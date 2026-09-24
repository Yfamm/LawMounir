import styles from "./Arrow.module.css";

type Props = { className?: string; direction?: "right" | "up-right" | "down" };

function Glyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12h17M14 5.5 20.5 12 14 18.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

/**
 * Arrow that slides out and back in when any ancestor link or button is
 * hovered — two glyphs in a clipping box.
 */
export function Arrow({ className, direction = "right" }: Props) {
  return (
    <span className={`${styles.arrow} ${styles[direction]} ${className ?? ""}`} aria-hidden="true">
      <span className={styles.a}>
        <Glyph />
      </span>
      <span className={styles.b}>
        <Glyph />
      </span>
    </span>
  );
}
