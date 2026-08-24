export interface FinancialTool{slug:string;name:string;description:string;summary:string;keywords:string[];category:"finanzas"}

export const FINANCIAL_TOOLS:FinancialTool[]=[
 {slug:"interes-compuesto",name:"Interés compuesto",category:"finanzas",description:"Calcula el crecimiento de una inversión con capital inicial, aportes periódicos y una tasa anual.",summary:"Proyecta capital, aportes e intereses acumulados.",keywords:["interés compuesto","inversión","capitalización"]},
 {slug:"cuota-de-prestamo",name:"Cuota de préstamo",category:"finanzas",description:"Calcula la cuota mensual, el total pagado y los intereses de un préstamo con tasa fija.",summary:"Cuota mensual, intereses y coste total del préstamo.",keywords:["cuota préstamo","crédito","intereses"]},
 {slug:"rentabilidad-de-inversion",name:"Rentabilidad de inversión",category:"finanzas",description:"Calcula beneficio, rentabilidad porcentual y rentabilidad anualizada a partir del capital inicial y final.",summary:"ROI, beneficio y rendimiento anualizado.",keywords:["rentabilidad","ROI","inversión"]},
 {slug:"objetivo-de-ahorro",name:"Objetivo de ahorro",category:"finanzas",description:"Calcula cuánto debes aportar cada mes para alcanzar un objetivo de ahorro con una tasa anual estimada.",summary:"Aporte mensual necesario para llegar a una meta.",keywords:["ahorro","meta de ahorro","aporte mensual"]},
 {slug:"inflacion-y-poder-adquisitivo",name:"Inflación y poder adquisitivo",category:"finanzas",description:"Estima cómo cambia el valor de una cantidad con una tasa de inflación anual durante varios años.",summary:"Valor futuro y poder adquisitivo ajustado por inflación.",keywords:["inflación","poder adquisitivo","valor real"]},
];

export const financialToolBySlug=(slug:string)=>FINANCIAL_TOOLS.find(tool=>tool.slug===slug);