"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { getDefaultScrollTrigger, GSAP_DURATION, GSAP_EASE } from "@/lib/animations/gsap-utils";

interface AnimatedTextProps {
  text: string;
  type?: "words" | "chars";
  stagger?: number;
  duration?: number;
  className?: string;
  tag?: keyof React.JSX.IntrinsicElements | React.ElementType;
}

export function AnimatedText({
  text,
  type = "words",
  stagger = 0.05,
  duration = GSAP_DURATION.NORMAL,
  className,
  tag: Tag = "div",
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  // Split logic
  const splitContent =
    type === "words"
      ? text.split(" ").map((w, i) => ({ text: w + " ", key: i }))
      : text.split("").map((c, i) => ({ text: c, key: i }));

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const elements = containerRef.current.children;

      gsap.from(elements, {
        scrollTrigger: getDefaultScrollTrigger(containerRef.current),
        y: 20,
        opacity: 0,
        duration,
        stagger,
        ease: GSAP_EASE.SMOOTH,
      });
    },
    { scope: containerRef, dependencies: [text, type, stagger, duration] }
  );

  return (
    <Tag ref={containerRef} className={cn("inline-block", className)} aria-label={text}>
       {splitContent.map((item) => (
         <span key={item.key} aria-hidden="true" className="inline-block opacity-100 will-change-transform">
           {item.text}
         </span>
       ))}
    </Tag>
  );
}
