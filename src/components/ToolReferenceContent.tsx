import { referenceLinks, toolReference } from "@/lib/tool-reference";

/** Quick-reference table, formula and worked examples for tools that have them. */
export function ToolReferenceContent({ slug, locale }: { slug: string; locale: "en" | "es" }) {
  const ref = toolReference(slug);
  if (!ref) return null;
  const t = (x: { en: string; es: string }) => x[locale];
  const examplesTitle = locale === "es" ? "Ejemplos resueltos" : "Worked examples";
  return (
    <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_.9fr]" aria-label={t(ref.table.caption)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="mb-3 text-left text-base font-bold">{t(ref.table.caption)}</caption>
          <thead>
            <tr className="border-b border-border">
              {ref.table.headers.map((h) => (
                <th key={h.en} scope="col" className="py-2 pr-4 text-left font-semibold">
                  {t(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ref.table.rows.map((row) => (
              <tr key={row.en.join("|")} className="border-b border-border/60">
                {row[locale].map((cell, i) => (
                  <td key={i} className="py-2 pr-4 tabular-nums text-muted-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-bold">{t(ref.formula.title)}</h3>
          <ul className="mt-3 space-y-2">
            {ref.formula.lines.map((line) => (
              <li key={line.en} className="text-sm leading-6 text-muted-foreground">
                {t(line)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-base font-bold">{examplesTitle}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {ref.examples.map((ex) => (
              <li key={ex.en} className="text-sm leading-6 text-muted-foreground">
                {t(ex)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** "See also" links from related pages to the reference tools (canonical URLs). */
export function ToolReferenceLinks({ slug, locale }: { slug: string; locale: "en" | "es" }) {
  const links = referenceLinks(slug);
  if (!links.length) return null;
  return (
    <nav className="mt-8 max-w-3xl" aria-label={locale === "es" ? "Ver también" : "See also"}>
      <h3 className="text-base font-bold">{locale === "es" ? "Ver también" : "See also"}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.en}>
            <a
              href={l[locale]}
              className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              {locale === "es" ? l.nameEs : l.nameEn}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
