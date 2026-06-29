"use client";

import dynamic from "next/dynamic";

const GLSLHills = dynamic(
  () => import("@/components/ui/glsl-hills").then((m) => ({ default: m.GLSLHills })),
  { ssr: false }
);

export function GLSLHillsBackground({
  speed = 0.3,
  cameraZ = 140,
}: {
  speed?: number;
  cameraZ?: number;
}) {
  return <GLSLHills width="100%" height="100%" speed={speed} cameraZ={cameraZ} />;
}
