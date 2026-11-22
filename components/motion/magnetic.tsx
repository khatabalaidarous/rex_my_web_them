"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function Magnetic({ children, className, strength = 0.25 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!mq.matches) return;

    let raf = 0;

    const move = (event: PointerEvent) => {
      const clientX = event.clientX;
      const clientY = event.clientY;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const x = (clientX - (rect.left + rect.width / 2)) * strength;
        const y = (clientY - (rect.top + rect.height / 2)) * strength;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
    };

    const leave = () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
      el.style.transform = "translate3d(0, 0, 0)";
    };

    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex transition-transform duration-300 ease-out motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  );
}