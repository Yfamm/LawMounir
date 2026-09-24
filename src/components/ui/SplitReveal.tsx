"use client";

import { useRef, type ReactNode } from "react";
import { EASE, gsap, MOTION, showRoot, SplitText, useGSAP } from "@/animation/gsap";

type Props = {
  as?: "p" | "div" | "blockquote";
  children: ReactNode;
  className?: string;
  immediate?: boolean;
  delay?: number;
  start?: string;
};

/** Body copy split into masked lines with SplitText, re-split on resize. */
export function SplitReveal({ as = "p", children, className, immediate = false, delay = 0, start = "top 88%" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 105,
              duration: 1.2,
              ease: EASE.reveal,
              stagger: 0.07,
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
            });
          },
        });
      });
      showRoot(el);
    },
    { scope: ref },
  );

  const Tag = as;
  return (
    <Tag ref={ref as never} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
