import type { Metadata } from "next";
import Link from "next/link";
import { saveSection } from "@/app/admin/actions";
import { FieldForm } from "@/components/admin/FieldForm";
import { PageHead, Panel } from "@/components/admin/PageHead";
import { SectionTabs } from "@/components/admin/SectionTabs";
import styles from "@/components/admin/admin.module.css";
import { adminSections } from "@/lib/cms/admin-data";
import { requireAdmin } from "@/lib/cms/auth";
import { sectionFields } from "@/lib/cms/fields";
import type { SectionKey } from "@/lib/cms/types";

export const metadata: Metadata = { title: "About" };

const tabs: { id: string; key: SectionKey; label: string }[] = [
  { id: "vision", key: "about.vision", label: "Vision — رؤيتنا" },
  { id: "who", key: "about.who", label: "Who We Are — من نحن؟" },
  { id: "values", key: "about.values", label: "Values — قيمنا الأساسية" },
  { id: "mission", key: "about.mission", label: "Mission — رسالتنا" },
];

type Props = { searchParams: Promise<{ section?: string }> };

export default async function AboutAdmin({ searchParams }: Props) {
  await requireAdmin();
  const { section } = await searchParams;
  const tab = tabs.find((t) => t.id === section) ?? tabs[0];
  const sections = await adminSections([tab.key]);

  return (
    <>
      <PageHead
        eyebrow="Pages"
        title={
          <>
            About <em>the firm.</em>
          </>
        }
        intro="The four parts of the firm’s introduction. Turn a part off to hide it; the remaining sections renumber themselves."
        actions={
          <a className={styles.buttonGhost} href="/about" target="_blank" rel="noopener">
            View page ↗
          </a>
        }
      />
      <SectionTabs base="/admin/about" tabs={tabs} current={tab.id} />
      <Panel title={tab.label} meta={tab.key}>
        {tab.id === "values" && (
          <p className={styles.help} style={{ marginBottom: "1.5rem" }}>
            The list of values is shared with the homepage. <Link href="/admin/values">Edit the values →</Link>
          </p>
        )}
        <FieldForm
          key={tab.key}
          fields={sectionFields[tab.key]}
          initial={sections[tab.key] as Record<string, unknown>}
          action={saveSection.bind(null, tab.key)}
        />
      </Panel>
    </>
  );
}
