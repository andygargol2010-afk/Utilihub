"use client";
// Part 2 of 3 — split from EchoWaveSignature.tsx on 2026-11-04. Edit here; EchoWaveSignature.tsx re-exports.

export interface Ripple {
  x: number;
  y: number;
  age: number;
  strength: number;
}

export const labels = {
  en: {
    message: "Your name or phrase",
    placeholder: "Echo Wave",
    layers: "Wave layers",
    amplitude: "Amplitude",
    speed: "Animation speed",
    help: "Type text. Unique multi-layer sine waves from character frequencies and hash. Click or drag to pluck ripples that interfere.",
    download: "Download PNG",
    share: "Share",
    copy: "Copy link",
    copied: "Copied!",
    clear: "Clear ripples",
  },
  es: {
    message: "Tu nombre o frase",
    placeholder: "Onda Eco",
    layers: "Capas de onda",
    amplitude: "Amplitud",
    speed: "Velocidad",
    help: "Escribí texto. Ondas sinusoidales multicapa únicas a partir de frecuencias de caracteres y hash. Clic o arrastrá para crear ondas que interfieren.",
    download: "Descargar PNG",
    share: "Compartir",
    copy: "Copiar enlace",
    copied: "¡Copiado!",
    clear: "Limpiar ondas",
  },
};

export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function hslFromHash(h: number, offset: number = 0): string {
  const hue = (h + offset * 37) % 360;
  return `hsl(${hue}, 75%, 55%)`;
}

export function buildFreqs(txt: string): number[] {
  const freqs: number[] = [];
  const len = Math.max(1, txt.length);
  for (let i = 0; i < len; i++) {
    freqs.push(0.5 + (txt.charCodeAt(i % txt.length) % 20) * 0.05);
  }
  return freqs;
}
