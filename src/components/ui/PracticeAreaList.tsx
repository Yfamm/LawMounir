"use client";

import { useCallback, useRef } from "react";
import heroImage from "@/assets/hero-justice-cairo.webp";
import { EASE, gsap, MOTION, ScrollTrigger, showRoot, useGSAP } from "@/animation/gsap";
import { practiceNumber, type PracticeArea } from "@/content/practiceAreas";
import { PracticeAreaRow } from "./PracticeAreaRow";
import styles from "./PracticeAreaList.module.css";

type Props = { areas: PracticeArea[] };

/**
 * Interactive index of practice areas. On fine pointers a framed window
 * follows the cursor and pans across the Cairo image as rows change.
 */
export function PracticeAreaList({ areas }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const activate = useRef<(index: number) => void>(() => {});

  useGSAP(
    () => {
      const root = ref.current;
      const preview = previewRef.current;
      if (!root || !preview) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root);
      const mm = gsap.matchMedia();

      mm.add(MOTION.ok, () => {
        gsap.set(rows, { autoAlpha: 0, y: 48 });
        gsap.set(root.querySelectorAll("[data-row-rule]"), { scaleX: 0, transformOrigin: "0% 50%" });
        ScrollTrigger.batch(rows, {
          start: "top 92%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE.reveal, stagger: 0.08 });
            gsap.to(
              batch.map((row) => row.querySelector("[data-row-rule]")),
              { scaleX: 1, duration: 1.6, ease: EASE.line, stagger: 0.08 },
            );
          },
        });
      });

      mm.add(MOTION.finePointer, () => {
        const img = preview.querySelector<HTMLElement>("[data-preview-img]");
        const num = preview.querySelector<HTMLElement>("[data-preview-num]");
        const xTo = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3" });
        const yTo = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3" });
        gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });

        const move = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          xTo(e.clientX - r.left);
          yTo(e.clientY - r.top);
        };
        const enter = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          gsap.set(preview, { x: e.clientX - r.left, y: e.clientY - r.top });
          gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.6, ease: EASE.soft });
        };
        const leave = () => gsap.to(preview, { autoAlpha: 0, scale: 0.6, duration: 0.5, ease: EASE.soft });

        activate.current = (index: number) => {
          const area = areas[index];
          if (!area || !img || !num) return;
          gsap.to(img, { backgroundPosition: area.focus, duration: 1.1, ease: EASE.inOut, overwrite: true });
          num.textContent = practiceNumber(area.slug);
          gsap.fromTo(num, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: EASE.soft });
        };

        root.addEventListener("pointermove", move);
        root.addEventListener("pointerenter", enter);
        root.addEventListener("pointerleave", leave);
        return () => {
          activate.current = () => {};
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerenter", enter);
          root.removeEventListener("pointerleave", leave);
        };
      });
      showRoot(root);
    },
    { scope: ref, dependencies: [areas] },
  );

  const onActivate = useCallback((index: number) => activate.current(index), []);

  return (
    <div ref={ref} className={styles.list} data-reveal>
      <ul>
        {areas.map((area, i) => (
          <PracticeAreaRow
            key={area.slug}
            area={area}
            number={practiceNumber(area.slug)}
            onActivate={() => onActivate(i)}
          />
        ))}
      </ul>

      <div ref={previewRef} className={styles.preview} aria-hidden="true">
        <div
          className={styles.previewImg}
          data-preview-img
          style={{ backgroundImage: `url(${heroImage.src})`, backgroundPosition: areas[0]?.focus }}
        />
        <span className={styles.previewShade} />
        <span className={`${styles.previewNum} serif tabular`} data-preview-num>
          {areas[0] ? practiceNumber(areas[0].slug) : ""}
        </span>
      </div>
    </div>
  );
}
