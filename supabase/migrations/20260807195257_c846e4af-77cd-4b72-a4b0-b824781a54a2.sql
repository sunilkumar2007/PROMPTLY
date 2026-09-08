-- Categories Enum
DO $$ BEGIN
    CREATE TYPE public.resource_category AS ENUM (
        'Website Development',
        'Mobile Applications',
        'UI/UX',
        'AI/ML',
        'Data Science',
        'Automation',
        'Marketing',
        'Content Creation',
        'Business',
        'Education',
        'Productivity'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Resource Types Enum
DO $$ BEGIN
    CREATE TYPE public.resource_type AS ENUM (
        'Prompt',
        'Code',
        'UI/UX',
        'Component',
        'Template',
        'Project',
        'Module',
        'Function'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Resources Table
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type public.resource_type NOT NULL,
    category public.resource_category NOT NULL,
    content TEXT NOT NULL,
    preview_url TEXT,
    download_url TEXT,
    tags TEXT[] DEFAULT '{}',
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Likes Table
CREATE TABLE public.likes (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, resource_id)
);

-- Saves Table
CREATE TABLE public.saves (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, resource_id)
);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT SELECT ON public.resources TO anon;
GRANT ALL ON public.resources TO service_role;

GRANT SELECT, INSERT, DELETE ON public.likes TO authenticated;
GRANT SELECT ON public.likes TO anon;
GRANT ALL ON public.likes TO service_role;

GRANT SELECT, INSERT, DELETE ON public.saves TO authenticated;
GRANT SELECT ON public.saves TO anon;
GRANT ALL ON public.saves TO service_role;

-- RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;

-- Policies for resources
CREATE POLICY "Anyone can view resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Creators can manage their resources" ON public.resources 
    FOR ALL TO authenticated USING (auth.uid() = creator_id);

-- Policies for likes
CREATE POLICY "Anyone can see likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can toggle likes" ON public.likes 
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Policies for saves
CREATE POLICY "Anyone can see saves" ON public.saves FOR SELECT USING (true);
CREATE POLICY "Authenticated users can toggle saves" ON public.saves 
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Trigger for counts
CREATE OR REPLACE FUNCTION public.handle_resource_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (TG_TABLE_NAME = 'likes') THEN
            UPDATE public.resources SET likes_count = likes_count + 1 WHERE id = NEW.resource_id;
        ELSIF (TG_TABLE_NAME = 'saves') THEN
            UPDATE public.resources SET saves_count = saves_count + 1 WHERE id = NEW.resource_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (TG_TABLE_NAME = 'likes') THEN
            UPDATE public.resources SET likes_count = (CASE WHEN likes_count > 0 THEN likes_count - 1 ELSE 0 END) WHERE id = OLD.resource_id;
        ELSIF (TG_TABLE_NAME = 'saves') THEN
            UPDATE public.resources SET saves_count = (CASE WHEN saves_count > 0 THEN saves_count - 1 ELSE 0 END) WHERE id = OLD.resource_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_like_change
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW EXECUTE FUNCTION public.handle_resource_stats();

CREATE TRIGGER on_save_change
AFTER INSERT OR DELETE ON public.saves
FOR EACH ROW EXECUTE FUNCTION public.handle_resource_stats();
