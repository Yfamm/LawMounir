import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/content/seo";
import { getSection, getSite } from "@/lib/cms/repository";
import { headlineLines } from "@/lib/cms/text";
import { isLang, tr } from "@/lib/i18n";
import { ContactSection } from "@/components/sections/ContactSection";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

type Props = { params: Promise<{ lang: string }> };

// Same as the [lang] layout; repeated here because vinext (Cloudflare build)
// reads the ISR interval from the page, not from parent layouts.
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const [site, seo] = await Promise.all([getSite(lang), getSection("seo.pages")]);
  return pageMetadata({
    lang,
    title: tr(seo.contact.title, lang),
    description: tr(seo.contact.description, lang),
    path: "/contact",
    siteName: site.brandName,
    shareImage: site.shareImage,
    defaultLanguage: site.defaultLanguage,
  });
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const page = await getSection("contact.page");
  const label = tr(page.label, lang);

  return (
    <>
      <div className={styles.top}>
        <ContactSection lang={lang} as="h1" immediate />
      </div>

      {page.steps.length > 0 && (
        <section className={`section surface-paper ${styles.process}`} aria-label={label}>
          <div className="container">
            <SectionHeading index="02" label={label} title={headlineLines(tr(page.title, lang))} size="l" />
            <Reveal as="ol" className={styles.steps} stagger={0.12}>
              {page.steps.map((step, i) => (
                <li key={i} className={styles.step} data-reveal-item>
                  <span className={styles.stepRule} data-reveal-line />
                  <span className={`serif ${styles.stepNum} tabular`}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={`serif ${styles.stepTitle}`}>{tr(step.title, lang)}</h3>
                  <p>{tr(step.text, lang)}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
