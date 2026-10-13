"use client";

import { ImageDropzone } from "../media/image-dropzone";

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
    <div className="space-y-4 focus-visible:outline-hidden">
      <ImageDropzone
        label="Poster Cover Image (2:3)"
        value={coverImage}
        aspectRatio={2 / 3}
        onChange={setCoverImage}
      />

      <ImageDropzone
        label="Backdrop Banner Image (16:9)"
        value={bannerImage}
        aspectRatio={16 / 9}
        onChange={setBannerImage}
      />
    </div>
  );
}
