"use client";

import { useRef, type ReactNode } from "react";
import { EASE, gsap, MOTION, showRoot, useGSAP } from "@/animation/gsap";

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

type Props = {
  as?: Tag;
  lines: ReactNode[];
  className?: string;
  id?: string;
  /** Play on mount instead of on scroll. */
  immediate?: boolean;
  delay?: number;
  stagger?: number;
  start?: string;
};

/**
 * Display typography revealed line by line from behind a clipping mask.
 * Lines are authored explicitly so the composition never depends on
 * where the browser happens to wrap.
 */
export function RevealText({
  as = "h2",
  lines,
  className,
  id,
  immediate = false,
  delay = 0,
  stagger = 0.1,
  start = "top 88%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.fromTo(
          el.querySelectorAll(".line-inner"),
          { yPercent: 118, rotate: 2.5, transformOrigin: "0% 100%" },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.5,
            ease: EASE.reveal,
            stagger,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
          },
        );
      });
      showRoot(el);
    },
    { scope: ref },
  );

  const Tag = as;
  return (
    <Tag ref={ref as never} className={className} id={id} data-reveal="">
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span className="line-inner">{line}</span>{" "}
        </span>
      ))}
    </Tag>
  );
}
