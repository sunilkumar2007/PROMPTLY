ALTER FUNCTION public.increment_resource_views(UUID) SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.increment_resource_views(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_resource_views(UUID) TO authenticated, anon;
