"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  startDelay?: number;
  formatter?: (v: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 1.4,
  prefix = "",
  suffix = "",
  decimals = 0,
  startDelay = 0,
  formatter,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration,
      delay: startDelay / 1000,
      ease: "power3.out",
      onUpdate() {
        if (!ref.current) return;
        const n = formatter
          ? formatter(obj.v)
          : decimals > 0
            ? obj.v.toFixed(decimals)
            : Math.round(obj.v).toLocaleString("en-IN");
        ref.current.textContent = prefix + n + suffix;
      },
    });
    return () => { tween.kill(); };
  }, [value]);

  const initial = formatter
    ? formatter(0)
    : decimals > 0
      ? (0).toFixed(decimals)
      : "0";

  return <span ref={ref}>{prefix}{initial}{suffix}</span>;
}
