import { lazy, Suspense } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import { ToolUiFallback } from "@/components/ToolUiFallback";

const HouseModeler3D = lazy(() => import("./HouseModeler3D").then((m) => ({ default: m.HouseModeler3D })));
const Modeler3D = lazy(() => import("./Modeler3D").then((m) => ({ default: m.Modeler3D })));

/**
 * Separate entry so tool pages that are not 3D studios never download the
 * module that points at HouseModeler3D / Modeler3D (and three.js).
 * Graphic quality is unchanged: same components, Sky, and textures.
 */
export function Studio3d({ slug, locale }: { slug: string; locale: "en" | "es" }) {
  const tool = GENERAL_TOOLS.find((item) => item.slug === slug);
  if (!tool) {
    return (
      <p role="alert" className="text-muted-foreground">
        {locale === "es" ? "Estudio no disponible." : "Studio not available."}
      </p>
    );
  }
  const Comp = slug === "modelador-casas-3d" ? HouseModeler3D : Modeler3D;
  return (
    <Suspense fallback={<ToolUiFallback locale={locale} />}>
      <Comp tool={tool} locale={locale} />
    </Suspense>
  );
}
