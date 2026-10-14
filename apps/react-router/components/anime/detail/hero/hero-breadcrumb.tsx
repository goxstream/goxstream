import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@goxstream/ui/components/skeleton";

interface HeroBreadcrumbProps {
  title?: string;
  isLoading?: boolean;
}

export function HeroBreadcrumb({ title, isLoading }: HeroBreadcrumbProps) {
  if (isLoading || !title) {
    return (
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-12 rounded" />
        <Skeleton className="h-3 w-3 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-3 w-3 rounded" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>
    );
  }

  return (
    <nav className="text-muted-foreground mb-6 flex items-center gap-1.5 text-xs">
      <Link to="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      <ChevronRight className="size-3" />
      <Link to="/browse" className="hover:text-foreground transition-colors">
        Browse Anime
      </Link>
      <ChevronRight className="size-3" />
      <span className="text-foreground max-w-[200px] truncate font-medium sm:max-w-none">
        {title}
      </span>
    </nav>
  );
}
