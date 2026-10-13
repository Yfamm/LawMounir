import Image from "next/image";
import { getSection, getSite, getUi, image as resolve } from "@/lib/cms/repository";
import { headlineLines, plain } from "@/lib/cms/text";
import { other, tr, type Lang } from "@/lib/i18n";
import { Counterpart } from "@/components/ui/Counterpart";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { ContactForm } from "@/components/ui/ContactForm";
import { ContactLink } from "@/components/ui/ContactLink";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import styles from "./ContactSection.module.css";

type Props = {
  lang: Lang;
  index?: string;
  as?: "h1" | "h2";
  immediate?: boolean;
};

/** The closing statement and enquiry form — the darkest room in the house. */
export async function ContactSection({ lang, index, as = "h2", immediate = false }: Props) {
  const [site, section, ui] = await Promise.all([getSite(lang), getSection("home.contact"), getUi(lang)]);
  const background = await resolve(section.image, "mashrabiya", lang);
  const content = {
    label: tr(section.label, lang),
    labelOther: plain(section.label[other(lang)] ?? ""),
    title: tr(section.title, lang),
    description: tr(section.description, lang),
  };

  return (
    <section className={styles.contact} aria-labelledby="contact-title" id="contact">
      <div className={styles.media} aria-hidden="true">
        <Image
          src={background.src}
          alt=""
          fill
          sizes="60vw"
          placeholder={typeof background.src === "string" ? "empty" : "blur"}
          className={styles.image}
          style={background.position !== "50% 50%" ? { objectPosition: background.position } : undefined}
        />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <GeometricPattern className={styles.pattern} opacity={0.08} size={96} />

      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.meta} immediate={immediate}>
          {index && (
            <span className="label tabular" data-reveal-item>
              {index}
            </span>
          )}
          <span className={styles.rule} data-reveal-line />
          <span className="label" data-reveal-item>
            {content.label}
          </span>
          {content.labelOther && (
            <span className={styles.arabic} data-reveal-item>
              <Counterpart lang={other(lang)}>{content.labelOther}</Counterpart>
            </span>
          )}
        </Reveal>

        <RevealText
          as={as}
          id="contact-title"
          className={`display ${styles.title}`}
          lines={headlineLines(content.title)}
          immediate={immediate}
          delay={immediate ? 0.3 : 0}
        />

        {content.description && (
          <Reveal immediate={immediate} delay={immediate ? 0.5 : 0}>
            <p className={`lede ${styles.description}`} data-reveal-item>
              {content.description}
            </p>
          </Reveal>
        )}

        <div className={styles.grid}>
          <Reveal as="dl" className={styles.details} immediate={immediate} delay={immediate ? 0.6 : 0}>
            <div data-reveal-item>
              <dt className="label">{ui.phone}</dt>
              <dd>
                <ContactLink href={site.phoneHref}>
                  <span dir="auto">{site.phone}</span>
                </ContactLink>
              </dd>
            </div>
            {site.whatsappHref && (
              <div data-reveal-item>
                <dt className="label">{ui.whatsapp}</dt>
                <dd>
                  <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" dir="auto">
                    {site.whatsapp}
                  </a>
                </dd>
              </div>
            )}
            <div data-reveal-item>
              <dt className="label">{ui.email}</dt>
              <dd>
                <ContactLink href={site.emailHref}>{site.email}</ContactLink>
              </dd>
            </div>
            <div data-reveal-item>
              <dt className="label">{ui.office}</dt>
              <dd>
                {site.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </dd>
            </div>
            <div data-reveal-item>
              <dt className="label">{ui.hours}</dt>
              <dd>{site.hours}</dd>
            </div>
          </Reveal>

          <Reveal className={styles.form} immediate={immediate} delay={immediate ? 0.8 : 0.1}>
            <ContactForm
              submitText={tr(section.submitText, lang)}
              notice={tr(section.notice, lang)}
              successTitle={tr(section.successTitle, lang)}
              successText={tr(section.successText, lang)}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
