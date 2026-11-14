// Share helpers for the Cellular Automaton Lab: compact URL bit-packing and a branded 1080x1080 PNG card.

export function packBits(cells: Uint8Array): string {
  const bytes = new Uint8Array(Math.ceil(cells.length / 8));
  for (let i = 0; i < cells.length; i++) if (cells[i]) bytes[i >> 3] = (bytes[i >> 3] ?? 0) | (1 << (i & 7));
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function unpackBits(s: string | null, length: number): Uint8Array | null {
  if (!s || !/^[A-Za-z0-9_-]+$/.test(s) || s.length > 2000) return null;
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
    if (bin.length < Math.ceil(length / 8)) return null;
    const out = new Uint8Array(length);
    for (let i = 0; i < length; i++) out[i] = (bin.charCodeAt(i >> 3) >> (i & 7)) & 1;
    return out;
  } catch {
    return null;
  }
}

export function digitsToFlags(s: string | null): boolean[] | null {
  if (s === null || !/^[0-8]*$/.test(s)) return null;
  return Array.from({ length: 9 }, (_, i) => s.includes(String(i)));
}

export function flagsToDigits(f: boolean[]): string {
  return f.map((v, i) => (v ? String(i) : "")).join("");
}

export type CardData = {
  title: string;
  subtitle: string;
  lines: string[];
  cols: number;
  rows: number;
  cells: Uint8Array;
  cell: number;
};

/** Draw the 1080x1080 branded card. `cells` is rows*cols row-major. */
export function drawCard(data: CardData): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 1080;
  c.height = 1080;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = "#22d3ee";
  ctx.font = "bold 54px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(data.title, 72, 110);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "30px system-ui, sans-serif";
  ctx.fillText(data.subtitle, 72, 158);

  const box = 800;
  const ox = (1080 - box) / 2;
  const oy = 190;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(ox, oy, box, box);
  const cw = box / data.cols;
  const ch = box / data.rows;
  ctx.fillStyle = "#22d3ee";
  for (let y = 0; y < data.rows; y++) {
    for (let x = 0; x < data.cols; x++) {
      if (data.cells[y * data.cols + x]) ctx.fillRect(ox + x * cw + 0.5, oy + y * ch + 0.5, cw - 1, ch - 1);
    }
  }
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 3;
  ctx.strokeRect(ox, oy, box, box);

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 34px system-ui, sans-serif";
  ctx.fillText(data.lines.join("  ·  "), 72, 1024);
  ctx.fillStyle = "#64748b";
  ctx.font = "26px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("UtiliHub", 1008, 1058);
  return c;
}

export function downloadCanvas(c: HTMLCanvasElement, filename: string): void {
  const a = document.createElement("a");
  a.href = c.toDataURL("image/png");
  a.download = filename;
  a.click();
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function buildUrl(params: Record<string, string>): string {
  const url = new URL(window.location.href);
  url.search = "";
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}
