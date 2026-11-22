"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Callback = () => void;
const listeners = new WeakMap<Element, Callback>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = listeners.get(entry.target);
            if (cb) {
              cb();
              listeners.delete(entry.target);
            }
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.01, rootMargin: "40px 0px" },
    );
  }
  return sharedObserver;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
};

export function Reveal({ children, className, delay = 0, y = 20 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof el.animate !== "function") return;

    const rect = el.getBoundingClientRect();
    const isBelowFold = rect.top > window.innerHeight * 0.98;
    if (!isBelowFold) return;

    const observer = getSharedObserver();
    if (!observer) return;

    const play = () => {
      el.animate(
        [
          { opacity: 0.01, transform: `translate3d(0, ${y}px, 0)` },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        {
          duration: 480,
          delay: Math.min(delay, 0.35) * 1000,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "backwards",
        },
      );
    };

    listeners.set(el, play);
    observer.observe(el);

    return () => {
      listeners.delete(el);
      observer.unobserve(el);
    };
  }, [delay, y]);

  return (
    <div ref={ref} className={cn("opacity-100", className)}>
      {children}
    </div>
  );
}