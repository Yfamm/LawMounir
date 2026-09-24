"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { EASE, gsap, MOTION, showRoot, useGSAP } from "@/animation/gsap";

type Props = {
  as?: "div" | "section" | "ul" | "ol" | "dl" | "footer" | "article" | "aside";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  immediate?: boolean;
  delay?: number;
  stagger?: number;
  y?: number;
  start?: string;
};

/**
 * Staggered entrance for a group of elements.
 * - `[data-reveal-item]` descendants fade and rise (falls back to direct children).
 * - `[data-reveal-line]` descendants draw in from the left.
 */
export function Reveal({
  as = "div",
  children,
  className,
  style,
  immediate = false,
  delay = 0,
  stagger = 0.09,
  y = 36,
  start = "top 86%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const marked = el.querySelectorAll("[data-reveal-item]");
        const items = marked.length ? marked : el.children;
        const lines = el.querySelectorAll("[data-reveal-line]");
        const tl = gsap.timeline({
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
        });
        if (lines.length) {
          tl.fromTo(
            lines,
            { scaleX: 0, transformOrigin: "0% 50%" },
            { scaleX: 1, duration: 1.4, ease: EASE.line, stagger },
            0,
          );
        }
        tl.fromTo(
          items,
          { y, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.2, ease: EASE.reveal, stagger },
          lines.length ? 0.15 : 0,
        );
      });
      showRoot(el);
    },
    { scope: ref },
  );

  const Tag = as;
  return (
    <Tag ref={ref as never} className={className} style={style} data-reveal="">
      {children}
    </Tag>
  );
}
