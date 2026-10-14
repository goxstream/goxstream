import { Zap, ShieldCheck, Tv, Download, Sparkles } from "lucide-react";

const PLATFORM_STATS = [
  {
    value: "1,200+",
    label: "Anime Titles",
    description: "Expansive library from classic retro to modern seasonal hits",
  },
  {
    value: "18,000+",
    label: "HD Episodes",
    description: "Streamed in crystal-clear 1080p 60fps quality",
  },
  {
    value: "45,000+",
    label: "Active Members",
    description: "Global community sharing reviews and watchlists",
  },
  {
    value: "99.9%",
    label: "Platform Uptime",
    description: "Ultra-low latency streaming powered by Cloudflare Workers",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Ultra-Fast Simulcast Drops",
    description:
      "Subbed episodes drop within 5 minutes of their official Japanese broadcast. Watch alongside fans worldwide.",
  },
  {
    icon: Tv,
    title: "1080p & 4K 60FPS Fidelity",
    description:
      "Crisp vector-sharp video quality with multi-bitrate adaptive streaming tailored to your network connection.",
  },
  {
    icon: ShieldCheck,
    title: "100% Ad-Free Experience",
    description:
      "Zero popups, pre-roll ads, or intrusive banners. Pure, unadulterated anime streaming from first frame to post-credits.",
  },
  {
    icon: Download,
    title: "Cross-Device Watchlist Sync",
    description:
      "Seamlessly continue watching across your desktop, phone, or tablet with automatic cloud progress synchronization.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <div className="bg-primary/10 border-primary/25 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            <span>Built for True Anime Fans</span>
          </div>
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            Why Streamers Choose GoxStream
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Engineered from the ground up for speed, visual clarity, and seamless user experience
            across all devices.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-card border-border/80 hover:border-primary/60 hover:bg-muted/30 flex flex-col gap-4 rounded-xl border p-6 transition-colors duration-200"
              >
                <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-foreground text-lg font-bold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-card border-border divide-border/60 grid grid-cols-2 gap-6 divide-y rounded-2xl border p-8 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {PLATFORM_STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center p-4 text-center">
              <span className="text-primary text-3xl font-black tracking-tight sm:text-4xl">
                {stat.value}
              </span>
              <span className="text-foreground mt-1 text-sm font-bold">{stat.label}</span>
              <span className="text-muted-foreground mt-1 max-w-[200px] text-xs">
                {stat.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
