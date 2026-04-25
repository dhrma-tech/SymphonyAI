"use client";

export function Grain() {
  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none opacity-[var(--grain-opacity,0.03)] contrast-150 brightness-100"
    >
      <svg className="h-full w-full">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
