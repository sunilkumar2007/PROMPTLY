REVOKE EXECUTE ON FUNCTION public.handle_resource_stats() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_resource_stats() TO service_role;

REVOKE EXECUTE ON FUNCTION public.increment_resource_views(uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_resource_views(uuid) TO service_role;

ALTER FUNCTION public.handle_resource_stats() SET search_path = public;
ALTER FUNCTION public.increment_resource_views(uuid) SET search_path = public;