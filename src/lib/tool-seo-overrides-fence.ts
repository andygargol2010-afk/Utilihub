import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_FENCE: Record<string, ToolSeoOverride> = {
  "calculadora-valla": {
    metaTitle: "Fence calculator — posts and pickets | UtiliHub",
    metaTitleEs: "Calculadora de valla y postes | UtiliHub",
    metaDescription:
      "Estimate fence posts, bays, rails, pickets or panels, and concrete bags from run length, spacing, and gates. Privacy, gapped, and panel presets. Free in the browser.",
    metaDescriptionEs:
      "Calculá postes, vanos, travesaños, tablas o paneles y sacos de hormigón según largo, separación y portones. Presets de privacidad, hueco y panel. Gratis en el navegador.",
    about: [
      "This fence calculator turns a straight run into a shopping list: end and line posts, bays, rails on the infill, and either pickets or panels. It is meant for a single straight side of a yard, not a surveyed layout with corners, slopes, or existing walls already counted as posts.",
      "Bays are the run length divided by the center-to-center spacing, rounded up. Posts are bays plus one, so both ends are included. A gate removes its width from the board or panel length and replaces that many bays of rails. If the last bay is shorter than the spacing, it is still counted so you do not under-buy posts.",
      "Pickets use the board width plus the gap as the pitch, then add the waste percent and round up. Panels use panel width the same way. Concrete bags are posts times the bags-per-post figure you enter; leave it at zero if posts are driven or bolted. Optional prices are a material check only, not labor or delivery.",
      "Coverage and spacing should match the product you will buy. A 1.8 m panel fence should use 1.8 m spacing. Privacy boards are often butted (0 mm gap). The tool does not design wind load, post depth, or local setback rules.",
    ],
    aboutEs: [
      "Esta calculadora de valla convierte un tramo recto en lista de compra: postes de extremo y de línea, vanos, travesaños del tramo ciego y tablas o paneles. Sirve para un lado recto del patio, no para un replanteo con esquinas, pendientes o muros que ya hacen de poste.",
      "Los vanos son el largo dividido por la separación entre ejes, redondeado hacia arriba. Los postes son los vanos más uno, así entran los dos extremos. Un portón resta su ancho de la longitud de tablas o paneles y reemplaza esa cantidad de vanos de travesaños. Si el último vano queda más corto que la separación, igual se cuenta para no quedarse corto de postes.",
      "Las tablas usan el ancho de tabla más la separación como paso, suman el desperdicio y redondean hacia arriba. Los paneles hacen lo mismo con el ancho de panel. Los sacos de hormigón son postes por sacos por poste; dejalo en cero si van hincados o atornillados. Los precios opcionales son solo un chequeo de material, sin mano de obra ni flete.",
      "La separación tiene que coincidir con el producto. Una valla de paneles de 1,8 m debería usar 1,8 m entre ejes. Las tablas de privacidad suelen ir a tope (separación 0 mm). La herramienta no calcula carga de viento, profundidad de poste ni retiros municipales.",
    ],
    steps: [
      "Enter the straight run in meters and the post spacing center to center.",
      "Set how many gates and each gate width. Gate width is subtracted from the infill.",
      "Choose pickets (board width and gap in mm) or panels (panel width in m), plus rails per infill bay and waste.",
      "Add bags per post and optional unit prices if you want a material total.",
      "Read posts, bays, boards or panels, rails, and bags. Copy the list or reset to a preset.",
    ],
    stepsEs: [
      "Cargá el tramo recto en metros y la separación de postes entre ejes.",
      "Indicá cuántos portones y el ancho de cada uno. Ese ancho se resta del tramo ciego.",
      "Elegí tablas (ancho y separación en mm) o paneles (ancho en m), más travesaños por vano y desperdicio.",
      "Sumá sacos por poste y precios unitarios si querés un total de material.",
      "Leé postes, vanos, tablas o paneles, travesaños y sacos. Copiá la lista o volvé a un preset.",
    ],
    faq: [
      {
        q: "How are fence posts calculated?",
        a: "Bays equal the run length divided by spacing, rounded up. Posts equal bays plus one so both ends are included. A 12 m run at 2.4 m spacing is 5 bays and 6 posts.",
      },
      {
        q: "Do gates add extra posts?",
        a: "No. Gate posts are already inside the post count. Each gate removes one bay of rails and its width from the picket or panel length. Do not enter more gates than bays.",
      },
      {
        q: "What waste percent should I use?",
        a: "About 8–10% covers cut boards and a snapped picket. Use 5% for factory panels that match the bay. Waste does not change the post count.",
      },
      {
        q: "Is the layout uploaded?",
        a: "No. Lengths and prices stay in the browser and are not sent to a server.",
      },
      {
        q: "How is this different from a concrete calculator?",
        a: "The concrete tool sizes a slab or columns from a mix ratio. This one counts fence posts and only multiplies bags per post. It does not design footings.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calculan los postes de la valla?",
        a: "Los vanos son el largo dividido por la separación, redondeados hacia arriba. Los postes son los vanos más uno, para incluir ambos extremos. Un tramo de 12 m a 2,4 m son 5 vanos y 6 postes.",
      },
      {
        q: "¿Los portones suman postes extra?",
        a: "No. Los postes del portón ya están en el conteo. Cada portón saca un vano de travesaños y su ancho de la longitud de tablas o paneles. No cargues más portones que vanos.",
      },
      {
        q: "¿Qué desperdicio uso?",
        a: "Un 8–10% cubre cortes y alguna tabla rota. Usá 5% en paneles de fábrica que coinciden con el vano. El desperdicio no cambia la cantidad de postes.",
      },
      {
        q: "¿Se envía el plano?",
        a: "No. Largos y precios quedan en el navegador y no se mandan a un servidor.",
      },
      {
        q: "¿En qué se diferencia de la calculadora de hormigón?",
        a: "La de hormigón dimensiona una losa o columnas con una dosificación. Esta cuenta postes de valla y solo multiplica sacos por poste. No diseña zapatas.",
      },
    ],
  },
};
