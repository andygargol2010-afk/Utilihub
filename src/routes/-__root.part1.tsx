// Part 1 of 3 — split from __root.tsx on 2026-11-04. Edit here; __root.tsx re-exports.
import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

export function useIsSpanish() {
  const { pathname } = useLocation();
  return pathname === "/es" || pathname.startsWith("/es/");
}

export function useIsPortuguese() {
  const { pathname } = useLocation();
  return pathname === "/pt" || pathname.startsWith("/pt/");
}

export function useIsFrench() {
  const { pathname } = useLocation();
  return pathname === "/fr" || pathname.startsWith("/fr/");
}

export function NotFound() {
  const isSpanish = useIsSpanish();
  const isPortuguese = useIsPortuguese();
  const isFrench = useIsFrench();
  useEffect(() => {
    document.title = isSpanish
      ? "Página no encontrada | UtiliHub"
      : isPortuguese
        ? "Página não encontrada | UtiliHub"
        : isFrench
          ? "Page non trouvée | UtiliHub"
          : "Page not found | UtiliHub";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow");
  }, [isSpanish, isPortuguese, isFrench]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-primary">UTILIHUB</p>
        <h1 className="mt-2 text-6xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">
          {isSpanish
            ? "No encontramos esta página."
            : isPortuguese
              ? "Não encontramos esta página."
              : isFrench
                ? "Nous n'avons pas trouvé cette page."
                : "We could not find this page."}
        </p>
        <a
          href={isSpanish ? "/es" : isPortuguese ? "/pt" : isFrench ? "/fr" : "/"}
          className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {isSpanish ? "Ir al inicio" : isPortuguese ? "Ir para o início" : isFrench ? "Aller à l'accueil" : "Go home"}
        </a>
      </div>
    </div>
  );
}
