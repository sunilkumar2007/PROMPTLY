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
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;
