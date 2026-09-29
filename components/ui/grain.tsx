import { cn } from "@/lib/cn";

// Fine fractal-noise texture, referenced as a data URI so no binary asset is needed.
// Gives placeholder/duotone imagery and dark sections a tactile, art-directed feel
// instead of a flat color fill (see docs/02-design-direction.md, "Imagery").
const NOISE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='200'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.85'%20numOctaves='3'%20stitchTiles='stitch'/%3E%3CfeColorMatrix%20type='saturate'%20values='0'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23n)'/%3E%3C/svg%3E";

export function Grain({
  className,
  opacity = 0.05,
  blend = "normal",
}: {
  className?: string;
  opacity?: number;
  blend?: "normal" | "soft-light" | "overlay";
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "200px 200px",
        opacity,
        mixBlendMode: blend,
      }}
    />
  );
}
