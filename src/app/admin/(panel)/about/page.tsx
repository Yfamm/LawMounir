import type { Metadata } from "next";
import Link from "next/link";
import { saveSection } from "@/app/admin/actions";
import { FieldForm } from "@/components/admin/FieldForm";
import { PageHead, Panel } from "@/components/admin/PageHead";
import styles from "@/components/admin/admin.module.css";
import { adminSections } from "@/lib/cms/admin-data";
import { requireAdmin } from "@/lib/cms/auth";
import { sectionFields } from "@/lib/cms/fields";

export const metadata: Metadata = { title: "About" };

export default async function AboutAdmin() {
  await requireAdmin();
  const sections = await adminSections(["about.blocks"]);

  return (
    <>
      <PageHead
        eyebrow="Pages"
        title={
          <>
            About <em>the firm.</em>
          </>
        }
        intro="Add, edit, hide, reorder or remove the sections of the About page, in Arabic and English. The default four follow the firm’s introduction: رؤيتنا · من نحن؟ · قيمنا الأساسية · رسالتنا."
        actions={
          <>
            <a className={styles.buttonGhost} href="/ar/about" target="_blank" rel="noopener">
              View Arabic ↗
            </a>
            <a className={styles.buttonGhost} href="/en/about" target="_blank" rel="noopener">
              View English ↗
            </a>
          </>
        }
      />
      <Panel title="Sections · الأقسام" meta="about.blocks">
        <p className={styles.help} style={{ marginBottom: "1.5rem" }}>
          The “Values” layout lists the firm’s values, which are shared with the homepage. <Link href="/admin/values">Edit the values →</Link>
        </p>
        <FieldForm
          fields={sectionFields["about.blocks"]}
          initial={sections["about.blocks"] as unknown as Record<string, unknown>}
          action={saveSection.bind(null, "about.blocks")}
          previewPath="/about"
        />
      </Panel>
    </>
  );
}
