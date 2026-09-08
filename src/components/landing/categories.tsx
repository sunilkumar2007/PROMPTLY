import { Code, BookOpen, Layers, Zap, Briefcase, Megaphone, GraduationCap, Bot, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function Categories() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const categories = [
    { icon: BookOpen,    title: "Prompts",       desc: "AI-optimized instructions",  category: "Content Creation",   count: "2.4k" },
    { icon: Code,        title: "Code",           desc: "Production snippets",        category: "Website Development", count: "1.8k" },
    { icon: Layers,      title: "UI Components",  desc: "Design system modules",      category: "UI/UX",              count: "930"  },
    { icon: Zap,         title: "Automation",     desc: "Workflow efficiency",         category: "Automation",         count: "640"  },
    { icon: Briefcase,   title: "Business",       desc: "Operations & strategy",      category: "Business",           count: "510"  },
    { icon: Megaphone,   title: "Marketing",      desc: "Copy & outreach",            category: "Marketing",          count: "380"  },
    { icon: GraduationCap, title: "Education",    desc: "Learning materials",         category: "Education",          count: "290"  },
    { icon: Bot,         title: "AI Agents",      desc: "Autonomous workflows",       category: "AI/ML",              count: "720"  },
  ];

  const handleClick = (category: string) => {
    if (user) navigate({ to: "/explore", search: { category, query: undefined, type: undefined } });
    else setIsAuthModalOpen(true);
  };

  return (
    <section id="categories" tabIndex={-1} className="py-20 md:py-32 bg-[#f9f9f9] outline-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 mb-4">Browse by category</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-black">
            Everything you need,<br className="hidden sm:block" /> organized.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((c, i) => (
            <motion.button
              key={i}
              onClick={() => handleClick(c.category)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative text-left p-5 md:p-6 rounded-2xl bg-white border border-black/[0.06] hover:border-black/10 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Subtle hover fill */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 rounded-2xl" />

              <div className="relative">
                {/* Icon + count row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-black/[0.04] flex items-center justify-center group-hover:scale-110 group-hover:bg-black/[0.07] transition-all duration-300">
                    <c.icon className="w-4 h-4 md:w-5 md:h-5 text-black" strokeWidth={1.75} />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-black/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </div>

                <h3 className="font-bold text-sm md:text-base tracking-tight text-black mb-1">{c.title}</h3>
                <p className="text-[9px] md:text-[10px] text-black/40 uppercase tracking-wider leading-relaxed">{c.desc}</p>

                {/* Count */}
                <div className="mt-4 text-[9px] font-bold uppercase tracking-widest text-black/25">
                  {c.count} resources
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
}