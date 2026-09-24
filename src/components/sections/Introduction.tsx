"use client";

import { useRef } from "react";
import { gsap, MOTION, showRoot, useGSAP } from "@/animation/gsap";
import { Arabic } from "@/components/ui/Arabic";
import { Button } from "@/components/ui/Button";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import styles from "./Introduction.module.css";

const statement: { word: string; em?: boolean }[] = [
  { word: "Built" },
  { word: "around" },
  { word: "the" },
  { word: "realities", em: true },
  { word: "of" },
  { word: "Egyptian" },
  { word: "law," },
  { word: "business" },
  { word: "and" },
  { word: "dispute." },
];

/** A near-empty editorial pause: one statement that lights up word by word. */
export function Introduction() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const words = el.querySelectorAll("[data-word]");
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.4,
            scrollTrigger: {
              trigger: el.querySelector("[data-statement]"),
              start: "top 80%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          },
        );
      });
      showRoot(el.querySelector("[data-statement]"));
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={`section ${styles.intro}`} aria-labelledby="intro-title">
      <div className="container">
        <Reveal className={styles.meta}>
          <span className="label tabular" data-reveal-item>
            02
          </span>
          <span className={styles.rule} data-reveal-line />
          <span className="label" data-reveal-item>
            The Firm
          </span>
          <span className={styles.arabicLabel} data-reveal-item>
            <Arabic>المكتب</Arabic>
          </span>
        </Reveal>

        <div className={styles.spread}>
          <div className={styles.lead}>
            <h2 id="intro-title" className={`display ${styles.statement}`} data-statement data-reveal>
              {statement.map(({ word, em }, i) => (
                <span key={i} data-word className={em ? styles.em : undefined}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            <Reveal>
              <Arabic as="p" className={styles.arabicStatement}>
                مبني على واقع القانون والأعمال والنزاع في مصر
              </Arabic>
            </Reveal>
          </div>

          <PlateFigure
            plate="hallAislePortrait"
            ratio="4 / 5"
            sizes="(min-width: 1024px) 34vw, 100vw"
            parallax={10}
            className={styles.figure}
          />

          <div className={styles.body}>
            <SplitReveal className="lede">
              We are an Egyptian law firm for clients who need more than a reading of the statute. We advise on how
              Egyptian law actually operates — in courtrooms, in ministries and across the negotiating table — and we
              build our advice around that practice.
            </SplitReveal>
            <SplitReveal className="lede" delay={0.1}>
              Our work spans corporate and commercial matters, disputes, regulation and personal status. Across all of
              it, the method is the same: understand the business, identify where the matter will truly be decided,
              and act early.
            </SplitReveal>
            <Reveal>
              <Button href="/about" variant="outline">
                About the firm
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
