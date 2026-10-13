import { Suspense } from "react";
import { Metadata } from "next";
import { LoginForm } from "./components/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Sign In — GoxStream",
  description: "Sign in to your GoxStream account to continue watching anime.",
};

function LoginFormFallback() {
  return (
    <div className="border-border/60 bg-card w-full max-w-md space-y-6 rounded-xl border p-6 shadow-xs">
      <Skeleton className="mx-auto h-6 w-1/3 rounded" />
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Subtle Background Glow Accent */}
      <div className="bg-primary/10 pointer-events-none absolute -top-40 -left-40 size-96 rounded-full blur-3xl" />
      <div className="bg-accent/10 pointer-events-none absolute -right-40 -bottom-40 size-96 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
