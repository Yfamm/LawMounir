"use client";

import { useRef, type ReactNode } from "react";
import { useMagnetic } from "@/animation/useMagnetic";
import { Arrow } from "./Arrow";
import { TransitionLink } from "./TransitionLink";
import styles from "./Button.module.css";

type Common = {
  children: ReactNode;
  variant?: "outline" | "solid" | "accent";
  tone?: "dark" | "paper";
  magnetic?: boolean;
  arrow?: boolean;
  className?: string;
};

type LinkProps = Common & { href: string; type?: never; disabled?: never };
type ActionProps = Common & { href?: never; type?: "button" | "submit"; disabled?: boolean };

/**
 * Primary call to action. Internal links use the page transition; `tel:`,
 * `mailto:` and external links fall back to a plain anchor.
 */
export function Button(props: LinkProps | ActionProps) {
  const { children, variant = "outline", tone = "dark", magnetic = true, arrow = true, className } = props;
  const ref = useRef<HTMLSpanElement>(null);
  useMagnetic(ref, magnetic ? 0.25 : 0);

  const classes = `${styles.button} ${styles[variant]} ${styles[tone]} ${className ?? ""}`;
  const inner = (
    <>
      <span className={styles.fill} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
      {arrow && <Arrow className={styles.arrow} />}
    </>
  );

  let control: ReactNode;
  if (props.href !== undefined) {
    const internal = props.href.startsWith("/");
    control = internal ? (
      <TransitionLink href={props.href} className={classes}>
        {inner}
      </TransitionLink>
    ) : (
      <a href={props.href} className={classes}>
        {inner}
      </a>
    );
  } else {
    control = (
      <button type={props.type ?? "button"} className={classes} disabled={props.disabled}>
        {inner}
      </button>
    );
  }

  return (
    <span ref={ref} className={styles.magnet}>
      {control}
    </span>
  );
}
