// Part 2 of 3 — split from ConverterTool.tsx on 2026-11-04. Edit here; ConverterTool.tsx re-exports.

export const sets: Record<string, string[]> = {
  area: ["m²", "km²", "ft²", "acres", "ha"],
  volume: ["L", "mL", "gal", "m³"],
  speed: ["km/h", "mph", "m/s", "kn"],
  energy: ["J", "cal", "kWh", "BTU"],
  power: ["W", "kW", "hp"],
  pressure: ["Pa", "bar", "atm", "psi"],
  frequency: ["Hz", "kHz", "MHz", "GHz"],
  data: ["bit", "byte", "KB", "MB", "GB", "TB"],
};
export const hexToRgb = (v: string) => {
  const h = v.replace(/^#/, "");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
};
export const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};
