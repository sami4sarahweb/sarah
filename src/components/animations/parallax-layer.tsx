"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // negative = background (slower), positive = foreground (faster)
  className?: string;
}

export function ParallaxLayer({ children, speed = -0.2, className }: ParallaxLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      
      const yValue = speed * 100;
      
      gsap.to(containerRef.current, {
        yPercent: yValue,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef, dependencies: [speed] }
  );

  return (
    <div ref={containerRef} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
