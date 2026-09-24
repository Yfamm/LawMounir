"use client";

import Image from "next/image";
import { useRef } from "react";
import { plateNumber, plates } from "@/content/plates";
import { Arabic } from "@/components/ui/Arabic";
import { EASE, gsap, MOTION, showRoot, useGSAP } from "@/animation/gsap";
import styles from "./LandscapeSection.module.css";

// VERIFY: general statements about Egyptian courts and regulators.
const pillars = [
  {
    title: "Courts",
    text: "From courts of first instance to the Court of Cassation, with specialized Economic, Family and administrative courts alongside.",
  },
  {
    title: "Regulators",
    text: "Investment, financial, banking and sector authorities whose decisions shape what a business may do — and when.",
  },
  {
    title: "Markets",
    text: "The commercial customs, negotiating habits and market realities that no statute records but every dispute reveals.",
  },
];

function Lines({ lines }: { lines: React.ReactNode[] }) {
  return lines.map((line, i) => (
    <span key={i} className="line-mask">
      <span className="line-inner" data-line>
        {line}
      </span>{" "}
    </span>
  ));
}

/**
 * Pinned storytelling section. On tablet and desktop the stage holds while
 * three statements pass through it and the image slowly pulls back from the
 * pyramids to the city. On mobile the statements simply stack.
 */
export function LandscapeSection({ index = "04" }: { index?: string }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const frames = q("[data-frame]");
      const counter = q("[data-counter]")[0];
      const mm = gsap.matchMedia();

      mm.add(MOTION.tabletUp, () => {
        const linesOf = (i: number) => frames[i].querySelectorAll("[data-line]");
        gsap.set(q("[data-line]"), { yPercent: 115 });
        gsap.set(q("[data-pillar]"), { autoAlpha: 0, y: 40 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q("[data-stage]")[0],
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (counter) counter.textContent = String(Math.min(3, Math.floor(self.progress * 3) + 1)).padStart(2, "0");
            },
          },
        });

        tl.fromTo(q("[data-media]"), { scale: 1.55 }, { scale: 1.02, duration: 10 }, 0)
          .fromTo(q("[data-shade]"), { opacity: 0.55 }, { opacity: 0.85, duration: 10 }, 0)
          .fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1, duration: 10 }, 0)
          .to(linesOf(0), { yPercent: 0, stagger: 0.15, duration: 1, ease: EASE.soft }, 0)
          .to(linesOf(0), { yPercent: -115, stagger: 0.1, duration: 1, ease: "power2.in" }, 2.6)
          .to(linesOf(1), { yPercent: 0, stagger: 0.15, duration: 1, ease: EASE.soft }, 3.5)
          .to(linesOf(1), { yPercent: -115, stagger: 0.1, duration: 1, ease: "power2.in" }, 6.2)
          .to(linesOf(2), { yPercent: 0, stagger: 0.15, duration: 1, ease: EASE.soft }, 7.1)
          .to(q("[data-pillar]"), { autoAlpha: 1, y: 0, stagger: 0.25, duration: 1, ease: EASE.soft }, 7.6);
      });

      mm.add(MOTION.mobile, () => {
        frames.forEach((frame) => {
          gsap.fromTo(
            frame.querySelectorAll("[data-line], [data-pillar]"),
            { yPercent: 110, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 1.3,
              ease: EASE.reveal,
              stagger: 0.1,
              scrollTrigger: { trigger: frame, start: "top 85%", once: true },
            },
          );
        });
      });

      showRoot(q("[data-stage]")[0]);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={styles.landscape} aria-labelledby="landscape-title">
      <div className={styles.stage} data-stage data-reveal>
        <div className={styles.media} aria-hidden="true">
          <div className={styles.mediaInner} data-media>
            <Image src={plates.hallAisle.image} alt="" fill sizes="100vw" placeholder="blur" className={styles.image} />
          </div>
        </div>
        <div className={styles.shade} data-shade aria-hidden="true" />

        <div className={`container ${styles.inner}`}>
          <div className={styles.meta}>
            <span className="label tabular">{index}</span>
            <span className={styles.rule} />
            <h2 id="landscape-title" className="label">
              The Egyptian legal landscape
            </h2>
            <Arabic className={styles.arabic}>المشهد القانوني المصري</Arabic>
          </div>

          <div className={styles.frames}>
            <div className={styles.frame} data-frame>
              <p className={`display ${styles.statement}`}>
                <Lines lines={["Egyptian law is not", "simply a collection", <em key="s">of statutes.</em>]} />
              </p>
            </div>

            <div className={styles.frame} data-frame>
              <p className={`display ${styles.statement} ${styles.statementSmall}`}>
                <Lines
                  lines={[
                    "It is a living framework,",
                    "shaped by courts, regulation,",
                    "commerce — and the realities",
                    <em key="m">of the market.</em>,
                  ]}
                />
              </p>
            </div>

            <div className={styles.frame} data-frame>
              <p className={`display ${styles.statement} ${styles.statementSmall}`}>
                <Lines lines={["Good counsel reads", <em key="a">all three at once.</em>]} />
              </p>
              <ul className={styles.pillars}>
                {pillars.map((pillar, i) => (
                  <li key={pillar.title} className={styles.pillar} data-pillar>
                    <span className={`label tabular ${styles.pillarIndex}`}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 className={`serif ${styles.pillarTitle}`}>{pillar.title}</h3>
                    <p>{pillar.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.progress} aria-hidden="true">
            <span className="label tabular" data-counter>
              01
            </span>
            <span className={styles.track}>
              <span className={styles.bar} data-progress />
            </span>
            <span className="label tabular">03</span>
            <span className={`label ${styles.plateCaption}`}>
              Pl. {plateNumber("hallAisle")} — {plates.hallAisle.caption}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
