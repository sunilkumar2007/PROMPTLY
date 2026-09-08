import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Sparkles,
  Repeat,
  Video,
  Award,
  Briefcase,
  PlusCircle,
  Zap,
  Menu,
  X,
  ShieldCheck,
  LayoutDashboard,
  MessageSquare,
  Bell,
  Settings,
  Users,
  TrendingUp,
  Target,
  Map,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CURRENT_USER } from "@/lib/skillswap-data";

export function SkillSwapNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [credits] = useState(CURRENT_USER.swapCredits);
  const [showCreditInfo, setShowCreditInfo] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock unread counts
  const unreadMessages = 2;
  const unreadNotifs = 4;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handler = () => {
      setShowCreditInfo(false);
      setShowMoreMenu(false);
      setShowUserMenu(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const mainNavLinks = [
    { label: "Explore", path: "/explore", icon: Repeat },
    { label: "Session", path: "/session", icon: Video, badge: "Live" },
    { label: "Careers", path: "/careers", icon: Briefcase, badge: "Hiring" },
    { label: "Certificates", path: "/certificates", icon: Award },
  ];

  const moreLinks = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Find People", path: "/people", icon: Users },
    { label: "AI Features", path: "/ai", icon: Sparkles },
    { label: "Progress", path: "/progress", icon: TrendingUp },
    { label: "Assessment", path: "/assessment", icon: Target },
    { label: "Career Roadmap", path: "/roadmap", icon: Map },
  ];

  const mobileLinks = [...mainNavLinks, ...moreLinks];

  return (
    <header className="fixed top-0 left-0 right-0 z-[80] transition-all duration-300 pointer-events-none px-3 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="pointer-events-auto flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg shadow-black/20 group text-white hover:border-emerald-500/50 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Repeat className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
                SkillSwap <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300">AI</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                P2P
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:block -mt-0.5 tracking-tight">
              Skill Exchange &amp; Career Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation pill */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 shadow-xl shadow-slate-950/30 text-sm">
          {mainNavLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                activeProps={{ className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" }}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all text-xs font-medium border border-transparent"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider",
                    item.badge === "Live"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                      : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMoreMenu(!showMoreMenu); setShowCreditInfo(false); setShowUserMenu(false); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all text-xs font-medium border border-transparent"
            >
              More <ChevronDown className={cn("w-3 h-3 transition-transform", showMoreMenu && "rotate-180")} />
            </button>
            <AnimatePresence>
              {showMoreMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-52 p-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {moreLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowMoreMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-xs font-medium"
                      >
                        <Icon className="w-4 h-4 text-emerald-400" />
                        {item.label}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Action Bar */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Swap Credits */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowCreditInfo(!showCreditInfo); setShowMoreMenu(false); setShowUserMenu(false); }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-colors shadow-sm text-xs font-medium cursor-pointer"
              title="Swap Credits"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold">{credits}</span>
              <span className="text-[11px] text-emerald-400/80 hidden sm:inline">Credits</span>
            </button>

            <AnimatePresence>
              {showCreditInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl text-xs text-slate-200 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> SkillSwap Karma
                    </span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      {credits} Active
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-2">SkillSwap AI operates on a fair peer exchange model:</p>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">+1 Credit</span> when you teach a peer for 1 hour.
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-bold">-1 Credit</span> when learning any skill from a peer.
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-indigo-400 font-bold">Bonus:</span> Completing a milestone grants verified certification!
                    </li>
                  </ul>
                  <Button
                    onClick={() => setShowCreditInfo(false)}
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 h-7 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    Got it
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Icon with unread badge */}
          <Link
            to="/chat"
            className="relative hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/85 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white transition-colors"
            title="Messages"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-bold flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </Link>

          {/* Notifications Bell */}
          <Link
            to="/notifications"
            className="relative hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/85 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </Link>

          {/* Post Swap */}
          <Link
            to="/create"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02]"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
            <span>Post Swap</span>
          </Link>

          {/* User Avatar + Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); setShowMoreMenu(false); setShowCreditInfo(false); }}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-slate-900/85 hover:bg-slate-800 border border-slate-700/70 text-white transition-colors"
            >
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.fullName}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/60"
              />
              <span className="text-xs font-medium hidden lg:inline max-w-[90px] truncate">
                {CURRENT_USER.fullName.split(" ")[0]}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-52 p-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 mb-1 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{CURRENT_USER.fullName}</p>
                    <p className="text-[11px] text-slate-400">@{CURRENT_USER.username}</p>
                  </div>
                  {[
                    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
                    { label: "My Profile", path: `/profile/${CURRENT_USER.username}`, icon: ShieldCheck },
                    { label: "Progress", path: "/progress", icon: TrendingUp },
                    { label: "Settings", path: "/settings", icon: Settings },
                    { label: "Admin Panel", path: "/admin", icon: ShieldCheck },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-xs font-medium"
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        {item.label}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto md:hidden mt-2 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-1 max-h-[80vh] overflow-y-auto"
          >
            {mobileLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-sm font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{item.label}</span>
                  </div>
                  {"badge" in item && item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/20 text-emerald-300">
                      {item.badge as string}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <Link
                to="/create"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Post Swap
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                Sign In
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
