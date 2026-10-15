import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@goxstream/ui/components/button";

interface ApiErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ApiError({
  message = "Failed to load data. Please try again later.",
  onRetry,
  className,
}: ApiErrorProps) {
  return (
    <div
      className={`border-destructive/20 bg-destructive/5 flex flex-col items-center gap-3 rounded-xl border p-6 text-center ${className ?? ""}`}
    >
      <AlertCircle className="text-destructive size-8" />
      <p className="text-destructive text-sm font-medium">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-1 gap-1.5 rounded-lg"
        >
          <RefreshCw className="size-3.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}
