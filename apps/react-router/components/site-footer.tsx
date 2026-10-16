import { Link } from "react-router";
import { ShieldCheck, Zap } from "lucide-react";
import { LogoBrand } from "@/components/logo-brand";
import { LogoType } from "@/components/logo-type";
import { Separator } from "@shionstream/ui/components/separator";

export function SiteFooter() {
  return (
    <footer className="border-border bg-card/40 text-card-foreground w-full border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <LogoBrand href="/" size="md" />
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              Fast discovery, high-fidelity streaming, and effortless watching. Experience your
              favorite anime series without friction or ad bloat.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                All Systems Operational
              </div>
              <div className="bg-muted border-border text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
                <Zap className="text-primary size-3" />
                Cloudflare Workers Engine
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/trending"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Trending Anime
                </Link>
              </li>
              <li>
                <Link
                  to="/browse"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link
                  to="/schedule"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Simulcast Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Legal */}
          <div className="space-y-3">
            <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
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
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-border/60 my-8" />

        <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-xs sm:flex-row">
          <div className="inline-flex items-center gap-1">
            <span>© {new Date().getFullYear()}</span>
            <LogoType size="sm" />
            <span>. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="text-primary size-4" />
            <span>High Quality Ad-Free Anime Player</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
