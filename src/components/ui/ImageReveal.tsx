"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type CSSProperties } from "react";
import { EASE, gsap, MOTION, showRoot, useGSAP } from "@/animation/gsap";
import styles from "./ImageReveal.module.css";

type Props = {
  src: StaticImageData;
  alt: string;
  sizes: string;
  /** CSS object-position used to frame the image. */
  position?: string;
  /** Extra zoom applied to crop into a detail of the image. */
  zoom?: number;
  /** Vertical parallax travel in percent. 0 disables parallax. */
  parallax?: number;
  ratio?: string;
  className?: string;
  tone?: "none" | "soft" | "deep";
  caption?: string;
  priority?: boolean;
};

/**
 * Image revealed from behind a clip mask as it enters the viewport, with
 * gentle scroll parallax once visible.
 */
export function ImageReveal({
  src,
  alt,
  sizes,
  position = "50% 50%",
  zoom = 1,
  parallax = 8,
  ratio,
  className,
  tone = "soft",
  caption,
  priority = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = innerRef.current;
      if (!el || !inner) return;
      gsap.set(inner, { scale: zoom });
      const mm = gsap.matchMedia();

      mm.add(MOTION.ok, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } })
          .fromTo(
            el.querySelector("[data-clip]"),
            { clipPath: "inset(18% 12% 18% 12%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: EASE.inOut },
          )
          .fromTo(inner, { scale: zoom * 1.3 }, { scale: zoom, duration: 2.2, ease: EASE.reveal }, 0);

        if (parallax) {
          gsap.fromTo(
            inner,
            { yPercent: -parallax },
            {
              yPercent: parallax,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
      showRoot(el);
    },
    { scope: ref },
  );

  const style = { "--ratio": ratio, "--travel": `${parallax}%` } as CSSProperties;

  return (
    <figure ref={ref} className={`${styles.figure} ${className ?? ""}`} style={style} data-reveal>
      <div className={styles.frame} data-clip>
        <div ref={innerRef} className={styles.inner}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            className={styles.img}
            style={{ objectPosition: position }}
          />
        </div>
        <div className={`${styles.tone} ${styles[tone]}`} aria-hidden="true" />
      </div>
      {caption && <figcaption className={`${styles.caption} label`}>{caption}</figcaption>}
    </figure>
  );
}
