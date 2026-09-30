import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { supabaseConfigured } from "@/lib/supabase/env";
import { sessionClient } from "@/lib/supabase/server";

export type AdminSession = {
  userId: string;
  email: string;
  role: "admin" | "editor";
};

/**
 * The signed-in admin, verified with Supabase Auth (getUser validates the
 * JWT with the auth server) and checked against admin_users. Null when the
 * visitor is not signed in or is not an admin.
 */
export const getAdmin = cache(async (): Promise<AdminSession | null> => {
  if (!supabaseConfigured()) return null;
  const db = await sessionClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;
  const { data } = await db.from("admin_users").select("role, email").eq("user_id", user.id).maybeSingle();
  if (!data) return null;
  return { userId: user.id, email: String(data.email ?? user.email ?? ""), role: data.role === "editor" ? "editor" : "admin" };
});

/** For admin pages: redirects to the login page unless an admin is signed in. */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** For server actions and admin API routes: throws unless an admin is signed in. */
export async function assertAdmin(): Promise<AdminSession> {
  const admin = await getAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Not authorized.");
  }
}
