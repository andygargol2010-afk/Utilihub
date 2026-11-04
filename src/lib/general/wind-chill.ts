import { type WindChillInput, type WindChillResult, parseNumber, toF, toMph, nwsWindChillF, toC } from "./wind-chill.part1";
import { validateWindChill, frostbiteLabel } from "./wind-chill.part2";
export { emptyWindChill, walkPreset, nwsPreset, toF, toC, toMph, nwsWindChillF } from "./wind-chill.part1";
export type { WindUnit, TempUnit, WindChillInput, WindChillIssue, WindChillResult } from "./wind-chill.part1";
export { frostbiteLabel, validateWindChill } from "./wind-chill.part2";

export function computeWindChill(input: WindChillInput): WindChillResult | null {
  if (validateWindChill(input, false).length) return null;
  const temp = parseNumber(input.temperature);
  const wind = parseNumber(input.wind);
  if (!temp.ok || !wind.ok) return null;
  const airF = toF(temp.n, input.tempUnit);
  const windMph = toMph(wind.n, input.windUnit);
  const calm = windMph < 3;
  const warm = airF > 50;
  const formulaApplied = !calm && !warm;
  const chillF = formulaApplied ? nwsWindChillF(airF, windMph) : airF;
  const frost = frostbiteLabel(chillF);
  const note = calm
    ? "Wind under 3 mph: the NWS formula does not apply, so wind chill equals the air temperature."
    : warm
      ? "Air above 50°F: the NWS formula does not apply, so wind chill equals the air temperature."
      : "NWS 2001 formula on temperature in °F and wind in mph.";
  const noteEs = calm
    ? "Viento menor a 3 mph: la fórmula NWS no aplica y el wind chill es la temperatura del aire."
    : warm
      ? "Aire por encima de 50°F: la fórmula NWS no aplica y el wind chill es la temperatura del aire."
      : "Fórmula NWS 2001 con temperatura en °F y viento en mph.";
  return {
    airF,
    airC: toC(airF),
    windMph,
    windKmh: windMph * 1.609344,
    chillF,
    chillC: toC(chillF),
    formulaApplied,
    note,
    noteEs,
    frostbite: frost.en,
    frostbiteEs: frost.es,
  };
}

export function formatTemp(value: number, digits = 1) {
  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? "0" : String(rounded);
}
