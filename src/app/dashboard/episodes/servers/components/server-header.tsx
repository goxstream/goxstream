import Link from "next/link";
import { Server, Plus, ArrowLeft, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServerHeaderProps {
  onAddClick: () => void;
}

export function ServerHeader({ onAddClick }: ServerHeaderProps) {
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
            <Server className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Video Server Sources & CDN Nodes
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor real-time node latency, health, active viewer streams, and fallback priorities.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Activity className="size-4 text-emerald-500" />
          Run Speed Test
        </Button>
        <Button size="sm" onClick={onAddClick} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" />
          Add Server Node
        </Button>
      </div>
    </div>
  );
}
