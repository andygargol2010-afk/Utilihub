/** NWS 2001 wind-chill. Inputs convert to °F and mph before the formula. */

export type WindUnit = "mph" | "kmh";
export type TempUnit = "F" | "C";

export type WindChillInput = {
  temperature: string;
  tempUnit: TempUnit;
  wind: string;
  windUnit: WindUnit;
};

export type WindChillIssue = { field: string; message: string };

export type WindChillResult = {
  airF: number;
  airC: number;
  windMph: number;
  windKmh: number;
  chillF: number;
  chillC: number;
  formulaApplied: boolean;
  note: string;
  noteEs: string;
  frostbite: string;
  frostbiteEs: string;
};

export function emptyWindChill(): WindChillInput {
  return { temperature: "", tempUnit: "C", wind: "", windUnit: "kmh" };
}

export function walkPreset(): WindChillInput {
  return { temperature: "0", tempUnit: "C", wind: "20", windUnit: "kmh" };
}

export function nwsPreset(): WindChillInput {
  return { temperature: "0", tempUnit: "F", wind: "15", windUnit: "mph" };
}

function parseNumber(value: string) {
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return { ok: false as const, reason: "empty" };
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return { ok: false as const, reason: "nan" };
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return { ok: false as const, reason: "nan" };
  return { ok: true as const, n };
}

export function toF(temp: number, unit: TempUnit) {
  return unit === "F" ? temp : temp * 9 / 5 + 32;
}

export function toC(tempF: number) {
  return (tempF - 32) * 5 / 9;
}

export function toMph(wind: number, unit: WindUnit) {
  return unit === "mph" ? wind : wind / 1.609344;
}

/** NWS 2001: 35.74 + 0.6215T − 35.75 V^0.16 + 0.4275 T V^0.16, T in °F, V in mph. */
export function nwsWindChillF(tempF: number, windMph: number) {
  const v = Math.pow(windMph, 0.16);
  return 35.74 + 0.6215 * tempF - 35.75 * v + 0.4275 * tempF * v;
}

export function frostbiteLabel(chillF: number) {
  if (chillF > -18) {
    return {
      en: "No NWS 30-minute frostbite band (wind chill warmer than −18°F).",
      es: "Fuera de la banda NWS de 30 minutos (wind chill más templado que −18°F).",
    };
  }
  if (chillF > -33) {
    return {
      en: "About 30 minutes to frostbite on exposed skin (NWS band −18 to −32°F).",
      es: "Unos 30 minutos hasta congelación en piel expuesta (banda NWS −18 a −32°F).",
    };
  }
  if (chillF > -48) {
    return {
      en: "About 10 minutes to frostbite on exposed skin (NWS band −33 to −47°F).",
      es: "Unos 10 minutos hasta congelación en piel expuesta (banda NWS −33 a −47°F).",
    };
  }
  if (chillF > -55) {
    return {
      en: "About 5 minutes to frostbite on exposed skin (NWS band −48 to −54°F).",
      es: "Unos 5 minutos hasta congelación en piel expuesta (banda NWS −48 a −54°F).",
    };
  }
  return {
    en: "Under 5 minutes to frostbite on exposed skin (NWS band at or below −55°F).",
    es: "Menos de 5 minutos hasta congelación en piel expuesta (banda NWS de −55°F o menos).",
  };
}

export function validateWindChill(input: WindChillInput, es: boolean): WindChillIssue[] {
  const issues: WindChillIssue[] = [];
  const temp = parseNumber(input.temperature);
  const wind = parseNumber(input.wind);
  if (!temp.ok) {
    issues.push({
      field: "temperature",
      message: temp.reason === "empty"
        ? es ? "La temperatura no puede estar vacía." : "Temperature cannot be empty."
        : es ? "La temperatura no es un número (NaN)." : "Temperature is not a number (NaN).",
    });
  } else if (temp.n < -80 || temp.n > 60) {
    issues.push({
      field: "temperature",
      message: es ? "La temperatura debe estar entre −80 y 60 en la unidad elegida." : "Temperature must be between −80 and 60 in the selected unit.",
    });
  }
  if (!wind.ok) {
    issues.push({
      field: "wind",
      message: wind.reason === "empty"
        ? es ? "El viento no puede estar vacío." : "Wind speed cannot be empty."
        : es ? "El viento no es un número (NaN)." : "Wind speed is not a number (NaN).",
    });
  } else if (wind.n < 0) {
    issues.push({
      field: "wind",
      message: es ? "El viento no puede ser negativo." : "Wind speed cannot be negative.",
    });
  } else if (wind.n > 120) {
    issues.push({
      field: "wind",
      message: es ? "El viento supera 120 en la unidad elegida." : "Wind speed is above 120 in the selected unit.",
    });
  }
  return issues;
}

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