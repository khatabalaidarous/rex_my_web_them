"use client";

import { useEffect, useRef } from "react";

type CounterProps = {
  value: number | string;
  suffix?: string;
  className?: string;
  duration?: number;
};

export function Counter({ value, suffix = "", className, duration = 1.2 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const raw = String(value).trim();
  const numericValue = Number(raw);
  const isNumeric = raw.length > 0 && Number.isFinite(numericValue);
  const decimals = isNumeric && raw.includes(".") ? raw.split(".")[1].length : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || !isNumeric) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId = 0;
    const animate = () => {
      const start = performance.now();
      const totalMs = duration * 1000;

      const step = (now: number) => {
        const elapsed = Math.min(1, (now - start) / totalMs);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        const current =
          elapsed >= 1
            ? raw
            : decimals > 0
              ? (eased * numericValue).toFixed(decimals)
              : String(Math.round(eased * numericValue));
        el.textContent = `${current}${suffix}`;
        if (elapsed < 1) {
          rafId = window.requestAnimationFrame(step);
        }
      };

      rafId = window.requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      animate();
      return () => {
        if (rafId) window.cancelAnimationFrame(rafId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          animate();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [raw, numericValue, isNumeric, decimals, suffix, duration]);

  return (
    <span ref={ref} className={className} dir="ltr">
      {raw}
      {suffix}
    </span>
  );
}