import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Interés Compuesto Explicado: Fórmulas, Ejemplos y Tabla de Crecimiento | UtiliHub";
const description = cleanDescription(
  "Guía original sobre interés compuesto. Aprende cómo funciona con fórmulas claras, ejemplos prácticos, tabla de crecimiento y visual simple. Enlace a la calculadora gratuita de interés compuesto de UtiliHub.",
);

export const Route = createFileRoute("/es/guias/interes-compuesto")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/guias/interes-compuesto") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/guias/interes-compuesto") },
      ...hreflangLinks("/guides/compound-interest", "/es/guias/interes-compuesto"),
    ],
  }),
  component: CompoundInterestGuideEs,
});

function CompoundInterestGuideEs() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Interés compuesto" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Interés Compuesto Explicado: Cómo Crece Tu Dinero con el Tiempo</h1>
        <p className="lead">
          El interés compuesto es el proceso por el cual el interés genera más interés. Esta guía original explica la idea central con fórmulas claras, ejemplos prácticos, una tabla de crecimiento y un visual simple. Úsala para entender el crecimiento a largo plazo y luego salta a la calculadora gratuita de UtiliHub para modelar tus propios números.
        </p>

        <h2>¿Qué es el interés compuesto?</h2>
        <p>
          El interés simple se calcula solo sobre el capital original. El interés compuesto se calcula sobre el capital más cualquier interés previamente ganado. El resultado es un crecimiento exponencial: cuanto más tiempo y mayor la tasa, más dramática es la diferencia.
        </p>
        <p>
          La fórmula clásica de valor futuro para un capital único es:
        </p>
        <p className="text-center font-mono text-lg">
          A = P × (1 + r)^t
        </p>
        <p>
          Donde A es el monto final, P el capital inicial, r la tasa anual de interés en decimal y t el número de años. Para capitalización más frecuente (mensual, diaria, etc.) la fórmula se convierte en:
        </p>
        <p className="text-center font-mono">
          A = P × (1 + r/n)^(n×t)
        </p>
        <p>
          Aquí n es el número de períodos de capitalización por año.
        </p>

        <h2>Ejemplo práctico</h2>
        <p>
          Supongamos que inviertes $10.000 al 7% de interés anual, capitalizado anualmente, durante 20 años.
        </p>
        <p>
          A = 10000 × (1 + 0.07)^20 ≈ 10000 × 3.8697 ≈ $38.697.
        </p>
        <p>
          A los 30 años la misma inversión alcanza unos $76.123. La segunda década agrega muchos más dólares absolutos que la primera porque el interés ahora se gana sobre una base mayor.
        </p>

        <h2>Tabla de crecimiento (capitalización anual, 7%)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Años</th>
                <th className="text-right">$10.000 crece a</th>
                <th className="text-right">Interés ganado</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>5</td><td className="text-right">$14.026</td><td className="text-right">$4.026</td></tr>
              <tr><td>10</td><td className="text-right">$19.672</td><td className="text-right">$9.672</td></tr>
              <tr><td>15</td><td className="text-right">$27.590</td><td className="text-right">$17.590</td></tr>
              <tr><td>20</td><td className="text-right">$38.697</td><td className="text-right">$28.697</td></tr>
              <tr><td>30</td><td className="text-right">$76.123</td><td className="text-right">$66.123</td></tr>
            </tbody>
          </table>
        </div>

        <div className="not-prose my-6">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Crecimiento visual (relativo al valor a 30 años)</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-8 shrink-0">5a</span>
              <div className="h-3 flex-1 overflow-hidden rounded bg-muted"><div className="h-3 rounded bg-primary" style={{ width: "18%" }} /></div>
              <span className="w-16 shrink-0 text-right">$14k</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 shrink-0">10a</span>
              <div className="h-3 flex-1 overflow-hidden rounded bg-muted"><div className="h-3 rounded bg-primary" style={{ width: "26%" }} /></div>
              <span className="w-16 shrink-0 text-right">$20k</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 shrink-0">15a</span>
              <div className="h-3 flex-1 overflow-hidden rounded bg-muted"><div className="h-3 rounded bg-primary" style={{ width: "36%" }} /></div>
              <span className="w-16 shrink-0 text-right">$28k</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 shrink-0">20a</span>
              <div className="h-3 flex-1 overflow-hidden rounded bg-muted"><div className="h-3 rounded bg-primary" style={{ width: "51%" }} /></div>
              <span className="w-16 shrink-0 text-right">$39k</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 shrink-0">30a</span>
              <div className="h-3 flex-1 overflow-hidden rounded bg-muted"><div className="h-3 rounded bg-primary" style={{ width: "100%" }} /></div>
              <span className="w-16 shrink-0 text-right">$76k</span>
            </div>
          </div>
        </div>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Prueba la calculadora</h3>
          <p className="mt-2 text-muted-foreground">
            Ingresa tu propio capital, tasa, años y aportes opcionales para ver el valor futuro exacto y el desglose año por año.
          </p>
          <Link
            to="/es/finanzas/interes-compuesto"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Abrir Calculadora de Interés Compuesto
          </Link>
        </div>

        <h2>Por qué el tiempo importa más que la tasa</h2>
        <p>
          Una ilustración común es la “regla del 72”: años aproximados para duplicar = 72 / tasa de interés. Al 7% el dinero se duplica aproximadamente cada 10 años. Empezar antes multiplica el número de duplicaciones, por eso comenzar a ahorrar a los 20 suele superar esperar hasta los 40 aunque la tasa posterior sea mayor.
        </p>
        <p>
          Añadir aportes regulares acelera aún más el crecimiento. El valor futuro de una serie de pagos tiene su propia fórmula, pero la calculadora de UtiliHub maneja tanto escenarios de capital único como de aportes en un solo lugar.
        </p>

        <h2>Preguntas frecuentes</h2>
        <p>
          <strong>¿El interés compuesto es lo mismo que la tasa de crecimiento anual compuesto (CAGR)?</strong> El CAGR es la tasa anual constante que produciría el mismo retorno total en un período. El interés compuesto es el proceso; el CAGR es una métrica derivada.
        </p>
        <p>
          <strong>¿Capitalizar más frecuentemente siempre ayuda?</strong> Sí, pero el beneficio marginal disminuye. La capitalización diaria es solo ligeramente mejor que la mensual para la mayoría de las tasas. La capitalización continua usa e^(rt) y es el máximo teórico.
        </p>
        <p>
          <strong>¿El interés compuesto puede trabajar en mi contra?</strong> Sí. Las deudas de tarjetas de crédito y alto interés se capitalizan de la misma forma, por eso pagarlas rápido suele ser la “inversión” de mayor retorno disponible.
        </p>

        <h2>Herramientas relacionadas en UtiliHub</h2>
        <ul>
          <li><Link to="/es/finanzas/interes-compuesto">Calculadora de interés compuesto</Link> — proyecciones completas con aportes.</li>
          <li><Link to="/es/finanzas/objetivo-de-ahorro">Objetivo de ahorro</Link> — encuentra el monto mensual necesario para alcanzar una meta.</li>
          <li><Link to="/es/finanzas/cagr">Calculadora CAGR</Link> — mide tasas de crecimiento históricas.</li>
        </ul>

        <h2>Conclusión</h2>
        <p>
          El interés compuesto convierte el tiempo en un aliado. Entender la fórmula, ver la tabla y modelar tus propios números con la calculadora hace concreto el efecto a largo plazo. Empieza con la herramienta en vivo enlazada arriba y experimenta con diferentes tasas y horizontes de tiempo.
        </p>
      </article>

      <div className="mt-12">
        <AdsterraBanner />
      </div>
    </div>
  );
}
