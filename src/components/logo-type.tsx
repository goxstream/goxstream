/**
 * ============================================================================
 * GOXSTREAM ENTERPRISE DESIGN SYSTEM
 * ============================================================================
 * @file        logo-type.tsx
 * @module      @/components/logo-type
 * @package     GoxStream Core UI Engine
 * @version     1.0.0
 * @author      GoxStream Architecture & Brand Design Team
 * @copyright   (c) 2026 GoxStream Inc. All rights reserved.
 * @license     MIT License (https://opensource.org/licenses/MIT)
 * 
 * @description
 * High-fidelity typography mark component for GoxStream.
 * Renders the "GoxStream" wordmark using the Syne font with adaptive color rules:
 * - "Gox": Electric Emerald (`text-brand` / `--brand`)
 * - "Stream": Adaptive Theme (`text-foreground` — dark in Light Mode, bright in Dark Mode)
 * 
 * @see {@link https://gox.my.id}
 * ============================================================================
 */

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
        "inline-flex items-center font-brand font-extrabold leading-none select-none py-0.5 px-1",
        SIZE_CLASSES[size],
        className
      )}
    >
      <span className="text-brand">Gox</span>
      <span className="text-foreground transition-colors">Stream</span>
    </span>
  );
}
