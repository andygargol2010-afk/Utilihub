import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { type Locale, staticEquivalent, needsHardNav } from "./LanguageSwitcher.part1";
import { lookupFallback, resolveCatalogPath } from "./LanguageSwitcher.part2";

export function LanguageSwitcher({ locale, onClick }: { locale: "en" | "es"; onClick?: () => void }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const targetLocale: Locale = locale === "en" ? "es" : "en";
  const staticTarget = staticEquivalent(pathname, targetLocale);
  const [target, setTarget] = useState(staticTarget ?? lookupFallback(pathname, targetLocale));

  useEffect(() => {
    if (staticTarget) {
      setTarget(staticTarget);
      return;
    }
    let cancelled = false;
    setTarget(lookupFallback(pathname, targetLocale));
    void resolveCatalogPath(pathname, targetLocale).then((href) => {
      if (!cancelled) setTarget(href);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, staticTarget, targetLocale]);

  const hard = needsHardNav(pathname);
  const label = locale === "en" ? "Español" : "English";
  const aria = locale === "en" ? "Ver UtiliHub en español" : "View UtiliHub in English";
  const className =
    "ml-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/15";

  if (hard || staticTarget == null) {
    return (
      <a
        href={target}
        onClick={(event) => {
          onClick?.();
          if (staticTarget) return;
          if (target !== lookupFallback(pathname, targetLocale)) return;
          event.preventDefault();
          void resolveCatalogPath(pathname, targetLocale).then((href) => {
            window.location.assign(href);
          });
        }}
        aria-label={aria}
        className={className}
      >
        {label}
      </a>
    );
  }

  return (
    <Link to={target as never} onClick={onClick} aria-label={aria} className={className}>
      {label}
    </Link>
  );
}
