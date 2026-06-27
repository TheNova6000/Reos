"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Check } from "lucide-react";
import { AuroraBackground } from "@/components/effects/aurora-background";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Authentication service is not configured.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Authentication service is not configured.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setResetSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <AuroraBackground intensity="subtle" />
      <Card className="w-full max-w-md glass-strong">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary flex items-center justify-center brutal-shadow">
            <Layers className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tight">REOS</CardTitle>
          <CardDescription>
            Real Estate Operating System
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetSent ? (
            <div className="text-center space-y-3 py-4">
              <div className="mx-auto w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center rounded-full">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm font-medium">Password reset email sent!</p>
              <p className="text-xs text-muted-foreground">Check your inbox for a reset link.</p>
              <Button variant="outline" size="sm" onClick={() => { setResetMode(false); setResetSent(false); }}>
                Back to Sign In
              </Button>
            </div>
          ) : resetMode ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-sm text-muted-foreground">Enter your email and we&apos;ll send you a password reset link.</p>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold uppercase text-xs tracking-wide">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
              <Button type="submit" className="w-full font-bold uppercase tracking-wide brutal-shadow-red" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <button type="button" onClick={() => { setResetMode(false); setError(null); }} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
                Back to Sign In
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold uppercase text-xs tracking-wide">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-bold uppercase text-xs tracking-wide">Password</Label>
                    <button type="button" onClick={() => { setResetMode(true); setError(null); }} className="text-xs text-primary font-semibold hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-2"
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive font-medium">{error}</p>
                )}
                <Button type="submit" className="w-full font-bold uppercase tracking-wide brutal-shadow-red" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary font-bold hover:underline">
                  Get Started
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
