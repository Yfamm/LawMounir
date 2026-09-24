"use client";

import { useRef } from "react";
import { EASE, gsap, MOTION, showRoot, useGSAP } from "@/animation/gsap";
import { useSmoothScroll } from "@/animation/SmoothScrollProvider";
import { practiceAreas } from "@/content/practiceAreas";
import { primaryNav, site } from "@/content/site";
import { Arabic } from "@/components/ui/Arabic";
import { Arrow } from "@/components/ui/Arrow";
import { ContactLink } from "@/components/ui/ContactLink";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Wordmark } from "./Wordmark";
import styles from "./Footer.module.css";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.fromTo(
          el.querySelectorAll("[data-giant] span"),
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 1.6,
            ease: EASE.reveal,
            stagger: 0.05,
            scrollTrigger: { trigger: el.querySelector("[data-giant]"), start: "top 98%", once: true },
          },
        );
      });
      showRoot(el.querySelector("[data-giant]"));
    },
    { scope: ref },
  );

  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className={styles.footer}>
      <GeometricPattern className={styles.pattern} opacity={0.06} size={110} />
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Wordmark />
            <p className={styles.note}>
              An Egyptian law firm for companies, investors and families — built around the realities of Egyptian
              law, business and dispute.
            </p>
          </div>

          <nav aria-label="Footer" className={styles.col}>
            <p className={`label ${styles.heading}`}>The Firm</p>
            <ul>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <TransitionLink href={item.href} className={styles.link}>
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <p className={`label ${styles.heading}`}>Practice</p>
            <ul>
              {practiceAreas.slice(0, 6).map((area) => (
                <li key={area.slug}>
                  <TransitionLink href={`/practice-areas/${area.slug}`} className={styles.link}>
                    {area.title}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <p className={`label ${styles.heading}`}>Contact</p>
            <ul>
              <li>
                <ContactLink href={site.contact.phoneHref} className={styles.link}>
                  {site.contact.phone}
                </ContactLink>
              </li>
              <li>
                <ContactLink href={site.contact.emailHref} className={styles.link}>
                  {site.contact.email}
                </ContactLink>
              </li>
              <li className={styles.muted}>{site.contact.office.join(", ")}</li>
              <li className={styles.muted}>{site.contact.hours}</li>
            </ul>
          </div>
        </div>

        <p
          className={styles.giant}
          aria-hidden="true"
          data-giant
          data-reveal
          style={{ "--chars": site.name.length } as React.CSSProperties}
        >
          {site.name.split("").map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </p>

        <div className={styles.bottom}>
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className={styles.disclaimer}>
            The content of this website is general information and does not constitute legal advice.
          </p>
          <p className="tabular">
            <Arabic className={styles.arabic}>{site.taglineAr}</Arabic>
            <span className={styles.coords}>{site.coordinates}</span>
          </p>
          <button type="button" className={styles.top} onClick={() => scrollTo(0)}>
            Back to top <Arrow direction="up-right" />
          </button>
        </div>
      </div>
    </footer>
  );
}
