"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SeasonQuarter } from "../types";

interface SeasonAddSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSeason: (data: { year: number; quarter: SeasonQuarter; startDate: string; endDate: string }) => void;
}

export function SeasonAddSheet({
  open,
  onOpenChange,
  onAddSeason,
}: SeasonAddSheetProps) {
  const [year, setYear] = useState<number>(2026);
  const [quarter, setQuarter] = useState<SeasonQuarter>("SUMMER");
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-09-30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSeason({ year, quarter, startDate, endDate });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md flex flex-col gap-6">
        <SheetHeader>
          <SheetTitle>Add Seasonal Schedule</SheetTitle>
          <SheetDescription>
            Configure a new anime broadcast season and specify seasonal release date windows.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="year">Release Year</FieldLabel>
              <Select value={String(year)} onValueChange={(val) => val && setYear(Number(val))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2027">2027</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="quarter">Season Quarter</FieldLabel>
              <Select value={quarter} onValueChange={(val) => val && setQuarter(val as SeasonQuarter)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WINTER">Winter (Q1: Jan - Mar)</SelectItem>
                  <SelectItem value="SPRING">Spring (Q2: Apr - Jun)</SelectItem>
                  <SelectItem value="SUMMER">Summer (Q3: Jul - Sep)</SelectItem>
                  <SelectItem value="FALL">Fall (Q4: Oct - Dec)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="endDate">End Date</FieldLabel>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Field>
          </FieldGroup>

          <SheetFooter className="mt-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Season</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
