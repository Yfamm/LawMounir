"use client";

import { useRef } from "react";
import { gsap, MOTION, showRoot, useGSAP } from "@/animation/gsap";
import type { ResolvedImage } from "@/lib/cms/images";
import { paragraphs, statementWords } from "@/lib/cms/text";
import type { HomeIntro } from "@/lib/cms/types";
import { Arabic } from "@/components/ui/Arabic";
import { Button } from "@/components/ui/Button";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import styles from "./Introduction.module.css";

/** A near-empty editorial pause: one statement that lights up word by word. */
export function Introduction({ content, image, index = "02" }: { content: HomeIntro; image: ResolvedImage; index?: string }) {
  const ref = useRef<HTMLElement>(null);
  const statement = statementWords(content.statement);

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
            {index}
          </span>
          <span className={styles.rule} data-reveal-line />
          <span className="label" data-reveal-item>
            {content.label}
          </span>
          {content.labelAr && (
            <span className={styles.arabicLabel} data-reveal-item>
              <Arabic>{content.labelAr}</Arabic>
            </span>
          )}
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
            {content.statementAr && (
              <Reveal>
                <Arabic as="p" className={styles.arabicStatement}>
                  {content.statementAr}
                </Arabic>
              </Reveal>
            )}
          </div>

          <PlateFigure
            image={image}
            ratio="4 / 5"
            sizes="(min-width: 1024px) 34vw, 100vw"
            parallax={10}
            className={styles.figure}
          />

          <div className={styles.body}>
            {paragraphs(content.body).map((paragraph, i) => (
              <SplitReveal key={i} className="lede" delay={i * 0.1}>
                {paragraph}
              </SplitReveal>
            ))}
            {content.ctaText && content.ctaUrl && (
              <Reveal>
                <Button href={content.ctaUrl} variant="outline">
                  {content.ctaText}
                </Button>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
