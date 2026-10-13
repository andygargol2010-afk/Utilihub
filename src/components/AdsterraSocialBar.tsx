/**
 * Adsterra Social Bar — DISABLED.
 * The third-party script injected a fixed overlay whose hit-box was larger than
 * the visible chip and intercepted clicks on navbar items (Tools, Advanced,
 * Kits, Simulators, Playgrounds, etc.).
 * Re-enable only with a constrained hit-box strategy; do not re-inject the raw script.
 * In-page Adsterra banners are unaffected.
 */
export function AdsterraSocialBar() {
  return null;
}
