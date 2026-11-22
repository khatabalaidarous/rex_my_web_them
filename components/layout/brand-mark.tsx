"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  logoUrl?: string;
  alt?: string;
  className?: string;
};

const sizeMap = {
  sm: { box: "size-8 rounded-lg text-xs", px: 32 },
  md: { box: "size-9 rounded-xl text-[13px]", px: 36 },
  lg: { box: "size-12 rounded-2xl text-base", px: 48 },
} as const;

function resolveLogoSrc(logoUrl?: string): string | null {
  const cleaned = typeof logoUrl === "string" ? logoUrl.trim() : "";
  if (!cleaned) return null;
  if (cleaned.startsWith("/") || cleaned.startsWith("data:image/")) {
    return cleaned;
  }
  if (cleaned.startsWith("https://")) {
    let hash = 0;
    for (let i = 0; i < cleaned.length; i += 1) {
      hash = (hash * 31 + cleaned.charCodeAt(i)) | 0;
    }
    return `/api/brand-logo?v=${Math.abs(hash)}`;
  }
  return null;
}

export function BrandMark({ size = "md", logoUrl, alt = "Next Soft", className }: BrandMarkProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const metrics = sizeMap[size];
  const resolvedSrc = resolveLogoSrc(logoUrl);
  const showCustom = Boolean(resolvedSrc && failedSrc !== resolvedSrc);

  if (showCustom && resolvedSrc) {
    return (
      <span
        className={cn(
          "relative inline-grid shrink-0 place-items-center overflow-hidden border border-border/80 bg-surface/90 p-1 shadow-sm transition-all duration-300",
          metrics.box,
          className,
        )}
      >
        <Image
          src={resolvedSrc}
          alt={alt}
          width={metrics.px}
          height={metrics.px}
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(resolvedSrc)}
          className="size-full object-contain"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      dir="ltr"
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br from-primary via-border to-accent p-px shadow-sm transition-all duration-300",
        metrics.box,
        className,
      )}
    >
      <span className="relative flex size-full items-center justify-center rounded-[inherit] bg-[#090910] font-bold tracking-[-0.06em] text-white">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(124,92,255,0.34),transparent_60%),radial-gradient(circle_at_88%_88%,rgba(79,227,193,0.28),transparent_60%)]"
        />
        <span className="relative flex items-baseline leading-none">
          <span>N</span>
          <span className="text-accent">S</span>
        </span>
      </span>
    </span>
  );
}
