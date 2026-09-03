/**
 * ============================================================================
 * GOXSTREAM ENTERPRISE DESIGN SYSTEM
 * ============================================================================
 * @file        logo-brand.tsx
 * @module      @/components/logo-brand
 * @package     GoxStream Core UI Engine
 * @version     1.0.0
 * @author      GoxStream Architecture & Brand Design Team
 * @copyright   (c) 2026 GoxStream Inc. All rights reserved.
 * @license     MIT License (https://opensource.org/licenses/MIT)
 * 
 * @description
 * Unified brand logo component composing the Icon Mark (<Logo />) and Syne
 * Wordmark (<LogoType />) with responsive layout variants:
 * - "horizontal": Inline row layout for headers, navbars, and footers.
 * - "1:1": Stacked square container layout for auth cards, modals, and app badges.
 * 
 * @see {@link https://gox.my.id}
 * ============================================================================
 */

import Link from "next/link";
import { Logo } from "@/components/logo";
import { LogoType } from "@/components/logo-type";
import { cn } from "@/lib/utils";

export interface LogoBrandProps {
  variant?: "horizontal" | "1:1";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  hideTextOnMobile?: boolean;
  className?: string;
  logoClassName?: string;
  logoTypeClassName?: string;
  renderAs?: "html" | "svg";
}

const ICON_SIZE_MAP = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 52,
};

export function LogoBrand({
  variant = "horizontal",
  size = "md",
  href,
  hideTextOnMobile = false,
  className,
  logoClassName,
  logoTypeClassName,
  renderAs = "html",
}: LogoBrandProps) {
  const iconSize = ICON_SIZE_MAP[size];

  if (renderAs === "svg") {
    const wordmarkWidth = { sm: 106, md: 122, lg: 136, xl: 164 }[size];
    const gap = 8;
    const padding = variant === "horizontal" ? 4 : 16;
    const width = variant === "horizontal"
      ? padding + iconSize + gap + wordmarkWidth + padding
      : iconSize + padding * 2;
    const height = variant === "horizontal"
      ? Math.max(iconSize, { sm: 24, md: 28, lg: 32, xl: 38 }[size]) + padding * 2
      : iconSize + 38 + padding * 2;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="GoxStream"
        className={className}
      >
        <g transform={`translate(${padding} ${variant === "horizontal" ? padding : padding})`}>
          <Logo size={iconSize} className={logoClassName} />
          <g transform={variant === "horizontal"
            ? `translate(${iconSize + gap} ${(iconSize - { sm: 24, md: 28, lg: 32, xl: 38 }[size]) / 2})`
            : `translate(${(iconSize - wordmarkWidth) / 2} ${iconSize + gap})`}>
            <LogoType size={size} renderAs="svg" className={logoTypeClassName} />
          </g>
        </g>
      </svg>
    );
  }

  const content = (
    <>
      <Logo
        size={iconSize}
        className={cn("transition-transform group-hover:scale-105 shrink-0", logoClassName)}
      />
      <LogoType
        size={size}
        className={cn(
          hideTextOnMobile && "hidden min-[380px]:inline-flex",
          logoTypeClassName
        )}
      />
    </>
  );


  const containerClassName = cn(
    "group inline-flex items-center transition-colors rounded-lg",
    variant === "horizontal"
      ? "flex-row gap-2 px-1.5 py-1"
      : "flex-col justify-center text-center gap-2 p-4 bg-card border border-border/60 shadow-xs",
    className
  );

  if (href) {
    return (
      <Link href={href} className={containerClassName}>
        {content}
      </Link>
    );
  }

  return <div className={containerClassName}>{content}</div>;
}
