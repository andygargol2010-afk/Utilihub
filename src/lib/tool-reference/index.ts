// Quick-reference content and inbound internal links for high-impression tools (GSC 2026-11-02).
// Add entries surgically; never rewrite this file wholesale.
import { BMI_REFERENCE, DEW_POINT_REFERENCE } from "./health-science";
import { KG_LBS_REFERENCE, OUNCES_GRAMS_REFERENCE, TABLESPOON_ML_REFERENCE } from "./conversions";
import type { ReferenceLink, ToolReference } from "./types";

export type { ReferenceLink, ToolReference } from "./types";

/** Keyed by internal catalog slug. */
const REFERENCE_BY_SLUG: Record<string, ToolReference> = {
  "calculadora-imc": BMI_REFERENCE,
  imc: BMI_REFERENCE,
  "calculadora-punto-rocio": DEW_POINT_REFERENCE,
  "conversor-onzas-gramos": OUNCES_GRAMS_REFERENCE,
  "conversion-cucharadas-ml": TABLESPOON_ML_REFERENCE,
  "conversor-cucharadas-ml": TABLESPOON_ML_REFERENCE,
  "conversor-kg-libras": KG_LBS_REFERENCE,
};

export function toolReference(slug: string): ToolReference | undefined {
  return REFERENCE_BY_SLUG[slug];
}

// Canonical public paths (verified with englishToolPath / spanishToolPath).
const BMI: ReferenceLink = {
  en: "/tools/bmi-calculator",
  es: "/es/herramientas/calculadora-imc",
  nameEn: "BMI calculator",
  nameEs: "Calculadora de IMC",
};
const DEW: ReferenceLink = {
  en: "/tools/dew-point-calculator",
  es: "/es/herramientas/calculadora-punto-rocio",
  nameEn: "Dew point calculator",
  nameEs: "Calculadora de punto de rocío",
};
const OZ_G: ReferenceLink = {
  en: "/tools/ounces-to-grams-converter",
  es: "/es/herramientas/conversor-onzas-gramos",
  nameEn: "Ounces to grams converter",
  nameEs: "Conversor de onzas a gramos",
};
const TBSP_ML: ReferenceLink = {
  en: "/tools/tablespoons-to-milliliters",
  es: "/es/herramientas/conversion-cucharadas-ml",
  nameEn: "Tablespoons to ml converter",
  nameEs: "Conversor de cucharadas a ml",
};
const KG_LB: ReferenceLink = {
  en: "/tools/kg-to-lbs-converter",
  es: "/es/herramientas/conversor-kg-libras",
  nameEn: "Kg to lbs converter",
  nameEs: "Conversor de kg a libras",
};

/** Related pages (by internal slug) that link to the reference tools above. */
const INBOUND_LINKS: Record<string, ReferenceLink[]> = {
  "calculadora-peso-ideal": [BMI, KG_LB],
  "peso-ideal": [BMI, KG_LB],
  "calculadora-peso-saludable": [BMI, KG_LB],
  "calculadora-grasa-corporal": [BMI],
  "calculadora-calorias-diarias": [BMI],
  "calculadora-tmb": [BMI],
  "calculadora-ratio-cintura-altura": [BMI],
  "calculadora-imc": [KG_LB],
  imc: [KG_LB],
  "conversor-temperatura": [DEW],
  "calculadora-sensacion-termica": [DEW],
  "calculadora-enfriamiento-viento": [DEW],
  "calculadora-presion-atmosferica": [DEW],
  "conversor-peso": [OZ_G, KG_LB],
  "conversor-gramos-libras": [OZ_G, KG_LB],
  "conversor-kg-libras": [OZ_G, BMI],
  "conversor-tazas-ml": [OZ_G, TBSP_ML],
  "conversor-onzas-ml": [TBSP_ML, OZ_G],
  "conversor-onzas-gramos": [TBSP_ML, KG_LB],
  "conversion-cucharadas-ml": [OZ_G],
  "conversor-cucharadas-ml": [TBSP_ML, OZ_G],
};

export function referenceLinks(slug: string): ReferenceLink[] {
  return INBOUND_LINKS[slug] ?? [];
}
