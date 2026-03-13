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
    <Card className="w-full border-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">
          {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
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
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              type="password"
              placeholder={isLogin ? "••••••••" : "อย่างน้อย 8 ตัว อักษรและตัวเลข"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isLogin ? undefined : 8}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "กรุณารอสักครู่..." : isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </Button>
        </form>
        <p className="text-center text-sm text-[var(--text-muted)]">
          {isLogin ? (
            <>
              ยังไม่มีบัญชี?{" "}
              <a
                href="/register"
                className="font-medium text-[var(--accent)] underline underline-offset-4 hover:no-underline"
              >
                สมัครสมาชิก
              </a>
            </>
          ) : (
            <>
              มีบัญชีอยู่แล้ว?{" "}
              <a
                href="/login"
                className="font-medium text-[var(--accent)] underline underline-offset-4 hover:no-underline"
              >
                เข้าสู่ระบบ
              </a>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
