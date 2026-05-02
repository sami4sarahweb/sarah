"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getDirectionMultiplier, GSAP_DURATION, GSAP_EASE } from "@/lib/animations/gsap-utils";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      
      const dirMap = getDirectionMultiplier();
      
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          x: 20 * dirMap,
        },
        {
          opacity: 1,
          x: 0,
          duration: GSAP_DURATION.NORMAL,
          ease: GSAP_EASE.SMOOTH,
        }
      );
    },
    { scope: containerRef, dependencies: [pathname] }
  );

  return (
    <div ref={containerRef} className="will-change-transform opacity-0">
      {children}
    </div>
  );
}
