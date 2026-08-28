"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroBreadcrumbProps {
  title?: string;
  isLoading?: boolean;
}

export function HeroBreadcrumb({ title, isLoading }: HeroBreadcrumbProps) {
  if (isLoading || !title) {
    return (
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-12 rounded" />
        <Skeleton className="h-3 w-3 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-3 w-3 rounded" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      <ChevronRight className="size-3" />
      <Link href="/browse" className="hover:text-foreground transition-colors">
        Browse Anime
      </Link>
      <ChevronRight className="size-3" />
      <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
        {title}
      </span>
    </nav>
  );
}
