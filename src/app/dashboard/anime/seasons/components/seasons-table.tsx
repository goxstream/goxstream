"use client";

import { Edit2, Trash2, CalendarCheck, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SeasonItem } from "../types";

interface SeasonsTableProps {
  seasons: SeasonItem[];
  onToggleStatus: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onDeleteSeason: (id: string) => void;
  onEditSeason: (season: SeasonItem) => void;
}

export function SeasonsTable({
  seasons,
  onToggleStatus,
  onSetCurrent,
  onDeleteSeason,
  onEditSeason,
}: SeasonsTableProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="w-[140px]">Season</TableHead>
            <TableHead>Year & Quarter</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead className="text-right">Total Anime</TableHead>
            <TableHead className="text-center">Current Active</TableHead>
            <TableHead className="w-[100px] text-center">Status</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seasons.map((season) => (
            <TableRow key={season.id} className="border-border/40 hover:bg-muted/40 transition-colors">
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">
                    {season.name}
                  </span>
                  {season.isCurrent && (
                    <Badge variant="default" className="text-[10px] bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/30">
                      Active Now
                    </Badge>
                  )}
                </div>
              </TableCell>

              <TableCell className="text-xs font-mono text-muted-foreground">
                {season.year} — {season.quarter}
              </TableCell>

              <TableCell className="text-xs text-muted-foreground font-mono">
                {season.startDate} to {season.endDate}
              </TableCell>

              <TableCell className="text-right font-medium text-sm text-foreground">
                {season.totalAnime} Titles
              </TableCell>

              <TableCell className="text-center">
                {season.isCurrent ? (
                  <Badge variant="outline" className="text-[11px] gap-1 text-emerald-500 border-emerald-500/40">
                    <Check className="size-3" /> Selected
                  </Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSetCurrent(season.id)}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Set Active
                  </Button>
                )}
              </TableCell>

              <TableCell className="text-center">
                <Switch
                  checked={season.isActive}
                  onCheckedChange={() => onToggleStatus(season.id)}
                  aria-label={`Toggle ${season.name} status`}
                />
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditSeason(season)}
                    className="size-8 text-muted-foreground hover:text-foreground rounded-lg"
                  >
                    <Edit2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteSeason(season.id)}
                    className="size-8 text-muted-foreground hover:text-destructive rounded-lg"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
