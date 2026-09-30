import type { Metadata } from "next";
import { CollectionIndex } from "@/components/admin/collections";
import { requireAdmin } from "@/lib/cms/auth";

export const metadata: Metadata = { title: "Practice Areas" };

export default async function Page() {
  await requireAdmin();
  return <CollectionIndex collection="practice" />;
}
