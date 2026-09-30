import { Fragment, type ReactNode } from "react";

/**
 * Editor text conventions, shared by the public site, the admin and the
 * seed script.
 */

/** Renders "*word*" as gold-italic emphasis inside a single line. */
export function emphasis(line: string): ReactNode {
  const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);
  if (parts.length === 1 && !/^\*[^*]+\*$/.test(parts[0])) return line;
  return parts.map((part, i) =>
    /^\*[^*]+\*$/.test(part) ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>,
  );
}

/** Splits a display headline into lines (one per row), each with emphasis applied. */
export function headlineLines(text: string): ReactNode[] {
  return splitLines(text).map((line) => emphasis(line));
}

/** Non-empty trimmed lines. */
export function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Words of a statement, with "*word*" marking emphasised words. */
export function statementWords(text: string): { word: string; em: boolean }[] {
  let open = false;
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((token) => {
      if (token.startsWith("*")) open = true;
      const em = open;
      if (/\*[.,;:!?)"”’]*$/.test(token) && (token.length > 1 || !token.startsWith("*"))) open = false;
      return { word: token.replace(/\*/g, ""), em };
    });
}

/** Removes emphasis markers for plain-text uses (metadata, alt text). */
export function plain(text: string): string {
  return splitLines(text).join(" ").replace(/\*/g, "");
}

/** Paragraphs separated by blank lines. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);
}

export type BodyBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

/** Parses an article body: blank-line blocks; "## " heading, "> " quote, "- " list. */
export function parseBody(text: string): BodyBlock[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): BodyBlock => {
      const lines = chunk.split(/\r?\n/).map((l) => l.trim());
      if (lines.every((l) => l.startsWith("- "))) return { type: "list", items: lines.map((l) => l.slice(2).trim()) };
      if (chunk.startsWith("## ")) return { type: "h", text: chunk.slice(3).replace(/\s*\n\s*/g, " ").trim() };
      if (chunk.startsWith("> ")) return { type: "quote", text: lines.map((l) => l.replace(/^>\s?/, "")).join(" ").trim() };
      return { type: "p", text: lines.join(" ") };
    });
}

export function serializeBody(blocks: BodyBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h":
          return `## ${b.text}`;
        case "quote":
          return `> ${b.text}`;
        case "list":
          return b.items.map((i) => `- ${i}`).join("\n");
        default:
          return b.text;
      }
    })
    .join("\n\n");
}

/** True while a value is still a "[PLACEHOLDER]" (or empty). */
export function isPlaceholder(value: string | null | undefined) {
  return !value || /^\[.*\]$/.test(value.trim());
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatDate(iso: string | null) {
  if (!iso) return "[PUBLICATION DATE]";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
