"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { getDefaultScrollTrigger, GSAP_DURATION } from "@/lib/animations/gsap-utils";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ end, suffix = "", duration = GSAP_DURATION.SLOW, className }: AnimatedCounterProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      
      gsap.to(
        { val: 0 },
        {
          val: end,
          duration,
          ease: "power2.out",
          scrollTrigger: getDefaultScrollTrigger(containerRef.current),
          onUpdate: function() {
            setValue(Math.floor((this.targets()[0] as any).val));
          },
        }
      );
    },
    { scope: containerRef, dependencies: [end, duration] }
  );

  return (
    <span ref={containerRef} className={cn("inline-block tabular-nums", className)}>
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
