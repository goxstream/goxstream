import Link from "next/link";
import { Play, Sparkles, Star, Zap, ShieldCheck, ArrowRight, Flame } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DecryptedText from "@/components/DecryptedText";
import { FEATURED_ANIME } from "@/lib/mock-anime";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-background border-b border-border/40">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>Simulcast Stream Engine • 1080p 60FPS</span>
            </div>

            {/* Main Hero Headline with React Bits DecryptedText */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Discover & Stream Your Favorite{" "}
              <span className="text-primary block mt-1">
                <DecryptedText
                  text="Anime Worlds"
                  animateOn="view"
                  speed={40}
                  maxIterations={8}
                  sequential={true}
                  revealDirection="start"
                  className="text-primary font-black"
                />
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Stream thousands of subbed and dubbed anime series with zero ad interruptions,
              lightning-fast bufferless playback, and instant simulcast releases straight from Japan.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <Link
                href="#watch"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "h-12 px-6 rounded-xl font-bold text-base shadow-lg shadow-primary/25 justify-center",
                })}
              >
                <Play className="mr-2 size-5 fill-primary-foreground stroke-primary-foreground" />
                Start Watching Now
              </Link>

              <Link
                href="#trending"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-12 px-6 rounded-xl font-semibold text-base justify-center",
                })}
              >
                Explore Trending Library
                <ArrowRight className="ml-2 size-4 text-muted-foreground" />
              </Link>
            </div>

            {/* Key Platform Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-muted-foreground border-t border-border/60 w-full">
              <span className="flex items-center gap-2">
                <Zap className="size-4 text-primary" /> Instant 5m Simulcast
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> 100% Ad-Free Experience
              </span>
              <span className="flex items-center gap-2">
                <Flame className="size-4 text-amber-500" /> 10,000+ Episodes
              </span>
            </div>
          </div>

          {/* Hero Right Visual: Featured Anime Hero Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden bg-card border border-border/80 shadow-2xl shadow-black/40 group">
              {/* Featured Poster Visual */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <div
                  className="absolute inset-0 size-full transition-transform duration-700 group-hover:scale-105"
                  style={{ background: FEATURED_ANIME.bannerImage }}
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <Badge className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 shadow-md">
                    #1 FEATURED SIMULCAST
                  </Badge>

                  <Badge className="bg-black/75 text-amber-400 backdrop-blur-md border border-amber-500/30 text-xs font-bold px-2.5 py-1 flex items-center gap-1">
                    <Star className="size-3.5 fill-amber-400 stroke-amber-400" />
                    {FEATURED_ANIME.rating}
                  </Badge>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Link
                    href={`#watch-${FEATURED_ANIME.slug}`}
                    className="size-16 rounded-full bg-primary/95 text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/40 group-hover:scale-110 transition-transform duration-300"
                    aria-label={`Watch ${FEATURED_ANIME.title}`}
                  >
                    <Play className="size-8 fill-primary-foreground stroke-primary-foreground ml-1" />
                  </Link>
                </div>

                {/* Anime Meta Details Banner at Bottom */}
                <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col gap-2 z-10 bg-card/90 backdrop-blur-md border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {FEATURED_ANIME.season} {FEATURED_ANIME.year}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground font-medium">
                      Ep {FEATURED_ANIME.latestEpisode} Released
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-foreground line-clamp-1">
                    {FEATURED_ANIME.title}
                  </h2>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {FEATURED_ANIME.synopsis}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    {FEATURED_ANIME.genres.slice(0, 3).map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-0.5 rounded bg-muted text-[10px] font-semibold text-muted-foreground"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
