import Link from "next/link";
import { Play, Sparkles, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section id="watch" className="py-16 md:py-20 bg-background border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 sm:p-12 md:p-16 text-center flex flex-col items-center gap-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold">
            <Sparkles className="size-3.5" />
            <span>Ready for the Next Episode?</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground max-w-2xl leading-tight">
            Start Streaming Your Favorite Anime Today
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Join thousands of anime fans streaming in high bitrate 1080p.
            No credit card required for initial library access.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
            <Link
              href="#trending"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "h-12 px-8 rounded-xl font-bold text-base justify-center",
              })}
            >
              <Play className="mr-2 size-5 fill-primary-foreground stroke-primary-foreground" />
              Start Watching Free
            </Link>

            <Link
              href="#latest"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-12 px-8 rounded-xl font-semibold text-base justify-center",
              })}
            >
              View Latest Episodes
              <ArrowRight className="ml-2 size-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
