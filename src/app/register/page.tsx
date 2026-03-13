import { AuthForm } from "@/components/features/auth-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <AuthForm mode="register" />
    </div>
  );
}
