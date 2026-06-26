"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

interface ScrollColorBackgroundProps {
  children: React.ReactNode;
}

export function ScrollColorBackground({ children }: ScrollColorBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !containerRef.current) return;

      const orb1 = containerRef.current.querySelector<HTMLElement>("[data-orb='1']");
      const orb2 = containerRef.current.querySelector<HTMLElement>("[data-orb='2']");
      const orb3 = containerRef.current.querySelector<HTMLElement>("[data-orb='3']");
      if (!orb1 || !orb2 || !orb3) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      tl.to(orb1, {
        x: "20vw",
        y: "40vh",
        scale: 1.3,
        background: "rgba(139, 92, 246, 0.25)",
        duration: 1,
      }, 0);

      tl.to(orb2, {
        x: "-30vw",
        y: "60vh",
        scale: 0.8,
        background: "rgba(6, 182, 212, 0.3)",
        duration: 1,
      }, 0);

      tl.to(orb3, {
        x: "10vw",
        y: "80vh",
        scale: 1.5,
        background: "rgba(99, 102, 241, 0.2)",
        duration: 1,
      }, 0);
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          data-orb="1"
          className="absolute will-change-transform"
          style={{
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "rgba(6, 182, 212, 0.2)",
            filter: "blur(120px)",
            top: "-10%",
            left: "-5%",
          }}
        />
        <div
          data-orb="2"
          className="absolute will-change-transform"
          style={{
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(139, 92, 246, 0.18)",
            filter: "blur(130px)",
            top: "10%",
            right: "-10%",
          }}
        />
        <div
          data-orb="3"
          className="absolute will-change-transform"
          style={{
            width: 550,
            height: 550,
            borderRadius: "50%",
            background: "rgba(20, 184, 166, 0.12)",
            filter: "blur(110px)",
            top: "50%",
            left: "30%",
          }}
        />
      </div>
      {children}
    </div>
  );
}
