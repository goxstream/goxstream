"use client";

import { Radio, CheckCircle2, Film, FileCode2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AnimeStatus } from "../../types";

interface AnimeStatusBadgeProps {
  status: AnimeStatus;
}

export function AnimeStatusBadge({ status }: AnimeStatusBadgeProps) {
  switch (status) {
    case "Airing":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-emerald-500/30 bg-emerald-500/10 px-2 text-[11px] text-emerald-500"
        >
          <Radio className="h-3 w-3 animate-pulse" />
          Airing
        </Badge>
      );
    case "Finished":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-blue-500/30 bg-blue-500/10 px-2 text-[11px] text-blue-500"
        >
          <CheckCircle2 className="h-3 w-3" />
          Finished
        </Badge>
      );
    case "Upcoming":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-purple-500/30 bg-purple-500/10 px-2 text-[11px] text-purple-500"
        >
          <Film className="h-3 w-3" />
          Upcoming
        </Badge>
      );
    case "Draft":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-amber-500/30 bg-amber-500/10 px-2 text-[11px] text-amber-500"
        >
          <FileCode2 className="h-3 w-3" />
          Draft
        </Badge>
      );
  }
}
