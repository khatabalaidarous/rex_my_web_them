"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  value,
  label,
  copiedLabel,
  className = "",
}: {
  value: string;
  label: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable in restricted context
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-border bg-bg-elevated px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-accent" aria-hidden />
          <span className="text-accent">{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy className="size-3.5" aria-hidden />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
