import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SmoothScrollProvider } from "@/animation/SmoothScrollProvider";
import { TransitionProvider } from "@/animation/TransitionProvider";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { site } from "@/content/site";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} — Law, within the Egyptian reality`,
    template: `%s — ${site.legalName}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.legalName,
    title: `${site.legalName} — Law, within the Egyptian reality`,
    description: site.description,
    locale: "en_EG",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Flags JS support before first paint so animated elements can start hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScrollProvider>
          <TransitionProvider>
            <Navigation />
            <main id="main">{children}</main>
            <Footer />
          </TransitionProvider>
        </SmoothScrollProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
