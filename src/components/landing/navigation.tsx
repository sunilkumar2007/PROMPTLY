import { useState, useEffect } from "react";
import { Search, Menu, X, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import { Link, useNavigate } from "@tanstack/react-router";
import logoAsset from "@/assets/promptly-icon.png.asset.json";

import { CreateResourceModal } from "@/components/resources/create-resource-modal";

export function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSectionClick = (e: React.MouseEvent, id: string) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] px-4 py-4 md:py-6 flex justify-center pointer-events-none">
      <nav
        className={cn(
          "max-w-fit flex items-center gap-4 sm:gap-8 px-4 sm:px-8 py-2.5 rounded-full border pointer-events-auto bg-white shadow-xl shadow-black/[0.03] border-black/[0.05]"
        )}
      >
        {/* Left: Logo */}
        <Link 
          to="/"
          className="flex items-center gap-2 group cursor-pointer pr-4 sm:border-r border-black/[0.08]"
        >
          <div className="w-8 h-8 transition-transform group-hover:scale-110">
            <img 
              src={logoAsset.url} 
              alt="Promptly" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-sora text-lg font-bold tracking-[-0.03em] text-black hidden sm:block">
            Promptly
          </span>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {user ? (
            <>
              <Link 
                to="/ai"
                className="px-4 h-8 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10 flex items-center justify-center"
              >
                AI Workspace
              </Link>
              <Link to="/explore" search={{ query: undefined, category: undefined, type: undefined }} className="text-[11px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">Explore</Link>
              <Link to="/categories" className="text-[11px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">Categories</Link>
            </>
          ) : (
            <>
              <a href="/#platform" onClick={(e) => handleSectionClick(e, "platform")} className="text-[11px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">Platform</a>
              <Link to="/explore" search={{ query: undefined, category: undefined, type: undefined }} onClick={(e) => handleSectionClick(e, "explore")} className="text-[11px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">Explore</Link>
              <Link to="/categories" onClick={(e) => handleSectionClick(e, "categories")} className="text-[11px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">Categories</Link>
            </>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 pl-4 sm:border-l border-black/[0.08]">
          <div className="flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0, marginRight: 0 }}
                  animate={{ width: 200, opacity: 1, marginRight: 8 }}
                  exit={{ width: 0, opacity: 0, marginRight: 0 }}
                  className="overflow-hidden"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        navigate({ to: "/explore", search: { query: searchQuery, category: undefined, type: undefined } });
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }
                    }}
                    className="w-[200px] h-8 px-3 text-xs bg-black/5 rounded-full outline-none focus:bg-black/10 transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
              }}
              className="p-2 text-black/40 hover:text-black transition-colors hidden sm:flex items-center justify-center cursor-pointer"
            >
              {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate({ to: "/create" })}
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-all shadow-sm group"
                title="Create a new post"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </button>
              <button 
                onClick={() => navigate({ to: "/profile/$username", params: { username: user.id } })}
                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                <User className="w-4 h-4" />
              </button>
              <button 
                onClick={() => signOut()}
                className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Button 
              className="bg-black text-white hover:bg-black/90 rounded-full px-6 h-9 text-[11px] font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Sign in
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-black transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-4 mx-auto max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-2xl rounded-3xl border border-black/[0.08] shadow-2xl p-6 flex flex-col gap-4 lg:hidden pointer-events-auto"
            >
              <div className="flex flex-col gap-2">
                {user ? (
                  <>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsCreateModalOpen(true);
                      }}
                      className="text-base font-bold text-black p-2 rounded-xl bg-black/5 text-left w-full cursor-pointer uppercase tracking-widest mb-2"
                    >
                      Create Resource
                    </button>
                    <Link 
                      to="/explore" 
                      search={{ query: undefined, category: undefined, type: undefined }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base font-bold text-black/60 hover:text-black p-2 rounded-xl hover:bg-black/[0.02] text-left w-full cursor-pointer uppercase tracking-widest"
                    >
                      Explore
                    </Link>
                    <Link 
                      to="/categories" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base font-bold text-black/60 hover:text-black p-2 rounded-xl hover:bg-black/[0.02] text-left w-full cursor-pointer uppercase tracking-widest"
                    >
                      Categories
                    </Link>
                    <Link 
                      to="/profile/$username" 
                      params={{ username: user.id }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base font-bold text-black/60 hover:text-black p-2 rounded-xl hover:bg-black/[0.02] text-left w-full cursor-pointer uppercase tracking-widest"
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <a 
                      href="/#platform"
                      onClick={(e) => {
                        handleSectionClick(e, "platform");
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-base font-bold text-black/60 hover:text-black p-2 rounded-xl hover:bg-black/[0.02] text-left w-full cursor-pointer uppercase tracking-widest"
                    >
                      Platform
                    </a>
                    <Link 
                      to="/explore" 
                      search={{ query: undefined, category: undefined, type: undefined }}
                      onClick={(e) => {
                        handleSectionClick(e, "explore");
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-base font-bold text-black/60 hover:text-black p-2 rounded-xl hover:bg-black/[0.02] text-left w-full cursor-pointer uppercase tracking-widest"
                    >
                      Explore
                    </Link>
                    <Link 
                      to="/categories" 
                      onClick={(e) => {
                        handleSectionClick(e, "categories");
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-base font-bold text-black/60 hover:text-black p-2 rounded-xl hover:bg-black/[0.02] text-left w-full cursor-pointer uppercase tracking-widest"
                    >
                      Categories
                    </Link>
                  </>
                )}
              </div>
              <div className="h-px bg-black/[0.08] my-2" />
              {user ? (
                <Button 
                  className="w-full h-12 rounded-2xl bg-black/5 text-black text-sm font-bold border border-black/5"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut();
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <Button 
                  className="w-full h-12 rounded-2xl bg-black text-white text-sm font-bold shadow-xl shadow-black/10"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                >
                  Sign in
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <CreateResourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          navigate({ to: "/explore", search: { query: undefined, category: undefined, type: undefined } });
        }}
      />
    </div>
  );
}