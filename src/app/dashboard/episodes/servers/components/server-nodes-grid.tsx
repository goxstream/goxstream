import { ServerNode } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, Globe, Edit2, Trash2, ShieldCheck } from "lucide-react";

interface ServerNodesGridProps {
  nodes: ServerNode[];
  onEdit: (node: ServerNode) => void;
  onDelete: (id: string) => void;
}

function renderHealthBadge(status: ServerNode["status"]) {
  switch (status) {
    case "online":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-medium flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </Badge>
      );
    case "degraded":
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-medium flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500" />
          High Latency
        </Badge>
      );
    case "offline":
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-medium flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-destructive" />
          Offline
        </Badge>
      );
  }
}

export function ServerNodesGrid({ nodes, onEdit, onDelete }: ServerNodesGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {nodes.map((node) => {
        const usagePercent = Math.round((node.bandwidthUsageGbps / node.totalCapacityGbps) * 100);

        return (
          <Card key={node.id} className="border-border/60 bg-card overflow-hidden">
            <CardHeader className="p-4 pb-3 flex flex-row items-start justify-between border-b border-border/40 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold text-foreground">
                    {node.name}
                  </CardTitle>
                  {node.isPrimary && (
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                      <ShieldCheck className="size-3 mr-1 inline" /> Primary
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="size-3.5" />
                  <span>{node.region}</span>
                  <span>•</span>
                  <span className="font-semibold text-foreground">{node.provider}</span>
                </div>
              </div>
              {renderHealthBadge(node.status)}
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 bg-muted/30 p-3 rounded-lg border border-border/40 text-center">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Latency</span>
                  <span className={`text-sm font-bold ${node.latencyMs > 200 ? "text-amber-500" : node.latencyMs === 0 ? "text-destructive" : "text-emerald-500"}`}>
                    {node.latencyMs > 0 ? `${node.latencyMs}ms` : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Active Streams</span>
                  <span className="text-sm font-bold text-foreground">
                    {node.activeConnections.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Bandwidth</span>
                  <span className="text-sm font-bold text-foreground">
                    {node.bandwidthUsageGbps} / {node.totalCapacityGbps} Gbps
                  </span>
                </div>
              </div>

              {/* Bandwidth Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Capacity Utilization</span>
                  <span className="font-semibold text-foreground">{usagePercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      usagePercent > 80 ? "bg-amber-500" : "bg-primary"
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              {/* Endpoint URL */}
              <div className="flex items-center justify-between text-muted-foreground bg-muted/40 p-2 rounded-md border border-border/40 font-mono text-[11px]">
                <span className="truncate max-w-[320px]">{node.endpoint}</span>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Button variant="ghost" size="icon" className="size-6" onClick={() => onEdit(node)}>
                    <Edit2 className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-6 text-destructive" onClick={() => onDelete(node.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
