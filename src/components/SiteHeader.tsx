import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { linkClass } from "./SiteHeader.part1";
import { activeClass, BROWSE, MORE, mobileLink, mobileMuted } from "./SiteHeader.part2";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const browseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!browseOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (browseRef.current && !browseRef.current.contains(e.target as Node)) {
        setBrowseOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBrowseOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [browseOpen]);

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/" className="brand-lockup flex min-h-11 min-w-0 items-center gap-2.5" aria-label="UtiliHub home">
          <img src="/page-logo-96.webp" alt="" width={36} height={36} decoding="async" fetchPriority="low" className="brand-mark size-9 shrink-0" />
          <span className="min-w-0">
            <span className="block truncate text-[17px] font-bold tracking-tight">UtiliHub</span>
          </span>
        </Link>

        <nav aria-label="Main" className="site-nav hidden items-center gap-0.5 lg:flex">
          <Link to="/tools" className={linkClass} activeProps={activeClass}>
            Tools
          </Link>
          <Link to="/category/advanced-tools" className={linkClass} activeProps={activeClass}>
            Advanced
          </Link>
          <Link to="/games" className={linkClass} activeProps={activeClass}>
            Games
          </Link>
          <Link to="/simulators" className={linkClass} activeProps={activeClass}>
            Simulators
          </Link>

          <div className="relative" ref={browseRef}>
            <button
              type="button"
              className={`gap-1 ${linkClass} ${browseOpen ? "bg-secondary text-foreground" : ""}`}
              aria-expanded={browseOpen}
              aria-haspopup="menu"
              onClick={() => setBrowseOpen((v) => !v)}
            >
              More
              <ChevronDown className={`size-3.5 transition ${browseOpen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {browseOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-1.5 min-w-[13rem] overflow-hidden rounded-lg border border-border bg-card py-1.5 shadow-lg"
              >
                {MORE.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className="block px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                    onClick={() => setBrowseOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="my-1.5 border-t border-border" />
                <p className="px-3.5 pb-1 pt-0.5 text-xs font-medium text-muted-foreground">Categories</p>
                {BROWSE.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className="block px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                    onClick={() => setBrowseOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="my-1.5 border-t border-border" />
                <Link
                  to="/tools"
                  role="menuitem"
                  className="block px-3.5 py-2 text-sm font-medium text-primary hover:bg-secondary"
                  onClick={() => setBrowseOpen(false)}
                >
                  All tools →
                </Link>
              </div>
            )}
          </div>

          <LanguageSwitcher locale="en" />
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LanguageSwitcher locale="en" />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-md border border-border bg-card"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-border bg-background lg:hidden">
          <div className="container-page grid gap-1 py-2">
            <Link to="/" onClick={() => setOpen(false)} className={mobileLink}>
              Home
            </Link>
            <Link to="/tools" onClick={() => setOpen(false)} className={mobileLink}>
              Tools
            </Link>
            <Link to="/category/advanced-tools" onClick={() => setOpen(false)} className={mobileLink}>
              Advanced tools
            </Link>
            <Link to="/kits" onClick={() => setOpen(false)} className={mobileLink}>
              Kits
            </Link>
            <Link to="/simulators" onClick={() => setOpen(false)} className={mobileLink}>
              Simulators
            </Link>
            <Link to="/playgrounds" onClick={() => setOpen(false)} className={mobileLink}>
              Playgrounds
            </Link>
            <Link to="/experiences" onClick={() => setOpen(false)} className={mobileLink}>
              Experiences
            </Link>
            <Link to="/games" onClick={() => setOpen(false)} className={mobileLink}>
              Games
            </Link>
            <p className="mt-2 px-3 text-[13px] font-semibold text-muted-foreground">
              Categories
            </p>
            {BROWSE.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className={mobileMuted}>
                {item.label}
              </a>
            ))}
            <a href="/hubs/documents-and-files" onClick={() => setOpen(false)} className={mobileMuted}>
              Documents
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
