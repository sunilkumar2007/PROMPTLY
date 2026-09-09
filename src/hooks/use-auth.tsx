import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  demoSignIn: (email?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for demo user
    const savedDemo = localStorage.getItem("promptly_demo_user");
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed);
        setSession({
          access_token: "demo-token",
          token_type: "bearer",
          user: parsed,
          expires_in: 3600,
          refresh_token: "demo-refresh-token",
        } as any);
        setIsLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem("promptly_demo_user");
      }
    }

    // Check active sessions and sets the user
    supabase.auth.getSession()
      .then(({ data }) => {
        setSession(data?.session ?? null);
        setUser(data?.session?.user ?? null);
      })
      .catch(() => {
        setSession(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Listen for changes on auth state (sign in, sign out, etc.)
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!localStorage.getItem("promptly_demo_user")) {
          setSession(session ?? null);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      });
      return () => {
        data?.subscription?.unsubscribe();
      };
    } catch {
      // Offline / guest mode fallback
      setIsLoading(false);
    }
  }, []);

  const demoSignIn = (customEmail?: string) => {
    const mockUser: User = {
      id: "demo-creator-1",
      email: customEmail || "demo@promptly.ai",
      user_metadata: { full_name: "Demo Creator", avatar_url: "/logo.png" },
      app_metadata: { provider: "email" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };
    localStorage.setItem("promptly_demo_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setSession({
      access_token: "demo-token",
      token_type: "bearer",
      user: mockUser,
      expires_in: 3600,
      refresh_token: "demo-refresh-token",
    } as any);
  };

  const signOut = async () => {
    localStorage.removeItem("promptly_demo_user");
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut, demoSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

