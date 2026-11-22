"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
};

export function Parallax({ children, className, speed = 0.08 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    if (!mq.matches) return;

    let raf = 0;
    let inView = true;

    const update = () => {
      raf = 0;
      if (!inView) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const centerRatio = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
      const offset = Math.max(-24, Math.min(24, centerRatio * -speed * 180));
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!raf && inView) {
        raf = window.requestAnimationFrame(update);
      }
    };

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            inView = Boolean(entries[0]?.isIntersecting);
          })
        : null;
    observer?.observe(el);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}