import { BadgeCheck, ArrowUpRight, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/auth-modal";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function CreatorShowcase() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [creators, setCreators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*, resources(id)")
          .limit(4);
        if (data) {
          setCreators(data.map((p) => ({ ...p, resourceCount: p.resources?.length || 0 })));
        }
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    };
    fetchCreators();
  }, []);

  return (
    <section id="creators" tabIndex={-1} className="py-20 md:py-32 bg-[#f9f9f9] outline-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 mb-4">Community</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-black">
            Built by creators,<br className="hidden sm:block" /> for creators.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-black/[0.06] p-6 animate-pulse h-64" />
              ))
            : creators.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-white rounded-2xl border border-black/[0.06] p-6 md:p-8 flex flex-col items-center text-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={c.avatar_url || `https://ui-avatars.com/api/?name=${c.username}&background=111&color=fff&bold=true`}
                      alt={c.username}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-black/[0.06] group-hover:border-black/20 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5">
                      <BadgeCheck className="w-3.5 h-3.5 text-black" />
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-black text-sm md:text-base tracking-tight text-black uppercase">{c.username}</h3>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <Star className="w-3 h-3 text-black/30" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/30">
                        {c.resourceCount} resources
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/profile/$username"
                    params={{ username: c.username }}
                    className="group/btn mt-auto w-full py-2.5 rounded-xl bg-black/[0.04] hover:bg-black text-black hover:text-white flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-200"
                  >
                    View Profile
                    <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
}