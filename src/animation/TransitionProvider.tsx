"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { EASE, gsap, prefersReducedMotion, ScrollTrigger } from "./gsap";
import { useSmoothScroll } from "./SmoothScrollProvider";
import styles from "./TransitionProvider.module.css";

type TransitionApi = { navigate: (href: string) => void };

const TransitionContext = createContext<TransitionApi | null>(null);

/**
 * Route transitions: a dark curtain rises over the current page, the route
 * changes underneath it, then the curtain continues upward to reveal the
 * new page. Reduced-motion users navigate instantly.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();
  const curtainRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const safety = useRef<number | undefined>(undefined);

  const reveal = useCallback(() => {
    const curtain = curtainRef.current;
    window.clearTimeout(safety.current);
    if (!curtain) return;
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
          gsap.set(curtain, { visibility: "hidden" });
        },
      })
      .to(markRef.current, { autoAlpha: 0, y: -10, duration: 0.35, ease: EASE.soft })
      .to(curtain, { yPercent: -100, duration: 0.95, ease: EASE.inOut }, "<0.05");
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);

      if (url.pathname === window.location.pathname) {
        scrollTo(url.hash || 0);
        return;
      }
      if (busy.current) return;
      if (prefersReducedMotion() || !curtainRef.current) {
        router.push(href);
        return;
      }

      busy.current = true;
      router.prefetch(href);
      gsap
        .timeline()
        .set(curtainRef.current, { visibility: "visible", yPercent: 100 })
        .set(markRef.current, { autoAlpha: 0, y: 14 })
        .to(curtainRef.current, { yPercent: 0, duration: 0.8, ease: EASE.inOut })
        .to(markRef.current, { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE.soft }, "-=0.3")
        .add(() => {
          router.push(href);
          // Never leave the curtain down if navigation stalls.
          safety.current = window.setTimeout(reveal, 4000);
        });
    },
    [router, scrollTo, reveal],
  );

  useEffect(() => {
    scrollTo(0, { immediate: true });
    if (!busy.current) {
      ScrollTrigger.refresh();
      return;
    }
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      reveal();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, scrollTo, reveal]);

  const api = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionContext.Provider value={api}>
      {children}
      <div ref={curtainRef} className={styles.curtain} aria-hidden="true">
        <div ref={markRef} className={styles.mark}>
          <span className={styles.word}>Mounir</span>
          <span className={styles.rule} />
          <span className={styles.sub}>Attorneys at Law</span>
          <span className={`arabic ${styles.arabic}`} lang="ar" dir="rtl">
            منير للمحاماة
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used inside TransitionProvider");
  return ctx;
}
