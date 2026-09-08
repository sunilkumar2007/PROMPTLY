import { createFileRoute, Link } from "@tanstack/react-router";
import { Navigation } from "@/components/landing/navigation";
import { motion } from "framer-motion";
import { Code, Terminal, Palette, Brain, Database, Zap, Megaphone, PenTool, Briefcase, GraduationCap, Layout } from "lucide-react";

const categories = [
  { name: 'Website Development', icon: Code, count: 120 },
  { name: 'Mobile Applications', icon: Terminal, count: 85 },
  { name: 'UI/UX', icon: Palette, count: 210 },
  { name: 'AI/ML', icon: Brain, count: 150 },
  { name: 'Data Science', icon: Database, count: 65 },
  { name: 'Automation', icon: Zap, count: 95 },
  { name: 'Marketing', icon: Megaphone, count: 110 },
  { name: 'Content Creation', icon: PenTool, count: 140 },
  { name: 'Business', icon: Briefcase, count: 75 },
  { name: 'Education', icon: GraduationCap, count: 130 },
  { name: 'Productivity', icon: Layout, count: 180 },
];

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white pt-32">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <header className="mb-12">
          <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase">Explore the continuum</h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40 max-w-xl">
            This sector of discovery is being synchronized. Return shortly.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              to="/explore"
              search={{ category: cat.name, query: undefined, type: undefined }}
              className="block group"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 border border-black/5 rounded-3xl hover:border-black/10 hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">
                  {cat.count} Resources
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
