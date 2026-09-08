import { Search, Code, BookOpen, Layers, Users, Zap } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/components/auth-modal";

export function Features() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const features = [
    { icon: Search, title: "Semantic AI Search", desc: "Find exactly what you need with natural language." },
    { icon: Code, title: "Reusable Code", desc: "Clean, production-ready snippets for every stack." },
    { icon: BookOpen, title: "Prompt Library", desc: "Curated collections of high-leverage prompts." },
    { icon: Layers, title: "Beautiful UI", desc: "Design systems and components that scale." },
    { icon: Users, title: "Community Driven", desc: "Shared wisdom from top-tier engineering teams." },
    { icon: Zap, title: "One Platform", desc: "Your entire workflow, unified in one space." },
  ];

  return (
    <section id="platform" tabIndex={-1} className="py-16 md:py-24 bg-[#fafafa] outline-none">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-white p-6 md:p-8 rounded-2xl border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <f.icon className="w-6 h-6 md:w-8 md:h-8 text-black mb-4 md:mb-6" />
              <h3 className="text-base md:text-lg font-bold tracking-tight text-black mb-2 md:mb-3">{f.title}</h3>
              <p className="text-xs md:text-sm text-black/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
}