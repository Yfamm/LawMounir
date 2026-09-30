import type { Metadata } from "next";
import { CollectionEditor } from "@/components/admin/collections";
import { requireAdmin } from "@/lib/cms/auth";

export const metadata: Metadata = { title: "Practice Areas" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  return <CollectionEditor collection="practice" id={id} />;
}
