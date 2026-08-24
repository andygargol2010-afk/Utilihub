import { CATEGORIES, TOOLS, type Tool } from "./tools";
import { FINANCIAL_TOOLS } from "./financial-tools";
import { GENERAL_CATEGORIES, GENERAL_TOOLS } from "./general";
import { LEGACY_CATEGORY_REDIRECTS } from "./category-catalog";

export type CatalogTool = Omit<Tool, "category"> & { category: string };

const FINANCIAL_CATEGORY = { slug:"finanzas", name:"Finanzas", title:"Calculadoras financieras online | UtiliHub", description:"Calculadoras y herramientas financieras gratuitas para inversión, ahorro, préstamos, inflación y carteras.", intro:"Herramientas financieras que ejecutan sus cálculos en el navegador. Incluyen inversión, préstamos, ahorro, inflación, carteras, jubilación y renta fija." };

// The new modular categories are canonical. Legacy categories remain only as
// compatibility aliases for old URLs; they are never rendered in navigation.
export const ALL_CATEGORIES = [FINANCIAL_CATEGORY, ...GENERAL_CATEGORIES];

const financialCards:CatalogTool[]=FINANCIAL_TOOLS.map(tool=>({...tool,title:`${tool.name} | UtiliHub`,category:"finanzas",about:[tool.description],steps:["Introduce los valores que quieras analizar.","Pulsa «Calcular» para ejecutar la fórmula.","Revisa los resultados y sus unidades."],faq:[{q:"¿Estos resultados son asesoramiento financiero?",a:"No. Son cálculos matemáticos orientativos y no sustituyen asesoramiento profesional."}]}));

const legacyCategory = (category:string) => LEGACY_CATEGORY_REDIRECTS[category] ?? category;
const legacyCards:CatalogTool[]=TOOLS.map(tool=>({...tool,category:legacyCategory(tool.category)}));
const generalCards:CatalogTool[]=GENERAL_TOOLS.map(tool=>({...tool}));

// New modular tools take precedence over old entries with the same slug.
const uniqueBySlug=(tools:CatalogTool[])=>{const seen=new Set<string>();return tools.filter(tool=>{if(seen.has(tool.slug))return false;seen.add(tool.slug);return true})};
export const ALL_TOOLS:CatalogTool[]=uniqueBySlug([...generalCards,...financialCards,...legacyCards]);
export const allToolBySlug=(slug:string)=>ALL_TOOLS.find(tool=>tool.slug===slug);
export const allToolsByCategory=(slug:string)=>ALL_TOOLS.filter(tool=>tool.category===slug);
export const allCategoryBySlug=(slug:string)=>ALL_CATEGORIES.find(category=>category.slug===slug);
export const legacyCategoryBySlug=(slug:string)=>CATEGORIES.find(category=>category.slug===slug);
