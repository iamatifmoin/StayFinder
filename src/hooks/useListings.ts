
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

interface CreateListingData {
  title: string;
  description: string;
  type: string;
  price_per_night: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  amenities: string[];
  images: string[];
}

export const useListings = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:host_id (
            full_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createListing = useMutation({
    mutationFn: async (listingData: CreateListingData) => {
      if (!isSignedIn || !user) {
        throw new Error('User must be signed in to create listings');
      }

      try {
        const token = await getToken({ template: 'supabase' });
        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        console.log('Setting Supabase session with token');
        
        // Set the auth token for this request
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw new Error(`Failed to set session: ${sessionError.message}`);
        }

        console.log('Checking for existing profile for user:', user.id);

        // First get or create user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('clerk_user_id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw new Error(`Failed to fetch profile: ${profileError.message}`);
        }

        let profileId;

        if (!profile) {
          console.log('Profile not found, creating new profile');
          // Profile doesn't exist, create it first
          const profileData = {
            clerk_user_id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            full_name: user.fullName || '',
            avatar_url: user.imageUrl || '',
          };

          console.log('Creating profile with data:', profileData);

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([profileData])
            .select('id')
            .single();

          if (createError) {
            console.error('Profile creation error:', createError);
            throw new Error(`Failed to create profile: ${createError.message}`);
          }

          console.log('Created new profile:', newProfile);
          profileId = newProfile.id;
        } else {
          console.log('Using existing profile:', profile);
          profileId = profile.id;
        }

        console.log('Creating listing with host_id:', profileId);

        const { data, error } = await supabase
          .from('listings')
          .insert([{
            ...listingData,
            host_id: profileId
          }])
          .select()
          .single();

        if (error) {
          console.error('Listing creation error:', error);
          throw error;
        }

        console.log('Successfully created listing:', data);
        return data;
      } catch (error) {
        console.error('Create listing error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      toast({
        title: "Success!",
        description: "Your property has been listed successfully.",
      });
    },
    onError: (error) => {
      console.error('Create listing mutation error:', error);
      toast({
        title: "Error",
        description: `Failed to create listing: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    listings,
    isLoading,
    createListing: createListing.mutate,
    isCreating: createListing.isPending,
  };
};
