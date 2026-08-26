"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ANIME_STATUSES, ANIME_TYPES, ANIME_SEASONS } from "../../constants";
import type { AnimeStatus, AnimeType, SeasonName } from "../../types";

interface AddSheetBasicTabProps {
  titleRomaji: string;
  setTitleRomaji: (v: string) => void;
  titleEnglish: string;
  setTitleEnglish: (v: string) => void;
  titleJapanese: string;
  setTitleJapanese: (v: string) => void;
  type: AnimeType;
  setType: (v: AnimeType) => void;
  status: AnimeStatus;
  setStatus: (v: AnimeStatus) => void;
  episodes: number;
  setEpisodes: (v: number) => void;
  seasonName: SeasonName;
  setSeasonName: (v: SeasonName) => void;
  seasonYear: number;
  setSeasonYear: (v: number) => void;
  synopsis: string;
  setSynopsis: (v: string) => void;
}

export function AddSheetBasicTab(props: AddSheetBasicTabProps) {
  return (
    <div className="space-y-3 focus-visible:outline-hidden">
      <div className="space-y-1">
        <Label className="text-xs font-medium">Title (Romaji / Main) <span className="text-destructive">*</span></Label>
        <Input placeholder="e.g. Shingeki no Kyojin" value={props.titleRomaji} onChange={(e) => props.setTitleRomaji(e.target.value)} required className="h-8 text-xs" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Title (English)</Label>
          <Input placeholder="e.g. Attack on Titan" value={props.titleEnglish} onChange={(e) => props.setTitleEnglish(e.target.value)} className="h-8 text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Title (Japanese)</Label>
          <Input placeholder="e.g. 進撃の巨人" value={props.titleJapanese} onChange={(e) => props.setTitleJapanese(e.target.value)} className="h-8 text-xs" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Format / Type</Label>
          <Select value={props.type} onValueChange={(val) => val && props.setType(val as AnimeType)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{ANIME_TYPES.map((t) => (<SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Status</Label>
          <Select value={props.status} onValueChange={(val) => val && props.setStatus(val as AnimeStatus)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{ANIME_STATUSES.map((st) => (<SelectItem key={st} value={st} className="text-xs">{st}</SelectItem>))}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Episodes</Label>
          <Input type="number" min={1} value={props.episodes} onChange={(e) => props.setEpisodes(Number(e.target.value))} className="h-8 text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Season</Label>
          <Select value={props.seasonName} onValueChange={(val) => val && props.setSeasonName(val as SeasonName)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{ANIME_SEASONS.map((sn) => (<SelectItem key={sn} value={sn} className="text-xs">{sn}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Year</Label>
          <Input type="number" min={1970} max={2030} value={props.seasonYear} onChange={(e) => props.setSeasonYear(Number(e.target.value))} className="h-8 text-xs" />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-medium">Synopsis / Summary</Label>
        <Textarea rows={3} placeholder="Brief plot summary..." value={props.synopsis} onChange={(e) => props.setSynopsis(e.target.value)} className="text-xs resize-none" />
      </div>
    </div>
  );
}
