export type Person = {
  /** Stable key for rendering. */
  id: string;
  name: string;
  role: string;
  practice: string;
  bio: string;
  /** Optional portrait, e.g. "/images/people/name.jpg" in public/. Without one, a typographic plate is shown. */
  image?: string;
};

/**
 * PLACEHOLDERS: the firm's lawyers have not been supplied yet. Replace each
 * entry with a real lawyer's confirmed name, title, practice and short bio.
 * Do not add credentials, admissions, results or clients unless verified.
 * Remove or add entries freely — counts on the site follow this list.
 */
const placeholder = (id: string): Person => ({
  id,
  name: "[LAWYER NAME]",
  role: "[TITLE]",
  practice: "[PRACTICE AREA]",
  bio: "[SHORT BIO]",
});

export const people: Person[] = ["01", "02", "03", "04", "05", "06"].map(placeholder);
