import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Subtle Background Glow Accents */}
      <div className="bg-primary/10 pointer-events-none absolute -top-40 -left-40 size-96 rounded-full blur-3xl" />
      <div className="bg-accent/10 pointer-events-none absolute -right-40 -bottom-40 size-96 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </main>
  );
}
