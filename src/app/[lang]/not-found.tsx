import type { Metadata } from "next";
import { lang as rootLang } from "next/root-params";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { getUi } from "@/lib/cms/repository";
import { headlineLines } from "@/lib/cms/text";
import { defaultLang, isLang, type Lang } from "@/lib/i18n";
import styles from "./not-found.module.css";

async function currentLang(): Promise<Lang> {
  const value = await rootLang();
  return isLang(value) ? value : defaultLang;
}

export async function generateMetadata(): Promise<Metadata> {
  const ui = await getUi(await currentLang());
  return { title: ui.notFoundMeta, robots: { index: false, follow: false } };
}

export default async function NotFound() {
  const lang = await currentLang();
  const ui = await getUi(lang);
  return (
    <section className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <p className={`label ${styles.code}`}>{ui.notFoundCode}</p>
        <RevealText as="h1" immediate delay={0.2} className={`display ${styles.title}`} lines={headlineLines(ui.notFoundTitle)} />
        <p className="lede">{ui.notFoundText}</p>
        <Button href={`/${lang}`} variant="outline">
          {ui.notFoundHome}
        </Button>
      </div>
    </section>
  );
}
