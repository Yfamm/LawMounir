import { Sidebar } from "@/components/admin/Sidebar";
import styles from "@/components/admin/admin.module.css";
import { requireAdmin } from "@/lib/cms/auth";
import { getSite } from "@/lib/cms/repository";
import { sessionClient } from "@/lib/supabase/server";

/** Every page below is rendered only for a verified admin (checked on the server). */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const db = await sessionClient();
  const [{ count }, site] = await Promise.all([
    db.from("enquiries").select("id", { count: "exact", head: true }).is("read_at", null),
    getSite(),
  ]);

  return (
    <div className={styles.shell}>
      <Sidebar email={admin.email} unread={count ?? 0} siteName={site.siteName} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
