/**
 * Content migration: copies the bilingual DIWAN source content
 * (src/lib/cms/defaults.ts, built from src/content/*) into Supabase —
 * settings, navigation, every page section and the interface text, values,
 * the six confirmed practice areas (with sources and VERIFY notes), the
 * placeholder team and the sample insights (published, legal review
 * pending). Arabic and English are both seeded; Arabic translations of
 * English copy are flagged "needs review".
 *
 * For a database seeded BEFORE the bilingual upgrade, use
 * `npm run cms:backfill-ar` instead — it fills Arabic without overwriting.
 *
 *   npm run cms:seed            seeds an empty database; refuses if already seeded
 *   npm run cms:seed -- --force replaces all CMS content (never enquiries, media or admins)
 */
import {
  defaultInsights,
  defaultNavigation,
  defaultPeople,
  defaultPracticeAreas,
  defaultSections,
  defaultSettings,
  defaultValues,
} from "../../src/lib/cms/defaults";
import { insightToRow, navToRow, personToRow, practiceToRow, valueToRow } from "../../src/lib/cms/records";
import { adminClient } from "./env";

const force = process.argv.includes("--force");
const db = adminClient();

async function run(label: string, promise: PromiseLike<{ error: { message: string } | null }>) {
  const { error } = await promise;
  if (error) {
    console.error(`✗ ${label}: ${error.message}`);
    process.exit(1);
  }
  console.log(`✓ ${label}`);
}

const ALL = "00000000-0000-0000-0000-000000000000";

async function main() {
  const { data: existing, error } = await db.from("site_settings").select("id").eq("id", 1).maybeSingle();
  if (error) {
    console.error(`Could not reach the database: ${error.message}`);
    process.exit(1);
  }
  if (existing && !force) {
    console.log("The CMS is already seeded. Use --force to replace all CMS content with the source content.");
    return;
  }

  if (force) {
    for (const table of ["navigation_items", "firm_values", "practice_areas", "people", "insights"]) {
      await run(`clear ${table}`, db.from(table).delete().neq("id", ALL));
    }
    await run("clear page_sections", db.from("page_sections").delete().neq("key", ""));
  }

  await run("site settings", db.from("site_settings").upsert({ id: 1, data: defaultSettings }));
  await run(
    `page sections (${Object.keys(defaultSections).length})`,
    db.from("page_sections").upsert(Object.entries(defaultSections).map(([key, data]) => ({ key, data, enabled: true }))),
  );
  await run(
    `navigation (${defaultNavigation.length})`,
    db.from("navigation_items").insert(defaultNavigation.map((n) => ({ ...navToRow(n), sort_order: n.sortOrder }))),
  );
  await run(
    `values (${defaultValues.length})`,
    db.from("firm_values").insert(defaultValues.map((v) => ({ ...valueToRow(v), sort_order: v.sortOrder }))),
  );
  await run(
    `practice areas (${defaultPracticeAreas.length})`,
    db.from("practice_areas").insert(defaultPracticeAreas.map((a) => ({ ...practiceToRow(a), sort_order: a.sortOrder }))),
  );
  await run(
    `people (${defaultPeople.length} placeholders)`,
    db.from("people").insert(defaultPeople.map((p) => ({ ...personToRow(p), sort_order: p.sortOrder }))),
  );
  await run(
    `insights (${defaultInsights.length}, legal review pending)`,
    db.from("insights").insert(defaultInsights.map((n) => ({ ...insightToRow(n), sort_order: n.sortOrder }))),
  );
  console.log("\nDone. Public pages pick this up on their next regeneration (≤ 5 minutes) or immediately after any admin save.");
}

main();
