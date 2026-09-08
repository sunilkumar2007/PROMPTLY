import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Eye, Download, Calendar, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CreatorCardProps {
  resource: any;
  userStats?: { liked: boolean; saved: boolean } | null | undefined;
}

export function CreatorCard({ resource, userStats }: CreatorCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState(userStats?.liked || false);
  const [isSaved, setIsSaved] = useState(userStats?.saved || false);

  const toggleLike = useMutation({
    mutationFn: async () => {
      setIsLiked(!isLiked);
      if (resource.id.startsWith("mock-")) return; // Simulate success for mock data
      if (!user) {
        toast.error("Please sign in to like resources");
        setIsLiked(isLiked); // Revert on auth error
        return;
      }
      if (isLiked) {
        await supabase.from("likes").delete().eq("resource_id", resource.id).eq("user_id", user.id);
      } else {
        await supabase.from("likes").insert({ resource_id: resource.id, user_id: user.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stats", resource.id] });
      queryClient.invalidateQueries({ queryKey: ["resource", resource.id] });
    }
  });

  const toggleSave = useMutation({
    mutationFn: async () => {
      setIsSaved(!isSaved);
      if (resource.id.startsWith("mock-")) return; // Simulate success for mock data
      if (!user) {
        toast.error("Please sign in to save resources");
        setIsSaved(isSaved); // Revert on auth error
        return;
      }
      if (isSaved) {
        await supabase.from("saves").delete().eq("resource_id", resource.id).eq("user_id", user.id);
      } else {
        await supabase.from("saves").insert({ resource_id: resource.id, user_id: user.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stats", resource.id] });
      queryClient.invalidateQueries({ queryKey: ["resource", resource.id] });
    }
  });

  const [isFollowing, setIsFollowing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleDownload = () => {
    setIsDownloading(true);
    toast.success("Downloading resource...");
    setTimeout(() => {
      setIsDownloading(false);
      toast.success("Download complete!");
    }, 1500);
  };

  return (
    <div className="bg-white border border-neutral-100 rounded-[40px] p-8 space-y-8 sticky top-24 shadow-xl shadow-black/[0.03]">
      <div className="flex items-center justify-between gap-4">
        <Link 
          to="/profile/$username" 
          params={{ username: resource.creator?.username || "anonymous" }}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <Avatar className="w-14 h-14 border-2 border-transparent group-hover:border-blue-100 transition-all duration-500">
            <AvatarImage src={resource.creator?.avatar_url || `https://ui-avatars.com/api/?name=${resource.creator?.username}&background=000&color=fff`} />
            <AvatarFallback className="bg-black text-white text-[10px] font-bold">
              {resource.creator?.username?.[0]?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-0.5">Creator</p>
            <p className="font-black uppercase tracking-tight text-neutral-900 group-hover:text-blue-600 transition-colors duration-300">
              {resource.creator?.username || "ANONYMOUS"}
            </p>
          </div>
        </Link>
        <Button 
          variant={isFollowing ? "default" : "outline"}
          size="sm" 
          onClick={() => {
            setIsFollowing(!isFollowing);
            if (!isFollowing) toast.success(`Following ${resource.creator?.username || 'ANONYMOUS'}`);
          }}
          className={cn(
            "rounded-full px-6 h-10 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 gap-2 shadow-sm",
            !isFollowing && "hover:bg-black hover:text-white"
          )}
        >
          <UserPlus className="w-3 h-3" />
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleLike.mutate()}
          className={cn(
            "relative flex flex-col items-center justify-center p-6 rounded-[28px] transition-colors duration-300 group border overflow-hidden",
            isLiked ? "bg-rose-50 text-rose-600 border-rose-100/50" : "bg-white border-neutral-100 hover:border-neutral-200 text-neutral-900 shadow-sm"
          )}
        >
          {isLiked && (
            <motion.div 
              layoutId="like-glow"
              className="absolute inset-0 bg-gradient-to-tr from-rose-200/20 to-transparent"
            />
          )}
          <AnimatePresence mode="wait">
            {isLiked ? (
              <motion.div
                key="liked"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Heart className="w-7 h-7 mb-3 text-rose-500 fill-rose-500" />
              </motion.div>
            ) : (
              <motion.div
                key="unliked"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Heart className="w-7 h-7 mb-3 text-neutral-300 group-hover:text-rose-400 transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="text-lg font-black tracking-tight">{resource.likes_count || 0}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mt-1">Likes</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleSave.mutate()}
          className={cn(
            "relative flex flex-col items-center justify-center p-6 rounded-[28px] transition-colors duration-300 group border overflow-hidden",
            isSaved ? "bg-amber-50 text-amber-600 border-amber-100/50" : "bg-white border-neutral-100 hover:border-neutral-200 text-neutral-900 shadow-sm"
          )}
        >
          {isSaved && (
            <motion.div 
              layoutId="save-glow"
              className="absolute inset-0 bg-gradient-to-tr from-amber-200/20 to-transparent"
            />
          )}
          <AnimatePresence mode="wait">
            {isSaved ? (
              <motion.div
                key="saved"
                initial={{ scale: 0, y: -10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Bookmark className="w-7 h-7 mb-3 text-amber-500 fill-amber-500" />
              </motion.div>
            ) : (
              <motion.div
                key="unsaved"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Bookmark className="w-7 h-7 mb-3 text-neutral-300 group-hover:text-amber-400 transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="text-lg font-black tracking-tight">{resource.saves_count || 0}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mt-1">Saves</span>
        </motion.button>
      </div>

      <div className="space-y-5 pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3 text-neutral-400 group-hover:text-black transition-colors">
            <Eye className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Views</span>
          </div>
          <span className="text-sm font-black text-neutral-900">{resource.views_count || 0}</span>
        </div>
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3 text-neutral-400 group-hover:text-black transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Downloads</span>
          </div>
          <span className="text-sm font-black text-neutral-900">{resource.downloads_count || 0}</span>
        </div>
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3 text-neutral-400 group-hover:text-black transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Published</span>
          </div>
          <span className="text-sm font-black text-neutral-900">
            {resource.created_at ? format(new Date(resource.created_at), "MMM d, yyyy") : "N/A"}
          </span>
        </div>
      </div>

      <div className="pt-6 space-y-3">
        <Button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full h-14 rounded-[20px] bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10"
        >
          {isDownloading ? "Downloading..." : "Download Resource"}
        </Button>
        <Button 
          onClick={handleShare}
          variant="outline" 
          className="w-full h-14 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
        >
          Share Resource
        </Button>
      </div>
    </div>
  );
}
