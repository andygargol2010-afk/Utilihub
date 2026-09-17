import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ToolListBrowser } from "@/components/ToolListBrowser";
import { ALL_TOOLS } from "@/lib/all-tools";
import { absoluteUrl } from "@/lib/seo";
import { spanishToolName, spanishToolPath } from "@/lib/i18n/es";

export const Route = createFileRoute("/es/finanzas/")({
  head: () => ({
    meta: [
      { title: "Calculadoras financieras | UtiliHub" },
      {
        name: "description",
        content:
          "Calculadoras financieras gratuitas para inversiones, ahorro, préstamos, inflación y planificación.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/finanzas") },
      { property: "og:title", content: "Calculadoras financieras | UtiliHub" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/finanzas") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/finanzas") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/finance") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/finance") },
    ],
  }),
  component: SpanishFinanceIndex,
});

function SpanishFinanceIndex() {
  const tools = ALL_TOOLS.filter((tool) => tool.category === "finanzas");
  const browseItems = tools.map((tool) => ({
    id: tool.slug,
    name: spanishToolName(tool),
    searchText: `${tool.summary} ${tool.description ?? ""} ${(tool.keywords ?? []).join(" ")}`,
    tool,
  }));

  return (
    <main className="container-page py-6 sm:py-8">
      <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Finanzas</p>
      <h1 className="mt-2 text-2xl font-black sm:text-3xl">Calculadoras financieras</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Analizá inversiones, ahorro, préstamos, inflación y otros escenarios con cálculos en el navegador.
      </p>

      <div className="mt-5">
        <ToolListBrowser
          tools={browseItems}
          locale="es"
          searchPlaceholder="Buscar calculadoras financieras…"
          renderItem={(item) => (
            <Link
              to={spanishToolPath(item.tool) as "/es/finanzas/$slug"}
              className="flex min-h-14 items-center gap-3 py-2"
            >
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-xs font-black text-primary"
              >
                F
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{item.name}</span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  Calculadora financiera gratuita
                </span>
              </span>
            </Link>
          )}
        />
      </div>
    </main>
  );
}
