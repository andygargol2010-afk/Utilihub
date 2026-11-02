import { createFileRoute } from "@tanstack/react-router";
import { SolarSystemScaleExplorer } from "@/components/playgrounds/SolarSystemScaleExplorer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Explorador de Escala do Sistema Solar | UtiliHub";
const description = cleanDescription(
  "Canvas interativo para explorar tamanhos e distâncias relativos reais do sistema solar. Alterne entre apenas tamanho, apenas distância ou ambos. Arraste planetas, zoom e pan. Sinta o quão longe Netuno realmente está e o quão pequena a Terra é ao lado de Júpiter.",
);

export const Route = createFileRoute("/pt/solar-system-scale-explorer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/solar-system-scale-explorer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/solar-system-scale-explorer") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/solar-system-scale-explorer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/solar-system-scale-explorer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/solar-system-scale-explorer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/solar-system-scale-explorer") },
    ],
  }),
  component: SolarSystemPagePt,
});

function SolarSystemPagePt() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Explorador · Educacional</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Explorador de Escala do Sistema Solar</h1>
        <p className="mt-3 text-muted-foreground">
          Experiência de canvas aberta para sentir os <strong className="font-semibold text-foreground">tamanhos e distâncias relativos reais</strong> do sistema solar. Alterne entre modos apenas tamanho, apenas distância ou ambos. Arraste planetas, zoom e pan. Rótulos e trilhas orbitais ajudam a comparar a Terra com Júpiter (~11× diâmetro) e apreciar que Netuno fica a ~30 UA.
        </p>
      </header>
      <SolarSystemScaleExplorer locale="pt" />

      <section className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-bold text-foreground">Por que a escala do sistema solar é difícil de compreender</h2>
        <p className="mt-2">
          A maioria dos diagramas encolhe as vastas distâncias para que os planetas caibam em uma página. Na realidade, se a Terra for uma bolinha de gude, o Sol é uma grande bola de praia a cerca de 15 metros, e Netuno fica aproximadamente a um quilômetro mais longe. Este explorador mantém as proporções mais próximas da realidade para que você possa dar zoom nas diferenças de tamanho ou se afastar para ver o vazio do espaço.
        </p>
        <p className="mt-2">
          Intenções de busca que esta página responde: “escala do sistema solar”, “comparação de tamanho de planetas”, “quão longe está Netuno”, “Terra vs Júpiter tamanho”.
        </p>
      </section>

      <PlaygroundNextStep currentId="solar-system-scale-explorer" locale="pt" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
