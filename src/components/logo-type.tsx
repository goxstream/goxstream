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
 * Renders the "GoxStream" wordmark using the Syne font, with a brand gradient
 * on "Gox" and the active foreground color on "Stream".
 * 
 * @see {@link https://gox.my.id}
 * ============================================================================
 */

import { cn } from "@/lib/utils";

export interface LogoTypeProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  renderAs?: "html" | "svg";
}

const SIZE_CLASSES = {
  sm: "text-base tracking-tight",
  md: "text-lg tracking-tight",
  lg: "text-xl tracking-tight",
  xl: "text-2xl tracking-tight",
};

const SVG_SIZE_MAP = {
  sm: { width: 106, height: 24, fontSize: 16 },
  md: { width: 122, height: 28, fontSize: 18 },
  lg: { width: 136, height: 32, fontSize: 20 },
  xl: { width: 164, height: 38, fontSize: 24 },
};

export function LogoType({ size = "md", className, renderAs = "html" }: LogoTypeProps) {
  if (renderAs === "svg") {
    const svgSize = SVG_SIZE_MAP[size];

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={svgSize.width}
        height={svgSize.height}
        viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
        role="img"
        aria-label="GoxStream"
        className={className}
      >
        <defs>
          <linearGradient id="goxstream-wordmark-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#31ffe7" stopOpacity=".988" />
            <stop offset="1" stopColor="#34d094" />
          </linearGradient>
        </defs>
        <text
          x="4"
          y={svgSize.height / 2}
          dominantBaseline="central"
          fontFamily="Syne"
          fontSize={svgSize.fontSize}
          fontWeight="800"
          letterSpacing="-0.5"
        >
          <tspan fill="url(#goxstream-wordmark-gradient)">Gox</tspan>
          <tspan fill="currentColor">Stream</tspan>
        </text>
      </svg>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-brand font-extrabold leading-none select-none py-0.5 px-1",
        SIZE_CLASSES[size],
        className
      )}
    >
      <span className="bg-linear-to-br from-[#31ffe7] to-[#34d094] bg-clip-text text-transparent">
        Gox
      </span>
      <span className="text-foreground transition-colors">Stream</span>
    </span>
  );
}
