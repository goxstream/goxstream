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
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} className="hidden" />

      {!value ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${
            isDragging ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/50 bg-muted/20"
          }`}
        >
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">
              Drag & drop image here, or <span className="text-primary underline">browse</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Supports PNG, JPG, WebP. Ratio {aspectRatio === 2 / 3 ? "2:3 (Poster)" : "16:9 (Banner)"}.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg border border-border/60 bg-muted overflow-hidden flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <div className="relative h-14 rounded overflow-hidden border border-border/60 bg-background shadow-xs shrink-0" style={{ aspectRatio }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-foreground block">Cropped Image Loaded</span>
              <span className="text-[10px] text-emerald-500 font-medium">Ready for upload</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button type="button" variant="outline" size="xs" onClick={() => fileInputRef.current?.click()} className="h-7 text-xs px-2 gap-1">
              <Crop className="h-3 w-3" /> Re-crop
            </Button>
            <Button type="button" variant="ghost" size="xs" onClick={() => onChange("")} className="h-7 text-xs px-2 text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {tempImageSrc && (
        <ImageCropModal
          open={Boolean(tempImageSrc)} imageSrc={tempImageSrc} aspectRatio={aspectRatio} title={`Crop & Edit ${label}`}
          onCropComplete={(croppedDataUrl) => { onChange(croppedDataUrl); setTempImageSrc(null); }}
          onCancel={() => setTempImageSrc(null)}
        />
      )}
    </div>
  );
}
