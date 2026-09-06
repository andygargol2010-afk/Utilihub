import { makeTool } from "./types";

export const INNOVATOR_TOOLS = [
  makeTool("contador-tiempo-lectura", "Contador de tiempo de lectura", "productividad", "text", "Estima los minutos necesarios para leer un texto según la velocidad seleccionada.", ["lectura","tiempo","palabras","estimador"]),
  makeTool("generador-nombres-archivos", "Generador de nombres de archivos", "productividad", "text", "Normaliza títulos y crea nombres de archivos consistentes para proyectos digitales.", ["nombres","archivos","slug","organizacion"]),
  makeTool("calculadora-propina-compartida", "Calculadora de propina compartida", "productividad", "text", "Calcula propina, total y reparto equitativo de una cuenta entre varias personas.", ["propina","cuenta","repartir","restaurante"]),
];
