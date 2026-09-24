"use client";

import { type RefObject } from "react";
import { gsap, MOTION, useGSAP } from "./gsap";

/**
 * Subtle magnetic pull toward the pointer for primary calls to action.
 * Only active for fine pointers with motion allowed.
 */
export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, strength = 0.28) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION.finePointer, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.45)" });

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { dependencies: [strength] },
  );
}
