"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function SpotlightCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for inertia
  const springX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 150 });

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      setIsHovering(
        !!target.closest("button") || 
        !!target.closest("a") || 
        !!target.closest(".interactive-card")
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        left: springX,
        top: springY,
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        opacity: isHovering ? 0.15 : 0.05,
      }}
      className="fixed w-32 h-32 -ml-16 -mt-16 bg-white rounded-full blur-3xl pointer-events-none z-[9999] mix-blend-difference hidden md:block"
    />
  );
}
