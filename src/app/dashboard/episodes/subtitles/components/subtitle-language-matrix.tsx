import { Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SubtitleCoverageItem } from "../../types";

interface SubtitleLanguageMatrixProps {
  coverageList: SubtitleCoverageItem[];
}

export function SubtitleLanguageMatrix({ coverageList }: SubtitleLanguageMatrixProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="p-4 border-b border-border/60 bg-muted/20">
        <h3 className="text-base font-semibold text-foreground">
          Subtitle Translation Completeness Matrix
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Overview of subtitle coverage per active anime series across target languages.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="min-w-[280px]">Anime Title</TableHead>
            <TableHead className="text-center">Total Ep</TableHead>
            <TableHead className="text-center">Indonesian (ID)</TableHead>
            <TableHead className="text-center">English (EN)</TableHead>
            <TableHead className="text-center">Japanese (JA)</TableHead>
            <TableHead className="text-right">Missing Tracks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coverageList.map((item) => {
            const idComplete = item.subtitlesCount.id === item.totalEpisodes;
            const enComplete = item.subtitlesCount.en === item.totalEpisodes;
            const jaComplete = item.subtitlesCount.ja === item.totalEpisodes;

            return (
              <TableRow key={item.animeId} className="border-border/60 hover:bg-muted/40 text-xs">
                <TableCell className="font-semibold text-foreground">
                  {item.animeTitle}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {item.totalEpisodes}
                </TableCell>

                {/* Indonesian */}
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-1">
                    {idComplete ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-normal">
                        <Check className="size-3 mr-1" /> 100% ({item.subtitlesCount.id}/{item.totalEpisodes})
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                        {item.subtitlesCount.id}/{item.totalEpisodes}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* English */}
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-1">
                    {enComplete ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-normal">
                        <Check className="size-3 mr-1" /> 100% ({item.subtitlesCount.en}/{item.totalEpisodes})
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                        {item.subtitlesCount.en}/{item.totalEpisodes}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Japanese */}
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-1">
                    {jaComplete ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-normal">
                        <Check className="size-3 mr-1" /> 100% ({item.subtitlesCount.ja}/{item.totalEpisodes})
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        {item.subtitlesCount.ja}/{item.totalEpisodes}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Missing */}
                <TableCell className="text-right font-medium">
                  {item.missingCount > 0 ? (
                    <span className="text-amber-500 flex items-center justify-end gap-1 font-semibold">
                      <AlertCircle className="size-3.5" /> {item.missingCount} missing
                    </span>
                  ) : (
                    <span className="text-emerald-500 font-semibold">Complete</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
