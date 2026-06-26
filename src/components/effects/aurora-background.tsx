"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AuroraBackgroundProps {
  intensity?: "subtle" | "medium" | "vivid";
  className?: string;
}

interface BlobConfig {
  color: string;
  size: number;
  blur: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  anim: string;
  delay?: string;
}

const BLOBS: Record<string, BlobConfig[]> = {
  subtle: [
    { color: "rgba(6, 182, 212, 0.15)", size: 500, blur: 80, top: "10%", left: "20%", anim: "aurora-drift-1 18s ease-in-out infinite alternate" },
    { color: "rgba(139, 92, 246, 0.12)", size: 400, blur: 90, top: "5%", right: "15%", anim: "aurora-drift-2 22s ease-in-out infinite alternate", delay: "-5s" },
  ],
  medium: [
    { color: "rgba(6, 182, 212, 0.3)", size: 600, blur: 100, top: "5%", left: "10%", anim: "aurora-drift-1 18s ease-in-out infinite alternate" },
    { color: "rgba(139, 92, 246, 0.25)", size: 500, blur: 110, top: "0%", right: "5%", anim: "aurora-drift-2 22s ease-in-out infinite alternate", delay: "-5s" },
    { color: "rgba(20, 184, 166, 0.2)", size: 650, blur: 120, bottom: "-10%", left: "25%", anim: "aurora-drift-3 25s ease-in-out infinite alternate", delay: "-8s" },
    { color: "rgba(99, 102, 241, 0.15)", size: 450, blur: 100, top: "30%", left: "50%", anim: "aurora-drift-1 20s ease-in-out infinite alternate-reverse", delay: "-12s" },
  ],
  vivid: [
    { color: "rgba(6, 182, 212, 0.4)", size: 650, blur: 100, top: "0%", left: "5%", anim: "aurora-drift-1 18s ease-in-out infinite alternate" },
    { color: "rgba(139, 92, 246, 0.35)", size: 550, blur: 110, top: "-5%", right: "0%", anim: "aurora-drift-2 22s ease-in-out infinite alternate", delay: "-5s" },
    { color: "rgba(20, 184, 166, 0.3)", size: 700, blur: 120, bottom: "-15%", left: "20%", anim: "aurora-drift-3 25s ease-in-out infinite alternate", delay: "-8s" },
    { color: "rgba(99, 102, 241, 0.2)", size: 500, blur: 100, top: "25%", left: "45%", anim: "aurora-drift-1 20s ease-in-out infinite alternate-reverse", delay: "-12s" },
  ],
};

export function AuroraBackground({ intensity = "medium", className }: AuroraBackgroundProps) {
  const isMobile = useIsMobile();
  const blobs = BLOBS[intensity];
  const visibleBlobs = isMobile ? blobs.slice(0, 2) : blobs;

  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden pointer-events-none", className)}>
      {visibleBlobs.map((blob, i) => (
        <div
          key={i}
          className="aurora-blob absolute rounded-full will-change-transform"
          style={{
            width: isMobile ? blob.size * 0.7 : blob.size,
            height: isMobile ? blob.size * 0.7 : blob.size,
            background: blob.color,
            filter: `blur(${isMobile ? blob.blur * 0.6 : blob.blur}px)`,
            top: blob.top,
            left: blob.left,
            right: blob.right,
            bottom: blob.bottom,
            animation: blob.anim,
            animationDelay: blob.delay || "0s",
          }}
        />
      ))}
    </div>
  );
}
