/**
 * Standalone harness page for Fightersland (bundled by dev/harness.mjs, never by the site).
 * Mimics the site layout: a sticky 64 px `header.site-header` above the game. `?lang=es|pt`
 * switches the locale, `?fldebug=1` enables the debug overlay and `window.__FL__`.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { Locale } from "../core/types";
import { FighterslandGame } from "../index";

function readLocale(): Locale {
  const v = new URLSearchParams(window.location.search).get("lang");
  return v === "es" || v === "pt" ? v : "en";
}

function Harness({ locale }: { locale: Locale }) {
  return (
    <>
      <header
        className="site-header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          background: "rgba(248,249,252,.95)",
          borderBottom: "1px solid #e5e7eb",
          color: "#1a1d2e",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 700,
        }}
      >
        UtiliHub · harness
      </header>
      <main style={{ maxWidth: 960, margin: "24px auto", padding: "0 16px", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: 28 }}>Fightersland</h1>
        <div style={{ background: "#0f0b1a", borderRadius: 16, padding: 12 }}>
          <FighterslandGame locale={locale} />
        </div>
        <p style={{ height: 1200 }}>Page content below the game (scroll must be locked while the stage is open).</p>
      </main>
    </>
  );
}

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(
    <StrictMode>
      <Harness locale={readLocale()} />
    </StrictMode>,
  );
}
