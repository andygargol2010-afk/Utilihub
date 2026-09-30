# SEO tracking checklist (UtiliHub)

Market priority remains **EN / US+UK ads** (higher eCPM). Spanish pages stay for coverage + hreflang, not as primary acquisition bet.

## Weekly (Vercel Analytics + Search Console)

1. **Google-only engagement**
   - Filter referrer ≈ `google.com` / Android GSA
   - Track: visitors, pageviews, pages/visitor (target > 1.3 on tool landings with related tools)
2. **Top paths by pageviews** (production)
   - Note any path with pages/visitor ≈ 1.0 and high volume → fix related cluster or title/intent mismatch
3. **Search Console** (when connected)
   - Impressions, clicks, CTR, position for top 20 queries
   - Pages with impressions but CTR < 2% → rewrite title/description
4. **Deploy hygiene**
   - Avoid rapid production churn on rankable tool routes
   - Prefer one stable production promote per day max

## Success signals (30 days)

- Google traffic pages/visitor **up** vs baseline week (23–30 Sep 2026: ~1.0)
- Bounce rate on tool landings down without killing ad density
- Stable index coverage (no spike of soft-404 ES paths)

## Do not

- Pivot content strategy to AR-only because of lower bounce there
- Add tools only "for SEO" without a cluster + related links
