import Link from "next/link";
import { notFound } from "next/navigation";
import { saveRecord } from "@/app/admin/actions";
import { adminGet, adminList } from "@/lib/cms/admin-data";
import { collectionFields, type CollectionKey } from "@/lib/cms/fields";
import { formatDate } from "@/lib/cms/text";
import type { FirmValue, InsightRecord, NavItem, PersonRecord, PracticeAreaRecord } from "@/lib/cms/types";
import { FieldForm } from "./FieldForm";
import { PageHead, Panel } from "./PageHead";
import { RowActions } from "./RowActions";
import styles from "./admin.module.css";

type Summary = { title: string; sub?: string; published: boolean; badges?: { text: string; tone?: "gold" | "outline" | "muted" }[]; href?: string };

type Config = {
  base: string;
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  singular: string;
  toggle?: [string, string];
  empty: Record<string, unknown>;
  summary: (record: never) => Summary;
};

export const collectionConfig: Record<CollectionKey, Config> = {
  practice: {
    base: "/admin/practice-areas",
    eyebrow: "Collections",
    title: (
      <>
        Practice <em>areas.</em>
      </>
    ),
    intro: "The order here is the order on the site. Unpublished areas are hidden from the site and have no public page.",
    singular: "practice area",
    empty: { title: "", titleAr: "", slug: "", summary: "", overview: "", scope: [], forums: [], image: {}, seoTitle: "", seoDescription: "", published: false, verify: [] },
    summary: (a: PracticeAreaRecord) => ({ title: a.title, sub: `/practice-areas/${a.slug}`, published: a.published, href: `/practice-areas/${a.slug}` }),
  },
  people: {
    base: "/admin/people",
    eyebrow: "Collections",
    title: (
      <>
        Our <em>people.</em>
      </>
    ),
    intro: "Publish only confirmed profiles. Placeholders stay in [BRACKETS] until the firm supplies real details.",
    singular: "person",
    empty: { nameEn: "", nameAr: "", titleEn: "", titleAr: "", practice: "", bioShort: "", bioFull: "", portrait: {}, education: "", languages: "", admission: "", published: false },
    summary: (p: PersonRecord) => ({ title: p.nameEn, sub: [p.titleEn, p.practice].filter(Boolean).join(" · "), published: p.published, href: "/people" }),
  },
  insights: {
    base: "/admin/insights",
    eyebrow: "Collections",
    title: (
      <>
        Insights <em>&amp; notes.</em>
      </>
    ),
    intro: "Articles marked “legal review pending” carry the draft notice on the site until the firm approves them.",
    singular: "article",
    empty: {
      title: "",
      titleAr: "",
      slug: "",
      excerpt: "",
      excerptAr: "",
      body: "",
      author: "",
      cover: {},
      category: "Legal Updates",
      publishedOn: null,
      readingTime: "",
      seoTitle: "",
      seoDescription: "",
      status: "draft",
      legalReview: "pending",
      verify: [],
    },
    summary: (n: InsightRecord) => ({
      title: n.title,
      sub: `${n.category} · ${formatDate(n.publishedOn)}`,
      published: n.status === "published",
      badges: [n.legalReview === "approved" ? { text: "Reviewed", tone: "outline" } : { text: "Review pending", tone: "muted" }],
      href: `/insights/${n.slug}`,
    }),
  },
  values: {
    base: "/admin/values",
    eyebrow: "Collections",
    title: (
      <>
        Core <em>values.</em>
      </>
    ),
    intro: "Shown on the homepage and the About page, numbered in this order.",
    singular: "value",
    empty: { titleEn: "", titleAr: "", bodyEn: "", bodyAr: "", published: true },
    summary: (v: FirmValue) => ({ title: v.titleEn, sub: v.titleAr, published: v.published }),
  },
  navigation: {
    base: "/admin/navigation",
    eyebrow: "Site",
    title: (
      <>
        Navigation <em>&amp; footer.</em>
      </>
    ),
    intro: "Menu links appear in the header, the mobile menu and the footer.",
    singular: "link",
    toggle: ["Show", "Hide"],
    empty: { label: "", href: "/", visible: true },
    summary: (n: NavItem) => ({ title: n.label, sub: n.href, published: n.visible }),
  },
};

