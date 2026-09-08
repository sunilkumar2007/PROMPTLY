import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Send } from "lucide-react";
import { AuthModal } from "@/components/auth-modal";
import { motion } from "framer-motion";
import logoAsset from "@/assets/promptly-icon.png.asset.json";

export function Footer() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-white border-t border-black/[0.06]">

      {/* Final CTA banner */}
      <div className="border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 md:space-y-10"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">Start building</p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-black leading-none">
              Ready to build<br className="hidden sm:block" /> faster?
            </h2>
            <Button
              size="lg"
              className="rounded-full bg-black text-white hover:bg-black/85 px-8 md:px-14 h-12 md:h-14 text-[10px] font-bold uppercase tracking-[0.25em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/20"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Start Exploring
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Links + newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10 md:gap-12">

          {/* Brand col */}
          <div className="col-span-2 sm:col-span-3 md:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8">
                <img src={logoAsset.url} alt="Promptly" className="w-full h-full object-contain" />
              </div>
              <span className="font-sora text-base font-black tracking-tight text-black">Promptly</span>
            </div>
            <p className="text-xs md:text-sm text-black/40 max-w-xs leading-relaxed">
              The high-performance intelligence layer for modern builders. Search less, create more.
            </p>
            {/* Newsletter */}
            <div className="relative max-w-xs">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-black/[0.04] border border-black/[0.06] rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-black/15 outline-none placeholder:text-black/25 transition"
              />
              <button
                onClick={() => setEmail("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-black rounded-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"
              >
                <Send className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.25em] text-black">Resources</h4>
            <div className="flex flex-col gap-3">
              {["Explore", "Prompts", "Code", "UI Kits"].map((link) => (
                <a key={link} href="#" className="text-xs text-black/40 hover:text-black transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.25em] text-black">Company</h4>
            <div className="flex flex-col gap-3">
              {["About", "Enterprise", "Pricing", "Privacy"].map((link) => (
                <a key={link} href="#" className="text-xs text-black/40 hover:text-black transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.25em] text-black">Social</h4>
            <div className="flex flex-col gap-3">
              {["Twitter", "GitHub", "LinkedIn", "Discord"].map((s) => (
                <a key={s} href="#" className="text-xs text-black/40 hover:text-black transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/25">
            © 2026 Promptly Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            {["Terms", "Privacy", "Cookies"].map((l) => (
              <a key={l} href="#" className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/25 hover:text-black transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </footer>
  );
}