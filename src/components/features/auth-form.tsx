"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

type AuthFormMode = "login" | "register";

interface AuthFormProps {
  mode: AuthFormMode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === "login";
  const endpoint = isLogin ? "/api/login" : "/api/register";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.status === "success") {
        toast(data.message, "success");
        router.push("/dashboard");
        router.refresh();
        return;
      }

      if (data.redirect_to) {
        toast(data.message, "error");
        router.push(data.redirect_to);
        return;
      }

      toast(data.message ?? "Something went wrong", "error");
    } catch {
      toast("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isLogin ? "Sign in" : "Create account"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={isLogin ? "••••••••" : "At least 8 chars, letters and numbers"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isLogin ? undefined : 8}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : isLogin ? "Sign in" : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {isLogin ? (
            <>
              No account?{" "}
              <a href="/register" className="font-medium text-foreground underline underline-offset-4">
                Register
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="/login" className="font-medium text-foreground underline underline-offset-4">
                Sign in
              </a>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
