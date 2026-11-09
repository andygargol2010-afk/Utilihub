// Part 2 of 3 — split from wind-chill.ts on 2026-11-04. Edit here; wind-chill.ts re-exports.
import { type WindChillInput, type WindChillIssue, parseNumber } from "./wind-chill.part1";

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
