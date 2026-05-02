"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className, strength = 0.5 }: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    // Only apply on non-touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = containerRef.current.getBoundingClientRect();
    
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;

    gsap.to(containerRef.current, { x, y, duration: 1, ease: "power3.out", overwrite: "auto" });
  });

  const handleMouseLeave = contextSafe(() => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)", overwrite: "auto" });
  });

  return (
    <div
      ref={containerRef}
      className={cn("inline-block", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
