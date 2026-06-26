"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

interface ScrollContextValue {
  lenisRef: React.RefObject<LenisRef | null>;
  prefersReducedMotion: boolean;
}

const ScrollContext = createContext<ScrollContextValue>({
  lenisRef: { current: null },
  prefersReducedMotion: false,
});

export function useScrollContext() {
  return useContext(ScrollContext);
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion) return;

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pathname]);

  if (prefersReducedMotion) {
    return (
      <ScrollContext.Provider value={{ lenisRef, prefersReducedMotion }}>
        {children}
      </ScrollContext.Provider>
    );
  }

  return (
    <ScrollContext.Provider value={{ lenisRef, prefersReducedMotion }}>
      <ReactLenis
        root
        ref={lenisRef}
        options={{
          lerp: 0.1,
          duration: 1.5,
          syncTouch: true,
          autoRaf: false,
        }}
      >
        {children}
      </ReactLenis>
    </ScrollContext.Provider>
  );
}
