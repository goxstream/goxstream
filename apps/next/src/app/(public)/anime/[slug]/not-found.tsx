import Link from "next/link";
import { Film, ArrowLeft, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function AnimeNotFound() {
  return (
    <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="bg-primary/10 text-primary mx-auto flex size-20 items-center justify-center rounded-full shadow-xs">
          <Film className="size-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Anime Not Found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sorry, the anime title you are looking for is not available in our library or has been
            relocated.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link
            href="/browse"
            className={buttonVariants({
              variant: "default",
              className: "w-full gap-2 font-medium sm:w-auto",
            })}
          >
            <Search className="size-4" />
            <span>Explore Catalog</span>
          </Link>

          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              className: "border-border/80 w-full gap-2 font-medium sm:w-auto",
            })}
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
