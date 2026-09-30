import type { Metadata } from "next";
import Link from "next/link";
import { saveSettings } from "@/app/admin/actions";
import { collectionConfig, CollectionTable } from "@/components/admin/collections";
import { FieldForm } from "@/components/admin/FieldForm";
import { PageHead, Panel } from "@/components/admin/PageHead";
import styles from "@/components/admin/admin.module.css";
import { adminSettings } from "@/lib/cms/admin-data";
import { requireAdmin } from "@/lib/cms/auth";
import { footerFields } from "@/lib/cms/fields";

export const metadata: Metadata = { title: "Navigation & Footer" };

export default async function NavigationAdmin() {
  await requireAdmin();
  const settings = await adminSettings();
  const config = collectionConfig.navigation;
  const footer = Object.fromEntries(footerFields.map((f) => [f.name, settings[f.name as keyof typeof settings]]));

  return (
    <>
      <PageHead eyebrow={config.eyebrow} title={config.title} intro={config.intro} />
      <div className={styles.stack}>
        <Panel
          title="Menu links"
          meta={
            <Link href="/admin/navigation/new" className={styles.iconButton}>
              + New link
            </Link>
          }
        >
          <CollectionTable collection="navigation" />
        </Panel>
        <Panel title="Header button & footer">
          <p className={styles.help} style={{ marginBottom: "1.5rem" }}>
            The footer also shows the firm’s names and contact details from{" "}
            <Link href="/admin/settings">Site Settings</Link>, and the first six practice areas.
          </p>
          <FieldForm fields={footerFields} initial={footer} action={saveSettings.bind(null, "footer")} />
        </Panel>
      </div>
    </>
  );
}
