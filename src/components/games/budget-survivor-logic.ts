export type Difficulty = "easy" | "medium" | "hard";
export type EventKind = "bill" | "optional" | "income" | "surprise";

export type GameEvent = {
  id: string;
  kind: EventKind;
  day: number;
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  amount: number;
  skippable: boolean;
  altAmount?: number;
  altLabelEn?: string;
  altLabelEs?: string;
};

export const START: Record<Difficulty, number> = {
  easy: 1200,
  medium: 900,
  hard: 650,
};

export const DAYS = 28;

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function buildMonth(difficulty: Difficulty): GameEvent[] {
  const events: GameEvent[] = [];
  let id = 0;
  const push = (e: Omit<GameEvent, "id">) => {
    events.push({ ...e, id: `e${id++}` });
  };

  const rent = difficulty === "hard" ? 420 : difficulty === "medium" ? 380 : 320;
  push({
    kind: "bill",
    day: 1,
    titleEn: "Rent due",
    titleEs: "Alquiler",
    descEn: "Monthly rent hits on day 1.",
    descEs: "El alquiler del mes cae el día 1.",
    amount: -rent,
    skippable: false,
  });

  for (const day of [3, 10, 17, 24]) {
    const food = rand(45, difficulty === "hard" ? 90 : 70);
    push({
      kind: "bill",
      day,
      titleEn: "Groceries",
      titleEs: "Supermercado",
      descEn: "Weekly food run.",
      descEs: "Compra semanal de comida.",
      amount: -food,
      skippable: true,
      altAmount: -Math.round(food * 0.65),
      altLabelEn: "Cook cheap",
      altLabelEs: "Cocinar barato",
    });
  }

  push({
    kind: "bill",
    day: 12,
    titleEn: "Utilities",
    titleEs: "Servicios",
    descEn: "Electricity, water, internet bundle.",
    descEs: "Luz, agua e internet.",
    amount: -(difficulty === "hard" ? rand(80, 120) : rand(55, 90)),
    skippable: false,
  });

  const optionals = [
    {
      day: 5,
      titleEn: "Streaming annual plan",
      titleEs: "Plan anual de streaming",
      descEn: "Discounted yearly subscription.",
      descEs: "Suscripción anual con descuento.",
      amount: -60,
    },
    {
      day: 9,
      titleEn: "Weekend out",
      titleEs: "Salida de fin de semana",
      descEn: "Dinner and drinks with friends.",
      descEs: "Cena y algo con amigos.",
      amount: -rand(35, 75),
    },
    {
      day: 16,
      titleEn: "New headphones",
      titleEs: "Auriculares nuevos",
      descEn: "Nice-to-have gear on sale.",
      descEs: "Accesorio en oferta.",
      amount: -rand(40, 95),
    },
    {
      day: 22,
      titleEn: "Concert ticket",
      titleEs: "Entrada a recital",
      descEn: "One night only.",
      descEs: "Una sola función.",
      amount: -rand(50, 110),
    },
  ];
  for (const o of optionals) {
    if (Math.random() < 0.85) {
      push({
        kind: "optional",
        day: o.day,
        titleEn: o.titleEn,
        titleEs: o.titleEs,
        descEn: o.descEn,
        descEs: o.descEs,
        amount: o.amount,
        skippable: true,
      });
    }
  }

  const surprises = [
    {
      day: 7,
      titleEn: "Phone repair",
      titleEs: "Arreglo del celular",
      amount: -rand(40, 100),
      descEn: "Screen crack. Unavoidable.",
      descEs: "Pantalla rota. No se puede evitar.",
      skip: false as boolean,
      alt: undefined as number | undefined,
    },
    {
      day: 14,
      titleEn: "Medical copay",
      titleEs: "Copago médico",
      amount: -rand(30, 80),
      descEn: "Clinic visit cost.",
      descEs: "Consulta en la clínica.",
      skip: false,
      alt: undefined,
    },
    {
      day: 20,
      titleEn: "Transit fine",
      titleEs: "Multa de tránsito",
      amount: -rand(25, 70),
      descEn: "Parking ticket.",
      descEs: "Multa de estacionamiento.",
      skip: true,
      alt: -15,
    },
  ];
  for (const s of surprises) {
    if (Math.random() < 0.75) {
      push({
        kind: "surprise",
        day: s.day,
        titleEn: s.titleEn,
        titleEs: s.titleEs,
        descEn: s.descEn,
        descEs: s.descEs,
        amount: s.amount,
        skippable: s.skip,
        altAmount: s.alt,
        altLabelEn: s.skip ? "Pay reduced" : undefined,
        altLabelEs: s.skip ? "Pagar reducido" : undefined,
      });
    }
  }

  push({
    kind: "income",
    day: 15,
    titleEn: "Payday",
    titleEs: "Cobro",
    descEn: "Mid-month paycheck lands.",
    descEs: "Llega el sueldo de mitad de mes.",
    amount:
      difficulty === "hard"
        ? rand(280, 360)
        : difficulty === "medium"
          ? rand(320, 400)
          : rand(360, 450),
    skippable: false,
  });
  if (Math.random() < 0.5) {
    push({
      kind: "income",
      day: 21,
      titleEn: "Side gig",
      titleEs: "Laburo extra",
      descEn: "Freelance micro-job paid out.",
      descEs: "Te pagaron un laburo freelance.",
      amount: rand(40, 120),
      skippable: false,
    });
  }

  return events.sort((a, b) => a.day - b.day || a.id.localeCompare(b.id));
}

export function money(n: number, es: boolean) {
  const sign = n < 0 ? "-" : n > 0 ? "+" : "";
  const abs = Math.abs(n).toLocaleString(es ? "es-AR" : "en-US");
  return `${sign}$${abs}`;
}
