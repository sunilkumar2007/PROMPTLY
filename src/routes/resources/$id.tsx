import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getResourceById } from "@/lib/resources.functions";
import { Navigation } from "@/components/landing/navigation";
import { 
  Loader2, 
  ArrowLeft, 
  Code2, 
  FileText, 
  Layers, 
  Box, 
  Zap, 
  Star,
  Share2,
  MoreVertical,
  ChevronRight,
  MonitorPlay,
  Cpu,
  Scale
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { CodeViewer } from "@/components/resource/code-viewer";
import { CreatorCard } from "@/components/resource/creator-card";
import { EngagementSection } from "@/components/resource/engagement-section";
import { RelatedResources } from "@/components/resource/related-resources";
import { FileExplorer, ProjectFile } from "@/components/resource/file-explorer";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/resources/$id")({
  head: (ctx: any) => ({
    title: `${ctx.loaderData?.title || "Resource"} | Promptly Discovery`,
    meta: [
      { name: "description", content: ctx.loaderData?.description || "Explore this high-quality resource on Promptly." },
      { property: "og:title", content: `${ctx.loaderData?.title} | Promptly` },
      { property: "og:description", content: ctx.loaderData?.description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(ctx.loaderData?.preview_url ? [
        { property: "og:image", content: ctx.loaderData.preview_url },
        { name: "twitter:image", content: ctx.loaderData.preview_url }
      ] : [])
    ],
  }),
  loader: async ({ params, context }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ["resource", params.id],
      queryFn: () => getResourceById({ data: { id: params.id } }),
    });
  },
  component: ResourceDetailPage,
});

function ResourceDetailPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  const { data: resource, isLoading } = useQuery({
    queryKey: ["resource", id],
    queryFn: () => getResourceById({ data: { id } }),
  });

  const { data: userStats } = useQuery({
    queryKey: ["user-stats", id, user?.id],
    queryFn: async () => {
      if (!user) return { liked: false, saved: false };
      const [liked, saved] = await Promise.all([
        supabase.from("likes").select("*").eq("resource_id", id).eq("user_id", user.id).maybeSingle(),
        supabase.from("saves").select("*").eq("resource_id", id).eq("user_id", user.id).maybeSingle()
      ]);
      return { liked: !!liked.data, saved: !!saved.data };
    },
    enabled: !!user && !!id
  });

  // Track view
  useEffect(() => {
    if (id) {
      supabase.rpc('increment_resource_views', { resource_id: id }).then();
    }
  }, [id]);

  const parsedContent = useMemo(() => {
    if (!resource?.content) return null;
    try {
      const parsed = JSON.parse(resource.content);
      return parsed;
    } catch {
      return null;
    }
  }, [resource?.content]);

  if (isLoading) return <ResourceSkeleton />;
  if (!resource) return <ResourceNotFound />;

  const resourceTypeLabel = resource.type.toUpperCase();
  const payloadTitle = resource.type === "Prompt" ? "PROMPT" : 
                       resource.type === "Code" ? "SOURCE CODE" : 
                       resource.type === "Component" ? "COMPONENT CODE" : "PAYLOAD";

  const hasFiles = parsedContent && Array.isArray(parsedContent.files) && parsedContent.files.length > 0;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32 selection:bg-black selection:text-white overflow-x-hidden">
      <Navigation />
      
      {/* Cinematic Hero */}
      <div className="relative w-full h-[60vh] min-h-[500px] flex flex-col justify-end overflow-hidden bg-black mt-16">
        {(resource.preview_url && !hasImageError) ? (
          <>
            {/* Blurred Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-110" 
              style={{ backgroundImage: `url(${resource.preview_url})` }} 
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            {/* Focused Image */}
            <div className="absolute inset-0 flex items-center justify-center p-12 lg:p-24 pb-40">
              <motion.img 
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                src={resource.preview_url}
                alt={resource.title}
                className="max-h-full max-w-5xl w-full object-contain rounded-[32px] shadow-2xl ring-1 ring-white/10"
                onLoad={() => setIsPreviewLoading(false)}
                onError={() => setHasImageError(true)}
              />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-black" />
        )}
        
        {/* Title Overlay content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-16">
          <Link 
            to="/explore"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Edge of discovery</span>
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-white/10">
              {resourceTypeLabel}
            </div>
            <ChevronRight className="w-3 h-3 text-white/30" />
            <div className="px-3 py-1 bg-white/5 text-white/70 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-white/5">
              {resource.category}
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white max-w-4xl">
            {resource.title}
          </h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Content */}
            <div className="lg:col-span-8 space-y-16">
              
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-100">
                <p className="text-xl text-neutral-600 font-medium leading-relaxed">
                  {resource.description?.replace(/\\n/g, '\n')}
                </p>
                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-8 mt-8 border-t border-neutral-100">
                    {resource.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-black hover:border-black/10 transition-all cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Payload Section */}
              {resource.content && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Box className="w-5 h-5 text-black" />
                      <h3 className="text-xl font-black uppercase tracking-tight">{payloadTitle}</h3>
                    </div>
                  </div>
                  {hasFiles ? (
                    <FileExplorer files={parsedContent.files as ProjectFile[]} />
                  ) : (
                    <CodeViewer 
                      code={resource.content.replace(/\\n/g, '\n').replace(/\\t/g, '  ')} 
                      filename={resource.type === "Code" ? `${resource.title.toLowerCase().replace(/\s+/g, '-')}.ts` : "content.txt"}
                      language={resource.language?.toLowerCase() || "typescript"}
                    />
                  )}
                </div>
              )}

              {/* Documentation / README */}
              {resource.readme_content && (
                <div className="space-y-6 bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-neutral-100">
                  <div className="flex items-center gap-3 pb-8 border-b border-neutral-100 mb-8">
                    <FileText className="w-5 h-5 text-black" />
                    <h3 className="text-xl font-black uppercase tracking-tight">Documentation</h3>
                  </div>
                  <div className="prose prose-neutral max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-p:leading-relaxed prose-strong:text-black prose-code:bg-neutral-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-neutral-950 prose-pre:rounded-[24px] prose-pre:p-8">
                    <ReactMarkdown>{resource.readme_content.replace(/\\n/g, '\n')}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Premium Tech Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {resource.language && (
                  <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-sm flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform">
                    <Code2 className="w-6 h-6 text-neutral-300 mb-4 group-hover:text-blue-500 transition-colors" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Language</p>
                    <p className="text-sm font-black uppercase tracking-tight">{resource.language}</p>
                  </div>
                )}
                {resource.framework && (
                  <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-sm flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform">
                    <MonitorPlay className="w-6 h-6 text-neutral-300 mb-4 group-hover:text-cyan-500 transition-colors" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Framework</p>
                    <p className="text-sm font-black uppercase tracking-tight">{resource.framework}</p>
                  </div>
                )}
                {resource.difficulty && (
                  <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-sm flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform">
                    <Cpu className="w-6 h-6 text-neutral-300 mb-4 group-hover:text-purple-500 transition-colors" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Difficulty</p>
                    <p className="text-sm font-black uppercase tracking-tight">{resource.difficulty}</p>
                  </div>
                )}
                {resource.license_type && (
                  <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-sm flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform">
                    <Scale className="w-6 h-6 text-neutral-300 mb-4 group-hover:text-emerald-500 transition-colors" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">License</p>
                    <p className="text-sm font-black uppercase tracking-tight">{resource.license_type}</p>
                  </div>
                )}
              </div>

              {/* Rating Section */}
              <div className="p-12 bg-white rounded-[40px] border border-neutral-100 shadow-sm space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tight">Rate this resource</h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => {
                          if (resource.id.startsWith("mock-") || true) {
                            toast.success(`Rated ${star} stars!`);
                            // We would mutate the rating here via an API
                          }
                        }}
                        className="p-1 hover:scale-110 transition-transform group"
                      >
                        <Star className={cn(
                          "w-10 h-10 transition-colors", 
                          star <= Math.round(resource.average_rating || 0) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-neutral-100 group-hover:fill-yellow-200 group-hover:text-yellow-200"
                        )} />
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Average: {resource.average_rating?.toFixed(1) || "0.0"} ({resource.ratings_count || 0} reviews)
                  </p>
                </div>
              </div>

              {/* Engagement / Comments */}
              <EngagementSection resourceId={id} />

            </div>

            {/* Right Column: Sticky Creator Card */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-24">
                <CreatorCard resource={resource} userStats={userStats as any} />
              </div>
            </div>
          </div>

          {/* Bottom Section: Related Resources */}
          <RelatedResources resource={resource} />
        </motion.div>
      </main>
    </div>
  );
}

function ResourceSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-16 pb-20">
      <Navigation />
      <div className="h-[500px] w-full bg-neutral-900 animate-pulse" />
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-12">
            <div className="h-40 bg-white rounded-[32px] animate-pulse border border-neutral-100" />
            <div className="h-96 w-full bg-neutral-100 rounded-[32px] animate-pulse" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-[500px] bg-white border border-neutral-100 rounded-[32px] animate-pulse shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceNotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
      <Navigation />
      <Box className="w-20 h-20 text-neutral-200 mb-8" />
      <h1 className="text-4xl font-black tracking-tighter uppercase mb-4">Resource not found</h1>
      <p className="text-neutral-400 text-sm font-bold uppercase tracking-widest max-w-xs mb-8">
        The discovery you seek has drifted beyond our observable horizon.
      </p>
      <Link 
        to="/explore"
        className="h-14 px-10 flex items-center bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-neutral-800 transition-all shadow-xl shadow-black/10"
      >
        Explore Promptly
      </Link>
    </div>
  );
}
