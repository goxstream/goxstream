"use client";

import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import type { SeasonQuarter } from "../types";

interface SeasonsHeaderProps {
  selectedYear: number;
  selectedQuarter: SeasonQuarter;
  onYearChange: (year: number) => void;
  onQuarterChange: (quarter: SeasonQuarter) => void;
  onOpenAddSheet: () => void;
}

export function SeasonsHeader({
  selectedYear,
  selectedQuarter,
  onYearChange,
  onQuarterChange,
  onOpenAddSheet,
}: SeasonsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CalendarDays className="size-6 text-primary" />
          Season Schedule Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage seasonal anime line-ups, broadcast day time slots, and seasonal calendar releases.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Season Pickers */}
        <div className="flex items-center gap-2 bg-card/60 p-1.5 rounded-lg border border-border/60">
          <NativeSelect
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="h-8 text-xs font-semibold rounded-md border-0 bg-transparent"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
          </NativeSelect>

          <NativeSelect
            value={selectedQuarter}
            onChange={(e) => onQuarterChange(e.target.value as SeasonQuarter)}
            className="h-8 text-xs font-semibold rounded-md border-0 bg-transparent"
          >
            <option value="WINTER">Winter (Q1)</option>
            <option value="SPRING">Spring (Q2)</option>
            <option value="SUMMER">Summer (Q3)</option>
            <option value="FALL">Fall (Q4)</option>
          </NativeSelect>
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={onOpenAddSheet}
          className="rounded-lg gap-1.5"
        >
          <Plus className="size-4" />
          Add Season
        </Button>
      </div>
    </div>
  );
}
