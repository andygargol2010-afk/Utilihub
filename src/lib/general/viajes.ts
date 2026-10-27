import { makeTool } from "./types";

function v(
  slug: string,
  name: string,
  kind: string,
  description: string,
  extras: Record<string, unknown>,
) {
  return makeTool(slug, name, "viajes", kind as never, description, [], extras);
}

export const VIAJES_TOOLS = [
  v("combustible-necesario", "Fuel Needed Calculator", "number", "Estimate the fuel needed for a given distance and consumption.", {
    operation: "fuel-needed",
    fields: ["Distance", "Consumption L/100 km"],
  }),
  v("calculadora-consumo-viaje", "Trip fuel cost calculator", "number", "Estimate fuel cost for a trip from distance, consumption and price.", {
    operation: "trip-cost",
    fields: ["Distance", "Consumption", "Price per liter"],
  }),
  v("calculadora-presupuesto-diario-viaje", "Daily travel budget calculator", "number", "Split a trip budget by number of days.", {
    operation: "daily-budget",
    fields: ["Total budget", "Days"],
  }),
  v("calculadora-costo-por-km", "Cost per km calculator", "number", "Cost per kilometer from total cost and distance.", {
    operation: "cost-per-km",
    fields: ["Total cost", "Distance km"],
  }),
];