/** Table of a collection with reorder / publish / delete controls. */
export async function CollectionTable({ collection }: { collection: CollectionKey }) {
  const config = collectionConfig[collection];
  const rows = await adminList(collection);
  if (rows.length === 0) return <p className={styles.empty}>Nothing here yet.</p>;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const s = config.summary(row as never);
            return (
              <tr key={row.id}>
                <td className={styles.mono}>{String(i + 1).padStart(2, "0")}</td>
                <td>
                  <Link href={`${config.base}/${row.id}`} className={styles.rowTitle}>
                    {s.title || "Untitled"}
                  </Link>
                  {s.sub && <span className={styles.sub}>{s.sub}</span>}
                </td>
                <td>
                  <span className={styles.tools}>
                    <span className={`${styles.badge} ${s.published ? styles.badgeOutline : styles.badgeMuted}`}>
                      {s.published ? (collection === "navigation" ? "Visible" : "Published") : collection === "navigation" ? "Hidden" : collection === "insights" ? "Draft" : "Unpublished"}
                    </span>
                    {s.badges?.map((b) => (
                      <span key={b.text} className={`${styles.badge} ${b.tone === "outline" ? styles.badgeOutline : b.tone === "gold" ? styles.badgeGold : styles.badgeMuted}`}>
                        {b.text}
                      </span>
                    ))}
                  </span>
                </td>
                <td>
                  <span className={styles.tools}>
                    <Link href={`${config.base}/${row.id}`} className={styles.iconButton}>
                      Edit
                    </Link>
                    <RowActions
                      collection={collection}
                      id={row.id ?? ""}
                      name={s.title}
                      published={s.published}
                      first={i === 0}
                      last={i === rows.length - 1}
                      toggle={config.toggle}
                    />
                    {s.href && s.published && (
                      <a href={s.href} target="_blank" rel="noopener" className={styles.iconButton}>
                        View ↗
                      </a>
                    )}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export async function CollectionIndex({ collection }: { collection: CollectionKey }) {
  const config = collectionConfig[collection];
  return (
    <>
      <PageHead
        eyebrow={config.eyebrow}
        title={config.title}
        intro={config.intro}
        actions={
          <Link href={`${config.base}/new`} className={styles.button}>
            + New {config.singular}
          </Link>
        }
      />
      <CollectionTable collection={collection} />
    </>
  );
}

/** Create / edit page for one record. `id` is a record id or "new". */
export async function CollectionEditor({ collection, id }: { collection: CollectionKey; id: string }) {
  const config = collectionConfig[collection];
  const isNew = id === "new";
  const record = isNew ? null : await adminGet(collection, id);
  if (!isNew && !record) notFound();
  const initial = record ? { ...(record as Record<string, unknown>) } : config.empty;
  const s = record ? config.summary(record as never) : null;

  return (
    <>
      <Link href={config.base} className={styles.back}>
        ← All {config.singular === "person" ? "people" : `${config.singular}s`}
      </Link>
      <PageHead
        eyebrow={isNew ? `New ${config.singular}` : `Edit ${config.singular}`}
        title={s?.title || `New ${config.singular}`}
        actions={
          s?.href && s.published ? (
            <a className={styles.buttonGhost} href={s.href} target="_blank" rel="noopener">
              View on site ↗
            </a>
          ) : undefined
        }
      />
      <Panel title="Details">
        <FieldForm
          fields={collectionFields[collection]}
          initial={initial}
          action={saveRecord.bind(null, collection, isNew ? null : id)}
          submitLabel={isNew ? "Create" : "Save & publish"}
          createdPath={isNew ? config.base : undefined}
        />
      </Panel>
    </>
  );
}
