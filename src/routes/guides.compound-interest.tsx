import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Compound Interest Explained: Formulas, Examples & Growth Table | UtiliHub";
const description = cleanDescription(
  "Original guide to compound interest. Learn how it works with clear formulas, practical examples, a growth table, and a simple visual. Link to the free UtiliHub compound interest calculator.",
);

export const Route = createFileRoute("/guides/compound-interest")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/guides/compound-interest") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/guides/compound-interest") },
      ...hreflangLinks("/guides/compound-interest", "/es/guias/interes-compuesto"),
    ],
  }),
  component: CompoundInterestGuideEn,
});

function CompoundInterestGuideEn() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Guides", to: "/guides" }, { label: "Compound Interest" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Compound Interest Explained: How Your Money Grows Over Time</h1>
        <p className="lead">
          Compound interest is the process by which interest earns interest. This original guide explains the core idea with clear formulas, practical examples, a growth table, and a simple visual. Use it to understand long-term growth, then jump to the free UtiliHub calculator to model your own numbers.
        </p>

        <h2>What is compound interest?</h2>
        <p>
          Simple interest is calculated only on the original principal. Compound interest is calculated on the principal plus any previously earned interest. The result is exponential growth: the longer the time and the higher the rate, the more dramatic the difference becomes.
        </p>
        <p>
          The classic future-value formula for a lump sum is:
        </p>
        <p className="text-center font-mono text-lg">
          A = P × (1 + r)^t
        </p>
        <p>
          Where A is the final amount, P is the principal, r is the annual interest rate as a decimal, and t is the number of years. For more frequent compounding (monthly, daily, etc.) the formula becomes:
        </p>
        <p className="text-center font-mono">
          A = P × (1 + r/n)^(n×t)
        </p>
        <p>
          Here n is the number of compounding periods per year.
        </p>

        <h2>Practical example</h2>
        <p>
          Suppose you invest $10,000 at 7% annual interest, compounded yearly, for 20 years.
        </p>
        <p>
          A = 10000 × (1 + 0.07)^20 ≈ 10000 × 3.8697 ≈ $38,697.
        </p>
        <p>
          After 30 years the same investment reaches about $76,123. The second decade adds far more absolute dollars than the first because interest is now earning interest on a larger base.
        </p>

        <h2>Growth table (yearly compounding, 7%)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Years</th>
                <th className="text-right">$10,000 grows to</th>
                <th className="text-right">Interest earned</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>5</td><td className="text-right">$14,026</td><td className="text-right">$4,026</td></tr>
              <tr><td>10</td><td className="text-right">$19,672</td><td className="text-right">$9,672</td></tr>
              <tr><td>15</td><td className="text-right">$27,590</td><td className="text-right">$17,590</td></tr>
              <tr><td>20</td><td className="text-right">$38,697</td><td className="text-right">$28,697</td></tr>
              <tr><td>30</td><td className="text-right">$76,123</td><td className="text-right">$66,123</td></tr>
            </tbody>
          </table>
        </div>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Try the calculator</h3>
          <p className="mt-2 text-muted-foreground">
            Enter your own principal, rate, years, and optional contributions to see the exact future value and year-by-year breakdown.
          </p>
          <Link
            to="/finance/compound-interest"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Open Compound Interest Calculator
          </Link>
        </div>

        <h2>Why time matters more than rate</h2>
        <p>
          A common illustration is the “rule of 72”: approximate years to double = 72 / interest rate. At 7% money roughly doubles every 10 years. Starting earlier multiplies the number of doublings, which is why beginning to save in your 20s usually beats waiting until your 40s even with a higher later rate.
        </p>
        <p>
          Adding regular contributions accelerates growth further. The future value of a series of payments has its own formula, but the calculator on UtiliHub handles both lump-sum and contribution scenarios in one place.
        </p>

        <h2>Frequently asked questions</h2>
        <p>
          <strong>Is compound interest the same as compound annual growth rate (CAGR)?</strong> CAGR is the constant annual rate that would produce the same total return over a period. Compound interest is the process; CAGR is a derived metric.
        </p>
        <p>
          <strong>Does more frequent compounding always help?</strong> Yes, but the marginal benefit diminishes. Daily compounding is only slightly better than monthly for most rates. Continuous compounding uses e^(rt) and is the theoretical maximum.
        </p>
        <p>
          <strong>Can compound interest work against me?</strong> Yes. Credit-card and high-interest debt compound in the same way, which is why paying them down quickly is usually the highest-return “investment” available.
        </p>

        <h2>Related tools on UtiliHub</h2>
        <ul>
          <li><Link to="/finance/compound-interest">Compound interest calculator</Link> — full projections with contributions.</li>
          <li><Link to="/finance/savings-goal">Savings goal</Link> — find the monthly amount needed to hit a target.</li>
          <li><Link to="/finance/cagr">CAGR calculator</Link> — measure historical growth rates.</li>
        </ul>

        <h2>Conclusion</h2>
        <p>
          Compound interest turns time into an ally. Understanding the formula, seeing the table, and modeling your own numbers with the calculator makes the long-term effect concrete. Start with the live tool linked above and experiment with different rates and time horizons.
        </p>
      </article>

      <div className="mt-12">
        <AdsterraBanner />
      </div>
    </div>
  );
}
