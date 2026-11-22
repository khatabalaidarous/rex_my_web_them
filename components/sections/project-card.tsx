"use client";

import { useRef, type PointerEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  title: string;
  summary: string;
  category: string;
  year: string;
  viewLabel: string;
  placeholderLabel: string;
  isPlaceholder?: boolean;
  stack?: string[];
  highlight?: { value: string; label: string };
  href?: string;
  className?: string;
};

export function ProjectCard({
  title,
  summary,
  category,
  year,
  viewLabel,
  placeholderLabel,
  isPlaceholder = false,
  stack,
  highlight,
  href,
  className,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const clientX = event.clientX;
    const clientY = event.clientY;
    if (rafRef.current) return;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      card.style.setProperty("--rx", `${((y / rect.height) - 0.5) * -4}deg`);
      card.style.setProperty("--ry", `${((x / rect.width) - 0.5) * 4}deg`);
      card.style.setProperty("--px", `${x}px`);
      card.style.setProperty("--py", `${y}px`);
    });
  };

  const handleLeave = () => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  const topStack = stack?.slice(0, 3) ?? [];

  return (
    <div
      ref={cardRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(
        "project-card surface-card group relative flex h-full flex-col gap-4 overflow-hidden p-6 hover:border-primary/40 hover:bg-surface-2",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(560px circle at var(--px, 50%) var(--py, 50%), color-mix(in srgb, var(--primary) 11%, transparent), transparent 65%)",
        }}
      />
      <span
        aria-hidden
        className="absolute inset-x-6 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="relative flex items-center justify-between gap-3 text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary">{category}</span>
          {isPlaceholder ? (
            <>
              <span aria-hidden>·</span>
              <span className="text-[11px] text-muted">{placeholderLabel}</span>
            </>
          ) : null}
        </div>
        <span dir="ltr" className="tabular-nums">
          {year}
        </span>
      </div>

      <h3 className="relative text-xl font-semibold">
        <bdi>{title}</bdi>
      </h3>

      <p className="relative text-sm leading-relaxed text-muted">{summary}</p>

      {topStack.length > 0 ? (
        <div dir="ltr" className="relative flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted">
          {topStack.map((item, idx) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              {idx > 0 ? <span aria-hidden>·</span> : null}
              <span>{item}</span>
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative mt-auto flex items-center justify-between gap-4 border-t border-border/70 pt-4">
        {highlight ? (
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold tabular-nums text-accent" dir="ltr">
              {highlight.value}
            </span>
            <span className="text-xs text-muted">{highlight.label}</span>
          </div>
        ) : (
          <span />
        )}

        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-text transition-colors group-hover:text-primary">
          {viewLabel}
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>

      {href ? (
        <Link
          href={href}
          aria-label={title}
          className="absolute inset-0 z-20 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2"
        />
      ) : null}
    </div>
  );
}