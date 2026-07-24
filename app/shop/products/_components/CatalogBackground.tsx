"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const DRIFTS = [
  { x: 50, y: -30, duration: 18 },
  { x: -40, y: 40, duration: 22 },
  { x: 35, y: 50, duration: 20 },
];

export default function CatalogBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const driftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fadeOutTimeout: ReturnType<typeof setTimeout>;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        driftRefs.current.forEach((el, i) => {
          if (!el) return;
          const d = DRIFTS[i % DRIFTS.length];
          gsap.to(el, {
            x: d.x,
            y: d.y,
            duration: d.duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.5,
          });
        });
      }

      if (spotlightRef.current) {
        quickX.current = gsap.quickTo(spotlightRef.current, "x", { duration: 0.7, ease: "power3.out" });
        quickY.current = gsap.quickTo(spotlightRef.current, "y", { duration: 0.7, ease: "power3.out" });
      }
    }, containerRef);

    // Tracked on window (not this element) so the spotlight follows the cursor
    // everywhere on the page, including while hovering over product cards above it.
    const handleWindowMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || !spotlightRef.current) return;
      quickX.current?.(e.clientX - rect.left - 220);
      quickY.current?.(e.clientY - rect.top - 220);
      gsap.to(spotlightRef.current, { opacity: 1, duration: 0.4 });
      clearTimeout(fadeOutTimeout);
      fadeOutTimeout = setTimeout(() => {
        if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.8 });
      }, 1500);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleWindowMouseMove);
      clearTimeout(fadeOutTimeout);
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Cursor-following ambient glow */}
      <div
        ref={spotlightRef}
        style={{ opacity: 0 }}
        className="absolute h-[440px] w-[440px] rounded-full bg-blush blur-3xl mix-blend-multiply"
      />

      {/* Slow-drifting ambient blobs for creative texture in the whitespace */}
      <div
        ref={(el) => { driftRefs.current[0] = el; }}
        className="absolute -top-20 -left-16 h-[380px] w-[380px] rounded-full bg-blush opacity-25 blur-3xl mix-blend-multiply"
      />
      <div
        ref={(el) => { driftRefs.current[1] = el; }}
        className="absolute top-1/2 -right-24 h-[340px] w-[340px] rounded-full bg-champagne opacity-30 blur-3xl mix-blend-multiply"
      />
      <div
        ref={(el) => { driftRefs.current[2] = el; }}
        className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-blush-deep opacity-20 blur-3xl mix-blend-multiply"
      />
    </div>
  );
}
