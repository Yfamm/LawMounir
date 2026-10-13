"use client";

import { useRef, useState } from "react";
import { EASE, gsap, prefersReducedMotion, showRoot, useGSAP } from "@/animation/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import type { InsightView } from "@/lib/cms/repository";
import { EditorialCard } from "./EditorialCard";
import { Reveal } from "./Reveal";
import styles from "./InsightsIndex.module.css";

type Filter = string;

/** Filterable journal index. Changing category re-deals the cards. */
const ALL = "";

export function InsightsIndex({ insights, categories }: { insights: InsightView[]; categories: string[] }) {
  const { ui } = useSite();
  const labels = { issue: ui.issue, read: ui.read };
  const [filter, setFilter] = useState<Filter>(ALL);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasEntered = useRef(false);
  const visible = filter === ALL ? insights : insights.filter((i) => i.category === filter);

  const choose = (next: Filter) => {
    if (next === filter) return;
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) {
      setFilter(next);
      return;
    }
    gsap.to(grid.children, {
      autoAlpha: 0,
      y: -16,
      duration: 0.35,
      ease: "power2.in",
      stagger: 0.03,
      onComplete: () => setFilter(next),
    });
  };

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;
      if (!prefersReducedMotion()) {
        // First entrance waits for the grid to scroll into view; later
        // filter changes re-deal the cards immediately.
        const first = !hasEntered.current;
        gsap.fromTo(
          grid.children,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: EASE.reveal,
            stagger: 0.07,
            scrollTrigger: first ? { trigger: grid, start: "top 88%", once: true } : undefined,
          },
        );
      }
      hasEntered.current = true;
      showRoot(grid);
    },
    { scope: gridRef, dependencies: [filter], revertOnUpdate: false },
  );

  return (
    <div className={styles.index}>
      <Reveal className={styles.filters}>
        <div role="group" aria-label={ui.filterLabel} className={styles.filterList}>
          {[ALL, ...categories].map((c) => (
            <button
              key={c || "all"}
              type="button"
              className={styles.filter}
              aria-pressed={filter === c}
              onClick={() => choose(c)}
            >
              {c || ui.filterAll}
            </button>
          ))}
        </div>
      </Reveal>

      <div ref={gridRef} className={styles.grid} aria-live="polite" data-reveal>
        {visible.length === 0 && <p className={styles.empty}>{ui.noInsights}</p>}
        {visible.map((insight) => (
          <div
            key={insight.slug}
            className={`${styles.cell} ${visible.length > 1 && insight === visible[0] ? styles.lead : ""}`}
          >
            <EditorialCard
              insight={insight}
              issue={insight.issue}
              labels={labels}
              variant={insight === visible[0] ? "feature" : "standard"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
