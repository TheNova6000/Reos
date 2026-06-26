"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { AuroraBackground } from "@/components/effects/aurora-background";
import { signup, type SignupState } from "@/app/actions/auth";

const initialState: SignupState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <AuroraBackground intensity="subtle" />
      <Card className="w-full max-w-md glass-strong">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary flex items-center justify-center brutal-shadow">
            <Layers className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tight">Get Started</CardTitle>
          <CardDescription>
            Create your REOS account and get a dashboard + branded website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name" className="font-bold uppercase text-xs tracking-wide">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                placeholder="Vision Infra Tech"
                required
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name" className="font-bold uppercase text-xs tracking-wide">Your Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Rajesh Kumar"
                required
                className="border-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold uppercase text-xs tracking-wide">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-bold uppercase text-xs tracking-wide">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 93912 38940"
                  className="border-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold uppercase text-xs tracking-wide">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min 8 characters"
                required
                minLength={8}
                className="border-2"
              />
            </div>
            {state.error && (
              <p className="text-sm text-destructive font-medium">{state.error}</p>
            )}
            <Button type="submit" className="w-full font-bold uppercase tracking-wide brutal-shadow-red" disabled={pending}>
              {pending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
