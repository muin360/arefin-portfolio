"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

/**
 * Cursor-reactive neural-network particle background. Renders to a
 * full-bleed canvas. Lightweight (~60 particles), respects DPR, pauses
 * when off-screen, and is disabled for prefers-reduced-motion.
 */
export default function ParticleNetwork({
  density = 60,
  linkDistance = 140,
  className = "",
}: {
  density?: number;
  linkDistance?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles.length = 0;
      const count = Math.min(
        density,
        Math.floor((w * h) / 18000)
      );
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.8,
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    let raf = 0;
    let visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Update + draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Mouse repel — gentle so it feels organic
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 130 * 130) {
            const d = Math.sqrt(d2) || 1;
            const f = (130 - d) / 130;
            p.vx += (dx / d) * f * 0.18;
            p.vy += (dy / d) * f * 0.18;
          }
        }
        // Damping
        p.vx *= 0.985;
        p.vy *= 0.985;
        // Drift baseline
        p.vx += (Math.random() - 0.5) * 0.012;
        p.vy += (Math.random() - 0.5) * 0.012;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180, 160, 255, 0.85)";
        ctx.fill();
      }

      // Draw links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDistance * linkDistance) {
            const d = Math.sqrt(d2);
            const alpha = 1 - d / linkDistance;
            ctx.strokeStyle = `rgba(168, 130, 255, ${alpha * 0.42})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Draw mouse-to-particle link
        if (mouse.active) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 180 * 180) {
            const d = Math.sqrt(d2);
            const alpha = 1 - d / 180;
            ctx.strokeStyle = `rgba(236, 72, 153, ${alpha * 0.6})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visible = e.isIntersecting;
          if (visible) {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(draw);
          } else {
            cancelAnimationFrame(raf);
          }
        });
      },
      { threshold: 0 }
    );

    const handleResize = () => {
      resize();
      seed();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [density, linkDistance]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`w-full h-full ${className}`}
    />
  );
}
