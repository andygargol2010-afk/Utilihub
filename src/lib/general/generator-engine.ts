const randomInt = (min: number, max: number): number => {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    throw new Error("El rango debe contener enteros válidos y el mínimo no puede superar al máximo.");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const pick = <T>(items: readonly T[]): T => {
  if (items.length === 0) throw new Error("No se puede seleccionar de una lista vacía.");
  return items[randomInt(0, items.length - 1)];
};

const randomAlphaNumeric = (length: number): string => {
  if (!Number.isInteger(length) || length < 0) throw new Error("La longitud debe ser un entero no negativo.");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => pick([...alphabet])).join("");
};

const randomName = (): string => pick([
  "Alex", "Andy", "Bruno", "Camila", "Daniel",
  "Elena", "Lucas", "Mia", "Nicolas", "Sofia",
]);

const lorem = (): string =>
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export type GeneratorOptions = {
  min?: number;
  max?: number;
  sides?: number;
  count?: number;
};

export const generateBySlug = (slug: string, options: GeneratorOptions = {}): string => {
  if (!slug.trim()) throw new Error("No se puede generar contenido sin un slug de herramienta.");

  switch (slug) {
    case "generador-numeros": {
      const min = options.min ?? 1;
      const max = options.max ?? 100;
      return String(randomInt(min, max));
    }
    case "generador-dados": {
      const sides = options.sides ?? 6;
      const count = options.count ?? 1;
      if (!Number.isInteger(sides) || sides < 2 || sides > 10000) {
        throw new Error("Las caras por dado deben ser un entero entre 2 y 10000.");
      }
      if (!Number.isInteger(count) || count < 1 || count > 1000) {
        throw new Error("La cantidad de dados debe ser un entero entre 1 y 1000.");
      }
      return Array.from({ length: count }, () => String(randomInt(1, sides))).join(" · ");
    }
    case "generador-nombres":
      return randomName();
    case "generador-usuarios":
      return `${randomName().toLowerCase()}_${randomInt(10, 9999)}`;
    case "generador-pin":
      return String(randomInt(0, 999999)).padStart(6, "0");
    case "generador-codigos":
      return randomAlphaNumeric(10);
    case "datos-prueba":
      return JSON.stringify(
        { name: randomName(), id: randomInt(1000, 9999), value: randomInt(1, 100) },
        null,
        2,
      );
    case "lorem-ipsum":
      return lorem();
    default:
      throw new Error(`Generador sin implementación específica: ${slug}`);
  }
};
