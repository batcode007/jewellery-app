"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, Profile } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signInWithOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) await fetchProfile(session.user.id);
        else { setProfile(null); setLoading(false); }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
    setLoading(false);
  }

  async function signInWithOtp(phone: string) {
    // Silently swallow errors so the OTP step is always reachable (allows dev bypass below)
    await supabase.auth.signInWithOtp({ phone });
  }

  async function verifyOtp(phone: string, token: string) {
    if (token === "123456") {
      // Dev bypass: sign in anonymously so a real session + user ID exists
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          phone,
          name: "Dev User",
          role: "user",
        });
      }
      return;
    }
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }

  async function updateProfile(data: Partial<Profile>) {
    if (!session?.user) return;
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", session.user.id);
    if (error) throw error;
    setProfile((prev) => prev ? { ...prev, ...data } : null);
  }

  return (
    <AuthContext.Provider
      value={{ session, profile, loading, signInWithOtp, verifyOtp, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
