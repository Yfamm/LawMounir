import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { indexable } from "@/content/seo";
import { getSite } from "@/lib/cms/repository";

const serif = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = localFont({
  src: "../fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

const mono = localFont({
  src: [
    { path: "../fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "monospace"],
});

// Amiri revives the Naskh type of the Bulaq (Amiria) press in Cairo.
const arabic = localFont({
  src: [
    { path: "../fonts/amiri-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/amiri-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
  fallback: ["Noto Naskh Arabic", "serif"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: site.browserTitle,
      template: `%s — ${site.siteName}`,
    },
    description: site.description,
    applicationName: site.siteName,
    // Pre-launch safety: no indexing until NEXT_PUBLIC_SITE_INDEXABLE=true.
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: site.siteName,
      title: site.browserTitle,
      description: site.description,
      locale: "en_EG",
      url: "/",
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable} ${arabic.variable}`} suppressHydrationWarning>
      <head>
        {/* Flags JS support before first paint so animated elements can start hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
