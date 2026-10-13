"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

gsap.defaults({ ease: "power3.out", duration: 1 });

/** Shared easing vocabulary so every animation speaks the same language. */
export const EASE = {
  reveal: "expo.out",
  soft: "power3.out",
  inOut: "power4.inOut",
  line: "power2.inOut",
} as const;

/** Media conditions for gsap.matchMedia(). */
export const MOTION = {
  ok: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  tabletUp: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  finePointer: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
} as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(MOTION.reduce).matches;
}

/** Makes a `[data-reveal]` root visible once its animation has been set up. */
export function showRoot(el: Element | null) {
  if (el) gsap.set(el, { visibility: "visible" });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** 1 on left-to-right pages, -1 on right-to-left pages (for mirroring horizontal motion). */
export function inlineDir(el: Element): 1 | -1 {
  return getComputedStyle(el).direction === "rtl" ? -1 : 1;
}

/** transform-origin at the inline start of an element ("0% y" in LTR, "100% y" in RTL). */
export function startOrigin(el: Element, y = "50%") {
  return `${inlineDir(el) === 1 ? "0%" : "100%"} ${y}`;
}
