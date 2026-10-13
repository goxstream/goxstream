"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, FlipHorizontal, Crop, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  open, imageSrc, aspectRatio, title, onCropComplete, onCancel,
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
      setZoom(1); setIsFlipped(false); setOffset({ x: 0, y: 0 });
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
    canvas.width = canvasWidth; canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ctx.translate(canvasWidth / 2 + offset.x, canvasHeight / 2 + offset.y);
    ctx.scale(isFlipped ? -zoom : zoom, zoom);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }, [aspectRatio, zoom, isFlipped, offset]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

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
      <DialogContent className="sm:max-w-md bg-background border-border/60 p-4">
        <DialogHeader className="pb-2 border-b border-border/40">
          <DialogTitle className="text-sm font-bold flex items-center gap-2">
            <Crop className="h-4 w-4 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-3 py-2">
          <div
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)}
            className="relative border-2 border-dashed border-primary/50 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing bg-black/60 shadow-md flex items-center justify-center"
          >
            <canvas ref={canvasRef} className="max-w-full block" />
          </div>

          <div className="flex items-center justify-between w-full max-w-xs px-2 gap-3 bg-muted/30 p-2 rounded-lg border border-border/60">
            <div className="flex items-center gap-2 flex-1">
              <ZoomOut className="h-3.5 w-3.5 text-muted-foreground" />
              <Slider
                value={[zoom]} min={0.5} max={3} step={0.1}
                onValueChange={(val) => {
                  if (typeof val === "number") setZoom(val);
                  else if (Array.isArray(val) && val.length > 0) setZoom(val[0]);
                }}
                className="flex-1"
              />
              <ZoomIn className="h-3.5 w-3.5 text-muted-foreground" />
            </div>

            <Button type="button" variant={isFlipped ? "default" : "outline"} size="xs" onClick={() => setIsFlipped(!isFlipped)} className="h-7 text-xs px-2 gap-1">
              <FlipHorizontal className="h-3.5 w-3.5" />
              Flip
            </Button>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-between sm:justify-between items-center gap-2 pt-2 border-t border-border/40">
          <Button type="button" variant="outline" size="sm" onClick={onCancel} className="text-xs">
            <X className="h-3.5 w-3.5 mr-1" />
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleExport} className="bg-primary text-primary-foreground text-xs gap-1">
            <Check className="h-3.5 w-3.5" />
            Apply & Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
