import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About | ${SITE_NAME}` },
      { name: "description", content: `About ${SITE_NAME}: free online tools, calculators, converters, simulators, games and educational resources. No account required. Operated from Argentina. Original content focused on practical utilities.` },
      { property: "og:title", content: `About | ${SITE_NAME}` },
      { property: "og:description", content: `Free online tools and educational resources. No signup. Browser-based. Original purpose: solve everyday problems with transparent, local computation.` },
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
        <p className="text-sm text-muted-foreground">Last updated: 9 November 2026</p>
        <p>
          {SITE_NAME} is a free collection of online tools, calculators, converters, simulators, games and educational resources.
          Everything runs in your browser — no account, no installation, and no personal data stored on our servers for the tools themselves.
          Our goal is to provide practical, transparent utilities that help with everyday tasks without friction.
        </p>
        <h2>What we offer</h2>
        <p>
          Practical utilities for everyday tasks: finance, text, design, security, education, games and interactive experiences.
          Results are computed locally or with transparent formulas. They are informational and educational; they do not replace professional advice.
          We focus on original interactive experiences that go beyond simple calculators, including kits, journeys, classic games and simulators.
        </p>
        <h2>How it works</h2>
        <p>
          Open any tool, enter your inputs, and get an instant result. Many tools support English and Spanish. Interactive playgrounds,
          kits and games give immediate visual feedback and can be exported or shared via PNG or URL deep-links.
          The site is designed to be mobile-first and accessible.
        </p>
        <h2>Our purpose</h2>
        <p>
          UtiliHub exists to make useful, high-quality digital tools freely available. We believe in browser-based computation that respects user privacy,
          original content that solves real problems, and a variety of experiences from educational kits to classic games. Content is created and maintained
          to be substantive, not thin, supporting both users and future monetization compliance.
        </p>
        <h2>Content density and originality</h2>
        <p>
          All pages and tools feature original, substantive content. We avoid thin or duplicated pages. Educational experiences include guided kits, step-by-step journeys,
          classic public-domain games with clear rules, and simulators that model real cause-and-effect systems. This density supports better user value and compliance with advertising network policies.
        </p>
        <h2>Operator</h2>
        <p>
          The site is operated by a small team based in Argentina. For questions, bug reports or suggestions write to
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> or use the contact page.
        </p>
        <h2>Privacy and ads</h2>
        <p>
          Tools do not require login. We may show third-party advertisements (including Adsterra and preparing for Google AdSense) to support the free service.
          See our Privacy and Cookie Policy pages for details on cookies, advertising networks, opt-out options and data handling. We do not sell personal data.
          Adsterra remains fully active and unchanged.
        </p>
        <p>
          Built to solve problems, not create them.
        </p>
      </article>
    </main>
  );
}
