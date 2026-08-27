import { Suspense } from "react"
import { Metadata } from "next"
import { LoginForm } from "./components/login-form"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Sign In — GoxStream",
  description: "Sign in to your GoxStream account to continue watching anime.",
}

function LoginFormFallback() {
  return (
    <div className="w-full max-w-md border border-border/60 shadow-xs rounded-xl bg-card p-6 space-y-6">
      <Skeleton className="h-6 w-1/3 mx-auto rounded" />
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Subtle Background Glow Accent */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}

