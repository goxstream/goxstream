"use client";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Skeleton } from "@shionstream/ui/components/skeleton";
import { useSession } from "@/lib/auth-client";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, {
        replace: true,
      });
    }
  }, [isPending, session, navigate, location.pathname]);

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 md:flex-row md:gap-8">
          <Skeleton className="h-64 w-full shrink-0 rounded-2xl md:w-64 lg:w-72" />
          <div className="w-full min-w-0 flex-1 space-y-4">
            <Skeleton className="h-8 w-1/3 rounded-lg" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return <>{children}</>;
}
