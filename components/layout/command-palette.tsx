"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { matchesSearchQuery } from "@/lib/search";

export type PaletteItem = {
  id: string;
  label: string;
  hint?: string;
  href: string;
  keywords: string;
};

type CommandPaletteProps = {
  items: PaletteItem[];
};

export function CommandPalette({ items }: CommandPaletteProps) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const normalizedQuery = query.trim();

  const filtered = useMemo(() => {
    if (!open) return [];
    if (!normalizedQuery) return items;
    return items.filter((item) =>
      matchesSearchQuery(`${item.label} ${item.hint ?? ""} ${item.keywords}`, normalizedQuery),
    );
  }, [items, normalizedQuery, open]);

  const clampedActive = filtered.length === 0 ? 0 : Math.min(active, filtered.length - 1);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    setActive(0);
    router.push(href);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const node = listRef.current?.children[clampedActive] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [clampedActive]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(Math.min(clampedActive + 1, Math.max(filtered.length - 1, 0)));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(Math.max(clampedActive - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      const item = filtered[clampedActive];
      if (item) {
        event.preventDefault();
        go(item.href);
      }
    }
  };

  const overlay =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
            onKeyDown={handleKeyDown}
          >
            <button
              type="button"
              aria-label={t("common.close")}
              onClick={() => setOpen(false)}
              className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
              tabIndex={-1}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t("search.label")}
              className="relative w-[min(92vw,36rem)] overflow-hidden rounded-2xl border border-border bg-bg-elevated/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search className="size-4 shrink-0 text-muted" aria-hidden />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                  }}
                  placeholder={t("search.placeholder")}
                  aria-label={t("search.label")}
                  className="h-14 w-full bg-transparent text-sm text-text outline-none placeholder:text-muted/70"
                />
                <kbd className="shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted">
                  Esc
                </kbd>
              </div>

              {filtered.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted">{t("search.empty")}</p>
              ) : (
                <ul ref={listRef} role="listbox" className="max-h-[55vh] overflow-y-auto p-2">
                  {filtered.map((item, index) => (
                    <li key={item.id} role="option" aria-selected={index === clampedActive}>
                      <button
                        type="button"
                        onClick={() => go(item.href)}
                        onMouseEnter={() => setActive(index)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors ${
                          index === clampedActive
                            ? "bg-surface text-text"
                            : "text-muted hover:bg-surface/60 hover:text-text"
                        }`}
                      >
                        <span className="flex flex-col gap-0.5">
                          <span className="font-medium">{item.label}</span>
                          {item.hint ? (
                            <span className="line-clamp-1 text-xs text-muted">{item.hint}</span>
                          ) : null}
                        </span>
                        <CornerDownLeft className="size-3.5 shrink-0 text-muted" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted">
                {query.trim() ? (
                  <button
                    type="button"
                    onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
                    className="font-medium text-primary transition-opacity hover:opacity-80"
                  >
                    {t("search.results")} ({filtered.length})
                  </button>
                ) : (
                  <span>{t("search.hint")}</span>
                )}
                <span aria-hidden>⌘K</span>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("search.label")}
        title={`${t("search.label")} (⌘K)`}
        className="hidden h-10 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-border px-2.5 text-xs text-muted transition-colors hover:bg-surface hover:text-text sm:inline-flex xl:px-3.5"
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="hidden xl:inline">{t("search.label")}</span>
        <kbd className="hidden rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] xl:inline">
          ⌘K
        </kbd>
      </button>

      {overlay}
    </>
  );
}