// Part 1 of 3 — split from SecurityTool.tsx on 2026-11-04. Edit here; SecurityTool.tsx re-exports.

export async function digest(algorithm: string, text: string) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest(algorithm, data);
  return [...new Uint8Array(hash)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
