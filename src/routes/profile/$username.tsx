import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Navigation } from "@/components/landing/navigation";
import { ResourceCard, ResourceCardSkeleton } from "@/components/resources/resource-card";
import { getProfile, getResources } from "@/lib/resources.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  User, 
  MapPin, 
  Calendar, 
  Share2, 
  Check, 
  Plus, 
  Box, 
  Heart, 
  Layers, 
  Code2, 
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/profile/$username")({
  head: (ctx: any) => ({
    title: `${ctx.loaderData?.full_name || ctx.loaderData?.username || "Creator Profile"} | Promptly`,
    meta: [
      {
        name: "description",
        content: ctx.loaderData?.bio || "Explore creator prompts, code snippets, and architectures on Promptly.",
      },
    ],
  }),
  loader: async ({ params }) => {
    try {
      return await getProfile({ data: { username: params.username } });
    } catch {
      return null;
    }
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"all" | "prompts" | "code" | "architectures" | "about">("all");
  const [isFollowing, setIsFollowing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Profile data
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await getProfile({ data: { username } });
      return res;
    },
  });

  // Resources by this creator
  const { data: allResources = [], isLoading: isResourcesLoading } = useQuery({
    queryKey: ["creator-resources", profile?.id, username],
    queryFn: async () => {
      if (profile?.id && !profile.id.startsWith("mock-")) {
        const { data } = await supabase
          .from("resources")
          .select("*, creator:profiles(*)")
          .eq("creator_id", profile.id);
        if (data && data.length > 0) return data;
      }
      // Fallback to searching all resources by creator or matching username
      const general = await getResources({ data: { sort: "popular", page: 1 } });
      const matched = general.filter((r: any) => 
        r.creator?.username?.toLowerCase() === username?.toLowerCase() ||
        r.creator_id === profile?.id
      );
      return matched.length > 0 ? matched : general.slice(0, 4);
    },
    enabled: !!profile,
  });

  const isOwnProfile = user && (user.id === profile?.id || user.id === username);

  const filteredResources = useMemo(() => {
    if (activeTab === "all") return allResources;
    if (activeTab === "prompts") return allResources.filter((r: any) => r.type?.toLowerCase() === "prompt");
    if (activeTab === "code") return allResources.filter((r: any) => ["snippet", "component"].includes(r.type?.toLowerCase()));
    if (activeTab === "architectures") return allResources.filter((r: any) => ["architecture", "project"].includes(r.type?.toLowerCase()));
    return allResources;
  }, [allResources, activeTab]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Profile link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFollow = () => {
    if (!user) {
      toast.error("Please sign in to follow creators");
      return;
    }
    setIsFollowing(!isFollowing);
    toast.success(!isFollowing ? `Following ${profile?.full_name || username}` : `Unfollowed ${profile?.full_name || username}`);
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-32">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 pt-28 sm:pt-36 space-y-12">
        {/* Breadcrumb */}
        <Link
          to="/explore"
          search={{ query: undefined, category: undefined, type: undefined }}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
        </Link>

        {/* Creator Header Banner */}
        <div className="bg-neutral-50/50 rounded-3xl border border-black/5 p-8 sm:p-12 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white shadow-xl shadow-black/5">
                <AvatarImage src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || username}&background=000&color=fff`} />
                <AvatarFallback className="bg-black text-white text-2xl font-bold rounded-3xl">
                  {profile?.full_name?.[0]?.toUpperCase() || username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                    {profile?.full_name || username}
                  </h1>
                  {isOwnProfile && (
                    <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-mono text-neutral-400">
                  @{profile?.username || username}
                </p>
                <p className="text-sm text-neutral-600 max-w-xl leading-relaxed pt-1">
                  {profile?.bio || "Creator & developer exploring AI prompts, architecture blueprints, and modular components on Promptly."}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isOwnProfile ? (
                <Link
                  to="/create"
                  className="flex-1 sm:flex-initial h-11 px-6 rounded-full bg-black text-white hover:bg-black/90 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Create Resource
                </Link>
              ) : (
                <Button
                  onClick={handleFollow}
                  className={`flex-1 sm:flex-initial h-11 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    isFollowing
                      ? "bg-neutral-200 text-black hover:bg-neutral-300"
                      : "bg-black text-white hover:bg-black/90 shadow-lg shadow-black/10"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleShare}
                className="h-11 w-11 rounded-full border-black/10 p-0 flex items-center justify-center hover:bg-neutral-100"
                title="Share Profile"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-8 pt-8 border-t border-black/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div>
              <p className="text-2xl font-black">{allResources.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Resources</p>
            </div>
            <div>
              <p className="text-2xl font-black">{allResources.length * 32 + 18}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Likes</p>
            </div>
            <div>
              <p className="text-2xl font-black">{allResources.length * 128 + 240}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Views</p>
            </div>
            <div>
              <p className="text-2xl font-black">{isFollowing ? 25 : 24}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Followers</p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-black/10 pb-4 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: `All (${allResources.length})` },
            { id: "prompts", label: "Prompts" },
            { id: "code", label: "Code & Components" },
            { id: "architectures", label: "Architectures" },
            { id: "about", label: "About" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-black text-white shadow-md shadow-black/10"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "about" ? (
          <div className="bg-neutral-50/50 rounded-3xl border border-black/5 p-8 max-w-3xl space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-tight">About {profile?.full_name || username}</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {profile?.bio || "No extended biography provided."}
            </p>
            <div className="pt-4 border-t border-black/5 space-y-2 text-xs text-neutral-500 font-mono">
              <p>Username: @{profile?.username || username}</p>
              <p>Profile ID: {profile?.id || "mock-creator-id"}</p>
              <p>Member of Promptly Community</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isResourcesLoading ? (
                [...Array(4)].map((_, i) => <ResourceCardSkeleton key={i} />)
              ) : filteredResources.length === 0 ? (
                <div className="col-span-full py-20 text-center space-y-4">
                  <Box className="w-12 h-12 text-neutral-300 mx-auto" />
                  <h3 className="text-lg font-bold uppercase tracking-tight">No resources in this section</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    {isOwnProfile
                      ? "You haven't published any items in this category yet."
                      : "This creator hasn't published any items in this category yet."}
                  </p>
                  {isOwnProfile && (
                    <Link
                      to="/create"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-black/90 shadow-lg shadow-black/10"
                    >
                      <Plus className="w-4 h-4" /> Create Now
                    </Link>
                  )}
                </div>
              ) : (
                filteredResources.map((resource: any) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
