"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const DRIFTS = [
  { x: 60, y: -40, duration: 16 },
  { x: -50, y: 50, duration: 20 },
  { x: 40, y: 60, duration: 18 },
  { x: -60, y: -30, duration: 24 },
];

export default function AnimatedHeroBackground() {
  const imageRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Slow, continuous Ken Burns pan/zoom on the hero image
      gsap.to(imageRef.current, {
        scale: 1.18,
        x: -20,
        y: 10,
        duration: 22,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Ambient light blobs drifting on independent loops for an organic, non-repeating feel
      blobRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = DRIFTS[i % DRIFTS.length];
        gsap.to(el, {
          x: d.x,
          y: d.y,
          duration: d.duration,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.6,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        ref={imageRef}
        className="absolute inset-0 scale-105 bg-[url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920')] bg-cover bg-center opacity-60 mix-blend-luminosity"
      />

      <div
        ref={(el) => { blobRefs.current[0] = el; }}
        className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-blush opacity-30 blur-3xl mix-blend-soft-light"
      />
      <div
        ref={(el) => { blobRefs.current[1] = el; }}
        className="absolute top-1/3 -right-32 h-[380px] w-[380px] rounded-full bg-champagne opacity-25 blur-3xl mix-blend-soft-light"
      />
      <div
        ref={(el) => { blobRefs.current[2] = el; }}
        className="absolute bottom-0 left-1/4 h-[340px] w-[340px] rounded-full bg-blush-deep opacity-20 blur-3xl mix-blend-soft-light"
      />
      <div
        ref={(el) => { blobRefs.current[3] = el; }}
        className="absolute bottom-10 right-10 h-[300px] w-[300px] rounded-full bg-cream opacity-20 blur-3xl mix-blend-soft-light"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </div>
  );
}
