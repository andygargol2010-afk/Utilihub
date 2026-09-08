import type { FinancialDefinition } from "./types";
import { financialValue, money, num, pct } from "./types";

const f = (key: string, label: string, defaultValue: number, unit = "") => ({ key, label, defaultValue, unit });

export const ADVANCED_FINANCIAL_TOOLS: FinancialDefinition[] = [
  {
    slug: "valoracion-dcf",
    fields: [
      f("fcf", "Flujo de caja libre actual", 100000, "$"),
      f("growth", "Crecimiento anual", 8, "%"),
      f("wacc", "WACC", 10, "%"),
      f("terminalGrowth", "Crecimiento terminal", 3, "%"),
      f("years", "Años de proyección", 5),
    ],
    calculate: (v) => {
      const fcf = financialValue(v, "fcf");
      const growth = financialValue(v, "growth") / 100;
      const wacc = financialValue(v, "wacc") / 100;
      const terminalGrowth = financialValue(v, "terminalGrowth") / 100;
      const years = Math.floor(financialValue(v, "years"));
      if (fcf <= 0 || years < 1 || wacc <= terminalGrowth || wacc <= 0) {
        throw Error("El flujo debe ser positivo, los años al menos 1 y el WACC mayor que el crecimiento terminal.");
      }
      let presentValue = 0;
      let projected = fcf;
      for (let year = 1; year <= years; year++) {
        projected *= 1 + growth;
        presentValue += projected / Math.pow(1 + wacc, year);
      }
      const terminalValue = projected * (1 + terminalGrowth) / (wacc - terminalGrowth);
      const terminalPresentValue = terminalValue / Math.pow(1 + wacc, years);
      const enterpriseValue = presentValue + terminalPresentValue;
      return [
        { label: "Valor presente de los flujos", value: money(presentValue) },
        { label: "Valor terminal presente", value: money(terminalPresentValue) },
        { label: "Valor empresarial estimado", value: money(enterpriseValue) },
        { label: "Peso del valor terminal", value: pct(terminalPresentValue / enterpriseValue * 100) },
      ];
    },
    note: "Modelo DCF simplificado: usa flujo de caja libre, WACC y crecimiento terminal constantes. No sustituye un modelo financiero completo ni una valoración profesional.",
  },
  {
    slug: "calculadora-wacc",
    fields: [
      f("equity", "Valor del capital", 1000000, "$"),
      f("debt", "Deuda con coste", 400000, "$"),
      f("costEquity", "Coste del capital", 12, "%"),
      f("costDebt", "Coste de la deuda", 7, "%"),
      f("taxRate", "Tasa fiscal", 25, "%"),
    ],
    calculate: (v) => {
      const equity = financialValue(v, "equity");
      const debt = financialValue(v, "debt");
      const costEquity = financialValue(v, "costEquity") / 100;
      const costDebt = financialValue(v, "costDebt") / 100;
      const taxRate = financialValue(v, "taxRate") / 100;
      const total = equity + debt;
      if (equity < 0 || debt < 0 || total <= 0 || taxRate < 0 || taxRate > 1) {
        throw Error("Capital y deuda deben ser no negativos y la tasa fiscal debe estar entre 0 % y 100 %.");
      }
      const wacc = equity / total * costEquity + debt / total * costDebt * (1 - taxRate);
      return [
        { label: "WACC", value: pct(wacc * 100) },
        { label: "Peso del capital", value: pct(equity / total * 100) },
        { label: "Peso de la deuda", value: pct(debt / total * 100) },
        { label: "Deuda después de impuestos", value: pct(costDebt * (1 - taxRate) * 100) },
      ];
    },
    note: "El WACC combina el coste del capital y el coste de la deuda después de impuestos según sus pesos de mercado.",
  },
  {
    slug: "cobertura-del-servicio-de-la-deuda",
    fields: [
      f("ebitda", "EBITDA o flujo operativo", 250000, "$"),
      f("debtService", "Servicio anual de deuda", 100000, "$"),
      f("interest", "Intereses anuales", 50000, "$"),
    ],
    calculate: (v) => {
      const ebitda = financialValue(v, "ebitda");
      const debtService = financialValue(v, "debtService");
      const interest = financialValue(v, "interest");
      if (ebitda < 0 || debtService <= 0 || interest <= 0) {
        throw Error("El flujo no puede ser negativo y la deuda e intereses deben ser mayores que 0.");
      }
      return [
        { label: "DSCR", value: `${num(ebitda / debtService)}x` },
        { label: "Cobertura de intereses", value: `${num(ebitda / interest)}x` },
        { label: "Margen sobre servicio de deuda", value: money(ebitda - debtService) },
      ];
    },
    note: "Un DSCR superior a 1x indica que el flujo operativo cubre el servicio anual de deuda. Los umbrales aceptables dependen del prestamista y del sector.",
  },
  {
    slug: "ciclo-de-conversion-de-efectivo",
    fields: [
      f("inventory", "Inventario promedio", 120000, "$"),
      f("receivables", "Cuentas por cobrar", 90000, "$"),
      f("payables", "Cuentas por pagar", 70000, "$"),
      f("revenue", "Ventas anuales", 1000000, "$"),
      f("cogs", "Coste de ventas anual", 600000, "$"),
    ],
    calculate: (v) => {
      const inventory = financialValue(v, "inventory");
      const receivables = financialValue(v, "receivables");
      const payables = financialValue(v, "payables");
      const revenue = financialValue(v, "revenue");
      const cogs = financialValue(v, "cogs");
      if ([inventory, receivables, payables].some((x) => x < 0) || revenue <= 0 || cogs <= 0) {
        throw Error("Los saldos no pueden ser negativos y ventas y coste de ventas deben ser mayores que 0.");
      }
      const dso = receivables / revenue * 365;
      const dio = inventory / cogs * 365;
      const dpo = payables / cogs * 365;
      return [
        { label: "Días de cuentas por cobrar", value: `${num(dso)} días` },
        { label: "Días de inventario", value: `${num(dio)} días` },
        { label: "Días de cuentas por pagar", value: `${num(dpo)} días` },
        { label: "Ciclo de conversión de efectivo", value: `${num(dso + dio - dpo)} días` },
      ];
    },
    note: "El ciclo de conversión de efectivo estima cuántos días permanece el dinero comprometido en la operación antes de recuperarse mediante cobros.",
  },
  {
    slug: "apalancamiento-neto",
    fields: [
      f("debt", "Deuda financiera", 500000, "$"),
      f("cash", "Caja y equivalentes", 100000, "$"),
      f("ebitda", "EBITDA anual", 200000, "$"),
      f("equity", "Patrimonio", 800000, "$"),
    ],
    calculate: (v) => {
      const debt = financialValue(v, "debt");
      const cash = financialValue(v, "cash");
      const ebitda = financialValue(v, "ebitda");
      const equity = financialValue(v, "equity");
      if ([debt, cash, equity].some((x) => x < 0) || ebitda <= 0 || equity <= 0) {
        throw Error("La deuda, caja y patrimonio no pueden ser negativos; el EBITDA debe ser mayor que 0.");
      }
      const netDebt = debt - cash;
      return [
        { label: "Deuda neta", value: money(netDebt) },
        { label: "Deuda neta / EBITDA", value: `${num(netDebt / ebitda)}x` },
        { label: "Deuda / patrimonio", value: `${num(debt / equity)}x` },
        { label: "Deuda neta / patrimonio", value: `${num(netDebt / equity)}x` },
      ];
    },
    note: "Los ratios de apalancamiento son indicadores orientativos y deben compararse con empresas similares y con los convenios financieros aplicables.",
  },
  {
    slug: "calculadora-roic",
    fields: [f("nopat", "Beneficio operativo después de impuestos", 150000, "$"), f("capital", "Capital invertido", 1000000, "$"), f("wacc", "WACC de referencia", 10, "%")],
    calculate: (v) => {
      const nopat = financialValue(v, "nopat"); const capital = financialValue(v, "capital"); const wacc = financialValue(v, "wacc");
      if (nopat < 0 || capital <= 0 || wacc < 0) throw Error("El capital debe ser mayor que 0 y los valores no pueden ser negativos.");
      const roic = nopat / capital * 100;
      return [{ label: "ROIC", value: pct(roic) }, { label: "WACC", value: pct(wacc) }, { label: "Spread de creación de valor", value: pct(roic - wacc) }, { label: "Beneficio operativo", value: money(nopat) }];
    },
    note: "El ROIC compara el beneficio operativo después de impuestos con el capital invertido. Un spread positivo frente al WACC sugiere creación de valor bajo estos supuestos.",
  },
  {
    slug: "runway-y-burn-rate",
    fields: [f("cash", "Caja disponible", 250000, "$"), f("revenue", "Ingresos mensuales", 50000, "$"), f("expenses", "Gastos mensuales", 80000, "$"), f("growth", "Crecimiento mensual de ingresos", 3, "%")],
    calculate: (v) => {
      const cash = financialValue(v, "cash"); const revenue = financialValue(v, "revenue"); const expenses = financialValue(v, "expenses"); const growth = financialValue(v, "growth") / 100;
      if (cash < 0 || revenue < 0 || expenses <= 0 || growth < -1) throw Error("La caja e ingresos no pueden ser negativos y los gastos deben ser mayores que 0.");
      const burn = Math.max(0, expenses - revenue); const runway = burn === 0 ? Infinity : cash / burn;
      let balance = cash; let month = 0; let monthlyRevenue = revenue;
      while (balance > 0 && month < 240) { balance += monthlyRevenue - expenses; monthlyRevenue *= 1 + growth; month++; }
      return [{ label: "Burn neto mensual", value: money(burn) }, { label: "Runway inicial", value: Number.isFinite(runway) ? `${num(runway)} meses` : "Sin consumo neto" }, { label: "Mes estimado de caja agotada", value: balance > 0 ? "Más de 20 años" : `${month} meses` }, { label: "Caja final del horizonte", value: money(Math.max(0, balance)) }];
    },
    note: "Estimación de runway con ingresos que crecen a una tasa mensual constante y gastos mensuales constantes. No modela deuda, impuestos ni estacionalidad.",
  },
  {
    slug: "apalancamiento-operativo",
    fields: [f("price", "Precio por unidad", 100, "$"), f("variable", "Coste variable por unidad", 40, "$"), f("fixed", "Costes fijos del período", 30000, "$"), f("units", "Unidades vendidas", 1000)],
    calculate: (v) => {
      const price = financialValue(v, "price"); const variable = financialValue(v, "variable"); const fixed = financialValue(v, "fixed"); const units = financialValue(v, "units");
      if (price <= variable || fixed < 0 || units <= 0) throw Error("El precio debe superar el coste variable, y las unidades deben ser mayores que 0.");
      const contribution = (price - variable) * units; const ebit = contribution - fixed; const dol = ebit === 0 ? Infinity : contribution / ebit; const breakEven = fixed / (price - variable);
      return [{ label: "Margen de contribución", value: money(contribution) }, { label: "Resultado operativo", value: money(ebit) }, { label: "Apalancamiento operativo", value: Number.isFinite(dol) ? `${num(dol)}x` : "No definido" }, { label: "Punto de equilibrio", value: `${num(breakEven)} unidades` }];
    },
    note: "El apalancamiento operativo muestra cuánto puede cambiar el resultado operativo ante cambios en ventas, debido al peso de los costes fijos.",
  },
  {
    slug: "modelo-de-crecimiento-de-dividendos",
    fields: [f("dividend", "Dividendo anual por acción", 2, "$"), f("growth", "Crecimiento esperado", 3, "%"), f("cost", "Rentabilidad exigida", 9, "%")],
    calculate: (v) => {
      const dividend = financialValue(v, "dividend"); const growth = financialValue(v, "growth") / 100; const cost = financialValue(v, "cost") / 100;
      if (dividend <= 0 || cost <= growth || cost <= 0) throw Error("El dividendo debe ser positivo y la rentabilidad exigida debe superar el crecimiento esperado.");
      const nextDividend = dividend * (1 + growth); const value = nextDividend / (cost - growth); return [{ label: "Dividendo esperado próximo", value: money(nextDividend) }, { label: "Valor teórico por acción", value: money(value) }, { label: "Margen de crecimiento", value: pct((cost - growth) * 100) }];
    },
    note: "Modelo de crecimiento de Gordon con crecimiento constante. Es muy sensible a la diferencia entre rentabilidad exigida y crecimiento.",
  },
  {
    slug: "margen-de-seguridad",
    fields: [f("sales", "Ventas actuales", 250000, "$"), f("breakEven", "Ventas de equilibrio", 180000, "$"), f("target", "Ventas objetivo", 300000, "$"), f("margin", "Margen neto esperado", 12, "%")],
    calculate: (v) => {
      const sales = financialValue(v, "sales"); const breakEven = financialValue(v, "breakEven"); const target = financialValue(v, "target"); const margin = financialValue(v, "margin") / 100;
      if (sales <= 0 || breakEven < 0 || target <= 0 || margin < 0 || margin > 1) throw Error("Las ventas deben ser positivas y el margen debe estar entre 0 % y 100 %.");
      const safety = (sales - breakEven) / sales * 100; const targetProfit = target * margin; return [{ label: "Margen de seguridad actual", value: pct(safety) }, { label: "Ventas por encima del equilibrio", value: money(sales - breakEven) }, { label: "Beneficio en ventas objetivo", value: money(targetProfit) }, { label: "Crecimiento hasta objetivo", value: pct((target / sales - 1) * 100) }];
    },
    note: "El margen de seguridad estima cuánto pueden caer las ventas antes de alcanzar el punto de equilibrio.",
  },
];
