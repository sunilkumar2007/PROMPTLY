import { useQuery } from "@tanstack/react-query";
import { getRelatedResources } from "@/lib/resources.functions";
import { ResourceCard } from "@/components/resources/resource-card";
import { Sparkles } from "lucide-react";

interface RelatedResourcesProps {
  resource: any;
}

export function RelatedResources({ resource }: RelatedResourcesProps) {
  const { data: related, isLoading } = useQuery({
    queryKey: ["related-resources", resource.id],
    queryFn: () => getRelatedResources({ 
      data: { 
        id: resource.id, 
        category: resource.category,
        type: resource.type,
        tags: resource.tags 
      } 
    }),
  });

  if (!isLoading && (!related || related.length === 0)) return null;

  return (
    <div className="pt-32 border-t border-neutral-100 space-y-12">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-neutral-50 rounded-full border border-neutral-100">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Continuum</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase">More from Promptly</h2>
        <p className="text-neutral-400 text-sm max-w-lg mx-auto uppercase font-bold tracking-widest leading-relaxed">
          Deepen your discovery with related architectural patterns and refined creative assets.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-[32px] bg-neutral-50 animate-pulse" />
          ))
        ) : (
          related?.map((item) => (
            <ResourceCard key={item.id} resource={item} />
          ))
        )}
      </div>
    </div>
  );
}
