"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";
import { EASE, gsap, MOTION, ScrollTrigger, showRoot, useGSAP } from "@/animation/gsap";
import type { ResolvedImage } from "@/lib/cms/images";
import { headlineLines } from "@/lib/cms/text";
import type { Lang } from "@/lib/i18n";
import { Counterpart } from "@/components/ui/Counterpart";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import styles from "./ExperienceSection.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Horizontal storytelling track. Pinned and scrubbed sideways on desktop;
 * a vertical sequence on smaller screens. Numerals count up on entry.
 */
export type ExperienceContent = {
  label: string;
  labelOther: string;
  otherLang: Lang;
  title: string;
  intro: string;
  hint: string;
  platePrefix: string;
  movements: { number: string; label: string; title: string; text: string; items: string[]; autoPracticeAreas: boolean }[];
};

type Props = {
  content: ExperienceContent;
  image: ResolvedImage;
  /** Titles of the published practice areas, for movements that list them. */
  practiceTitles: string[];
  index?: string;
};

export function ExperienceSection({ content, image, practiceTitles, index = "06" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const movements = content.movements.map((m) => ({ ...m, items: m.autoPracticeAreas ? practiceTitles : m.items }));
  const titleLines = headlineLines(content.title);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const panels = q("[data-panel]");
      const track = q("[data-track]")[0];

      const countUp = (el: Element | null) => {
        if (!el) return;
        const target = Number(el.getAttribute("data-count"));
        if (!Number.isFinite(target)) return;
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = pad(Math.round(state.v));
          },
        });
      };

      const mm = gsap.matchMedia();
      // Right-to-left pages travel the other way: the track moves right and
      // panels enter from the left edge.
      const dir = getComputedStyle(root).direction === "rtl" ? -1 : 1;
      const enter = dir === 1 ? "left right" : "right left";
      const leave = dir === 1 ? "right left" : "left right";

      mm.add(MOTION.desktop, () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        const scroller = gsap.to(track, {
          x: () => -distance() * dir,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.fromTo(
          q("[data-progress]"),
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: () => `+=${distance()}`, scrub: true } },
        );

        const panelImage = q("[data-panel-image]")[0];
        if (panelImage) {
          gsap.fromTo(
            panelImage,
            { xPercent: -8 * dir, scale: 1.18 },
            {
              xPercent: 8 * dir,
              scale: 1.18,
              ease: "none",
              scrollTrigger: {
                trigger: panelImage.closest("figure"),
                containerAnimation: scroller,
                start: enter,
                end: leave,
                scrub: true,
              },
            },
          );
        }

        panels.forEach((panel) => {
          const items = panel.querySelectorAll("[data-panel-item]");
          gsap.set(items, { autoAlpha: 0, y: 40 });
          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: scroller,
            start: dir === 1 ? "left 72%" : "right 28%",
            once: true,
            onEnter: () => {
              countUp(panel.querySelector("[data-count]"));
              gsap.to(items, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE.reveal, stagger: 0.08 });
            },
          });
          gsap.fromTo(
            panel.querySelector("[data-numeral]"),
            { xPercent: 18 * dir },
            {
              xPercent: -12 * dir,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: scroller, start: enter, end: leave, scrub: true },
            },
          );
        });
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        panels.forEach((panel) => {
          ScrollTrigger.create({
            trigger: panel,
            start: "top 80%",
            once: true,
            onEnter: () => countUp(panel.querySelector("[data-count]")),
          });
          gsap.fromTo(
            panel.querySelectorAll("[data-panel-item]"),
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.1,
              ease: EASE.reveal,
              stagger: 0.08,
              scrollTrigger: { trigger: panel, start: "top 80%", once: true },
            },
          );
        });
      });

      showRoot(track);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={styles.experience} aria-labelledby="experience-title">
      <GeometricPattern className={styles.pattern} opacity={0.07} size={120} />
      <div className={styles.track} data-track data-reveal>
        <div className={`${styles.panel} ${styles.intro}`}>
          <div className={styles.meta}>
            <span className="label tabular">{index}</span>
            <span className={styles.rule} />
            <span className="label">{content.label}</span>
            <Counterpart lang={content.otherLang} className={styles.arabic}>
              {content.labelOther}
            </Counterpart>
          </div>
          <h2 id="experience-title" className={`display ${styles.introTitle}`}>
            {titleLines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h2>
          {content.intro && <p className="lede">{content.intro}</p>}
          {content.hint && (
            <span className={`label ${styles.hint}`} aria-hidden="true">
              {content.hint}
            </span>
          )}
        </div>

        <figure className={styles.imagePanel}>
          <div className={styles.imageFrame}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              placeholder={typeof image.src === "string" ? "empty" : "blur"}
              className={styles.image}
              style={image.position !== "50% 50%" ? { objectPosition: image.position } : undefined}
              data-panel-image
            />
            <span className={styles.keyline} aria-hidden="true" />
          </div>
          {image.caption && (
            <figcaption className="label">
              {image.plateNo && (
                <span className={styles.plateNo}>
                  {content.platePrefix} {image.plateNo}
                </span>
              )}{" "}
              {image.caption}
            </figcaption>
          )}
        </figure>

        {movements.map((m, i) => (
          <article key={i} className={styles.panel} data-panel>
            <div className={styles.numeralWrap} aria-hidden="true">
              <span className={`${styles.numeral} serif tabular`} data-numeral data-count={Number(m.number) || i + 1}>
                {m.number || pad(i + 1)}
              </span>
            </div>
            <div className={styles.panelBody}>
              <p className={`label ${styles.panelLabel}`} data-panel-item>
                {m.number || pad(i + 1)} — {m.label}
              </p>
              <h3 className={`serif ${styles.panelTitle}`} data-panel-item>
                {m.title}
              </h3>
              <p className={styles.panelText} data-panel-item>
                {m.text}
              </p>
              <ul className={styles.items} data-panel-item>
                {m.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span className={styles.bar} data-progress />
      </div>
    </section>
  );
}
