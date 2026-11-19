/** Portuguese footer — plain anchors only (same hydration rule as SiteFooter). */
import { PT_CATEGORIES, PT_CHROME as T, PT_INFO } from "@/lib/i18n/pt-site-chrome";

export function PortugueseSiteFooter() {
  const col = (label: string, aria: string, items: readonly { href: string; label: string }[]) => (
    <div>
      <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">{label}</p>
      <nav aria-label={aria} className="mt-3 grid gap-2">
        {items.map((item) => (
          <a key={item.href} href={item.href} className="w-fit text-sm font-semibold hover:text-primary">
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
  return (
    <footer className="mt-16 border-t border-border/70 bg-surface/55">
      <div className="container-page grid gap-10 py-10 sm:grid-cols-[1.4fr_1fr_1fr] sm:py-12">
        <div>
          <a href="/pt" className="flex min-h-11 items-center gap-2 font-extrabold tracking-tight">
            <img src="/page-logo-96.webp" alt="" width={32} height={32} loading="lazy" decoding="async" fetchPriority="low" className="brand-mark size-8" />
            UtiliHub
          </a>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{T.footerBlurb}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[.16em] text-primary">{T.footerBadge}</p>
        </div>
        {col(T.explore, T.explore, PT_CATEGORIES)}
        {col("UtiliHub", T.info, [...PT_INFO, { href: "/", label: "Versão em inglês" }, { href: "/es", label: "Versão em espanhol" }])}
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-border/70 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} UtiliHub</span>
        <span>{T.footerNote}</span>
      </div>
    </footer>
  );
}
