import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <p className={`label ${styles.code}`}>Error 404</p>
        <RevealText
          as="h1"
          immediate
          delay={0.2}
          className={`display ${styles.title}`}
          lines={["Not on", <em key="e">the record.</em>]}
        />
        <p className="lede">The page you are looking for has moved, or never existed. Let us take you somewhere useful.</p>
        <Button href="/" variant="outline">
          Return home
        </Button>
      </div>
    </section>
  );
}
