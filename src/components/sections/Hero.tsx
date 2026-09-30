"use client";

import Image from "next/image";
import { useRef } from "react";
import { EASE, gsap, MOTION, showRoot, useGSAP } from "@/animation/gsap";
import type { ResolvedImage } from "@/lib/cms/images";
import { headlineLines } from "@/lib/cms/text";
import type { HomeHero } from "@/lib/cms/types";
import { Arabic } from "@/components/ui/Arabic";
import { Button } from "@/components/ui/Button";
import styles from "./Hero.module.css";

type Props = { content: HomeHero; image: ResolvedImage; location: string };

/**
 * Full-viewport opening sequence built around the Justice hero image:
 * a dark veil lifts, the image settles from a slow push-in, the headline
 * rises line by line, and the image drifts with scroll.
 */
export function Hero({ content, image, location }: Props) {
  const ref = useRef<HTMLElement>(null);
  const headline = headlineLines(content.headline);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION.ok, () => {
        const intro = gsap.timeline({ defaults: { ease: EASE.reveal } });
        intro
          .fromTo(q("[data-veil]"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 2.2, ease: "power2.inOut" }, 0)
          .fromTo(q("[data-media]"), { scale: 1.22, yPercent: 4 }, { scale: 1.06, yPercent: 0, duration: 3.2 }, 0)
          .fromTo(q("[data-eyebrow-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: EASE.line }, 0.6)
          .fromTo(q("[data-eyebrow]"), { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 1.2 }, 0.8)
          .fromTo(
            q(".line-inner"),
            { yPercent: 118, rotate: 2.5, transformOrigin: "0% 100%" },
            { yPercent: 0, rotate: 0, duration: 1.7, stagger: 0.13 },
            0.75,
          )
          .fromTo(q("[data-fade]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.1 }, 1.4)
          .fromTo(q("[data-scroll-cue]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 2);

        // Scroll: the image drifts slower than the page, copy lifts away.
        gsap.to(q("[data-parallax]"), {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(q("[data-content]"), {
          yPercent: -18,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "35% top", end: "bottom top", scrub: true },
        });
      });

      mm.add(MOTION.reduce, () => {
        gsap.set(q("[data-veil]"), { autoAlpha: 0 });
      });

      q("[data-reveal]").forEach(showRoot);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media} data-parallax>
        <div className={styles.mediaInner} data-media>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            quality={85}
            placeholder={typeof image.src === "string" ? "empty" : "blur"}
            sizes="100vw"
            className={styles.image}
            style={image.position !== "50% 50%" ? { objectPosition: image.position } : undefined}
          />
        </div>
      </div>

      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.veil} aria-hidden="true" data-veil />

      <div className={`container ${styles.content}`} data-content data-reveal>
        <p className={`label ${styles.eyebrow}`}>
          <span className={styles.eyebrowRule} data-eyebrow-rule />
          <span data-eyebrow>{content.eyebrow}</span>
        </p>

        <h1 id="hero-title" className={`display ${styles.title}`}>
          {headline.map((line, i) => (
            <span key={i} className="line-mask">
              <span className="line-inner">{line}</span>{" "}
            </span>
          ))}
        </h1>
        {content.headlineAr && (
          <p className={styles.arabicLine} data-fade>
            <Arabic>{content.headlineAr}</Arabic>
          </p>
        )}

        <div className={styles.foot}>
          {content.textAr ? (
            <div data-fade>
              <p className={styles.lede}>{content.text}</p>
              <Arabic as="p" className={styles.ledeAr}>
                {content.textAr}
              </Arabic>
            </div>
          ) : (
            <p className={styles.lede} data-fade>
              {content.text}
            </p>
          )}
          <div className={styles.actions} data-fade>
            {content.ctaText && content.ctaUrl && (
              <Button href={content.ctaUrl} variant="solid">
                {content.ctaText}
              </Button>
            )}
            {content.secondaryCtaText && content.secondaryCtaUrl && (
              <Button href={content.secondaryCtaUrl} variant="outline" magnetic={false}>
                {content.secondaryCtaText}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.cue} data-scroll-cue data-reveal aria-hidden="true">
        <span className={styles.cueLabel}>Scroll</span>
        <span className={styles.cueTrack}>
          <span className={styles.cueDot} />
        </span>
      </div>
      <p className={`${styles.coords} label tabular`} data-scroll-cue data-reveal aria-hidden="true">
        {location}
      </p>
    </section>
  );
}
