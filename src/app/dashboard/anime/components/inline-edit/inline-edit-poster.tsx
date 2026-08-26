"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InlineEditPosterProps {
  titleRomaji: string;
  coverImage: string;
  setCoverImage: (v: string) => void;
}

export function InlineEditPoster({
  titleRomaji,
  coverImage,
  setCoverImage,
}: InlineEditPosterProps) {
  return (
    <div className="md:col-span-3 flex flex-col items-center gap-2">
      <div className="relative aspect-2/3 w-28 rounded-lg overflow-hidden border border-border/60 shadow-xs bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverImage} alt={titleRomaji} className="w-full h-full object-cover" />
      </div>
      <div className="w-full space-y-1">
        <Label className="text-[11px] font-medium text-muted-foreground">Poster Image URL</Label>
        <Input
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="h-7 text-[11px]"
        />
      </div>
    </div>
  );
}
