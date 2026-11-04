// Part 1 of 3 — split from tools.ts on 2026-11-04. Edit here; tools.ts re-exports.

export type CategorySlug = "calculadoras" | "conversores" | "texto" | "fechas" | "seguridad";
export interface Category { slug: CategorySlug; name: string; title: string; description: string; intro: string; }
export interface FaqItem { q: string; a: string; }
export interface Tool { slug: string; name: string; title: string; description: string; summary: string; category: CategorySlug; keywords: string[]; about: string[]; steps: string[]; faq: FaqItem[]; }

export const CATEGORIES: Category[] = [
  { slug:"calculadoras", name:"Calculators", title:"Free online calculators | UtiliHub", description:"Free online calculators with no signup: arithmetic, percentages, and rule of three. They run in the browser without sending data.", intro:"Calculation tools for everyday operations. All run in your browser, so they respond instantly and do not need a connection once the page is loaded." },
  { slug:"conversores", name:"Converters", title:"Online unit converters | UtiliHub", description:"Convert length, weight, and temperature with standard conversion factors. Fast, free converters with no signup.", intro:"Converters based on International System factors and official imperial equivalences. Enter a value and get the result as you type." },
  { slug:"texto", name:"Text", title:"Online text tools | UtiliHub", description:"Analyze and work with text in the browser: word count, characters, sentences, and estimated reading time.", intro:"Utilities for writing and reviewing text. The content you paste never leaves your device because processing happens in the browser." },
  { slug:"fechas", name:"Dates", title:"Online date calculators | UtiliHub", description:"Calculate the difference between two dates in days, weeks, months, and years, including business days.", intro:"Tools for working with calendars: date differences, deadlines, and business-day counts." },
  { slug:"seguridad", name:"Security", title:"Online security tools | UtiliHub", description:"Generate secure passwords in your own browser with the system cryptographic API. No data upload.", intro:"Security utilities that run locally. Nothing you generate is transmitted or stored on a server." },
];
