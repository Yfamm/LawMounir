import { SmoothScrollProvider } from "@/animation/SmoothScrollProvider";
import { TransitionProvider } from "@/animation/TransitionProvider";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { getSiteContext } from "@/lib/cms/repository";
import type { Lang } from "@/lib/i18n";
import { Footer } from "./Footer";
import { Navigation } from "./Navigation";

/** The public site's frame: smooth scroll, page transitions, navigation and footer. */
export async function SiteChrome({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const context = await getSiteContext(lang);
  return (
    <SiteProvider value={context}>
      <a href="#main" className="skip-link">
        {context.ui.skipToContent}
      </a>
      <SmoothScrollProvider>
        <TransitionProvider>
          <Navigation />
          <main id="main">{children}</main>
          <Footer />
        </TransitionProvider>
      </SmoothScrollProvider>
      <div className="grain" aria-hidden="true" />
    </SiteProvider>
  );
}
