import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy policy | ${SITE_NAME}` },
      { name: "description", content: `Privacy policy and data handling for ${SITE_NAME}, including advertising cookies, third parties, user rights, opt-outs, retention and legal bases.` },
      { property: "og:title", content: `Privacy policy | ${SITE_NAME}` },
      { property: "og:url", content: absoluteUrl("/privacy") },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/privacy` },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/privacy") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/privacidad") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/privacy") },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Privacy" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Privacy policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: 3 November 2026</p>
        <p>
          This policy explains how <strong>{SITE_NAME}</strong> handles information that may be collected when you
          browse or use the site. {SITE_NAME} is aimed at an international audience and its operator is based in
          Argentina. For details on cookies and similar technologies, see our <a href="/cookies">Cookie Policy</a>.
        </p>
        <h2>Key points</h2>
        <ul>
          <li>No accounts required; tools process data locally in your browser.</li>
          <li>We do not sell personal data.</li>
          <li>Third-party advertising partners (including Adsterra and potentially Google AdSense) may set cookies for ad delivery, measurement and personalization where permitted.</li>
          <li>You can control or opt out of personalized advertising via browser settings or industry tools (see Opt-out methods).</li>
          <li>Contact us for any data rights requests.</li>
        </ul>
        <h2>Information we may process</h2>
        <p>
          We may process basic technical browsing data, such as browser type, operating system, language, pages visited,
          session duration, IP address, and site security data, for statistics, technical maintenance, and protection
          against errors or abuse.
        </p>
        <p>
          Compatible calculators, converters, and utilities process the values you enter locally in the browser. We do
          not require accounts, passwords, or personal financial information to use the tools.
        </p>
        <h2>Local preferences</h2>
        <p>
          Some features, such as favorites, recent tools, or usage preferences, may be stored in your browser's
          local storage to improve the experience. You can remove them from your browser settings.
        </p>
        <h2>Analytics and performance</h2>
        <p>
          UtiliHub may use <strong>Vercel Analytics</strong> and <strong>Vercel Speed Insights</strong> to understand
          aggregated usage and performance metrics, detect technical issues, and improve stability. These providers may
          process technical visit information under their own policies.
        </p>
        <h2>Third-party advertising and cookies</h2>
        <p>
          To keep the site free, we may display advertisements from third-party partners, including Adsterra and potentially Google AdSense or similar networks. These partners may set cookies or use similar technologies (such as web beacons or device identifiers) to deliver, measure, and (where permitted by law and your choices) personalize ads based on your visits to this and other sites. We do not control these third-party cookies. Their use is governed by the partners' own privacy policies.
        </p>
        <p>
          Third-party vendors, including Google, may use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to this site and/or other sites on the Internet.
        </p>
        <h2>Advertising network readiness</h2>
        <p>
          These disclosures are structured to meet common expectations of advertising partners (including potential Google AdSense) regarding third-party cookies, data processing, user rights and opt-outs. Adsterra advertising and related mentions remain fully intact and unmodified.
        </p>
        <h2>Your rights</h2>
        <p>
          Depending on your location, you may have rights regarding personal data, including the right to access, correct, delete, or restrict processing of your information, and to object to or opt out of certain uses (such as personalized advertising). You can exercise these rights by contacting us or using the opt-out methods described below and in our Cookie Policy.
        </p>
        <h2>Opt-out methods</h2>
        <ul>
          <li>Manage cookies and local storage via your browser settings.</li>
          <li>Opt out of personalized advertising via <a href="https://adssettings.google.com">Google Ad Settings</a>, the <a href="https://optout.networkadvertising.org">Network Advertising Initiative</a>, <a href="https://aboutads.info">aboutads.info</a>, or your local equivalent.</li>
          <li>Use browser extensions or ad blockers if desired (note that this may affect site functionality and does not remove Adsterra advertising).</li>
          <li>Contact us for data access or deletion requests.</li>
        </ul>
        <h2>Data retention</h2>
        <p>
          Technical and analytics data are retained only as long as needed for the purposes described (typically aggregated or short-term logs). Local storage remains on your device until you clear it. We do not maintain long-term personal profiles.
        </p>
        <h2>Legal bases for processing</h2>
        <p>
          Processing is based on legitimate interests (site operation, security, analytics), contractual necessity where applicable, or consent for optional features and personalized advertising where required by law.
        </p>
        <h2>International data transfers</h2>
        <p>
          Data may be processed by providers located outside Argentina or your country (including the EU/EEA or US). We rely on appropriate safeguards such as standard contractual clauses or adequacy decisions where applicable.
        </p>
        <h2>Children's privacy</h2>
        <p>
          The site is not directed at children under 16. We do not knowingly collect personal information from children. If you believe a child has provided data, contact us for deletion.
        </p>
        <h2>Use of information</h2>
        <p>
          Information is used to improve the experience, maintain security, analyze general site behavior, optimize
          content delivery, and support free access via advertising. We do not sell personal data or share it in ways contrary to applicable law, except where
          there is a legal requirement, a contractual obligation, or express consent when applicable.
        </p>
        <h2>Rights and inquiries</h2>
        <p>
          To consult, correct, or request information about data processing, you can write to{" "}
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> or call{" "}
          <a href="tel:+5491162517976">+54 9 11 6251-7976</a>.
        </p>
        <h2>Updates</h2>
        <p>
          This policy may be updated when site features, the services used, or applicable regulations change. The date above reflects the latest revision.
        </p>
      </article>
    </div>
  );
}
