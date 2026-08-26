"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddSheetBasicTab } from "./add-sheet/add-sheet-basic-tab";
import { AddSheetMediaTab } from "./add-sheet/add-sheet-media-tab";
import { AddSheetGenresTab } from "./add-sheet/add-sheet-genres-tab";
import type { AnimeItem, AnimeStatus, AnimeType, SeasonName } from "../types";

interface AnimeAddSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAnime: (anime: Omit<AnimeItem, "id" | "createdAt" | "updatedAt">) => void;
}

export function AnimeAddSheet({ open, onOpenChange, onAddAnime }: AnimeAddSheetProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [titleRomaji, setTitleRomaji] = useState("");
  const [titleEnglish, setTitleEnglish] = useState("");
  const [titleJapanese, setTitleJapanese] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [type, setType] = useState<AnimeType>("TV");
  const [status, setStatus] = useState<AnimeStatus>("Airing");
  const [episodes, setEpisodes] = useState(12);
  const [seasonYear, setSeasonYear] = useState(new Date().getFullYear());
  const [seasonName, setSeasonName] = useState<SeasonName>("Fall");
  const [coverImage, setCoverImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Action", "Fantasy"]);
  const [studios, setStudios] = useState("MAPPA");

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleRomaji.trim()) return;
    const slug = titleRomaji.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    onAddAnime({
      titleRomaji, titleEnglish: titleEnglish || titleRomaji, titleJapanese, slug: slug || "anime-title",
      synopsis: synopsis || "No description provided yet.", type, status, episodes: Number(episodes) || 1, durationPerEp: "24m",
      season: { year: Number(seasonYear) || 2026, season: seasonName }, rating: 8.0,
      studios: studios ? studios.split(",").map((s) => s.trim()) : ["Unknown"], genres: selectedGenres.length > 0 ? selectedGenres : ["Action"],
      coverImage: coverImage || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80",
      bannerImage: bannerImage || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&q=80", featured: false, trending: false,
    });

    setTitleRomaji(""); setTitleEnglish(""); setTitleJapanese(""); setSynopsis(""); setCoverImage(""); setBannerImage("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-full p-0 flex flex-col h-full bg-background border-l border-border/60">
        <SheetHeader className="p-4 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold">Add New Anime</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">Create a new title record in the catalog.</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-2 border-b border-border/60 bg-muted/20">
              <TabsList className="grid grid-cols-3 h-8 text-xs bg-muted/60 p-0.5">
                <TabsTrigger value="basic" className="text-xs py-1">Basic Info</TabsTrigger>
                <TabsTrigger value="media" className="text-xs py-1">Media</TabsTrigger>
                <TabsTrigger value="genres" className="text-xs py-1">Genres & More</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="basic" className="m-0">
                <AddSheetBasicTab
                  titleRomaji={titleRomaji} setTitleRomaji={setTitleRomaji} titleEnglish={titleEnglish} setTitleEnglish={setTitleEnglish}
                  titleJapanese={titleJapanese} setTitleJapanese={setTitleJapanese} type={type} setType={setType} status={status}
                  setStatus={setStatus} episodes={episodes} setEpisodes={setEpisodes} seasonName={seasonName} setSeasonName={setSeasonName}
                  seasonYear={seasonYear} setSeasonYear={setSeasonYear} synopsis={synopsis} setSynopsis={setSynopsis}
                />
              </TabsContent>
              <TabsContent value="media" className="m-0">
                <AddSheetMediaTab coverImage={coverImage} setCoverImage={setCoverImage} bannerImage={bannerImage} setBannerImage={setBannerImage} />
              </TabsContent>
              <TabsContent value="genres" className="m-0">
                <AddSheetGenresTab studios={studios} setStudios={setStudios} selectedGenres={selectedGenres} toggleGenre={toggleGenre} />
              </TabsContent>
            </div>

            <SheetFooter className="p-4 border-t border-border/60 bg-card/60 flex flex-row items-center justify-between gap-2">
              <SheetClose render={<Button type="button" variant="outline" size="sm" className="text-xs">Cancel</Button>} />
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>Save Anime</span>
              </Button>
            </SheetFooter>
          </Tabs>
        </form>
      </SheetContent>
    </Sheet>
  );
}
