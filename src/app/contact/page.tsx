import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Speak with the firm about a corporate, dispute, regulatory or personal matter.",
};

// VERIFY: intake process (conflict check, first conversation, engagement letter) — confirm it matches the firm's procedure.
const steps = [
  {
    title: "Conflict check",
    text: "Before discussing the substance of a matter, we confirm that we are free to act for you. We only need the names of the parties involved.",
  },
  {
    title: "First conversation",
    text: "A focused discussion of the facts, the timeline and what you need to achieve — and an honest view of whether and how we can help.",
  },
  {
    title: "Engagement",
    text: "If we proceed, you receive a written engagement letter setting out the scope of work, the team and the basis of our fees before work begins.",
  },
];

export default function ContactPage() {
  return (
    <>
      <div className={styles.top}>
        <ContactSection as="h1" immediate />
      </div>

      <section className={`section surface-paper ${styles.process}`} aria-label="What happens next">
        <div className="container">
          <SectionHeading
            index="02"
            label="What happens next"
            title={["From first call", <em key="e">to engagement.</em>]}
            size="l"
          />
          <Reveal as="ol" className={styles.steps} stagger={0.12}>
            {steps.map((step, i) => (
              <li key={step.title} className={styles.step} data-reveal-item>
                <span className={styles.stepRule} data-reveal-line />
                <span className={`serif ${styles.stepNum} tabular`}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={`serif ${styles.stepTitle}`}>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
