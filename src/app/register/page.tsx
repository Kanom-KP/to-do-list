import { AuthForm } from "@/components/features/auth-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--bg-page)] p-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[var(--due-today-border)]/30 dark:bg-[var(--accent)]/10 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">TaskFlow</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">สร้างบัญชีเพื่อเริ่มต้นใช้งาน</p>
        </div>
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
