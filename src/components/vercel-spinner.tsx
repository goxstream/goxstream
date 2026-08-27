import { cn } from "@/lib/utils";

interface VercelSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
};

/**
 * Vercel-style SVG spinner component featuring smooth circular rotation
 * and minimalist stroke design.
 */
export function VercelSpinner({ className, size = "md" }: VercelSpinnerProps) {
  return (
    <svg
      className={cn("animate-spin text-primary-foreground/90", sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading..."
      role="status"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
