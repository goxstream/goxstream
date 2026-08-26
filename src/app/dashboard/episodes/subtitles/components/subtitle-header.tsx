import Link from "next/link";
import { Globe, ArrowLeft, FileText, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubtitleHeaderProps {
  onUploadClick: () => void;
}

export function SubtitleHeader({ onUploadClick }: SubtitleHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border/60">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/episodes">
          <Button variant="outline" size="icon" className="size-9 border-border/60">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <Globe className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Subtitles & Audio Dubbing Center
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit translation coverage, language tracks, and batch subtitle management.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Languages className="size-4 text-sky-500" />
          Language Rules
        </Button>
        <Button size="sm" onClick={onUploadClick} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
          <FileText className="size-4" />
          Batch Upload Subtitles
        </Button>
      </div>
    </div>
  );
}
