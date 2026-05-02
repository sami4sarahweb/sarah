"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { getDirectionMultiplier, GSAP_DURATION, GSAP_EASE, getDefaultScrollTrigger } from "@/lib/animations/gsap-utils";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "inline-start" | "inline-end" | "none";
  delay?: number;
}

export function RevealOnScroll({ children, className, direction = "up", delay = 0 }: RevealOnScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      
      const vars: gsap.TweenVars = {
        opacity: 0,
        duration: GSAP_DURATION.NORMAL,
        delay,
        ease: GSAP_EASE.SMOOTH,
        scrollTrigger: getDefaultScrollTrigger(containerRef.current),
      };

      const dirMap = getDirectionMultiplier();

      if (direction === "up") vars.y = 30;
      else if (direction === "down") vars.y = -30;
      else if (direction === "inline-start") vars.x = 30 * dirMap;
      else if (direction === "inline-end") vars.x = -30 * dirMap;

      gsap.from(containerRef.current, vars);
    },
    { scope: containerRef, dependencies: [direction, delay] }
  );

  return (
    <div ref={containerRef} className={cn("will-change-transform opacity-100", className)}>
      {children}
    </div>
  );
}
