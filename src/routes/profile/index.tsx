import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/landing/navigation";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/profile/")({
  component: ProfileIndexPage,
});

function ProfileIndexPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        navigate({ to: "/profile/$username", params: { username: user.id } });
      } else {
        navigate({ to: "/explore", search: { query: undefined, category: undefined, type: undefined } });
      }
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Navigation />
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Loading profile...</p>
      </div>
    </div>
  );
}
