import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Heart, Bookmark, Play, Code2, Layout as LayoutIcon, FileText, FolderRoot, User, Palette, Database, Zap, Megaphone, PenTool, Briefcase, GraduationCap, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ResourceCardProps {
  resource: any;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(resource.likes_count || 0);

  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const checkStatus = async () => {
      const [{ data: likeData }, { data: saveData }] = await Promise.all([
        supabase.from("likes").select("id").eq("user_id", user.id).eq("resource_id", resource.id).maybeSingle(),
        supabase.from("saves").select("id").eq("user_id", user.id).eq("resource_id", resource.id).maybeSingle()
      ]);
      
      if (likeData) setIsLiked(true);
      if (saveData) setIsSaved(true);
    };
    
    checkStatus();
  }, [user, resource.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to like resources");
      return;
    }

    try {
      if (isLiked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("resource_id", resource.id);
        if (error) throw error;
        setLikesCount((prev: number) => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ user_id: user.id, resource_id: resource.id });
        if (error) throw error;
        setLikesCount((prev: number) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to save resources");
      return;
    }

    try {
      if (isSaved) {
        const { error } = await supabase
          .from("saves")
          .delete()
          .eq("user_id", user.id)
          .eq("resource_id", resource.id);
        if (error) throw error;
        setIsSaved(false);
        toast.success("Removed from saves");
      } else {
        const { error } = await supabase
          .from("saves")
          .insert({ user_id: user.id, resource_id: resource.id });
        if (error) throw error;
        setIsSaved(true);
        toast.success("Saved to your resources");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to update save");
    }
  };


  const typeLabel = resource.type.toUpperCase();
  const isVideo = resource.preview_url?.endsWith(".mp4");

  const categoryStyles = useMemo(() => {
    const styles: Record<string, { bg: string, border: string, text: string, icon: any }> = {
      'AI/ML': { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600', icon: Code2 },
      'Website Development': { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', icon: LayoutIcon },
      'Mobile Applications': { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600', icon: LayoutIcon },
      'UI/UX': { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-600', icon: Palette },
      'Data Science': { bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-600', icon: Database },
      'Automation': { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', icon: Zap },
      'Marketing': { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', icon: Megaphone },
      'Content Creation': { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600', icon: PenTool },
      'Business': { bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-600', icon: Briefcase },
      'Education': { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600', icon: GraduationCap },
      'Productivity': { bg: 'bg-lime-50', border: 'border-lime-100', text: 'text-lime-600', icon: Layout },
    };
    return styles[resource.category] || { bg: 'bg-neutral-50', border: 'border-neutral-100', text: 'text-neutral-600', icon: FileText };
  }, [resource.category]);

  const placeholderContent = useMemo(() => {
    switch (resource.type.toLowerCase()) {
      case 'code':
      case 'code_snippet':
      case 'function':
      case 'module':
        return (
          <div className="w-full h-full p-4 font-mono text-[10px] opacity-40 overflow-hidden leading-relaxed bg-[#f8f9fc]">
            <div className="text-[#9d58f3]">import</div> {"{"} useState {"}"} <div className="text-[#9d58f3]">from</div> <span className="text-[#0c8ce9]">'react'</span>;<br/>
            <div className="text-[#0c8ce9]">export function</div> <span className="text-[#f15e5e]">Component</span>() {"{"}<br/>
            &nbsp;&nbsp;<div className="text-[#9d58f3]">const</div> [state, setState] = useState(<span className="text-[#0c8ce9]">null</span>);<br/>
            &nbsp;&nbsp;<div className="text-[#9d58f3]">return</div> (<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;div className=<span className="text-[#0c8ce9]">"p-4"</span>&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{resource.type === 'Prompt' ? (resource.content ? resource.content.substring(0, 50) + '...' : 'System Prompt...') : `Rendering ${resource.title}...`}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br/>
            &nbsp;&nbsp;);<br/>
            {"}"}
          </div>
        );
      case 'component':
      case 'ui/ux':
        return (
          <div className="w-full h-full p-6 flex flex-col gap-3 opacity-20">
            <div className="h-8 w-2/3 bg-black rounded-lg" />
            <div className="grid grid-cols-3 gap-2 h-16">
              <div className="bg-black rounded-lg" />
              <div className="bg-black rounded-lg" />
              <div className="bg-black rounded-lg" />
            </div>
            <div className="h-4 w-full bg-black rounded-full" />
          </div>
        );
      case 'prompt':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 opacity-40 bg-neutral-50">
            <div className="w-full text-[10px] font-mono leading-tight overflow-hidden line-clamp-6 text-neutral-500 italic">
              "{resource.content || 'System initializing prompt sequence...'}"
            </div>
            <FileText className="w-8 h-8 text-black mt-2 opacity-20" />
          </div>
        );
      case 'project':
      case 'template':
        return (
          <div className="w-full h-full flex items-center justify-center p-8 opacity-20">
            <FolderRoot className="w-20 h-20 text-black" />
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center p-8 bg-black/5">
            <div className="text-[32px] font-black tracking-tighter uppercase text-black/10">{typeLabel}</div>
          </div>
        );
    }
  }, [resource.type, typeLabel, resource.title]);

  return (
    <Link
      to="/resources/$id"
      params={{ id: resource.id }}
      className="block h-full"
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="group bg-white border border-neutral-100 rounded-[28px] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col h-full ring-offset-white focus-visible:ring-2 focus-visible:ring-black"
      >
        {/* Preview Area */}
        <div className="relative aspect-[4/3] w-full bg-[#fcfcfc] overflow-hidden">
          {resource.preview_url && !hasImageError ? (
            <div className="w-full h-full overflow-hidden relative">
              {isPreviewLoading && (
                <div className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 border-2 border-black/5 rounded-full" />
                    <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-t-black rounded-full animate-spin" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20 animate-pulse">Syncing...</span>
                </div>
              )}
                <motion.img
                  loading="lazy"
                  src={resource.preview_url}
                  alt={`${resource.title} - Preview of ${resource.type} by ${resource.creator?.username || "Anonymous"}`}
                  onLoad={() => setIsPreviewLoading(false)}
                  onError={() => {
                    setIsPreviewLoading(false);
                    setHasImageError(true);
                  }}
                className={cn(
                  "w-full h-full object-contain transition-all duration-1000 group-hover:scale-110",
                  isPreviewLoading ? "opacity-0" : "opacity-100"
                )}
                style={{ objectPosition: 'center' }}
              />
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={cn("w-full h-full transition-colors duration-500 flex items-center justify-center overflow-hidden", categoryStyles.bg)}>
              {placeholderContent}
            </div>
          )}

          {/* Save Button (Hover reveal) */}
          <button
            onClick={handleSave}
            className={cn(
              "absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center",
              isSaved 
                ? "bg-black text-white border-black shadow-lg shadow-black/20" 
                : "bg-white/70 text-black border-white/50 hover:bg-white hover:scale-110 active:scale-95"
            )}
          >
            <Bookmark className={cn("w-4 h-4", isSaved && "fill-white")} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[17px] font-bold text-[#1a1a1a] leading-tight line-clamp-2 group-hover:text-black transition-colors tracking-tight">
              {resource.title}
            </h3>
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-black transition-all min-h-[44px] min-w-[44px] justify-end shrink-0"
            >
              <AnimatePresence mode="wait">
                {isLiked ? (
                  <motion.div
                    key="liked"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="not-liked"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <Heart className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className={cn("text-[12px] font-bold tabular-nums transition-colors", isLiked && "text-red-500")}>
                {likesCount > 999 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount}
              </span>
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className={cn("px-2.5 py-1 rounded-[6px] text-[9px] font-black tracking-widest uppercase border", categoryStyles.bg, categoryStyles.text, categoryStyles.border)}>
              {typeLabel}
            </div>
          </div>

          {/* Footer Area */}
          <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-neutral-50/80">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate({
                  to: "/profile/$username",
                  params: { username: resource.creator?.username || "anonymous" }
                });
              }}
              className="flex items-center gap-2 group/creator cursor-pointer min-h-[44px] min-w-0"
            >
              <Avatar className="w-6 h-6 shrink-0 border border-neutral-100/50 transition-transform group-hover/creator:scale-110">
                <AvatarImage src={resource.creator?.avatar_url || `https://ui-avatars.com/api/?name=${resource.creator?.username}&background=000&color=fff`} alt={`${resource.creator?.username || "Anonymous"}'s avatar`} />
                <AvatarFallback className="bg-[#000] text-[10px] font-bold text-[#fff]">
                  {resource.creator?.username?.[0]?.toUpperCase() || <User className="w-3 h-3" />}
                </AvatarFallback>
              </Avatar>
              <span className="text-[12px] font-black text-[#1a1a1a] tracking-tight group-hover/creator:text-blue-600 transition-colors uppercase truncate">
                {resource.creator?.username || "ANONYMOUS"}
              </span>
            </button>
            
            <div className="text-[10px] font-bold text-[#8e8e8e] uppercase tracking-[0.05em] text-right shrink-0 max-w-[50%]">
              {resource.category}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function ResourceCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-100 rounded-[28px] overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[4/3] w-full bg-neutral-100" />
      <div className="p-4">
        <div className="h-4 bg-neutral-100 rounded w-3/4 mb-3" />
        <div className="h-2 bg-neutral-100 rounded w-1/4 mb-6" />
        <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neutral-100" />
            <div className="h-2 bg-neutral-100 rounded w-16" />
          </div>
          <div className="h-2 bg-neutral-100 rounded w-12" />
        </div>
      </div>
    </div>
  );
}
