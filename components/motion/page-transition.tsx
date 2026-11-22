"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";

export function PageTransition() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const raf1 = window.requestAnimationFrame(() => setPhase("active"));
    const timer = window.setTimeout(() => setPhase("done"), 260);
    const cleanup = window.setTimeout(() => setPhase("idle"), 420);

    return () => {
      window.cancelAnimationFrame(raf1);
      window.clearTimeout(timer);
      window.clearTimeout(cleanup);
    };
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 ease-out rtl:origin-right ${
        phase === "active" ? "scale-x-100 opacity-100" : "scale-x-100 opacity-0"
      }`}
    />
  );
}