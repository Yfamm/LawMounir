/**
 * Creates (or promotes) an administrator. Public sign-up is disabled, so this
 * is the only way to add an admin.
 *
 *   ADMIN_PASSWORD='…' npm run cms:create-admin -- someone@example.com
 *
 * Without ADMIN_PASSWORD a strong random password is generated and printed
 * once. Existing users are added to admin_users without changing their password.
 */
import { randomBytes } from "node:crypto";
import { adminClient } from "./env";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: npm run cms:create-admin -- <email>");
  process.exit(1);
}

const db = adminClient();

function strongPassword() {
  // Guarantees lower, upper and digit (the auth policy) plus length 24.
  return `Dw${randomBytes(18).toString("base64url")}7a`;
}

async function findUser(address: string) {
  for (let page = 1; page < 50; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === address);
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function main() {
  let user = await findUser(email);
  let generated: string | null = null;

  if (!user) {
    const password = process.env.ADMIN_PASSWORD || (generated = strongPassword());
    if (password.length < 12) {
      console.error("ADMIN_PASSWORD must be at least 12 characters, with lower- and upper-case letters and digits.");
      process.exit(1);
    }
    const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true });
    if (error || !data.user) {
      console.error(`Could not create the user: ${error?.message}`);
      process.exit(1);
    }
    user = data.user;
    console.log(`✓ Created user ${email}`);
  } else {
    console.log(`• User ${email} already exists — password unchanged`);
  }

  const { error } = await db.from("admin_users").upsert({ user_id: user.id, email, role: "admin" });
  if (error) {
    console.error(`Could not grant admin access: ${error.message}`);
    process.exit(1);
  }
  console.log(`✓ ${email} is an administrator`);
  if (generated) console.log(`\nGenerated password (shown once — store it securely):\n${generated}\n`);
}

main();
