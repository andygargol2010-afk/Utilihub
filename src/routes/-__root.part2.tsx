// Part 2 of 3 — split from __root.tsx on 2026-11-04. Edit here; __root.tsx re-exports.
import { useRouter, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { isChunkLoadError } from "@/lib/chunk-errors";
import { useIsSpanish, useIsPortuguese, useIsFrench } from "./-__root.part1";

/**
 * Server-rendered header/main/footer, captured before hydration (the entry
 * module runs after the parser has passed them) and refreshed at
 * DOMContentLoaded so streamed Suspense content is included. If a route chunk
 * fails to load (crawler renderer, flaky network) the root errorComponent shows
 * this markup instead of a full-page error, so Googlebot never sees a soft 404.
 * Only valid for the path it was captured on (not after client navigation).
 */
export let ssrShellHtml: string | null = null;
export let ssrShellPath: string | null = null;

export function captureSsrShell() {
  const main = document.getElementById("main-content");
  if (!main) return;
  if (ssrShellPath !== null && ssrShellPath !== window.location.pathname) return;
  ssrShellPath = window.location.pathname;
  const parts: string[] = [];
  const prev = main.previousElementSibling;
  if (prev?.tagName === "HEADER") parts.push(prev.outerHTML);
  parts.push(main.outerHTML);
  const next = main.nextElementSibling;
  if (next?.tagName === "FOOTER") parts.push(next.outerHTML);
  ssrShellHtml = parts.join("");
}

if (typeof document !== "undefined") {
  captureSsrShell();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", captureSsrShell, { once: true });
  }
}

export const BOT_RE =
  /bot\b|crawler|spider|crawling|Googlebot|Google-InspectionTool|AdsBot|Mediapartners|bingpreview|Slurp|DuckDuck|Baiduspider|YandexBot|facebookexternalhit|Lighthouse/i;

export function isBotVisitor() {
  return typeof navigator !== "undefined" && BOT_RE.test(navigator.userAgent || "");
}

/** One automatic route retry per page load; a second failure keeps the server HTML. */
export let routeRetried = false;

export function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const { pathname } = useLocation();
  const isSpanish = useIsSpanish();
  const isPortuguese = useIsPortuguese();
  const isFrench = useIsFrench();
  const keepServerHtml =
    Boolean(ssrShellHtml) && ssrShellPath === pathname && (isChunkLoadError(error) || isBotVisitor());
  useEffect(() => console.error(error), [error]);
  useEffect(() => {
    if (!keepServerHtml || routeRetried) return;
    routeRetried = true;
    // Not cleared on re-render: the single retry must still fire if reset changes identity.
    setTimeout(() => {
      void router.invalidate().finally(() => reset());
    }, 600);
  }, [keepServerHtml, router, reset]);
  if (keepServerHtml) {
    return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: ssrShellHtml as string }} />;
  }
  const msg = error?.message?.slice(0, 280) || "";
  const stackLine = (error?.stack || "")
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.includes("/") || l.includes(".tsx") || l.includes(".ts") || l.includes(".js"));
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">
          {isSpanish
            ? "No pudimos cargar esta página"
            : isPortuguese
              ? "Não conseguimos carregar esta página"
              : isFrench
                ? "Nous n'avons pas pu charger cette page"
                : "We could not load this page"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSpanish
            ? "Ocurrió un error. Puedes intentarlo de nuevo o volver al inicio."
            : isPortuguese
              ? "Ocorreu um erro. Você pode tentar novamente ou voltar ao início."
              : isFrench
                ? "Une erreur s'est produite. Vous pouvez réessayer ou retourner à l'accueil."
                : "An error occurred. You can try again or go back home."}
        </p>
        {msg ? (
          <pre className="mt-4 max-h-32 overflow-auto rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-[11px] leading-snug text-muted-foreground">
            {msg}
            {stackLine ? `\n${stackLine}` : ""}
          </pre>
        ) : null}
        <div className="mt-6 flex justify-center gap-2">
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            {isSpanish ? "Reintentar" : isPortuguese ? "Tentar novamente" : isFrench ? "Réessayer" : "Try again"}
          </button>
          <a href={isSpanish ? "/es" : isPortuguese ? "/pt" : isFrench ? "/fr" : "/"} className="rounded-lg border border-input px-4 py-2 text-sm font-semibold">
            {isSpanish ? "Inicio" : isPortuguese ? "Início" : isFrench ? "Accueil" : "Home"}
          </a>
        </div>
      </div>
    </div>
  );
}
