import { makeTool } from "./types";

const s = (slug: string, name: string, summary: string) => makeTool(slug, name, "ciencia", "science", summary);

export const SCIENCE_TOOLS = [
  s("densidad", "Densidad", "Calcula densidad como masa dividida por volumen."),
  s("velocidad-fisica", "Velocidad física", "Calcula velocidad media como distancia dividida por tiempo."),
  s("aceleracion", "Aceleración", "Calcula aceleración media como cambio de velocidad dividido por tiempo."),
  s("fuerza", "Fuerza", "Calcula fuerza mediante la segunda ley de Newton: masa por aceleración."),
  s("energia-cinetica", "Energía cinética", "Calcula energía cinética mediante ½·m·v²."),
  s("energia-potencial", "Energía potencial", "Calcula energía potencial gravitatoria mediante m·g·h."),
  s("ley-de-ohm", "Ley de Ohm", "Calcula el voltaje a partir de corriente y resistencia."),
  s("potencia-electrica", "Potencia eléctrica", "Calcula potencia eléctrica mediante voltaje por corriente."),
  s("resistencias-serie", "Resistencias en serie", "Calcula la resistencia equivalente de dos resistencias en serie."),
  s("resistencias-paralelo", "Resistencias en paralelo", "Calcula la resistencia equivalente de dos resistencias en paralelo."),
  s("longitud-onda", "Frecuencia y longitud de onda", "Calcula longitud de onda mediante velocidad de propagación dividida por frecuencia."),
  s("presion", "Presión", "Calcula presión como fuerza dividida por área."),
  s("caudal", "Caudal", "Calcula caudal volumétrico como volumen dividido por tiempo."),
  s("ph", "pH", "Calcula pH aproximado a partir de la concentración de iones H⁺."),
  s("temperatura-cientifica", "Temperatura absoluta", "Convierte una temperatura Celsius a Celsius, Kelvin y Fahrenheit."),
  s("gravedad", "Peso y gravedad", "Calcula peso mediante masa por aceleración gravitatoria local."),
];
