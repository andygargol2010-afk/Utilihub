/** Static footer. Plain anchors only — never typed TanStack Links here.
 *  Root mounts this on every route; a Link to a path missing from routeTree.gen
 *  throws during client hydration and surfaces as "We could not load this page".
 */
const FEATURED = [
  { href: "/finance", label: "Finance" },
  { href: "/category/text", label: "Text" },
  { href: "/category/design", label: "Design & color" },
  { href: "/category/security", label: "Security" },
] as const;

const INFO = [
  { href: "/tools", label: "All tools" },
  { href: "/games", label: "Games" },
  { href: "/simulators", label: "Simulators" },
  { href: "/kits", label: "Goal-based kits" },
  { href: "/hubs/documents-and-files", label: "Documents & files" },
  { href: "/about", label: "About" },
  { href: "/legal", label: "Legal notice" },
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-surface/55">
      <div className="container-page grid gap-10 py-10 sm:grid-cols-[1.4fr_1fr_1fr] sm:py-12">
        <div>
          <a href="/" className="flex min-h-11 items-center gap-2 font-extrabold tracking-tight">
            <img
              src="/page-logo-96.webp"
              alt=""
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="brand-mark size-8"
            />
            UtiliHub
          </a>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Free online tools to calculate, convert, and get things done without the hassle.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[.16em] text-primary">
            No signup · Local privacy
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">Explore</p>
          <nav aria-label="Featured categories" className="mt-3 grid gap-2">
            {FEATURED.map((category) => (
              <a key={category.href} href={category.href} className="w-fit text-sm font-semibold hover:text-primary">
                {category.label}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">UtiliHub</p>
          <nav aria-label="Information" className="mt-3 grid gap-2">
            {INFO.map((item) => (
              <a key={item.href} href={item.href} className="w-fit text-sm font-semibold hover:text-primary">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-border/70 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} UtiliHub</span>
        <span>Built to solve problems, not create them.</span>
      </div>
    </footer>
  );
}
