import { CATEGORIES, TOOLS, type Tool } from "./tools";
import { FINANCIAL_TOOLS } from "./financial-tools";

export type CatalogTool=Omit<Tool,"category"> & { category:string };
export const ALL_CATEGORIES=[...CATEGORIES,{slug:"finanzas",name:"Finanzas",title:"Calculadoras financieras online | UtiliHub",description:"Calculadoras y herramientas financieras gratuitas para inversión, ahorro, préstamos, inflación y carteras.",intro:"Herramientas financieras que ejecutan sus cálculos en el navegador. Incluyen inversión, préstamos, ahorro, inflación, carteras, jubilación y renta fija."}];
const financialCards:CatalogTool[]=FINANCIAL_TOOLS.map((tool)=>({
  ...tool,title:`${tool.name} | UtiliHub`,category:"finanzas",about:[tool.description],steps:["Introduce los valores que quieras analizar.","Pulsa «Calcular» para ejecutar la fórmula.","Revisa los resultados y sus unidades."],faq:[{q:"¿Estos resultados son asesoramiento financiero?",a:"No. Son cálculos matemáticos orientativos y no sustituyen asesoramiento profesional."}]
}));
export const ALL_TOOLS:CatalogTool[]=[...TOOLS,...financialCards];
export const allToolBySlug=(slug:string)=>ALL_TOOLS.find((tool)=>tool.slug===slug);
export const allToolsByCategory=(slug:string)=>ALL_TOOLS.filter((tool)=>tool.category===slug);
export const allCategoryBySlug=(slug:string)=>ALL_CATEGORIES.find((category)=>category.slug===slug);
