CREATE OR REPLACE FUNCTION public.increment_resource_views(resource_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.resources
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.increment_resource_views(UUID) TO authenticated, anon;
