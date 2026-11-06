#!/usr/bin/env node
/**
 * Generic SEO-locale guard (see .agent/seo-locales-registry.md, "Definition of done").
 *   node scripts/check-locale.mjs --locale=pt [http://host:port]
 * Same checks as check-pt-locale.mjs (header <nav>, no English UI phrases, internal links 200)
 * applied to every /<locale> URL in sitemap.xml. Run together with scripts/check-sitemap-links.mjs.
 */
import "./check-pt-locale.mjs";
