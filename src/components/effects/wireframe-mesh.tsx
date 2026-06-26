"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

interface WireframeMeshProps {
  className?: string;
  opacity?: number;
}

export function WireframeMesh({ className, opacity = 1 }: WireframeMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scroll = useRef(0);
  const time = useRef(0);
  const frameId = useRef(0);
  const size = useRef({ w: 0, h: 0 });
  const prefersReducedMotion = useReducedMotion();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = size.current.w;
    const h = size.current.h;
    if (w === 0) return;

    const s = scroll.current;
    const t = time.current;
    const cols = 36;
    const rows = 24;

    ctx.clearRect(0, 0, w, h);

    const pts: { x: number; y: number; d: number }[][] = [];

    for (let r = 0; r < rows; r++) {
      pts[r] = [];
      for (let c = 0; c < cols; c++) {
        const nx = c / (cols - 1);
        const ny = r / (rows - 1);
        const bx = nx * w;
        const by = ny * h;

        const d1 = Math.sin(nx * 5 + s * 6 + t * 1.2) * Math.cos(ny * 4 + s * 4) * 40;
        const d2 = Math.cos(nx * 8 - s * 3 + t * 0.8) * Math.sin(ny * 6 + s * 5) * 25;
        const d3 = Math.sin((nx + ny) * 3 + s * 7 + t * 1.5) * 20;
        const d4 = Math.cos(nx * 3 - ny * 4 + s * 2 + t * 0.6) * 15;
        const disp = d1 + d2 + d3 + d4;

        const pScale = 1 + ny * 0.5;
        const px = w / 2 + (bx - w / 2) * pScale;
        const py = by + disp * (0.8 + ny * 0.8);

        pts[r][c] = { x: px, y: py, d: disp };
      }
    }

    const cx = w / 2;
    const cy = h / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = pts[r][c];
        const hn = Math.max(0, Math.min(1, (p.d + 100) / 200));

        const dist = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2) / maxDist;
        const fade = Math.max(0, 1 - dist * 0.9);
        const intensity = Math.abs(p.d) / 100;
        const a = (0.45 + intensity * 0.5) * fade;

        if (a < 0.03) continue;

        const cr = Math.floor(6 + 133 * hn);
        const cg = Math.floor(182 - 90 * hn);
        const cb = Math.floor(212 + 34 * hn);

        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${a})`;
        ctx.lineWidth = 1.2 + intensity * 1;

        if (c < cols - 1) {
          const n = pts[r][c + 1];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
        if (r < rows - 1) {
          const n = pts[r + 1][c];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }

        if (intensity > 0.25 && fade > 0.2) {
          const ga = (intensity - 0.25) * fade * 1.2;
          const gr = 3 + intensity * 4;
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr);
          gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${ga})`);
          gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, gr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      canvas!.width = vw * dpr;
      canvas!.height = vh * dpr;
      canvas!.style.width = `${vw}px`;
      canvas!.style.height = `${vh}px`;
      const ctx = canvas!.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      size.current = { w: vw, h: vh };
    }

    resize();
    window.addEventListener("resize", resize);

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scroll.current = self.progress * Math.PI * 8;
      },
    });

    let prev = 0;
    function loop(ts: number) {
      const dt = prev === 0 ? 16 : ts - prev;
      prev = ts;
      if (!prefersReducedMotion) {
        time.current += (dt / 1000) * 0.8;
      }
      draw();
      frameId.current = requestAnimationFrame(loop);
    }
    frameId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId.current);
      trigger.kill();
      window.removeEventListener("resize", resize);
    };
  }, [draw, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("fixed inset-0 -z-10 pointer-events-none", className)}
      style={{ opacity }}
    />
  );
}
