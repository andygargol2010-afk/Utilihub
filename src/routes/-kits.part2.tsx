// Part 2 of 3 — split from kits.tsx on 2026-11-04. Edit here; kits.tsx re-exports.
import { BriefcaseBusiness, GraduationCap, FileText, Search } from "lucide-react";
import { cleanDescription } from "@/lib/seo";

export const description = cleanDescription(
  "Free online tool kits for freelancers, SEO and content, documents, and students. Chain multiple utilities with no signup.",
);
export const icons = [BriefcaseBusiness, Search, FileText, GraduationCap];
