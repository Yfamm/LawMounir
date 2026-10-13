import type { Metadata } from "next";
import { saveSection } from "@/app/admin/actions";
import { FieldForm } from "@/components/admin/FieldForm";
import { PageHead, Panel } from "@/components/admin/PageHead";
import { adminSections } from "@/lib/cms/admin-data";
import { requireAdmin } from "@/lib/cms/auth";
import { sectionFields } from "@/lib/cms/fields";

export const metadata: Metadata = { title: "Interface text" };

export default async function InterfaceAdmin() {
  await requireAdmin();
  const sections = await adminSections(["ui.strings"]);
  return (
    <>
      <PageHead
        eyebrow="Site"
        title={
          <>
            Interface <em>text.</em>
          </>
        }
        intro="Every button, label, form message, accessibility label and the 404 page, in Arabic and English. Words in {braces} are filled in automatically — keep them as they are."
      />
      <Panel title="Interface text · نصوص الواجهة" meta="ui.strings">
        <FieldForm
          fields={sectionFields["ui.strings"]}
          initial={sections["ui.strings"] as unknown as Record<string, unknown>}
          action={saveSection.bind(null, "ui.strings")}
          previewPath="/"
        />
      </Panel>
    </>
  );
}
