
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

export const useProfile = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!isSignedIn || !user) {
        console.log('User not signed in or user object missing');
        return null;
      }

      try {
        const token = await getToken({ template: 'supabase' });
        if (!token) {
          console.log('Failed to get Supabase token');
          return null;
        }

        // Set the auth token for this request
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('clerk_user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Profile fetch error:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Profile query error:', error);
        return null;
      }
    },
    enabled: !!user && isSignedIn,
  });

  const createOrUpdateProfile = useMutation({
    mutationFn: async () => {
      if (!isSignedIn || !user) {
        throw new Error('User must be signed in');
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

        const profileData = {
          clerk_user_id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          full_name: user.fullName || '',
          avatar_url: user.imageUrl || '',
        };

        console.log('Creating/updating profile with data:', profileData);

        const { data, error } = await supabase
          .from('profiles')
          .upsert([profileData], { 
            onConflict: 'clerk_user_id',
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (error) {
          console.error('Profile upsert error:', error);
          throw error;
        }

        console.log('Profile created/updated successfully:', data);
        return data;
      } catch (error) {
        console.error('Profile mutation error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Profile update successful:', data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    isLoading,
    createOrUpdateProfile: createOrUpdateProfile.mutate,
    isUpdating: createOrUpdateProfile.isPending,
    isSignedIn,
  };
};
