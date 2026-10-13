import type { Metadata } from "next";
import { saveSection } from "@/app/admin/actions";
import { FieldForm } from "@/components/admin/FieldForm";
import { PageHead, Panel } from "@/components/admin/PageHead";
import { SectionTabs } from "@/components/admin/SectionTabs";
import { adminSections } from "@/lib/cms/admin-data";
import { requireAdmin } from "@/lib/cms/auth";
import { sectionFields } from "@/lib/cms/fields";
import type { SectionKey } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Pages & SEO" };

const tabs: { id: string; key: SectionKey; label: string; about: string; preview: string }[] = [
  { id: "practice", key: "practice.index", label: "Practice areas page", about: "Heading, introduction and wide image of /practice-areas.", preview: "/practice-areas" },
  { id: "people", key: "people.index", label: "People page", about: "Heading and introduction of /people.", preview: "/people" },
  { id: "insights", key: "insights.index", label: "Insights page", about: "Heading and introduction of /insights.", preview: "/insights" },
  { id: "contact", key: "contact.page", label: "Contact page", about: "The “What happens next” steps on /contact. The contact section itself is edited under Homepage → Contact.", preview: "/contact" },
  { id: "seo", key: "seo.pages", label: "Search & sharing", about: "Browser titles and search descriptions for each page, in both languages. Practice areas and articles have their own SEO fields.", preview: "/" },
];

type Props = { searchParams: Promise<{ section?: string }> };

export default async function PagesAdmin({ searchParams }: Props) {
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
            Index pages <em>&amp; SEO.</em>
          </>
        }
        intro="The opening of each listing page, the contact page steps, and search metadata."
      />
      <SectionTabs base="/admin/pages" tabs={tabs} current={tab.id} />
      <Panel title={tab.label} meta={tab.key}>
        <p style={{ marginBottom: "1.5rem" }}>{tab.about}</p>
        <FieldForm
          key={tab.key}
          fields={sectionFields[tab.key]}
          initial={sections[tab.key] as unknown as Record<string, unknown>}
          action={saveSection.bind(null, tab.key)}
          previewPath={tab.preview}
        />
      </Panel>
    </>
  );
}
