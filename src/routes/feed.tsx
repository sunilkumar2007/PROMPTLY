import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getResources } from "@/lib/resources.functions";
import { Navigation } from "@/components/landing/navigation";
import { ResourceCard, ResourceCardSkeleton } from "@/components/resources/resource-card";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
});

function FeedPage() {
  const { ref, inView } = useInView();

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useInfiniteQuery({
    queryKey: ["feed-resources"],
    queryFn: ({ pageParam = 1 }) => getResources({ 
      data: { 
        sort: 'newest',
        page: pageParam as number 
      } 
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const resources = data?.pages.flat() || [];

  return (
    <div className="min-h-screen bg-white pb-32">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 sm:pt-40">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2">Discovery Feed</h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Live stream from the continuum
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(8)].map((_, i) => <ResourceCardSkeleton key={i} />)
          ) : resources.map((res) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ResourceCard resource={res} />
            </motion.div>
          ))}
        </div>

        <div ref={ref} className="mt-12 py-10 flex flex-col items-center justify-center border-t border-neutral-50">
          {isFetchingNextPage && (
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
               <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
               <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

