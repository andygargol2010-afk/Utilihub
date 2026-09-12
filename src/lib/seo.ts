// Vercel serves www.utilihub.net as the primary host. Keep every generated canonical, sitemap, Open Graph and JSON-LD URL aligned with that redirect.
import { englishToolPath } from "./route-slugs";

export const SITE_URL = "https://www.utilihub.net";
export const SITE_NAME = "UtiliHub";
export const DEFAULT_DESCRIPTION = "500+ free online tools: calculators, converters, and utilities for math, finance, education, science, and everyday tasks. No signup.";
export const absoluteUrl = (path:string) => `${SITE_URL}${path.startsWith("/")?path:`/${path}`}`;
export const ogImage = () => absoluteUrl("/og-image.svg");
export const cleanDescription = (value:string,max=160) => {const text=value.replace(/\s+/g," ").trim();return text.length<=max?text:`${text.slice(0,max-1).trimEnd()}…`};
export const toolKeywords = (tool:{name:string;keywords?:string[];category?:string}) => Array.from(new Set([tool.name,...(tool.keywords??[]),tool.category??"online tools","UtiliHub"]));
export const toolPath=(tool:{slug:string;name?:string;category?:string})=>tool.name ? englishToolPath(tool as { name: string; category: string }) : tool.category==="finanzas"?`/finance/${tool.slug}`:`/tools/${tool.slug}`;
export const webApplicationSchema=(tool:{name:string;description:string;slug:string;category?:string})=>({"@type":"WebApplication",name:tool.name,description:tool.description,url:absoluteUrl(toolPath(tool)),applicationCategory:"UtilityApplication",operatingSystem:"Any",isAccessibleForFree:true,offers:{"@type":"Offer",price:"0",priceCurrency:"USD"},publisher:{"@type":"Organization",name:SITE_NAME,url:SITE_URL}});
export const breadcrumbSchema=(items:Array<{name:string;path?:string}>)=>({"@type":"BreadcrumbList",itemListElement:items.map((item,index)=>({"@type":"ListItem",position:index+1,name:item.name,...(item.path?{item:absoluteUrl(item.path)}:{})}))});
export const faqSchema=(faq:Array<{q:string;a:string}>)=>({"@type":"FAQPage",mainEntity:faq.map(item=>({"@type":"Question",name:item.q,acceptedAnswer:{"@type":"Answer",text:item.a}}))});
export const websiteSchema=()=>({"@context":"https://schema.org","@type":"WebSite",name:SITE_NAME,url:SITE_URL,description:DEFAULT_DESCRIPTION,potentialAction:{"@type":"SearchAction",target:{"@type":"EntryPoint",urlTemplate:`${SITE_URL}/tools?search={search_term_string}`},"query-input":"required name=search_term_string"}});
