import { cn } from "@/lib/utils";

export interface LogoTypeProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "text-base tracking-tight",
  md: "text-lg tracking-tight",
  lg: "text-xl tracking-tight",
  xl: "text-2xl tracking-tight",
};

export function LogoType({ size = "md", className }: LogoTypeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-bold leading-none select-none py-0.5 px-1",
        SIZE_CLASSES[size],
        className
      )}
    >
      <span className="text-primary">Gox</span>
      <span className="text-foreground transition-colors">Stream</span>
    </span>
  );
}
