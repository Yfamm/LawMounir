"use client";

import { useRef } from "react";
import { EASE, gsap, MOTION, ScrollTrigger, showRoot, useGSAP } from "@/animation/gsap";
import type { Person } from "@/content/people";
import { TeamCard } from "./TeamCard";
import styles from "./TeamGrid.module.css";

type Props = { people: Person[]; showBio?: boolean; columns?: 3 | 4 };

/** Portrait grid; each image unmasks upward as it scrolls into view. */
export function TeamGrid({ people, showBio = false, columns = 3 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-team-card]", root);
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        cards.forEach((card) => {
          gsap.set(card.querySelector("[data-card-media]"), { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(card.querySelector("[data-card-inner]"), { scale: 1.35 });
        });
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            gsap.to(
              batch.map((c) => c.querySelector("[data-card-media]")),
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: EASE.inOut, stagger: 0.12 },
            );
            gsap.to(
              batch.map((c) => c.querySelector("[data-card-inner]")),
              { scale: 1, duration: 2, ease: EASE.reveal, stagger: 0.12 },
            );
          },
        });
      });
      showRoot(root);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`${styles.grid} ${columns === 4 ? styles.four : ""}`} data-reveal>
      {people.map((person, i) => (
        <TeamCard key={person.id} person={person} number={String(i + 1).padStart(2, "0")} showBio={showBio} />
      ))}
    </div>
  );
}
