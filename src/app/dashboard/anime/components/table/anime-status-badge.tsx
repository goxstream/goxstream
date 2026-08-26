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
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[11px] gap-1 px-2">
          <Radio className="h-3 w-3 animate-pulse" />
          Airing
        </Badge>
      );
    case "Finished":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 text-[11px] gap-1 px-2">
          <CheckCircle2 className="h-3 w-3" />
          Finished
        </Badge>
      );
    case "Upcoming":
      return (
        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30 text-[11px] gap-1 px-2">
          <Film className="h-3 w-3" />
          Upcoming
        </Badge>
      );
    case "Draft":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[11px] gap-1 px-2">
          <FileCode2 className="h-3 w-3" />
          Draft
        </Badge>
      );
  }
}
