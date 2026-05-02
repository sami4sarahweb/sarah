export const GSAP_EASE = {
  SMOOTH: "power3.out",
  BOUNCE: "back.out(1.7)",
  SLOW: "power2.inOut",
};

export const GSAP_DURATION = {
  FAST: 0.3,
  NORMAL: 0.6,
  SLOW: 1.2,
};

/**
 * Returns a multiplier for horizontal animations based on document direction.
 * RTL = -1, LTR = 1
 */
export const getDirectionMultiplier = (): number => {
  if (typeof document === "undefined") return 1;
  return document.documentElement.dir === "rtl" ? -1 : 1;
};

/**
 * Common scroll trigger default settings
 */
export const getDefaultScrollTrigger = (trigger: Element) => ({
  trigger,
  start: "top 85%",
  end: "bottom 20%",
  toggleActions: "play none none reverse",
});
