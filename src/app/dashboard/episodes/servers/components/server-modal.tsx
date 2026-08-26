"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { ServerNode } from "../../types";

interface ServerModalProps {
  node: ServerNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (node: Partial<ServerNode>) => void;
}

export function ServerModal({ node, isOpen, onClose, onSave }: ServerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    region: "Asia Pacific (Singapore)",
    provider: "Cloudflare R2",
    endpoint: "",
    totalCapacityGbps: "20.0",
    isPrimary: false,
  });

  useEffect(() => {
    if (node) {
      setFormData({
        name: node.name,
        region: node.region,
        provider: node.provider,
        endpoint: node.endpoint,
        totalCapacityGbps: node.totalCapacityGbps.toString(),
        isPrimary: node.isPrimary,
      });
    } else {
      setFormData({
        name: "",
        region: "Asia Pacific (Singapore)",
        provider: "Cloudflare R2",
        endpoint: "",
        totalCapacityGbps: "20.0",
        isPrimary: false,
      });
    }
  }, [node, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: node?.id,
      name: formData.name,
      region: formData.region,
      provider: formData.provider,
      endpoint: formData.endpoint,
      totalCapacityGbps: parseFloat(formData.totalCapacityGbps) || 10,
      isPrimary: formData.isPrimary,
      status: node?.status || "online",
      latencyMs: node?.latencyMs || 40,
      activeConnections: node?.activeConnections || 0,
      bandwidthUsageGbps: node?.bandwidthUsageGbps || 0,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border-border/60 bg-card">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {node ? "Edit Video Server Node" : "Add New Server Node"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure CDN server endpoint, region, bandwidth limit, and primary flag.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Server Node Name *</Label>
            <Input
              placeholder="e.g. Cloudflare R2 Primary Edge"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              className="h-9 border-border/60 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Provider</Label>
              <Select
                value={formData.provider}
                onValueChange={(val) => val && setFormData((p) => ({ ...p, provider: val }))}
              >
                <SelectTrigger className="h-9 border-border/60 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cloudflare R2">Cloudflare R2</SelectItem>
                  <SelectItem value="BunnyCDN">BunnyCDN</SelectItem>
                  <SelectItem value="FastEmbed Network">FastEmbed</SelectItem>
                  <SelectItem value="AWS CloudFront">AWS CloudFront</SelectItem>
                  <SelectItem value="Custom Server">Custom Server</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Region Location</Label>
              <Input
                placeholder="e.g. Asia Pacific"
                value={formData.region}
                onChange={(e) => setFormData((p) => ({ ...p, region: e.target.value }))}
                className="h-9 border-border/60 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">CDN Endpoint Base URL *</Label>
            <Input
              placeholder="https://cdn-sg.goxstream.tv/hls/"
              value={formData.endpoint}
              onChange={(e) => setFormData((p) => ({ ...p, endpoint: e.target.value }))}
              required
              className="h-9 border-border/60 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Max Bandwidth Capacity (Gbps)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="20.0"
              value={formData.totalCapacityGbps}
              onChange={(e) => setFormData((p) => ({ ...p, totalCapacityGbps: e.target.value }))}
              className="h-9 border-border/60 text-xs"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20">
            <div>
              <Label className="text-xs font-semibold text-foreground">Set as Primary Default Server</Label>
              <p className="text-[11px] text-muted-foreground">
                First choice server for all player stream requests.
              </p>
            </div>
            <Switch
              checked={formData.isPrimary}
              onCheckedChange={(checked) => setFormData((p) => ({ ...p, isPrimary: checked }))}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
              Save Server Node
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
