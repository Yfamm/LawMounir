import { SiteChrome } from "@/components/layout/SiteChrome";
// Imported after the chrome so global rules follow the component modules in
// the cascade, exactly as in the approved design.
import "../globals.css";

// Public pages are static and regenerate at most every five minutes; every
// admin save also purges them immediately (revalidatePath in the actions).
export const revalidate = 300;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
