import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About | ${SITE_NAME}` },
      { name: "description", content: `About ${SITE_NAME}: free online tools, calculators, converters and educational resources. No account required. Operated from Argentina.` },
      { property: "og:title", content: `About | ${SITE_NAME}` },
      { property: "og:description", content: `Free online tools and educational resources. No signup. Browser-based.` },
      { property: "og:url", content: `${SITE_URL}/about` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>About {SITE_NAME}</h1>
        <p>
          {SITE_NAME} is a free collection of online tools, calculators, converters, simulators and educational resources.
          Everything runs in your browser — no account, no installation, and no personal data stored on our servers for the tools themselves.
        </p>
        <h2>What we offer</h2>
        <p>
          Practical utilities for everyday tasks: finance, text, design, security, education, games and interactive experiences.
          Results are computed locally or with transparent formulas. They are informational and educational; they do not replace professional advice.
        </p>
        <h2>How it works</h2>
        <p>
          Open any tool, enter your inputs, and get an instant result. Many tools support English and Spanish. Interactive playgrounds
          (mandalas, particles, signatures, etc.) give immediate visual feedback and can be exported or shared.
        </p>
        <h2>Operator</h2>
        <p>
          The site is operated by a small team based in Argentina. For questions, bug reports or suggestions write to
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> or use the contact page.
        </p>
        <h2>Privacy and ads</h2>
        <p>
          Tools do not require login. We may show third-party advertisements (including Adsterra) to support the free service.
          See our Privacy page for details on cookies and opt-out options. We do not sell personal data.
        </p>
        <p>
          Built to solve problems, not create them.
        </p>
      </article>
    </main>
  );
}
