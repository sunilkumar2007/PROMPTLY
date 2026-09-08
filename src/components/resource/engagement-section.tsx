import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments } from "@/lib/resources.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, MoreHorizontal, Heart, Trash2, Flag, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface EngagementSectionProps {
  resourceId: string;
}

export function EngagementSection({ resourceId }: EngagementSectionProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", resourceId],
    queryFn: () => getComments({ data: { resourceId } }),
  });

  const addComment = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Auth required");
      if (resourceId.startsWith("mock-")) {
        const mockComment = {
          id: `mock-comment-${Date.now()}`,
          resource_id: resourceId,
          user_id: user.id,
          content: newComment,
          created_at: new Date().toISOString(),
          profiles: {
            username: user.user_metadata?.username || "You",
            avatar_url: user.user_metadata?.avatar_url || null,
          }
        };
        queryClient.setQueryData(["comments", resourceId], (old: any) => {
          return [mockComment, ...(old || [])];
        });
        return;
      }
      const { error } = await supabase.from("comments").insert({
        resource_id: resourceId,
        user_id: user.id,
        content: newComment,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewComment("");
      setIsFocused(false);
      queryClient.invalidateQueries({ queryKey: ["comments", resourceId] });
      toast.success("Comment posted");
    },
    onError: () => toast.error("Failed to post comment"),
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", resourceId] });
      toast.success("Comment deleted");
    },
  });

  return (
    <div className="space-y-12 pt-16 border-t border-neutral-100 mt-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-black" />
          <h3 className="text-2xl font-black uppercase tracking-tight">Discussion</h3>
          <span className="px-3 py-1 bg-black text-white rounded-full text-[10px] font-black tracking-widest">
            {comments?.length || 0}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <Avatar className="w-12 h-12 border border-neutral-100 flex-shrink-0 hidden sm:block">
          <AvatarImage src={user?.user_metadata?.['avatar_url']} />
          <AvatarFallback className="bg-black text-white text-[12px] font-bold">
            {user?.email?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className={cn(
            "relative bg-white border rounded-[32px] overflow-hidden transition-all duration-300",
            isFocused ? "border-black shadow-lg shadow-black/5" : "border-neutral-200"
          )}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                if (!newComment.trim()) setIsFocused(false);
              }}
              placeholder="Share your thoughts..."
              className="w-full min-h-[140px] p-6 bg-transparent focus:outline-none text-sm resize-none placeholder:text-neutral-400"
            />
            <div className="absolute bottom-4 right-4">
              <Button
                disabled={!newComment.trim() || addComment.isPending}
                onClick={() => addComment.mutate()}
                className="h-10 px-6 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50 gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="w-32 h-4 bg-neutral-100 rounded" />
                  <div className="w-full h-20 bg-neutral-50 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : comments?.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-[40px] border border-dashed border-neutral-200">
            <MessageSquare className="w-10 h-10 text-neutral-200 mx-auto mb-4" />
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">No comments yet. Be the first to start the conversation.</p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-100 before:to-transparent">
            {comments?.map((comment) => (
              <div key={comment.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white bg-neutral-100 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  <Avatar className="w-10 h-10 border border-white">
                    <AvatarImage src={comment.user?.avatar_url || undefined} />
                    <AvatarFallback className="bg-neutral-50 text-[10px] font-bold text-neutral-600">
                      {comment.user?.username?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-[32px] bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group-hover:border-neutral-200 ml-4 md:ml-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tight text-neutral-900">{comment.user?.username}</span>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                        {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : ''}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 -mr-2 rounded-full hover:bg-neutral-50 text-neutral-400 hover:text-black transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-neutral-100 shadow-xl p-2 min-w-[160px]">
                        {user?.id === comment.user_id ? (
                          <DropdownMenuItem 
                            className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 flex items-center gap-2 rounded-xl p-3 cursor-pointer"
                            onClick={() => deleteComment.mutate(comment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="font-bold text-xs uppercase tracking-widest">Delete</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="flex items-center gap-2 rounded-xl p-3 cursor-pointer focus:bg-neutral-50 text-neutral-600 focus:text-black">
                            <Flag className="w-4 h-4" />
                            <span className="font-bold text-xs uppercase tracking-widest">Report</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {comment.content}
                  </p>
                  
                  <div className="flex items-center gap-4 pt-4 mt-4 border-t border-neutral-50">
                    <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-rose-500 transition-colors group/btn">
                      <Heart className="w-3.5 h-3.5 group-hover/btn:fill-rose-500" />
                      Like
                    </button>
                    <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
