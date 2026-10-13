import Link from "next/link";
import { notFound } from "next/navigation";
import { saveRecord } from "@/app/admin/actions";
import { adminGet, adminList } from "@/lib/cms/admin-data";
import { collectionFields, type CollectionKey } from "@/lib/cms/fields";
import { completeness } from "@/lib/cms/fields";
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
  plural: string;
  toggle?: [string, string];
  empty: Record<string, unknown>;
  summary: (record: never) => Summary;
  /** Language-neutral public path for previews. */
  preview?: (record: never) => string;
};

const E = () => ({ en: "", ar: "" });
const both = (v: { en: string; ar: string }) => (v.en && v.ar ? `${v.en} · ${v.ar}` : v.en || v.ar);

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
    plural: "practice areas",
    empty: {
      title: E(), slug: "", summary: E(), overview: E(), scope: { en: [], ar: [] }, forums: { en: [], ar: [] }, image: {},
      seoTitle: E(), seoDescription: E(), published: false, verify: [], _translation: {},
    },
    summary: (a: PracticeAreaRecord) => ({ title: both(a.title), sub: `/practice-areas/${a.slug}`, published: a.published, href: `/ar/practice-areas/${a.slug}` }),
    preview: (a: PracticeAreaRecord) => `/practice-areas/${a.slug}`,
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
    plural: "people",
    empty: {
      name: E(), title: E(), practice: E(), bioShort: E(), bioFull: E(), portrait: {}, education: E(), languages: E(), admission: E(),
      published: false, _translation: {},
    },
    summary: (p: PersonRecord) => ({ title: both(p.name), sub: [p.title.en || p.title.ar, p.practice.en || p.practice.ar].filter(Boolean).join(" · "), published: p.published, href: "/ar/people" }),
    preview: () => "/people",
  },
  insights: {
    base: "/admin/insights",
    eyebrow: "Collections",
    title: (
      <>
        Insights <em>&amp; notes.</em>
      </>
    ),
    intro: "Only “Published” articles are public. Articles marked “legal review pending” carry the draft notice on the site until the firm approves them. Publishing never approves legal review.",
    singular: "article",
    plural: "articles",
    empty: {
      title: E(), slug: "", excerpt: E(), body: E(), author: E(), cover: {}, category: { en: "Legal Updates", ar: "مستجدات قانونية" },
      publishedOn: null, readingTime: E(), seoTitle: E(), seoDescription: E(), status: "draft", legalReview: "pending", verify: [], _translation: {},
    },
    summary: (n: InsightRecord) => ({
      title: both(n.title),
      sub: `${n.category.en || n.category.ar} · ${formatDate(n.publishedOn)}`,
      published: n.status === "published",
      badges: [
        ...(n.status === "review" ? [{ text: "In review", tone: "gold" as const }] : []),
        n.legalReview === "approved" ? { text: "Legally reviewed", tone: "outline" as const } : { text: "Legal review pending", tone: "muted" as const },
      ],
      href: `/ar/insights/${n.slug}`,
    }),
    preview: (n: InsightRecord) => `/insights/${n.slug}`,
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
    plural: "values",
    empty: { title: E(), body: E(), published: true, _translation: {} },
    summary: (v: FirmValue) => ({ title: both(v.title), published: v.published }),
    preview: () => "/about",
  },
  navigation: {
    base: "/admin/navigation",
    eyebrow: "Site",
    title: (
      <>
        Navigation <em>&amp; footer.</em>
      </>
    ),
    intro: "Menu links appear in the header, the mobile menu and the footer, in both languages.",
    singular: "link",
    plural: "links",
    toggle: ["Show", "Hide"],
    empty: { label: E(), href: "/", visible: true },
    summary: (n: NavItem) => ({ title: both(n.label), sub: n.href, published: n.visible }),
  },
};

/** Translation badges for a record. */
function TranslationBadges({ collection, record }: { collection: CollectionKey; record: Record<string, unknown> }) {
  const state = completeness(collectionFields[collection], record, (record.translations ?? {}) as Record<string, string>);
  return (
    <span className={styles.statusGrid}>
      {(["ar", "en"] as const).map((lang) => {
        const s = state[lang];
        return (
          <span key={lang} className={`${styles.badge} ${s.complete ? styles.badgeOutline : s.missing ? styles.badgeDanger : styles.badgeMuted}`}>
            {lang.toUpperCase()} {s.complete ? "✓" : s.missing ? `${s.missing} missing` : "review"}
          </span>
        );
      })}
    </span>
  );
}

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
            <th>Translation</th>
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
                  <TranslationBadges collection={collection} record={row as unknown as Record<string, unknown>} />
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
  const initial = record
    ? { ...(record as Record<string, unknown>), _translation: (record as { translations?: unknown }).translations ?? {} }
    : config.empty;
  const s = record ? config.summary(record as never) : null;

  return (
    <>
      <Link href={config.base} className={styles.back}>
        ← All {config.plural}
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
          previewPath={record && config.preview ? config.preview(record as never) : undefined}
          translationBar={collection !== "navigation" ? true : undefined}
        />
      </Panel>
    </>
  );
}
