"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type Animation = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-up";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: string;
  className?: string;
}

const ANIMATION_FROM: Record<Animation, gsap.TweenVars> = {
  "fade-up": { opacity: 0, y: 40 },
  "fade-in": { opacity: 0 },
  "fade-left": { opacity: 0, x: -30 },
  "fade-right": { opacity: 0, x: 30 },
  "scale-up": { opacity: 0, scale: 0.95 },
};

export function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.8,
  stagger = 0,
  threshold = "top 85%",
  className,
}: AnimateOnScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const fromVars = ANIMATION_FROM[animation];
      const effectiveDuration = prefersReducedMotion ? 0 : duration;

      const targets =
        stagger > 0
          ? containerRef.current.children
          : containerRef.current;

      gsap.from(targets, {
        ...fromVars,
        duration: effectiveDuration,
        delay,
        stagger: prefersReducedMotion ? 0 : stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: threshold,
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion, animation] }
  );

  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  );
}
