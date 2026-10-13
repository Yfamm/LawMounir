import type { Metadata } from "next";
import Link from "next/link";
import { saveSection } from "@/app/admin/actions";
import { FieldForm } from "@/components/admin/FieldForm";
import { PageHead, Panel } from "@/components/admin/PageHead";
import { SectionTabs } from "@/components/admin/SectionTabs";
import { HomeLayoutEditor } from "@/components/admin/HomeLayoutEditor";
import styles from "@/components/admin/admin.module.css";
import { adminList, adminSections } from "@/lib/cms/admin-data";
import { requireAdmin } from "@/lib/cms/auth";
import { sectionFields } from "@/lib/cms/fields";
import type { SectionKey } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Homepage" };

const tabs: { id: string; key: SectionKey; label: string; about: string }[] = [
  { id: "layout", key: "home.layout", label: "Order & visibility", about: "Reorder, hide or show the homepage sections." },
  { id: "hero", key: "home.hero", label: "Hero", about: "The opening image, headline and buttons." },
  { id: "intro", key: "home.intro", label: "Introduction", about: "The statement that lights up word by word, with the firm’s introduction." },
  { id: "practice", key: "home.practice", label: "Practice Areas", about: "Heading for the practice list. The areas themselves are edited under Practice Areas." },
  { id: "landscape", key: "home.landscape", label: "Legal Landscape", about: "The pinned scene: three statements, then the pillars." },
  { id: "values", key: "home.values", label: "Values", about: "Heading and image for the values. The values themselves are edited under Values." },
  { id: "experience", key: "home.experience", label: "Experience", about: "The horizontal track of numbered movements." },
  { id: "people", key: "home.people", label: "People preview", about: "Which people appear on the homepage, and in what order." },
  { id: "insights", key: "home.insights", label: "Insights preview", about: "Which articles appear on the homepage, and in what order." },
  { id: "contact", key: "home.contact", label: "Contact", about: "The closing contact section and enquiry form, shown on every page." },
];

type Props = { searchParams: Promise<{ section?: string }> };

export default async function HomepageAdmin({ searchParams }: Props) {
  await requireAdmin();
  const { section } = await searchParams;
  const tab = tabs.find((t) => t.id === section) ?? tabs[1];
  const [sections, people, insights] = await Promise.all([
    adminSections([tab.key, "home.layout"]),
    tab.id === "people" ? adminList("people") : Promise.resolve([]),
    tab.id === "insights" ? adminList("insights") : Promise.resolve([]),
  ]);

  return (
    <>
      <PageHead
        eyebrow="Pages"
        title={
          <>
            The <em>homepage.</em>
          </>
        }
        intro="Content only — layout, imagery treatment and animation stay as designed."
        actions={
          <a className={styles.buttonGhost} href="/" target="_blank" rel="noopener">
            View homepage ↗
          </a>
        }
      />
      <SectionTabs base="/admin/homepage" tabs={tabs} current={tab.id} />
      <Panel title={tab.label} meta={tab.key}>
        <p className={styles.help} style={{ marginBottom: "1.5rem" }}>
          {tab.about}
          {tab.id === "values" && (
            <>
              {" "}
              <Link href="/admin/values">Edit the values →</Link>
            </>
          )}
          {tab.id === "practice" && (
            <>
              {" "}
              <Link href="/admin/practice-areas">Edit practice areas →</Link>
            </>
          )}
        </p>
        {tab.key === "home.layout" ? (
          <HomeLayoutEditor initial={sections["home.layout"]} />
        ) : (
        <FieldForm
          key={tab.key}
          previewPath="/"
          fields={sectionFields[tab.key]}
          initial={sections[tab.key] as Record<string, unknown>}
          action={saveSection.bind(null, tab.key)}
          refOptions={{
            people: people.map((p) => ({ value: p.id ?? "", label: `${p.name.en || p.name.ar}${p.title.en ? ` — ${p.title.en}` : ""}${p.published ? "" : " (unpublished)"}` })),
            insights: insights.map((n) => ({ value: n.slug, label: `${n.title.en || n.title.ar}${n.status === "published" ? "" : " (not published)"}` })),
          }}
        />
        )}
      </Panel>
    </>
  );
}
