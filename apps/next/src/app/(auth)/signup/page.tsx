import { Metadata } from "next";
import { SignupForm } from "./components/signup-form";

export const metadata: Metadata = {
  title: "Create Account — GoxStream",
  description: "Create a new GoxStream account to start streaming anime.",
};

export default function SignupPage() {
  return (
    <main className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Subtle Background Accent */}
      <div className="bg-primary/10 pointer-events-none absolute -top-40 -right-40 size-96 rounded-full blur-3xl" />
      <div className="bg-accent/10 pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <SignupForm />
      </div>
    </main>
  );
}
