import { Zap, ShieldCheck, Tv, Download, Sparkles } from "lucide-react";

const PLATFORM_STATS = [
  { value: "1,200+", label: "Anime Titles", description: "Expansive library from classic retro to modern seasonal hits" },
  { value: "18,000+", label: "HD Episodes", description: "Streamed in crystal-clear 1080p 60fps quality" },
  { value: "45,000+", label: "Active Members", description: "Global community sharing reviews and watchlists" },
  { value: "99.9%", label: "Platform Uptime", description: "Ultra-low latency streaming powered by Cloudflare Workers" },
];


const FEATURES = [
  {
    icon: Zap,
    title: "Ultra-Fast Simulcast Drops",
    description: "Subbed episodes drop within 5 minutes of their official Japanese broadcast. Watch alongside fans worldwide.",
  },
  {
    icon: Tv,
    title: "1080p & 4K 60FPS Fidelity",
    description: "Crisp vector-sharp video quality with multi-bitrate adaptive streaming tailored to your network connection.",
  },
  {
    icon: ShieldCheck,
    title: "100% Ad-Free Experience",
    description: "Zero popups, pre-roll ads, or intrusive banners. Pure, unadulterated anime streaming from first frame to post-credits.",
  },
  {
    icon: Download,
    title: "Cross-Device Watchlist Sync",
    description: "Seamlessly continue watching across your desktop, phone, or tablet with automatic cloud progress synchronization.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold">
            <Sparkles className="size-3.5" />
            <span>Built for True Anime Fans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Why Streamers Choose GoxStream
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Engineered from the ground up for speed, visual clarity, and seamless user experience across all devices.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-card border border-border/80 hover:border-primary/60 hover:bg-muted/30 transition-colors duration-200 flex flex-col gap-4"
              >
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Platform Metric Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-2xl bg-card border border-border divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {PLATFORM_STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4">
              <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                {stat.value}
              </span>
              <span className="font-bold text-sm text-foreground mt-1">{stat.label}</span>
              <span className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                {stat.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
