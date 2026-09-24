"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

type ScrollApi = {
  scrollTo: (target: number | string | HTMLElement, options?: { immediate?: boolean; offset?: number }) => void;
  stop: () => void;
  start: () => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

/**
 * Lenis-powered smooth scrolling on desktop pointer devices, wired into
 * ScrollTrigger. Touch devices and reduced-motion users keep native scroll.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -80 },
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback<ScrollApi["scrollTo"]>((target, options = {}) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { ...options, force: true });
      return;
    }
    const behavior: ScrollBehavior = options.immediate || prefersReducedMotion() ? "auto" : "smooth";
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior });
      return;
    }
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + (options.offset ?? 0);
      window.scrollTo({ top, behavior });
    }
  }, []);

  const stop = useCallback(() => {
    lenisRef.current?.stop();
    document.documentElement.classList.add("is-locked");
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
    document.documentElement.classList.remove("is-locked");
  }, []);

  const api = useMemo(() => ({ scrollTo, stop, start }), [scrollTo, stop, start]);

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}

export function useSmoothScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside SmoothScrollProvider");
  return ctx;
}
