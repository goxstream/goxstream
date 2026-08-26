import { Shield, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ServerFallbackConfig() {
  return (
    <div className="bg-card p-6 rounded-xl border border-border/60 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">
              Automatic Stream Fallback Routing
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Define secondary mirror fallback order when a primary video server experiences outages or high latency.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5 self-start sm:self-auto">
          <RefreshCw className="size-3.5" />
          Test Fallback Chain
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-3 text-xs">
        {/* Step 1 */}
        <div className="flex-1 w-full bg-muted/30 p-3 rounded-lg border border-border/60 flex items-center justify-between">
          <div className="space-y-1">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">Priority 1 (Primary)</Badge>
            <p className="font-bold text-foreground text-sm">Cloudflare R2 Edge</p>
            <p className="text-muted-foreground">HLS Master Playlist</p>
          </div>
          <span className="font-mono text-emerald-500 font-semibold">38ms</span>
        </div>

        <ArrowRight className="size-5 text-muted-foreground shrink-0 rotate-90 lg:rotate-0" />

        {/* Step 2 */}
        <div className="flex-1 w-full bg-muted/30 p-3 rounded-lg border border-border/60 flex items-center justify-between">
          <div className="space-y-1">
            <Badge variant="outline" className="text-[10px]">Priority 2 (Secondary)</Badge>
            <p className="font-bold text-foreground text-sm">BunnyCDN Mirror</p>
            <p className="text-muted-foreground">Tokyo CDN Proxy</p>
          </div>
          <span className="font-mono text-emerald-500 font-semibold">65ms</span>
        </div>

        <ArrowRight className="size-5 text-muted-foreground shrink-0 rotate-90 lg:rotate-0" />

        {/* Step 3 */}
        <div className="flex-1 w-full bg-muted/30 p-3 rounded-lg border border-border/60 flex items-center justify-between">
          <div className="space-y-1">
            <Badge variant="outline" className="text-[10px]">Priority 3 (Fallback)</Badge>
            <p className="font-bold text-foreground text-sm">FastEmbed Embed</p>
            <p className="text-muted-foreground">External iFrame Player</p>
          </div>
          <span className="font-mono text-amber-500 font-semibold">290ms</span>
        </div>
      </div>
    </div>
  );
}
