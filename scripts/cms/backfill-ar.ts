/**
 * Bilingual upgrade for a database seeded before Arabic support.
 *
 * Fills EMPTY Arabic fields from the DIWAN source content and converts page
 * sections / settings stored in the old single-language shape to the
 * bilingual shape. It never overwrites a non-empty value, never deletes
 * anything, and never touches enquiries, media files or admins.
 *
 *   npm run cms:backfill-ar              shows what would change (dry run)
 *   npm run cms:backfill-ar -- --apply   writes the changes
 */
import { defaultInsights, defaultNavigation, defaultPracticeAreas, defaultSections, defaultValues, defaultPeople } from "../../src/lib/cms/defaults";
import { normalizeSection, normalizeSettings } from "../../src/lib/cms/normalize";
import type { SectionKey } from "../../src/lib/cms/types";
import { adminClient } from "./env";

const apply = process.argv.includes("--apply");
const db = adminClient();
let changes = 0;

type Row = Record<string, unknown>;

const empty = (v: unknown) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);

/** Only the columns that are empty in the row and non-empty in the source. */
function fill(row: Row, source: Row) {
  const patch: Row = {};
  for (const [k, v] of Object.entries(source)) if (empty(row[k]) && !empty(v)) patch[k] = v;
  return patch;
}

async function update(table: string, id: unknown, patch: Row, label: string) {
  if (!Object.keys(patch).length) return;
  changes++;
  console.log(`• ${table} ${label}: ${Object.keys(patch).join(", ")}`);
  if (!apply) return;
  const { error } = await db.from(table).update(patch).eq("id", id);
  if (error) throw new Error(`${table} ${label}: ${error.message}`);
}

async function rows(table: string) {
  const { data, error } = await db.from(table).select("*");
  if (error) throw new Error(`${table}: ${error.message}`);
  return (data ?? []) as Row[];
}

async function main() {
  // Practice areas — matched by slug.
  for (const r of await rows("practice_areas")) {
    const d = defaultPracticeAreas.find((a) => a.slug === r.slug);
    if (!d) continue;
    await update(
      "practice_areas",
      r.id,
      {
        ...fill(r, {
          title_ar: d.title.ar,
          summary_ar: d.summary.ar,
          overview_ar: d.overview.ar,
          scope_ar: d.scope.ar,
          forums_ar: d.forums.ar,
        }),
        ...(r.translations && Object.keys(r.translations as object).length ? {} : { translations: d.translations }),
      },
      String(r.slug),
    );
  }

  // Insights — matched by slug (titles, excerpts, categories, reading time; bodies stay untranslated).
  for (const r of await rows("insights")) {
    const d = defaultInsights.find((n) => n.slug === r.slug);
    if (!d) continue;
    await update(
      "insights",
      r.id,
      {
        ...fill(r, { title_ar: d.title.ar, excerpt_ar: d.excerpt.ar, category_ar: d.category.ar, reading_time_ar: d.readingTime.ar }),
        ...(r.translations && Object.keys(r.translations as object).length ? {} : { translations: d.translations }),
      },
      String(r.slug),
    );
  }

  // Navigation — matched by link.
  for (const r of await rows("navigation_items")) {
    const d = defaultNavigation.find((n) => n.href === r.href && n.label.en === r.label);
    if (d) await update("navigation_items", r.id, fill(r, { label_ar: d.label.ar }), String(r.href));
  }

  // Values — matched by English title.
  for (const r of await rows("firm_values")) {
    const d = defaultValues.find((v) => v.title.en === r.title_en);
    if (d) await update("firm_values", r.id, fill(r, { title_ar: d.title.ar, body_ar: d.body.ar }), String(r.title_en));
  }

  // People — only untouched placeholders get Arabic placeholders.
  for (const r of await rows("people")) {
    const d = defaultPeople[0];
    if (r.name_en !== d.name.en) continue;
    await update(
      "people",
      r.id,
      fill(r, {
        name_ar: d.name.ar,
        title_ar: r.title_en === d.title.en ? d.title.ar : "",
        practice_ar: r.practice === d.practice.en ? d.practice.ar : "",
        bio_short_ar: r.bio_short === d.bioShort.en ? d.bioShort.ar : "",
      }),
      "placeholder",
    );
  }

  // Page sections — convert old single-language shapes; add new sections.
  const { data: sectionRows, error } = await db.from("page_sections").select("key, data");
  if (error) throw new Error(error.message);
  const stored = Object.fromEntries((sectionRows ?? []).map((r) => [String(r.key), r.data]));
  for (const key of Object.keys(defaultSections) as SectionKey[]) {
    const current = stored[key];
    // home.layout holds no text; it only needs adding when missing.
    const isLegacy =
      current === undefined ||
      (key !== "home.layout" && (JSON.stringify(current).includes('"labelAr"') || !JSON.stringify(current).includes('"ar"')));
    if (!isLegacy) continue;
    const next = normalizeSection(key, stored);
    changes++;
    console.log(`• page_sections ${key}: ${current === undefined ? "added" : "converted to bilingual"}`);
    if (apply) {
      const { error: e } = await db.from("page_sections").upsert({ key, data: next, enabled: true }, { onConflict: "key" });
      if (e) throw new Error(`${key}: ${e.message}`);
    }
  }

  // Site settings — convert the old flat shape.
  const { data: settings } = await db.from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (settings && !JSON.stringify(settings.data).includes('"firmName"')) {
    changes++;
    console.log("• site_settings: converted to bilingual");
    if (apply) {
      const { error: e } = await db.from("site_settings").update({ data: normalizeSettings(settings.data) }).eq("id", 1);
      if (e) throw new Error(`site_settings: ${e.message}`);
    }
  }

  console.log(
    changes === 0
      ? "\nNothing to do — the content is already bilingual."
      : apply
        ? `\n${changes} change(s) applied. Existing text was not overwritten.`
        : `\n${changes} change(s) would be made. Run again with --apply to write them.`,
  );
}

main().catch((e) => {
  console.error(`✗ ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
