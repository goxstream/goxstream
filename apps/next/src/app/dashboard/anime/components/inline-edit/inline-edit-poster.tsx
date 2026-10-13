"use client";

import { ImageDropzone } from "../media/image-dropzone";

interface InlineEditPosterProps {
  titleRomaji: string;
  coverImage: string;
  setCoverImage: (v: string) => void;
}

export function InlineEditPoster({
  coverImage,
  setCoverImage,
}: InlineEditPosterProps) {
  return (
    <div className="md:col-span-4">
      <ImageDropzone
        label="Poster Cover (2:3)"
        value={coverImage}
        aspectRatio={2 / 3}
        onChange={setCoverImage}
      />
    </div>
  );
}
