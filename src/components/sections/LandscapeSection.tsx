"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ResolvedImage } from "@/lib/cms/images";
import { headlineLines } from "@/lib/cms/text";
import type { Lang } from "@/lib/i18n";
import { Counterpart } from "@/components/ui/Counterpart";
import { EASE, gsap, MOTION, showRoot, useGSAP } from "@/animation/gsap";
import styles from "./LandscapeSection.module.css";

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
export type LandscapeContent = {
  label: string;
  labelOther: string;
  otherLang: Lang;
  frames: string[];
  pillars: { title: string; text: string }[];
  platePrefix: string;
};

export function LandscapeSection({
  content,
  image,
  index = "04",
}: {
  content: LandscapeContent;
  image: ResolvedImage;
  index?: string;
}) {
  // The pinned timeline is choreographed for exactly three statements.
  const frames = [0, 1, 2].map((i) => content.frames[i] ?? "");
  const pillars = content.pillars;

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
            <Image
              src={image.src}
              alt=""
              fill
              sizes="100vw"
              placeholder={typeof image.src === "string" ? "empty" : "blur"}
              className={styles.image}
              style={image.position !== "50% 50%" ? { objectPosition: image.position } : undefined}
            />
          </div>
        </div>
        <div className={styles.shade} data-shade aria-hidden="true" />

        <div className={`container ${styles.inner}`}>
          <div className={styles.meta}>
            <span className="label tabular">{index}</span>
            <span className={styles.rule} />
            <h2 id="landscape-title" className="label">
              {content.label}
            </h2>
            <Counterpart lang={content.otherLang} className={styles.arabic}>
              {content.labelOther}
            </Counterpart>
          </div>

          <div className={styles.frames}>
            <div className={styles.frame} data-frame>
              <p className={`display ${styles.statement}`}>
                <Lines lines={headlineLines(frames[0])} />
              </p>
            </div>

            <div className={styles.frame} data-frame>
              <p className={`display ${styles.statement} ${styles.statementSmall}`}>
                <Lines lines={headlineLines(frames[1])} />
              </p>
            </div>

            <div className={styles.frame} data-frame>
              <p className={`display ${styles.statement} ${styles.statementSmall}`}>
                <Lines lines={headlineLines(frames[2])} />
              </p>
              <ul className={styles.pillars}>
                {pillars.map((pillar, i) => (
                  <li key={i} className={styles.pillar} data-pillar>
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
            {image.caption && (
              <span className={`label ${styles.plateCaption}`}>
                {image.plateNo ? `${content.platePrefix} ${image.plateNo} — ` : ""}
                {image.caption}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
