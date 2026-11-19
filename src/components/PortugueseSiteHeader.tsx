import { useEffect, useState } from "react";
import { useLocation, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { linkClass } from "./SiteHeader.part1";
import { mobileLink, mobileMuted } from "./SiteHeader.part2";
import { PT_CATEGORIES, PT_CHROME as T, PT_NAV } from "@/lib/i18n/pt-site-chrome";

/** Plain anchors only (same hydration rule as SiteFooter). */
type Alt = { en: string; es: string };

function hrefOf(link: { href?: string }) {
  return (link.href ?? "").replace(/^https?:\/\/[^/]+/, "") || "/";
}

/** EN/ES targets from the page's own hreflang alternates (route head), falling back to the home pages. */
function useAlternates(): Alt {
  const links = useRouterState({
    select: (s) => s.matches.flatMap((m) => ((m as unknown as { links?: { rel?: string; hrefLang?: string; href?: string }[] }).links ?? [])),
  });
  const fromHead = (lang: string) => links.find((l) => l.rel === "alternate" && l.hrefLang === lang);
  const [alt, setAlt] = useState<Alt>({ en: fromHead("en") ? hrefOf(fromHead("en")!) : "/", es: fromHead("es") ? hrefOf(fromHead("es")!) : "/es" });
  const pathname = useLocation({ select: (l) => l.pathname });
  useEffect(() => {
    const q = (lang: string) => document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${lang}"]`);
    const en = q("en");
    const es = q("es");
    setAlt({ en: en ? hrefOf({ href: en.href }) : "/", es: es ? hrefOf({ href: es.href }) : "/es" });
  }, [pathname]);
  return alt;
}

function LanguagePicker() {
  const alt = useAlternates();
  const pill = "rounded-full px-2.5 py-2 text-xs font-bold";
  return (
    <div role="group" aria-label={T.language} className="ml-1 flex items-center rounded-full border border-primary/40 bg-primary/10 p-0.5">
      <a href={alt.en} hrefLang="en" lang="en" className={`${pill} text-primary hover:bg-primary/15`} aria-label="View UtiliHub in English">
        EN
      </a>
      <a href={alt.es} hrefLang="es" lang="es" className={`${pill} text-primary hover:bg-primary/15`} aria-label="Ver UtiliHub en español">
        ES
      </a>
      <span aria-current="true" className={`${pill} bg-primary text-primary-foreground`}>
        PT
      </span>
    </div>
  );
}

export function PortugueseSiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useLocation({ select: (l) => l.pathname });
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <a href="/pt" className="brand-lockup flex min-h-11 min-w-0 items-center gap-2.5" aria-label={T.homeAria}>
          <img src="/page-logo-96.webp" alt="" width={36} height={36} decoding="async" fetchPriority="low" className="brand-mark size-9 shrink-0" />
          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold tracking-tight">UtiliHub</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground sm:block">{T.tagline}</span>
          </span>
        </a>

        <nav aria-label={T.mainNav} className="site-nav hidden items-center gap-0.5 lg:flex">
          {PT_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active(item.href) ? "page" : undefined}
              className={`${linkClass} ${active(item.href) ? "bg-accent text-primary ring-1 ring-primary/70" : ""}`}
            >
              {item.label}
            </a>
          ))}
          <LanguagePicker />
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LanguagePicker />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl border border-border bg-card shadow-sm"
            aria-expanded={open}
            aria-label={open ? T.closeMenu : T.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label={T.mobileNav} className="border-t border-border bg-background lg:hidden">
          <div className="container-page grid gap-1 py-2">
            <a href="/pt" onClick={() => setOpen(false)} className={mobileLink}>
              {T.home}
            </a>
            {PT_NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className={mobileLink}>
                {item.label}
              </a>
            ))}
            <p className="mt-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{T.categories}</p>
            {PT_CATEGORIES.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className={mobileMuted}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
