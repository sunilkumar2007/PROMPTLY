import { Bookmark, Heart, ArrowUpRight, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/auth-modal";
import { getResources } from "@/lib/resources.functions";
import { ResourceCardSkeleton } from "@/components/resources/resource-card";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function FeaturedResources() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getResources({ data: { sort: "trending", page: 1 } });
        setResources(data.slice(0, 4));
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section id="explore" tabIndex={-1} className="py-20 md:py-32 bg-white outline-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-black/30" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">Trending now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-black leading-none">
              Top Discoveries
            </h2>
          </div>
          <Link
            to="/explore"
            search={{ query: undefined, category: undefined, type: undefined }}
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors shrink-0"
          >
            View all
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {isLoading
            ? [...Array(4)].map((_, i) => <ResourceCardSkeleton key={i} />)
            : resources.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to="/resources/$id"
                    params={{ id: r.id }}
                    className="group flex flex-col bg-white rounded-2xl border border-black/[0.06] overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-neutral-50">
                      {r.preview_url ? (
                        <img
                          src={r.preview_url}
                          alt={r.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Bookmark className="w-8 h-8 text-black/10" />
                        </div>
                      )}
                      {/* Type badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-bold uppercase tracking-widest text-black/70 border border-black/5">
                          {r.type}
                        </span>
                      </div>
                      {/* Bookmark btn */}
                      <button
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90 transition-all border border-black/5 shadow-sm"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAuthModalOpen(true); }}
                      >
                        <Bookmark className="w-3.5 h-3.5 text-black" />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 md:p-5 space-y-3 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm leading-snug tracking-tight text-black line-clamp-2 flex-1">
                          {r.title}
                        </h3>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-black/30 shrink-0 pt-0.5">
                          <Heart className="w-3 h-3" />
                          <span>{(r.likes_count || 0) >= 1000 ? `${((r.likes_count || 0) / 1000).toFixed(1)}k` : r.likes_count || 0}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-auto pt-1 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-black/5 overflow-hidden flex items-center justify-center shrink-0">
                          {r.creator?.avatar_url ? (
                            <img src={r.creator.avatar_url} alt={r.creator.username} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[8px] font-bold">{r.creator?.username?.[0]?.toUpperCase()}</span>
                          )}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-black/40 truncate flex-1 min-w-0">
                          {r.creator?.username}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
}