"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getDirectionMultiplier, GSAP_DURATION, GSAP_EASE, getDefaultScrollTrigger } from "@/lib/animations/gsap-utils";
import { cn } from "@/lib/utils";

type AnimationType = "fade-up" | "fade-down" | "fade-inline" | "scale-in" | "stagger-children";

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export function AnimatedSection({
  children,
  animation = "fade-up",
  delay = 0,
  duration = GSAP_DURATION.NORMAL,
  className,
}: AnimatedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      
      const tl = gsap.timeline({
        scrollTrigger: getDefaultScrollTrigger(el),
        delay,
      });

      switch (animation) {
        case "fade-up":
          tl.fromTo(el, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration, ease: GSAP_EASE.SMOOTH }
          );
          break;
        case "fade-down":
          tl.fromTo(el, 
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration, ease: GSAP_EASE.SMOOTH }
          );
          break;
        case "fade-inline":
          const dirMap = getDirectionMultiplier();
          tl.fromTo(el, 
            { x: 50 * dirMap, opacity: 0 },
            { x: 0, opacity: 1, duration, ease: GSAP_EASE.SMOOTH }
          );
          break;
        case "scale-in":
          tl.fromTo(el, 
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration, ease: GSAP_EASE.BOUNCE }
          );
          break;
        case "stagger-children":
          tl.fromTo(gsap.utils.toArray(el.children), 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration, stagger: 0.1, ease: GSAP_EASE.SMOOTH }
          );
          break;
      }
    },
    { scope: containerRef, dependencies: [animation, delay, duration] }
  );

  return (
    <div ref={containerRef} className={cn("will-change-transform opacity-100", className)}>
      {children}
    </div>
  );
}
