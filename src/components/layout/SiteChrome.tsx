import { SmoothScrollProvider } from "@/animation/SmoothScrollProvider";
import { TransitionProvider } from "@/animation/TransitionProvider";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { getSiteContext } from "@/lib/cms/repository";
import { Footer } from "./Footer";
import { Navigation } from "./Navigation";

/** The public site's frame: smooth scroll, page transitions, navigation and footer. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const context = await getSiteContext();
  return (
    <SiteProvider value={context}>
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
    </SiteProvider>
  );
}
