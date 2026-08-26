"use client";

import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ANIME_STATUSES, ANIME_TYPES, ANIME_SEASONS } from "../../constants";
import type { AnimeStatus, AnimeType, SeasonName } from "../../types";

interface InlineEditDetailsProps {
  titleRomaji: string;
  setTitleRomaji: (v: string) => void;
  titleEnglish: string;
  setTitleEnglish: (v: string) => void;
  status: AnimeStatus;
  setStatus: (v: AnimeStatus) => void;
  type: AnimeType;
  setType: (v: AnimeType) => void;
  episodes: number;
  setEpisodes: (v: number) => void;
  rating: number;
  setRating: (v: number) => void;
  studiosStr: string;
  setStudiosStr: (v: string) => void;
  seasonName: SeasonName;
  setSeasonName: (v: SeasonName) => void;
  seasonYear: number;
  setSeasonYear: (v: number) => void;
}

export function InlineEditDetails(props: InlineEditDetailsProps) {
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[11px] font-medium">Title (Romaji)</Label>
          <Input value={props.titleRomaji} onChange={(e) => props.setTitleRomaji(e.target.value)} className="h-8 text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-medium">Title (English)</Label>
          <Input value={props.titleEnglish} onChange={(e) => props.setTitleEnglish(e.target.value)} className="h-8 text-xs" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="space-y-1">
          <Label className="text-[11px] font-medium">Status</Label>
          <Select value={props.status} onValueChange={(v) => v && props.setStatus(v as AnimeStatus)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{ANIME_STATUSES.map((st) => (<SelectItem key={st} value={st} className="text-xs">{st}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-medium">Format</Label>
          <Select value={props.type} onValueChange={(v) => v && props.setType(v as AnimeType)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{ANIME_TYPES.map((t) => (<SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-medium">Episodes</Label>
          <Input type="number" value={props.episodes} onChange={(e) => props.setEpisodes(Number(e.target.value))} className="h-8 text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-medium">Rating (0-10)</Label>
          <div className="relative">
            <Input type="number" step="0.1" min="0" max="10" value={props.rating} onChange={(e) => props.setRating(Number(e.target.value))} className="h-8 text-xs pr-6" />
            <Star className="absolute right-2 top-2 h-3.5 w-3.5 text-amber-500 fill-amber-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[11px] font-medium">Studios</Label>
          <Input value={props.studiosStr} onChange={(e) => props.setStudiosStr(e.target.value)} className="h-8 text-xs" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[11px] font-medium">Season</Label>
            <Select value={props.seasonName} onValueChange={(v) => v && props.setSeasonName(v as SeasonName)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{ANIME_SEASONS.map((sn) => (<SelectItem key={sn} value={sn} className="text-xs">{sn}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] font-medium">Year</Label>
            <Input type="number" value={props.seasonYear} onChange={(e) => props.setSeasonYear(Number(e.target.value))} className="h-8 text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
