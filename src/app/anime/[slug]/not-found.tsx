import Link from "next/link";
import { Film, ArrowLeft, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function AnimeNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
            <Film className="size-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Anime Tidak Ditemukan
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Maaf, judul anime yang Anda cari tidak tersedia di pustaka kami atau telah berpindah alamat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/browse"
              className={buttonVariants({ variant: "default", className: "w-full sm:w-auto font-medium gap-2" })}
            >
              <Search className="size-4" />
              <span>Jelajahi Katalog</span>
            </Link>

            <Link
              href="/"
              className={buttonVariants({ variant: "outline", className: "w-full sm:w-auto font-medium gap-2 border-border/80" })}
            >
              <ArrowLeft className="size-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

