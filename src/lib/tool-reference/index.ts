// Quick-reference content and inbound internal links for high-impression tools (GSC 2026-11-02).
// Add entries surgically; never rewrite this file wholesale.
import { BMI_REFERENCE, DEW_POINT_REFERENCE } from "./health-science";
import { KG_LBS_REFERENCE, OUNCES_GRAMS_REFERENCE, TABLESPOON_ML_REFERENCE } from "./conversions";
import {
  MILES_KM_REFERENCE,
  INCHES_CM_REFERENCE,
  CELSIUS_FAHRENHEIT_REFERENCE,
  LITERS_GALLONS_REFERENCE,
  METERS_FEET_REFERENCE,
  GRAMS_POUNDS_REFERENCE,
  ACRES_HECTARES_REFERENCE,
  KCAL_KJ_REFERENCE,
  PSI_BAR_REFERENCE,
  YARDS_METERS_REFERENCE,
  KMH_MS_REFERENCE,
  DEGREES_RADIANS_REFERENCE,
  OVEN_F_TO_C_REFERENCE,
  HOURS_DECIMAL_REFERENCE,
  MAX_HEART_RATE_REFERENCE,
} from "./everyday";
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
  // Task 26 (2026-11-18): everyday converters/calculators that were noindex.
  "conversor-millas-km": MILES_KM_REFERENCE,
  "conversor-pulgadas-cm": INCHES_CM_REFERENCE,
  "conversor-celsius-a-fahrenheit": CELSIUS_FAHRENHEIT_REFERENCE,
  "conversor-litros-galones": LITERS_GALLONS_REFERENCE,
  "conversor-metros-pies": METERS_FEET_REFERENCE,
  "conversor-gramos-libras": GRAMS_POUNDS_REFERENCE,
  "conversor-acres-hectareas": ACRES_HECTARES_REFERENCE,
  "conversor-kcal-kj": KCAL_KJ_REFERENCE,
  "conversor-psi-bar": PSI_BAR_REFERENCE,
  "conversor-yardas-metros": YARDS_METERS_REFERENCE,
  "conversor-kmh-ms": KMH_MS_REFERENCE,
  "conversor-grados-a-radianes": DEGREES_RADIANS_REFERENCE,
  "temperatura-horno-celsius": OVEN_F_TO_C_REFERENCE,
  "calculadora-horas-a-decimal": HOURS_DECIMAL_REFERENCE,
  "calculadora-frecuencia-cardiaca-maxima": MAX_HEART_RATE_REFERENCE,
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
  "conversor-de-peso": [OZ_G, KG_LB],
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
