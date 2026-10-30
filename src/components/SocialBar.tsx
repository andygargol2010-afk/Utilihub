import { useEffect, useMemo, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Check, Link2, Share2 } from "lucide-react";

/** Paths where a sticky share bar would fight the navbar / browsing UI. */
function isNavigationPath(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";
  if (p === "/" || p === "/es") return true;
  if (p === "/tools" || p === "/herramientas" || p === "/es/herramientas") return true;
  if (p === "/finance" || p === "/finanzas" || p === "/es/finanzas") return true;
  if (p === "/kits" || p.startsWith("/kits/")) return true;
  if (p.startsWith("/category/") || p.startsWith("/categoria/")) return true;
  if (p.startsWith("/hubs/")) return true;
  if (p.startsWith("/education/") || p.startsWith("/educacion/")) return true;
  if (
    p === "/contact" ||
    p === "/contacto" ||
    p === "/privacy" ||
    p === "/privacidad" ||
    p === "/legal" ||
    p === "/aviso-legal"
  )
    return true;
  return false;
}

/** Tool detail pages + interactive experiences (games, playgrounds, simulators, studios). */
function isToolLikePath(pathname: string): boolean {
  if (isNavigationPath(pathname)) return false;
  const p = pathname;
  if (p.startsWith("/tools/")) return true;
  if (p.startsWith("/herramientas/")) return true;
  if (p.startsWith("/es/herramientas/")) return true;
  if (p.startsWith("/finance/")) return true;
  if (p.startsWith("/finanzas/")) return true;
  if (p.startsWith("/es/finanzas/")) return true;
  if (p.startsWith("/games")) return true;
  if (p.startsWith("/playgrounds")) return true;
  if (p.startsWith("/simulators")) return true;
  if (p.startsWith("/studios")) return true;
  // Standalone interactive experiences on the live site (e.g. /n-body-gravity-sim)
  const knownInteractive =
    /^\/(n-body-gravity-sim|aura-card|neon-layer-composer|prism-trail-composer|aurora-particle-playground|solar-system-scale-explorer|pulse-catch|color-cascade-fusion|return-streak-board|daily-progress-constellation)(\/|$)/;
  if (knownInteractive.test(p)) return true;
  return false;
}

function buildShareUrl(url: string, title: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return {
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
  };
}

export function SocialBar() {
  const { pathname } = useLocation();
  const [pageUrl, setPageUrl] = useState("");
  const [title, setTitle] = useState("UtiliHub");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const visible = isToolLikePath(pathname);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPageUrl(window.location.href.split("#")[0]);
    setTitle(document.title.replace(/\s*[·|]\s*UtiliHub.*$/i, "").trim() || "UtiliHub");
    setOpen(false);
    setCopied(false);
  }, [pathname]);

  const links = useMemo(() => {
    if (!pageUrl) return null;
    return buildShareUrl(pageUrl, title);
  }, [pageUrl, title]);

  if (!visible || !links) return null;

  const isEs = pathname === "/es" || pathname.startsWith("/es/");
  const label = isEs ? "Compartir" : "Share";
  const copiedLabel = isEs ? "Copiado" : "Copied";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const btn =
    "flex size-11 items-center justify-center rounded-full border border-border/80 bg-card text-sm font-bold shadow-md transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div
      className="pointer-events-none fixed bottom-6 right-3 z-40 flex flex-col items-end gap-2 sm:bottom-auto sm:top-28 sm:right-4"
      aria-label={label}
    >
      <div className={`pointer-events-auto flex flex-col items-end gap-2 transition ${open ? "opacity-100" : "opacity-100"}`}>
        {open && (
          <div className="flex flex-col gap-2">
            <a className={btn} href={links.x} target="_blank" rel="noopener noreferrer" title="X / Twitter" aria-label="Share on X">
              𝕏
            </a>
            <a className={btn} href={links.facebook} target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Share on Facebook">
              f
            </a>
            <a className={btn} href={links.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="Share on LinkedIn">
              in
            </a>
            <a className={btn} href={links.whatsapp} target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="Share on WhatsApp">
              WA
            </a>
            <button type="button" className={btn} onClick={copyLink} title={copied ? copiedLabel : label} aria-label={copied ? copiedLabel : label}>
              {copied ? <Check className="size-4 text-primary" /> : <Link2 className="size-4" />}
            </button>
          </div>
        )}
        <button
          type="button"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-expanded={open}
          aria-controls="utilihub-social-bar-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <Share2 className="size-4" />
          <span className="hidden sm:inline">{open ? (isEs ? "Cerrar" : "Close") : label}</span>
        </button>
      </div>
      {open && <div id="utilihub-social-bar-panel" className="sr-only">{label}</div>}
    </div>
  );
}
