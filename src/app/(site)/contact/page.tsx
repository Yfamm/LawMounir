import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import { getSite } from "@/lib/cms/repository";
import { ContactSection } from "@/components/sections/ContactSection";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMetadata({
    title: "Contact",
    description: `Contact ${site.siteName} — law and legal consultancy in ${site.city}.`,
    path: "/contact",
    siteName: site.siteName,
  });
}

// Source: the firm's values and mission (introduction document).
const steps = [
  {
    title: "In confidence",
    text: "Your privacy, your data and your case are treated with absolute confidentiality from the first message.",
  },
  {
    title: "Clear advice",
    text: "A clear view of your legal position and the procedures ahead, set out simply.",
  },
  {
    title: "Kept informed",
    text: "You are kept up to date with every development in your case and its legal position, through direct and digital channels.",
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
            title={["What you", <em key="e">can expect.</em>]}
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
