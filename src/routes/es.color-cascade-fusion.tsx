import { createFileRoute } from "@tanstack/react-router";
import { ColorCascadeFusionGame } from "@/components/games/ColorCascadeFusionGame";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Fusi\u00f3n Cascada de Color | UtiliHub";
const description = cleanDescription(
  "Arcade interactivo: fusion\u00e1 orbes de colores que caen haciendo clic en coincidencias adyacentes. Constru\u00ed cadenas, puntu\u00e1 combos y compart\u00ed tu r\u00e9cord. Sin cuentas.",
);

export const Route = createFileRoute("/es/color-cascade-fusion")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/color-cascade-fusion") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/color-cascade-fusion") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/color-cascade-fusion") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/color-cascade-fusion") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/color-cascade-fusion") },
    ],
  }),
  component: ColorCascadePageEs,
});

function ColorCascadePageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Juegos · Fusi\u00f3n arcade</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Fusi\u00f3n Cascada de Color</h1>
        <p className="mt-3 text-muted-foreground">
          Orbes de colores caen por gravedad. Hac\u00e9 clic en colores iguales adyacentes para fusionarlos en orbes m\u00e1s grandes, activar reacciones en cadena y subir la puntuaci\u00f3n. Los niveles aumentan la velocidad. Compart\u00ed tu mejor marca.
        </p>
      </header>
      <ColorCascadeFusionGame locale="es" />
      <PlaygroundNextStep currentId="color-cascade-fusion" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
