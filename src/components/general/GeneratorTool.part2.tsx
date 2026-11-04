// Part 2 of 3 — split from GeneratorTool.tsx on 2026-11-04. Edit here; GeneratorTool.tsx re-exports.
import { randomInt, makeCode, shuffle } from "./GeneratorTool.part1";

export function generate(slug: string, input: string): string {
  switch (slug) {
    case "generador-numeros": {
      const [min, max] = input.split(/[,;\s]+/).map(Number);
      if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) throw new Error("Enter a valid minimum and maximum.");
      return String(randomInt(Math.ceil(min), Math.floor(max)));
    }
    case "generador-dados": {
      const [sidesRaw, countRaw] = input.split(/[,;\s]+/).map(Number);
      const sides = Number.isFinite(sidesRaw) ? Math.trunc(sidesRaw) : 6;
      const count = Number.isFinite(countRaw) ? Math.trunc(countRaw) : 1;
      if (sides < 2 || sides > 10000 || count < 1 || count > 100) throw new Error("Use between 2 and 10,000 sides and between 1 and 100 dice.");
      return Array.from({ length: count }, () => randomInt(1, sides)).join(" · ");
    }
    case "generador-pin": {
      const length = input.trim() ? Math.trunc(Number(input)) : 6;
      if (!Number.isInteger(length) || length < 1 || length > 32) throw new Error("Length must be between 1 and 32.");
      return Array.from({ length }, () => String(randomInt(0, 9))).join("");
    }
    case "generador-codigos": {
      const length = input.trim() ? Math.trunc(Number(input)) : 12;
      if (!Number.isInteger(length) || length < 1 || length > 128) throw new Error("Length must be between 1 and 128.");
      return makeCode(length);
    }
    case "sorteo": {
      const items = input.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
      if (!items.length) throw new Error("Enter at least one item, one per line.");
      return items[randomInt(0, items.length - 1)];
    }
    case "lista-aleatoria": {
      const items = input.split(/\r?\n/).filter((x) => x.length > 0);
      if (!items.length) throw new Error("Enter at least one item, one per line.");
      return shuffle(items).join("\n");
    }
    case "generador-nombres": {
      const first = ["Alex", "Andrea", "Bruno", "Clara", "Diego", "Elena", "Lucas", "Mia", "Nora", "Sofia"];
      const last = ["Rivera", "Torres", "Vega", "Silva", "Molina", "Rojas", "Navarro", "Paz"];
      return `${first[randomInt(0, first.length - 1)]} ${last[randomInt(0, last.length - 1)]}`;
    }
    case "generador-usuarios": {
      const words = ["pixel", "nova", "orbit", "code", "matrix", "luna", "byte", "zen"];
      return `${words[randomInt(0, words.length - 1)]}${randomInt(10, 9999)}`;
    }
    case "datos-prueba":
      return JSON.stringify({ id: randomInt(1000, 999999), name: "Test user", email: `test${randomInt(100, 9999)}@example.com` }, null, 2);
    case "lorem-ipsum":
      return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat, nisl at tincidunt consequat, sapien justo commodo urna, vitae posuere neque libero vitae erat. Sed euismod, justo at tincidunt pharetra, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.";
    default:
      throw new Error(`Generator not implemented: ${slug}`);
  }
}
