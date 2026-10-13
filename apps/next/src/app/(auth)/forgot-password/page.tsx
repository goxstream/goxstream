import { Metadata } from "next";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password — GoxStream",
  description: "Reset your GoxStream account password.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="bg-primary/10 pointer-events-none absolute -top-40 -left-40 size-96 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
