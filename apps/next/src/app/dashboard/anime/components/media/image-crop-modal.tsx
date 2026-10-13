"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, FlipHorizontal, Crop, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string;
  aspectRatio: number; // e.g. 2/3 for poster, 16/9 for banner
  title: string;
  onCropComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export function ImageCropModal({
  open,
  imageSrc,
  aspectRatio,
  title,
  onCropComplete,
  onCancel,
}: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      setZoom(1);
      setIsFlipped(false);
      setOffset({ x: 0, y: 0 });
    };
  }, [imageSrc]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = 320;
    const canvasHeight = Math.round(320 / aspectRatio);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ctx.translate(canvasWidth / 2 + offset.x, canvasHeight / 2 + offset.y);
    ctx.scale(isFlipped ? -zoom : zoom, zoom);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }, [aspectRatio, zoom, isFlipped, offset]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onCropComplete(canvas.toDataURL("image/jpeg", 0.9));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="bg-background border-border/60 p-4 sm:max-w-md">
        <DialogHeader className="border-border/40 border-b pb-2">
          <DialogTitle className="flex items-center gap-2 text-sm font-bold">
            <Crop className="text-primary h-4 w-4" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-3 py-2">
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            className="border-primary/50 relative flex cursor-grab items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-black/60 shadow-md active:cursor-grabbing"
          >
            <canvas ref={canvasRef} className="block max-w-full" />
          </div>

          <div className="bg-muted/30 border-border/60 flex w-full max-w-xs items-center justify-between gap-3 rounded-lg border p-2 px-2">
            <div className="flex flex-1 items-center gap-2">
              <ZoomOut className="text-muted-foreground h-3.5 w-3.5" />
              <Slider
                value={[zoom]}
                min={0.5}
                max={3}
                step={0.1}
                onValueChange={(val) => {
                  if (typeof val === "number") setZoom(val);
                  else if (Array.isArray(val) && val.length > 0) setZoom(val[0]);
                }}
                className="flex-1"
              />
              <ZoomIn className="text-muted-foreground h-3.5 w-3.5" />
            </div>

            <Button
              type="button"
              variant={isFlipped ? "default" : "outline"}
              size="xs"
              onClick={() => setIsFlipped(!isFlipped)}
              className="h-7 gap-1 px-2 text-xs"
            >
              <FlipHorizontal className="h-3.5 w-3.5" />
              Flip
            </Button>
          </div>
        </div>

        <DialogFooter className="border-border/40 flex flex-row items-center justify-between gap-2 border-t pt-2 sm:justify-between">
          <Button type="button" variant="outline" size="sm" onClick={onCancel} className="text-xs">
            <X className="mr-1 h-3.5 w-3.5" />
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleExport}
            className="bg-primary text-primary-foreground gap-1 text-xs"
          >
            <Check className="h-3.5 w-3.5" />
            Apply & Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
