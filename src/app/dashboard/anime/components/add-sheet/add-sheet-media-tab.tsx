"use client";

import { Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddSheetMediaTabProps {
  coverImage: string;
  setCoverImage: (v: string) => void;
  bannerImage: string;
  setBannerImage: (v: string) => void;
}

export function AddSheetMediaTab({
  coverImage,
  setCoverImage,
  bannerImage,
  setBannerImage,
}: AddSheetMediaTabProps) {
  return (
    <div className="space-y-3.5 focus-visible:outline-hidden">
      <div className="space-y-1.5">
        <Label htmlFor="coverImage" className="text-xs font-medium">
          Poster Cover Image URL
        </Label>
        <Input
          id="coverImage"
          placeholder="https://..."
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="h-9 text-xs"
        />
        {coverImage && (
          <div className="mt-2 relative aspect-2/3 w-28 rounded-md overflow-hidden border border-border/60 bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="Cover Preview" className="object-cover w-full h-full" />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bannerImage" className="text-xs font-medium">
          Banner Backdrop Image URL
        </Label>
        <Input
          id="bannerImage"
          placeholder="https://..."
          value={bannerImage}
          onChange={(e) => setBannerImage(e.target.value)}
          className="h-9 text-xs"
        />
        {bannerImage && (
          <div className="mt-2 relative aspect-16/9 w-full rounded-md overflow-hidden border border-border/60 bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bannerImage} alt="Banner Preview" className="object-cover w-full h-full" />
          </div>
        )}
      </div>

      <div className="p-3 bg-muted/40 rounded-lg border border-border/60 text-xs text-muted-foreground flex items-center gap-2">
        <ImageIcon className="h-4 w-4 shrink-0 text-primary" />
        <span>Poster ratio: 2:3 aspect ratio. Banner ratio: 16:9 widescreen.</span>
      </div>
    </div>
  );
}
