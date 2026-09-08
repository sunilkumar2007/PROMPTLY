import { useState } from "react";
import { AuthModal } from "@/components/auth-modal";
import { motion } from "framer-motion";
import { Search, Sparkles, Copy, Rocket } from "lucide-react";

export function HowItWorks() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const steps = [
    {
      icon: Search,
      num: "01",
      title: "Search",
      desc: "Access the world's most comprehensive library of AI prompts, code snippets, and UI components.",
    },
    {
      icon: Sparkles,
      num: "02",
      title: "Discover",
      desc: "Find curated, high-performance building blocks tested by thousands of developers.",
    },
    {
      icon: Copy,
      num: "03",
      title: "Copy",
      desc: "One-click copy for any code, prompt, or design asset. No sign-up needed to browse.",
    },
    {
      icon: Rocket,
      num: "04",
      title: "Build",
      desc: "Integrate instantly and ship production-ready features faster than ever before.",
    },
  ];

  return (
    <section id="how-it-works" tabIndex={-1} className="py-20 md:py-32 bg-white outline-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 mb-4">How it works</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-black">
            From search to ship<br className="hidden sm:block" /> in four steps.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-black/10 to-transparent z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setIsAuthModalOpen(true)}
              className="relative z-10 group cursor-pointer"
            >
              {/* Step number + icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-[#f5f5f5] border border-black/[0.06] flex items-center justify-center mx-auto group-hover:scale-105 group-hover:border-black/10 group-hover:shadow-lg transition-all duration-300">
                  <step.icon className="w-7 h-7 text-black" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-[9px] font-black tracking-widest" style={{ left: "calc(50% + 22px)" }}>
                  {i + 1}
                </div>
              </div>

              <div className="text-center px-2">
                <h3 className="font-black text-lg md:text-xl tracking-tight text-black mb-2 group-hover:text-black transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-black/45 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
}