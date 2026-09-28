/** SEO-growth overrides part b2. */
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_B2: Record<string, ToolSeoOverrideGrowth> = {
  "pago-tarjeta-credito": {
    metaTitle: "Credit Card Payoff Calculator — Months & Interest | UtiliHub",
    metaTitleEs: "Calculadora de pago de tarjeta de crédito | UtiliHub",
    metaDescription:
      "Estimate how many months and how much interest you pay to clear a revolving balance at a fixed monthly payment and APR.",
    metaDescriptionEs:
      "Estimá en cuántos meses y con cuánto interés cancelás un saldo rotativo con pago mensual fijo y tasa anual.",
    about: [
      "Credit cards charge interest on revolving balances. A fixed payment must exceed the monthly interest or the balance never falls.",
      "We simulate month-by-month interest accrual and payments until the balance is cleared (or a safety month cap is hit).",
      "Fees, promotional rates, and minimum-payment rules differ by issuer—treat the output as a planning model.",
    ],
    aboutEs: [
      "Las tarjetas cobran interés sobre el saldo rotativo. El pago fijo debe superar el interés mensual o el saldo no baja.",
      "Simulamos mes a mes el interés y los pagos hasta liquidar el saldo (o alcanzar un tope de seguridad de meses).",
      "Comisiones, tasas promocionales y mínimos varían por emisor: tomá el resultado como modelo de planificación.",
    ],
    steps: [
      "Enter current balance, annual rate %, and monthly payment.",
      "Calculate months to payoff and total interest.",
      "Try a higher payment to see interest saved.",
    ],
    stepsEs: [
      "Ingresá saldo, tasa anual % y pago mensual.",
      "Calculá meses hasta cancelar e interés total.",
      "Probá un pago mayor para ver el interés ahorrado.",
    ],
    faq: [
      {
        q: "Payment too low error?",
        a: "If the payment is less than or equal to the first month’s interest, the balance grows. Raise the payment.",
      },
      {
        q: "Daily vs monthly compounding?",
        a: "This model uses a simple monthly rate (APR/12). Card statements may use daily balances; results can differ slightly.",
      },
    ],
    faqEs: [
      {
        q: "¿Error de pago demasiado bajo?",
        a: "Si el pago es menor o igual al interés del primer mes, el saldo crece. Subí el pago.",
      },
      {
        q: "¿Interés diario o mensual?",
        a: "El modelo usa tasa mensual simple (TEA/12). Los resúmenes pueden usar saldo diario; puede haber pequeñas diferencias.",
      },
    ],
  },

  "cron-generator": {
    metaTitle: "Cron Expression Helper — Common Schedules | UtiliHub",
    metaTitleEs: "Ayuda de expresiones cron — horarios habituales | UtiliHub",
    metaDescription:
      "Build or decode common cron expressions for every minute, hour, day, or weekday schedules. Free, in-browser.",
    metaDescriptionEs:
      "Armá o interpretá expresiones cron habituales: cada minuto, hora, día o días de la semana. Gratis, en el navegador.",
    about: [
      "Cron strings define when jobs run on Unix-style schedulers. Fields usually cover minute, hour, day of month, month, and day of week.",
      "This helper focuses on common patterns (hourly, daily, weekdays) so you can copy a working expression quickly.",
      "Syntax differs slightly between crontab, systemd timers, and cloud schedulers—always verify against your runtime docs.",
    ],
    aboutEs: [
      "Las cadenas cron definen cuándo corren tareas en planificadores tipo Unix. Los campos cubren minuto, hora, día del mes, mes y día de la semana.",
      "Esta ayuda se centra en patrones habituales (cada hora, diario, días hábiles) para copiar una expresión usable.",
      "La sintaxis varía entre crontab, systemd y planificadores en la nube: verificá la documentación de tu runtime.",
    ],
    steps: [
      "Choose a schedule pattern or enter fields.",
      "Copy the generated cron expression.",
      "Test it in your scheduler’s dry-run or next-run preview if available.",
    ],
    stepsEs: [
      "Elegí un patrón o completá los campos.",
      "Copiá la expresión cron generada.",
      "Probalá en el dry-run o vista previa de tu planificador si existe.",
    ],
    faq: [
      {
        q: "Five vs six fields?",
        a: "Classic crontab uses five fields. Some systems add a seconds field at the front—check which your tool expects.",
      },
      {
        q: "Timezone?",
        a: "Cron usually follows the host timezone. Cloud jobs often need an explicit TZ setting.",
      },
    ],
    faqEs: [
      {
        q: "¿Cinco o seis campos?",
        a: "El crontab clásico usa cinco. Algunos sistemas agregan segundos al inicio: confirmá qué espera tu herramienta.",
      },
      {
        q: "¿Zona horaria?",
        a: "Cron suele seguir la TZ del host. En la nube a menudo hay que definir TZ explícita.",
      },
    ],
  },

  "calculadora-subnet": {
    metaTitle: "Subnet Calculator — CIDR Network & Broadcast | UtiliHub",
    metaTitleEs: "Calculadora de subred CIDR | UtiliHub",
    metaDescription:
      "Calculate network address, broadcast, host range, and mask from an IPv4 address and CIDR prefix.",
    metaDescriptionEs:
      "Calculá dirección de red, broadcast, rango de hosts y máscara a partir de una IP y prefijo CIDR.",
    about: [
      "CIDR notation combines an IPv4 address with a prefix length (e.g. 192.168.1.10/24) to describe a subnet.",
      "This calculator derives network and broadcast addresses, usable host counts, and the dotted mask.",
      "It does not design hierarchical addressing plans—use it to check a single prefix quickly.",
    ],
    aboutEs: [
      "CIDR combina una IPv4 con un prefijo (p. ej. 192.168.1.10/24) para describir una subred.",
      "La calculadora obtiene red, broadcast, hosts utilizables y la máscara en notación decimal.",
      "No diseña planes jerárquicos: sirve para validar un prefijo de forma rápida.",
    ],
    steps: [
      "Enter an IPv4 address and prefix length (0–32).",
      "Read network, broadcast, and host range.",
      "Confirm the result matches your routing design.",
    ],
    stepsEs: [
      "Ingresá una IPv4 y el prefijo (0–32).",
      "Leé red, broadcast y rango de hosts.",
      "Confirmá que coincida con tu diseño de enrutamiento.",
    ],
    faq: [
      {
        q: "What about /31 and /32?",
        a: "Point-to-point and host routes use special host counts; the tool reports 0 usable hosts if the prefix is ≥ 31.",
      },
      {
        q: "Private ranges?",
        a: "10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 are private. The calculator does not restrict them.",
      },
    ],
    faqEs: [
      {
        q: "¿Y /31 y /32?",
        a: "Enlaces punto a punto y rutas de host usan conteos especiales; se reportan 0 hosts utilizables si el prefijo ≥ 31.",
      },
      {
        q: "¿Rangos privados?",
        a: "10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16 son privados. La calculadora no los bloquea.",
      },
    ],
  },

  "punto-equilibrio-unidades": {
    metaTitle: "Break-Even Units Calculator — Fixed vs Variable Cost | UtiliHub",
    metaTitleEs: "Calculadora de punto de equilibrio en unidades | UtiliHub",
    metaDescription:
      "Find how many units you must sell to cover fixed costs given price and variable cost per unit.",
    metaDescriptionEs:
      "Calculá cuántas unidades debés vender para cubrir costos fijos dado el precio y el costo variable unitario.",
    about: [
      "Break-even units equal fixed costs divided by contribution margin (price minus variable cost per unit).",
      "If margin is zero or negative, there is no finite break-even—each sale loses money on variable cost alone.",
      "This unit model is simpler than full investment break-even tools; it focuses on quantity planning for a single product.",
    ],
    aboutEs: [
      "Las unidades de equilibrio son costos fijos divididos por el margen de contribución (precio menos costo variable unitario).",
      "Si el margen es cero o negativo no hay equilibrio finito: cada venta pierde solo por el costo variable.",
      "Este modelo de unidades es más simple que el break-even de inversión: apunta a planificar cantidad de un producto.",
    ],
    steps: [
      "Enter fixed costs, selling price, and variable cost per unit.",
      "Calculate break-even units (rounded up for whole units).",
      "Stress-test with lower prices or higher fixed costs.",
    ],
    stepsEs: [
      "Ingresá costos fijos, precio de venta y costo variable unitario.",
      "Calculá las unidades de equilibrio (redondeo hacia arriba).",
      "Probá escenarios con menor precio o mayores fijos.",
    ],
    faq: [
      {
        q: "Taxes and inventory?",
        a: "Not included. Extend the model in a spreadsheet if tax or stock constraints matter.",
      },
      {
        q: "Multiple products?",
        a: "Use a weighted average margin or separate break-evens per product line.",
      },
    ],
    faqEs: [
      {
        q: "¿Impuestos e inventario?",
        a: "No están incluidos. Extendé el modelo en una planilla si importan.",
      },
      {
        q: "¿Varios productos?",
        a: "Usá un margen promedio ponderado o un equilibrio por línea de producto.",
      },
    ],
  },
};
