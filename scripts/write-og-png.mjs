/** Writes a 1200×630 PNG for Open Graph (no external binary in git). */
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
// #071a24
const r = 7,
  g = 26,
  b = 36;
const rows = Buffer.alloc((w * 3 + 1) * h);
for (let y = 0; y < h; y++) {
  const o = y * (w * 3 + 1);
  rows[o] = 0;
  for (let x = 0; x < w; x++) {
    const i = o + 1 + x * 3;
    rows[i] = r;
    rows[i + 1] = g;
    rows[i + 2] = b;
  }
}
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
