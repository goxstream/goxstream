"use client";

import { useUserNav } from "@/hooks/use-user-nav";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUserNav();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role === "user")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role === "user") {
    return (
      <div className="flex-1 flex flex-col gap-6 p-6 min-h-screen bg-background">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl flex-1" />
      </div>
    );
  }

  return <>{children}</>;
}
