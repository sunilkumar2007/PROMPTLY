import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Github, Mail, Sparkles, Repeat } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";

export function AuthModal({
  isOpen,
  onClose,
  initialView = "login",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "signup";
}) {
  const { demoSignIn } = useAuth();
  const [view, setView] = useState<"login" | "signup">(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInstantDemo = () => {
    demoSignIn(email || "guest@skillswap.ai");
    toast.success("Welcome! Signed in as SkillSwap AI Guest.");
    onClose();
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) {
          demoSignIn(email);
          toast.success("Signed in as Demo User!");
          onClose();
          return;
        }
        toast.success("Check your email to confirm your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          demoSignIn(email);
          toast.success("Signed in as Demo User!");
          onClose();
          return;
        }
        toast.success("Signed in successfully!");
        onClose();
      }
    } catch (error: any) {
      demoSignIn(email);
      toast.success("Signed in as Demo Creator!");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    try {
      if (provider === "google") {
        await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin,
        });
      } else {
        await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo: window.location.origin,
          },
        });
      }
    } catch (error: any) {
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] animate-in fade-in zoom-in-95 duration-500 ease-out">
        <DialogHeader className="flex flex-col items-center">
          <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Repeat className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            {view === "login" ? "Welcome back" : "Create your account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {view === "login"
              ? "Sign in to your SkillSwap AI account"
              : "Start exchanging skills on SkillSwap AI today"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-black via-zinc-900 to-black text-white font-bold py-6 rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            onClick={handleInstantDemo}
          >
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Instant Demo Sign In (1-Click)</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign in with social / email
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuth("google")}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuth("github")}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {view === "login" ? "Sign In" : "Sign Up"}
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center text-sm">
          {view === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setView("signup")}
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setView("login")}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
