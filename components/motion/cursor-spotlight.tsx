"use client";

import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!mq.matches) return;

    let raf = 0;
    let targetX = -999;
    let targetY = -999;
    let active = false;

    const apply = () => {
      raf = 0;
      el.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      if (!active) {
        active = true;
        el.style.opacity = "1";
      }
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!raf) {
        raf = window.requestAnimationFrame(apply);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed start-0 top-0 -z-10 size-[28rem] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_65%)] opacity-0 transition-opacity duration-500"
    />
  );
}