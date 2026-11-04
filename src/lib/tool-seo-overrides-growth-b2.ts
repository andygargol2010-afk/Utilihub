/** SEO-growth overrides part b2. */
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";
import { TOOL_SEO_OVERRIDES_GROWTH_B2_PART1 } from "./tool-seo-overrides-growth-b2.part1";
import { TOOL_SEO_OVERRIDES_GROWTH_B2_PART2 } from "./tool-seo-overrides-growth-b2.part2";


export const TOOL_SEO_OVERRIDES_GROWTH_B2: Record<string, ToolSeoOverrideGrowth> = {
  ...TOOL_SEO_OVERRIDES_GROWTH_B2_PART1,
  ...TOOL_SEO_OVERRIDES_GROWTH_B2_PART2,

  "calculadora-subnet": {
    metaTitle: "Subnet Calculator — CIDR Network & Broadcast | UtiliHub",
    metaTitleEs: "Calculadora de subred CIDR | UtiliHub",
    metaDescription:
      "Calculate network address, broadcast, host range, and mask from an IPv4 address and CIDR prefix.",
    metaDescriptionEs:
      "Calculá dirección de red, broadcast, rango de hosts y máscara a partir de una IP y prefijo CIDR.",
    about: [
      "CIDR notation combines an IPv4 address with a prefix length (e.g. 192.168.1.10/24) to describe a subnet.",
      "This calculator derives network and broadcast addresses, usable host counts, and the dotted mask.",
      "It does not design hierarchical addressing plans—use it to check a single prefix quickly.",
    ],
    aboutEs: [
      "CIDR combina una IPv4 con un prefijo (p. ej. 192.168.1.10/24) para describir una subred.",
      "La calculadora obtiene red, broadcast, hosts utilizables y la máscara en notación decimal.",
      "No diseña planes jerárquicos: sirve para validar un prefijo de forma rápida.",
    ],
    steps: [
      "Enter an IPv4 address and prefix length (0–32).",
      "Read network, broadcast, and host range.",
      "Confirm the result matches your routing design.",
    ],
    stepsEs: [
      "Ingresá una IPv4 y el prefijo (0–32).",
      "Leé red, broadcast y rango de hosts.",
      "Confirmá que coincida con tu diseño de enrutamiento.",
    ],
    faq: [
      {
        q: "What about /31 and /32?",
        a: "Point-to-point and host routes use special host counts; the tool reports 0 usable hosts if the prefix is ≥ 31.",
      },
      {
        q: "Private ranges?",
        a: "10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 are private. The calculator does not restrict them.",
      },
    ],
    faqEs: [
      {
        q: "¿Y /31 y /32?",
        a: "Enlaces punto a punto y rutas de host usan conteos especiales; se reportan 0 hosts utilizables si el prefijo ≥ 31.",
      },
      {
        q: "¿Rangos privados?",
        a: "10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16 son privados. La calculadora no los bloquea.",
      },
    ],
  },

  "punto-equilibrio-unidades": {
    metaTitle: "Break-Even Units Calculator — Fixed vs Variable Cost | UtiliHub",
    metaTitleEs: "Calculadora de punto de equilibrio en unidades | UtiliHub",
    metaDescription:
      "Find how many units you must sell to cover fixed costs given price and variable cost per unit.",
    metaDescriptionEs:
      "Calculá cuántas unidades debés vender para cubrir costos fijos dado el precio y el costo variable unitario.",
    about: [
      "Break-even units equal fixed costs divided by contribution margin (price minus variable cost per unit).",
      "If margin is zero or negative, there is no finite break-even—each sale loses money on variable cost alone.",
      "This unit model is simpler than full investment break-even tools; it focuses on quantity planning for a single product.",
    ],
    aboutEs: [
      "Las unidades de equilibrio son costos fijos divididos por el margen de contribución (precio menos costo variable unitario).",
      "Si el margen es cero o negativo no hay equilibrio finito: cada venta pierde solo por el costo variable.",
      "Este modelo de unidades es más simple que el break-even de inversión: apunta a planificar cantidad de un producto.",
    ],
    steps: [
      "Enter fixed costs, selling price, and variable cost per unit.",
      "Calculate break-even units (rounded up for whole units).",
      "Stress-test with lower prices or higher fixed costs.",
    ],
    stepsEs: [
      "Ingresá costos fijos, precio de venta y costo variable unitario.",
      "Calculá las unidades de equilibrio (redondeo hacia arriba).",
      "Probá escenarios con menor precio o mayores fijos.",
    ],
    faq: [
      {
        q: "Taxes and inventory?",
        a: "Not included. Extend the model in a spreadsheet if tax or stock constraints matter.",
      },
      {
        q: "Multiple products?",
        a: "Use a weighted average margin or separate break-evens per product line.",
      },
    ],
    faqEs: [
      {
        q: "¿Impuestos e inventario?",
        a: "No están incluidos. Extendé el modelo en una planilla si importan.",
      },
      {
        q: "¿Varios productos?",
        a: "Usá un margen promedio ponderado o un equilibrio por línea de producto.",
      },
    ],
  },
};
