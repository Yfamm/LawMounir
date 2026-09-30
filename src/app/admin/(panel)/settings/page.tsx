import type { Metadata } from "next";
import { saveSettings } from "@/app/admin/actions";
import { FieldForm } from "@/components/admin/FieldForm";
import { PageHead, Panel } from "@/components/admin/PageHead";
import styles from "@/components/admin/admin.module.css";
import { adminSettings } from "@/lib/cms/admin-data";
import { requireAdmin } from "@/lib/cms/auth";
import { settingsFields } from "@/lib/cms/fields";

export const metadata: Metadata = { title: "Site Settings" };

export default async function SettingsAdmin() {
  await requireAdmin();
  const settings = await adminSettings();
  const initial = Object.fromEntries(settingsFields.map((f) => [f.name, settings[f.name as keyof typeof settings]]));

  return (
    <>
      <PageHead
        eyebrow="Site"
        title={
          <>
            Site <em>settings.</em>
          </>
        }
        intro="The firm’s names, contact details and search-engine defaults, used across every page."
      />
      <div className={styles.stack}>
        <p className={styles.notice}>
          Keys, passwords and the notification e-mail address are not stored here — they are environment variables on
          the server (see <code>.env.example</code>). Values in [BRACKETS] are placeholders and are never turned into
          links.
        </p>
        <Panel title="Identity, contact & SEO">
          <FieldForm fields={settingsFields} initial={initial} action={saveSettings.bind(null, "settings")} />
        </Panel>
      </div>
    </>
  );
}
