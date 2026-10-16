import { Link } from "react-router";
import { Sparkles, ArrowRight, UserPlus } from "lucide-react";
import { buttonVariants } from "@shionstream/ui/components/button";

export function CtaSection() {
  return (
    <section id="watch" className="bg-background border-border/60 border-t py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-card border-border relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border p-8 text-center sm:p-12 md:p-16">
          <div className="bg-primary/10 border-primary/25 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            <span>Ready for the Next Episode?</span>
          </div>

          <h2 className="text-foreground max-w-2xl text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Start Streaming Your Favorite Anime Today
          </h2>

          <p className="text-muted-foreground max-w-xl text-base leading-relaxed sm:text-lg">
            Join thousands of anime fans streaming in high bitrate 1080p. No credit card required
            for initial library access.
          </p>

          <div className="flex w-full flex-col items-stretch gap-4 pt-2 sm:w-auto sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "h-12 justify-center gap-2 rounded-xl px-8 text-base font-bold",
              })}
            >
              <UserPlus className="size-5" />
              Create Free Account
            </Link>

            <Link
              to="/login"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-12 justify-center gap-2 rounded-xl px-8 text-base font-semibold",
              })}
            >
              Sign In to Account
              <ArrowRight className="text-muted-foreground size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
