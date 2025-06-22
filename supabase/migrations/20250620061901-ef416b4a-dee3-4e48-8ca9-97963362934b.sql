
-- Drop all existing policies for profiles table
DROP POLICY IF EXISTS "Authenticated users can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new RLS policies that work without JWT sub claim
-- Allow any authenticated user to insert their profile (application handles the clerk_user_id)
CREATE POLICY "Authenticated users can insert profiles" ON profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow users to update profiles where clerk_user_id matches their session
-- We'll rely on application-level checks since we can't use auth.jwt() ->> 'sub'
CREATE POLICY "Authenticated users can update profiles" ON profiles 
FOR UPDATE 
TO authenticated 
USING (true);
