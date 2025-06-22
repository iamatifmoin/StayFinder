
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

interface CreateBookingData {
  listing_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
}

export const useBookings = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!isSignedIn || !user) {
        return [];
      }

      try {
        const token = await getToken({ template: 'supabase' });
        if (!token) {
          console.log('No auth token available for bookings');
          return [];
        }

        // Set the auth token for this request
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });

        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            listing:listings (*),
            guest:profiles!bookings_guest_id_fkey (full_name, email)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Bookings query error:', error);
        return [];
      }
    },
    enabled: !!user && isSignedIn,
  });

  const createBooking = useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      if (!isSignedIn || !user) {
        throw new Error('User must be signed in to create bookings');
      }

      try {
        const token = await getToken({ template: 'supabase' });
        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        // Set the auth token for this request
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });

        // Get or create user profile
        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('clerk_user_id', user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it first
          const profileData = {
            clerk_user_id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            full_name: user.fullName || '',
            avatar_url: user.imageUrl || '',
          };

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([profileData])
            .select('id')
            .single();

          if (createError) {
            throw new Error(`Failed to create profile: ${createError.message}`);
          }

          profile = newProfile;
          console.log('Created new profile for booking:', profile);
        } else if (profileError) {
          throw profileError;
        }

        console.log('Using profile for booking:', profile);

        const { data, error } = await supabase
          .from('bookings')
          .insert([{
            ...bookingData,
            guest_id: profile.id
          }])
          .select(`
            *,
            listing:listings (*),
            guest:profiles!bookings_guest_id_fkey (full_name, email)
          `)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Create booking error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Booking confirmed!",
        description: "Your reservation has been created successfully.",
      });
    },
    onError: (error) => {
      console.error('Create booking error:', error);
      toast({
        title: "Booking failed",
        description: `Failed to create booking: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    bookings,
    isLoading,
    createBooking: createBooking.mutate,
    isCreating: createBooking.isPending,
  };
};
