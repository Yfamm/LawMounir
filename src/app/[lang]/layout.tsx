import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { indexable } from "@/content/seo";
import { getSite } from "@/lib/cms/repository";
import { dirOf, isLang, locales } from "@/lib/i18n";
import { fontVariables } from "../fonts";
// Imported after the chrome so global rules follow the component modules in
// the cascade, exactly as in the approved design.
import "../globals.css";

// Public pages are static and regenerate at most every five minutes; every
// admin save also purges them immediately (revalidatePath in the actions).
export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const site = await getSite(lang);
  const icon = site.favicon;
  return {
    metadataBase: new URL(site.url),
    title: { default: site.browserTitle, template: `%s — ${site.brandName}` },
    description: site.description,
    applicationName: site.brandName,
    // Pre-launch safety: no indexing until NEXT_PUBLIC_SITE_INDEXABLE=true.
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    icons: icon
      ? { icon: [{ url: icon }], apple: [{ url: icon }] }
      : { icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.svg", type: "image/svg+xml" }], apple: [{ url: "/apple-icon.png" }] },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} dir={dirOf(lang)} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Flags JS support before first paint so animated elements can start hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SiteChrome lang={lang}>{children}</SiteChrome>
      </body>
    </html>
  );
}
