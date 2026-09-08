import { Link } from "@tanstack/react-router";
import { Repeat, ShieldCheck, Award, Briefcase, Heart, Github, Sparkles, CheckCircle2 } from "lucide-react";

export function SkillSwapFooter() {
  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Column & Project Title / Abstract */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-slate-950 font-bold">
                <Repeat className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                SkillSwap <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300">AI</span>
              </span>
            </div>

            {/* Exact 2-Line Project Title */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-200 leading-snug">
                SkillSwap AI: An Intelligent Skill Exchange and Career Recommendation Platform
              </h3>
              <p className="text-xs text-emerald-400/90 font-medium">
                Empowering Collaborative Learning Through AI-Based Skill Matching and Certification
              </p>
            </div>

            {/* Abstract snippet */}
            <p className="text-xs text-slate-400/80 leading-relaxed max-w-xl">
              An AI-powered web platform that enables individuals to exchange skills through machine learning-based matching, collaborate via live online video sessions with AI note-taking, earn cryptographically verified digital certificates, and receive customized career and internship opportunities from top industry partners.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verifiable Ledger
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                <Award className="w-3.5 h-3.5 text-indigo-400" /> Digital Certificates
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Partner Careers
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-emerald-400 transition-colors">
                  Skill Matcher & Directory
                </Link>
              </li>
              <li>
                <Link to="/session" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  Virtual Session Room <span className="text-[9px] px-1 bg-rose-500/20 text-rose-300 rounded font-semibold">Live</span>
                </Link>
              </li>
              <li>
                <Link to="/certificates" className="hover:text-emerald-400 transition-colors">
                  Certificate Registry
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-emerald-400 transition-colors">
                  AI Career Recommendations
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-emerald-400 transition-colors">
                  Post a Skill Swap
                </Link>
              </li>
            </ul>
          </div>

          {/* Innovation & Verification */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Technology
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ML Vector Matching
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Realtime AI Note-Taker
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Tamper-Proof Badges
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Industry Skill Mapping
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Reciprocal Karma Economy
              </li>
            </ul>
          </div>

          {/* Quick Certificate Verification */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Verify Credential
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Validate any digital certificate issued by SkillSwap AI:
            </p>
            <div className="space-y-1.5">
              <Link 
                to="/certificates" 
                className="block w-full text-center py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-all"
              >
                Instant Hash Lookup
              </Link>
              <span className="block text-[10px] text-center text-slate-500">
                Polygon POS Block-Confirmed
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright & credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SkillSwap AI. Built for next-generation collaborative learning and career advancement.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Peer-to-Peer Education
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
