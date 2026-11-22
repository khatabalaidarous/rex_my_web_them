"use client";

import { useState } from "react";
import Image from "next/image";

const fallbackGradients = [
  "from-primary/20 via-bg-elevated to-surface text-primary",
  "from-accent/20 via-bg-elevated to-surface text-accent",
  "from-sky-400/20 via-bg-elevated to-surface text-sky-600 dark:text-sky-400",
  "from-amber-400/20 via-bg-elevated to-surface text-amber-600 dark:text-amber-400",
];

function resolvePortraitSrc(src?: string, slug?: string): string | null {
  const cleaned = typeof src === "string" ? src.trim() : "";
  if (!cleaned) return null;
  if (cleaned.startsWith("/") || cleaned.startsWith("data:image/")) {
    return cleaned;
  }
  if (cleaned.startsWith("https://") && slug) {
    let hash = 0;
    for (let i = 0; i < cleaned.length; i += 1) {
      hash = (hash * 31 + cleaned.charCodeAt(i)) | 0;
    }
    return `/api/team-avatar/${encodeURIComponent(slug)}?v=${Math.abs(hash)}`;
  }
  return null;
}

export function TeamPortrait({
  src,
  slug,
  alt,
  initials,
  accentIndex = 0,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className = "",
  interactive = true,
}: {
  src?: string;
  slug?: string;
  alt: string;
  initials: string;
  accentIndex?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  interactive?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolvedSrc = resolvePortraitSrc(src, slug);
  const validSrc = resolvedSrc && failedSrc !== resolvedSrc ? resolvedSrc : null;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border/80 bg-bg-elevated ${className}`}
    >
      <div
        aria-hidden
        className={`absolute inset-0 grid place-items-center bg-gradient-to-br text-2xl font-bold tracking-tight ${
          fallbackGradients[accentIndex % fallbackGradients.length]
        }`}
      >
        <span>{initials}</span>
      </div>

      {validSrc ? (
        <Image
          src={validSrc}
          alt={alt}
          fill
          priority={priority}
          referrerPolicy="no-referrer"
          sizes={sizes}
          onError={() => setFailedSrc(validSrc)}
          className={`object-cover object-top scale-[1.04] motion-reduce:transition-none ${
            interactive
              ? "transition-transform duration-500 ease-out group-hover:scale-[1.08] motion-reduce:group-hover:scale-[1.04]"
              : ""
          }`}
        />
      ) : null}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 via-black/15 to-transparent"
      />
    </div>
  );
}
