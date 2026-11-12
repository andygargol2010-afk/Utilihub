import { SITE_URL } from "@/lib/seo";
import { computeStreaks, countDone, lastDays, type DoneMap } from "@/lib/daily-challenge/logic";

export type ShareSnapshot = { current: number; best: number; bits: string; today: string };

/** Build a compact snapshot (28 chars of 0/1, oldest first) from the done map. */
export function buildSnapshot(done: DoneMap, today: string): ShareSnapshot {
  const days = lastDays(today, 28);
  const { current, best } = computeStreaks(done, today);
  return { current, best, today, bits: days.map((d) => (done[d] ? "1" : "0")).join("") };
}

export function shareUrl(snap: ShareSnapshot, path: string): string {
  const q = new URLSearchParams({ s: String(snap.current), b: String(snap.best), d: snap.bits, t: snap.today });
  return `${SITE_URL}${path}?${q.toString()}`;
}

/** Parse a shared link; returns null when anything looks off. */
export function parseSnapshot(search: string): ShareSnapshot | null {
  const q = new URLSearchParams(search);
  const s = Number(q.get("s"));
  const b = Number(q.get("b"));
  const d = q.get("d") ?? "";
  const t = q.get("t") ?? "";
  if (!Number.isInteger(s) || !Number.isInteger(b) || s < 0 || b < s || b > 9999) return null;
  if (!/^[01]{28}$/.test(d) || !/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  return { current: s, best: b, bits: d, today: t };
}

export function snapshotCount(snap: ShareSnapshot): number {
  return countDone(
    Object.fromEntries(lastDays(snap.today, 28).filter((_, i) => snap.bits[i] === "1").map((k) => [k, "x"])),
    lastDays(snap.today, 28),
  );
}

/** Draw the branded share card (1080x1080) and return it as a PNG blob. */
export async function renderShareCard(
  snap: ShareSnapshot,
  copy: { title: string; streak: string; best: string; days: string; summary: string },
): Promise<Blob | null> {
  const size = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0b1220";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#22d3ee";
  ctx.font = "700 34px system-ui, sans-serif";
  ctx.fillText("UtiliHub", 70, 100);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 64px system-ui, sans-serif";
  ctx.fillText(copy.title, 70, 190);
  ctx.fillStyle = "#34d399";
  ctx.font = "800 190px system-ui, sans-serif";
  ctx.fillText(String(snap.current), 70, 400);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "600 40px system-ui, sans-serif";
  ctx.fillText(`${copy.streak} (${copy.days})`, 70, 455);
  ctx.fillText(`${copy.best}: ${snap.best} ${copy.days}`, 70, 510);
  const cols = 7;
  const gap = 14;
  const cell = Math.floor((size - 140 - gap * (cols - 1)) / cols);
  for (let i = 0; i < 28; i++) {
    const x = 70 + (i % cols) * (cell + gap);
    const y = 570 + Math.floor(i / cols) * (cell + gap);
    ctx.fillStyle = snap.bits[i] === "1" ? "#10b981" : "#1e293b";
    ctx.beginPath();
    ctx.roundRect(x, y, cell, cell, 14);
    ctx.fill();
  }
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 34px system-ui, sans-serif";
  ctx.fillText(`${snapshotCount(snap)}/28 ${copy.summary}`, 70, 1010);
  ctx.textAlign = "right";
  ctx.fillText("utilihub.net", size - 70, 1010);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}
