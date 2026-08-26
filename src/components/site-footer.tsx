import Link from "next/link";
import { Play, ShieldCheck, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-card/40 text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Play className="size-4 fill-primary-foreground stroke-primary-foreground ml-0.5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                Gox<span className="text-primary">Stream</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Fast discovery, high-fidelity streaming, and effortless watching.
              Experience your favorite anime series without friction or ad bloat.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-medium">
                <Zap className="size-3 text-primary" />
                Cloudflare Workers Engine
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#trending" className="text-muted-foreground hover:text-foreground transition-colors">
                  Trending Anime
                </Link>
              </li>
              <li>
                <Link href="#latest" className="text-muted-foreground hover:text-foreground transition-colors">
                  Latest Releases
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Platform Features
                </Link>
              </li>
              <li>
                <Link href="#watch" className="text-muted-foreground hover:text-foreground transition-colors">
                  Simulcast Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Platform & Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#dmca" className="text-muted-foreground hover:text-foreground transition-colors">
                  DMCA Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border/60" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} GoxStream. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-primary" />
            <span>High Quality Ad-Free Anime Player</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
