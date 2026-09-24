"use client";

import Image from "next/image";
import { useRef } from "react";
import { EASE, gsap, MOTION, ScrollTrigger, showRoot, useGSAP } from "@/animation/gsap";
import { plateNumber, plates } from "@/content/plates";
import { practiceAreas } from "@/content/practiceAreas";
import { Arabic } from "@/components/ui/Arabic";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import styles from "./ExperienceSection.module.css";

// Source: the firm's introduction document (areas, mission, values). The
// named courts in "Forums" are general statements — VERIFY with the firm.
const movements = [
  {
    label: "Practice areas",
    title: "The areas the firm names as its own.",
    text: "Companies and investment, civil and real-estate transactions, and personal status cases — with representation running through all of them.",
    items: practiceAreas.map((a) => a.title),
  },
  {
    label: "Forums",
    title: "Before judicial and administrative bodies.",
    text: "The firm's mission commits it to the faithful defence of rights before all judicial and administrative bodies.",
    items: ["Judicial bodies", "Administrative bodies", "Civil Courts", "Family Courts"],
  },
  {
    label: "Clients",
    title: "For investors, company owners and citizens.",
    text: "The mission names those the firm serves: everyone seeking legal security in Egypt.",
    items: ["Investors", "Company owners", "Citizens"],
  },
  {
    label: "Approach",
    title: "Simpler procedures. Clearer advice.",
    text: "Simplifying procedures, offering clear advice and faithfully defending rights — completed efficiently, with the client kept informed.",
    items: ["Simplify procedures", "Clear advice", "Company formation", "Contract drafting", "Administrative procedures", "Defence of rights"],
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Horizontal storytelling track. Pinned and scrubbed sideways on desktop;
 * a vertical sequence on smaller screens. Numerals count up on entry.
 */
export function ExperienceSection({ index = "06" }: { index?: string }) {
  const ref = useRef<HTMLElement>(null);

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

      mm.add(MOTION.desktop, () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        const scroller = gsap.to(track, {
          x: () => -distance(),
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
            { xPercent: -8, scale: 1.18 },
            {
              xPercent: 8,
              scale: 1.18,
              ease: "none",
              scrollTrigger: {
                trigger: panelImage.closest("figure"),
                containerAnimation: scroller,
                start: "left right",
                end: "right left",
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
            start: "left 72%",
            once: true,
            onEnter: () => {
              countUp(panel.querySelector("[data-count]"));
              gsap.to(items, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE.reveal, stagger: 0.08 });
            },
          });
          gsap.fromTo(
            panel.querySelector("[data-numeral]"),
            { xPercent: 18 },
            {
              xPercent: -12,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: scroller, start: "left right", end: "right left", scrub: true },
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
            <span className="label">Experience</span>
            <Arabic className={styles.arabic}>الخبرة</Arabic>
          </div>
          <h2 id="experience-title" className={`display ${styles.introTitle}`}>
            The practice,
            <br />
            <em>in four movements.</em>
          </h2>
          <p className="lede">
            Not a list of figures — a map of where the work sits, where it is decided and how it is carried through.
          </p>
          <span className={`label ${styles.hint}`} aria-hidden="true">
            Scroll to continue
          </span>
        </div>

        <figure className={styles.imagePanel}>
          <div className={styles.imageFrame}>
            <Image
              src={plates.hallRows.image}
              alt={plates.hallRows.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              placeholder="blur"
              className={styles.image}
              data-panel-image
            />
            <span className={styles.keyline} aria-hidden="true" />
          </div>
          <figcaption className="label">
            <span className={styles.plateNo}>Pl. {plateNumber("hallRows")}</span> {plates.hallRows.caption}
          </figcaption>
        </figure>

        {movements.map((m, i) => (
          <article key={m.label} className={styles.panel} data-panel>
            <div className={styles.numeralWrap} aria-hidden="true">
              <span className={`${styles.numeral} serif tabular`} data-numeral data-count={i + 1}>
                {pad(i + 1)}
              </span>
            </div>
            <div className={styles.panelBody}>
              <p className={`label ${styles.panelLabel}`} data-panel-item>
                {pad(i + 1)} — {m.label}
              </p>
              <h3 className={`serif ${styles.panelTitle}`} data-panel-item>
                {m.title}
              </h3>
              <p className={styles.panelText} data-panel-item>
                {m.text}
              </p>
              <ul className={styles.items} data-panel-item>
                {m.items.map((item) => (
                  <li key={item}>{item}</li>
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
