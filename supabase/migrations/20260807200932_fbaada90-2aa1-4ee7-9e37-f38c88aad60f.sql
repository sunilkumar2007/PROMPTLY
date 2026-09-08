-- Ensure profiles has all needed columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Seed the profiles for the existing mock data IDs in resources
INSERT INTO public.profiles (id, username, full_name, onboarding_completed)
SELECT DISTINCT creator_id, 'user_' || substr(creator_id::text, 1, 8), 'Test User', true
FROM public.resources
ON CONFLICT (id) DO NOTHING;

-- Now safe to add the foreign key to profiles
ALTER TABLE public.resources
DROP CONSTRAINT IF EXISTS resources_creator_id_fkey;

ALTER TABLE public.resources
ADD CONSTRAINT resources_creator_id_fkey 
    FOREIGN KEY (creator_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;

-- Ensure RLS allows public profiles access for joins
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Ensure authenticated users can still manage their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can manage their own profile" 
ON public.profiles FOR ALL 
TO authenticated 
USING (auth.uid() = id);

-- Grant select on profiles to anon for discovery
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.profiles TO authenticated;
