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
  className?: string;
  logoClassName?: string;
  logoTypeClassName?: string;
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
  className,
  logoClassName,
  logoTypeClassName,
}: LogoBrandProps) {
  const iconSize = ICON_SIZE_MAP[size];

  const content = (
    <>
      <Logo
        size={iconSize}
        className={cn("transition-transform group-hover:scale-105", logoClassName)}
      />
      <LogoType size={size} className={logoTypeClassName} />
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
