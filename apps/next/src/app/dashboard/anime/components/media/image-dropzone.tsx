"use client";

import { useState, useRef } from "react";
import { UploadCloud, Crop, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCropModal } from "./image-crop-modal";

interface ImageDropzoneProps {
  label: string;
  value: string;
  aspectRatio: number;
  onChange: (croppedUrl: string) => void;
}

export function ImageDropzone({ label, value, aspectRatio, onChange }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) setTempImageSrc(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-1.5">
      <span className="text-foreground text-xs font-medium">{label}</span>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        className="hidden"
      />

      {!value ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border/60 hover:border-primary/50 bg-muted/20"
          }`}
        >
          <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <p className="text-foreground text-xs font-semibold">
              Drag & drop image here, or <span className="text-primary underline">browse</span>
            </p>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              Supports PNG, JPG, WebP. Ratio{" "}
              {aspectRatio === 2 / 3 ? "2:3 (Poster)" : "16:9 (Banner)"}.
            </p>
          </div>
        </div>
      ) : (
        <div className="border-border/60 bg-muted relative flex items-center justify-between overflow-hidden rounded-lg border p-2">
          <div className="flex items-center gap-3">
            <div
              className="border-border/60 bg-background relative h-14 shrink-0 overflow-hidden rounded border shadow-xs"
              style={{ aspectRatio }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Uploaded preview" className="h-full w-full object-cover" />
            </div>
            <div className="text-xs">
              <span className="text-foreground block font-semibold">Cropped Image Loaded</span>
              <span className="text-[10px] font-medium text-emerald-500">Ready for upload</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 gap-1 px-2 text-xs"
            >
              <Crop className="h-3 w-3" /> Re-crop
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onChange("")}
              className="text-destructive hover:text-destructive h-7 px-2 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {tempImageSrc && (
        <ImageCropModal
          open={Boolean(tempImageSrc)}
          imageSrc={tempImageSrc}
          aspectRatio={aspectRatio}
          title={`Crop & Edit ${label}`}
          onCropComplete={(croppedDataUrl) => {
            onChange(croppedDataUrl);
            setTempImageSrc(null);
          }}
          onCancel={() => setTempImageSrc(null)}
        />
      )}
    </div>
  );
}
