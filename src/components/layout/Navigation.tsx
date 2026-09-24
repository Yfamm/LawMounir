"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { EASE, gsap, MOTION, ScrollTrigger, showRoot, useGSAP } from "@/animation/gsap";
import { useSmoothScroll } from "@/animation/SmoothScrollProvider";
import { primaryNav, site } from "@/content/site";
import { Arabic } from "@/components/ui/Arabic";
import { Button } from "@/components/ui/Button";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Wordmark } from "./Wordmark";
import styles from "./Navigation.module.css";

export function Navigation() {
  const pathname = usePathname();
  const { stop, start } = useSmoothScroll();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // Intro reveal and scroll-driven states: transparent over the hero, then a
  // compact solid bar; hides while scrolling down, returns on scroll up.
  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION.ok, () => {
        gsap.from(header.querySelectorAll("[data-nav-item]"), {
          yPercent: -120,
          autoAlpha: 0,
          duration: 1.2,
          ease: EASE.reveal,
          stagger: 0.06,
          delay: 0.6,
        });
      });

      let solid = false;
      let hidden = false;
      const setSolid = (value: boolean) => {
        if (value === solid) return;
        solid = value;
        header.dataset.solid = String(value);
        gsap.to(header, {
          "--nav-bg-alpha": value ? 1 : 0,
          "--nav-pad": value ? "0.9rem" : "1.6rem",
          duration: 0.7,
          ease: EASE.soft,
        });
      };
      const setHidden = (value: boolean) => {
        if (value === hidden) return;
        hidden = value;
        gsap.to(header, { yPercent: value ? -100 : 0, duration: 0.7, ease: EASE.soft });
      };

      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setSolid(y > 40);
          setHidden(y > 480 && self.direction === 1);
        },
      });
      setSolid(st.scroll() > 40);
      showRoot(header);

      return () => st.kill();
    },
    { scope: headerRef },
  );

  // Full-screen menu timeline, built once and played / reversed.
  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu) return;
      const reduce = window.matchMedia(MOTION.reduce).matches;
      menuTl.current = gsap
        .timeline({ paused: true, defaults: { ease: EASE.inOut } })
        .set(menu, { visibility: "visible" })
        .fromTo(
          menu,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: reduce ? 0.01 : 0.9 },
        )
        .fromTo(
          menu.querySelectorAll("[data-menu-line]"),
          { yPercent: 110 },
          { yPercent: 0, duration: reduce ? 0.01 : 1.1, ease: EASE.reveal, stagger: 0.06 },
          "-=0.45",
        )
        .fromTo(
          menu.querySelectorAll("[data-menu-fade]"),
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: reduce ? 0.01 : 0.8, ease: EASE.soft, stagger: 0.05 },
          "-=0.8",
        );
    },
    { scope: menuRef },
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    if (open) {
      stop();
      tl.timeScale(1).play();
      menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else {
      start();
      tl.timeScale(1.6).reverse();
    }
  }, [open, stop, start]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header ref={headerRef} className={styles.header} data-open={open} data-reveal>
        <div className={styles.backdrop} aria-hidden="true" />
        <nav className={styles.bar} aria-label="Primary">
          <div data-nav-item>
            <TransitionLink href="/" className={styles.brand} aria-label={`${site.legalName} — home`} onClick={close}>
              <Wordmark />
            </TransitionLink>
          </div>

          <ul className={styles.links}>
            {primaryNav.map((item) => (
              <li key={item.href} data-nav-item>
                <TransitionLink
                  href={item.href}
                  className={styles.link}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <div className={styles.cta} data-nav-item>
              <Button href="/contact" variant="accent">
                Let&rsquo;s talk
              </Button>
            </div>
            <div data-nav-item>
              <button
                type="button"
                className={styles.toggle}
                aria-expanded={open}
                aria-controls="site-menu"
                onClick={() => setOpen((v) => !v)}
              >
                <span className={styles.toggleLabel}>{open ? "Close" : "Menu"}</span>
                <span className={styles.toggleIcon} aria-hidden="true">
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div
        ref={menuRef}
        id="site-menu"
        className={styles.menu}
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
      >
        <GeometricPattern className={styles.menuPattern} opacity={0.08} size={96} />
        <div className={styles.menuInner}>
          <ol className={styles.menuList}>
            {primaryNav.map((item, i) => (
              <li key={item.href} className={styles.menuItem}>
                <span className="line-mask">
                  <span className="line-inner" data-menu-line>
                    <TransitionLink
                      href={item.href}
                      className={styles.menuLink}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      onClick={close}
                    >
                      <span className={`${styles.menuIndex} label tabular`}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="serif">{item.label}</span>
                    </TransitionLink>
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <p className={styles.menuArabic} data-menu-fade>
            <Arabic>{site.taglineAr}</Arabic>
          </p>
          <div className={styles.menuFooter}>
            <div data-menu-fade>
              <p className="label">Call</p>
              <a href={site.contact.phoneHref}>{site.contact.phone}</a>
            </div>
            <div data-menu-fade>
              <p className="label">Write</p>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </div>
            <div data-menu-fade>
              <p className="label">Visit</p>
              <p>{site.contact.office.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
