# UtiliHub

UtiliHub is a free web hub for practical calculators, converters, text utilities, date tools and browser-local security utilities.

## Architecture

- GitHub is the source of truth.
- Lovable is only the original prototype/source of the initial UI.
- Vercel is the intended production host.
- Most tools run entirely in the browser and require no backend.
- Vercel Analytics and Speed Insights are included in the application shell.

## SEO

Each tool has its own clean URL, metadata, canonical URL, internal links, breadcrumbs and structured data where appropriate. The project also exposes `robots.txt` and a production sitemap.

## Development

```bash
npm install
npm run dev
npm run build
```
