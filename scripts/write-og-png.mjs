/** Writes a 1200×630 branded PNG for Open Graph (no external deps). */
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const w = 1200;
const h = 630;

// 5×7 uppercase glyphs (bit rows top→bottom)
const FONT = {
  U: [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  T: [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  I: [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
  L: [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  H: [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  B: [0x1e, 0x11, 0x11, 0x1e, 0x11, 0x11, 0x1e],
  " ": [0, 0, 0, 0, 0, 0, 0],
  F: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x10],
  R: [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  E: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
  O: [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  N: [0x11, 0x19, 0x15, 0x13, 0x11, 0x11, 0x11],
  L2: [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  S: [0x0f, 0x10, 0x10, 0x0e, 0x01, 0x01, 0x1e],
  A: [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  C: [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e],
  K: [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
};

function setPx(rows, x, y, r, g, b) {
  if (x < 0 || y < 0 || x >= w || y >= h) return;
  const o = y * (w * 3 + 1) + 1 + x * 3;
  rows[o] = r;
  rows[o + 1] = g;
  rows[o + 2] = b;
}

function fillRect(rows, x0, y0, rw, rh, r, g, b) {
  for (let y = y0; y < y0 + rh; y++) {
    for (let x = x0; x < x0 + rw; x++) setPx(rows, x, y, r, g, b);
  }
}

function drawChar(rows, ch, x0, y0, scale, r, g, b) {
  const glyph = FONT[ch] ?? FONT[" "];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 5; col++) {
      if (glyph[row] & (1 << (4 - col))) {
        fillRect(rows, x0 + col * scale, y0 + row * scale, scale, scale, r, g, b);
      }
    }
  }
}

function drawText(rows, text, x0, y0, scale, r, g, b) {
  let x = x0;
  for (const ch of text) {
    drawChar(rows, ch, x, y0, scale, r, g, b);
    x += 6 * scale;
  }
}

const rows = Buffer.alloc((w * 3 + 1) * h);
for (let y = 0; y < h; y++) {
  rows[y * (w * 3 + 1)] = 0;
  // Vertical gradient #071a24 → #0f2740
  const t = y / (h - 1);
  const br = Math.round(7 + t * 8);
  const bg = Math.round(26 + t * 13);
  const bb = Math.round(36 + t * 28);
  for (let x = 0; x < w; x++) setPx(rows, x, y, br, bg, bb);
}

// Left accent bar (brand blue)
fillRect(rows, 0, 0, 16, h, 29, 78, 216);

// Soft card panel
fillRect(rows, 80, 120, 1040, 390, 12, 36, 56);
fillRect(rows, 88, 128, 1024, 374, 15, 42, 68);

// Accent chip
fillRect(rows, 120, 180, 120, 10, 59, 130, 246);

// Wordmark + tagline (bitmap)
drawText(rows, "UTILIHUB", 120, 220, 10, 248, 250, 252);
drawText(rows, "FREE ONLINE TOOLS", 120, 340, 5, 148, 163, 184);

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(w, 0);
ihdr.writeUInt32BE(h, 4);
ihdr[8] = 8;
ihdr[9] = 2;
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(rows, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "og-image.png");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, png);
console.log("wrote", out, png.length, "bytes");
