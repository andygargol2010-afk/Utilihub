import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy policy | ${SITE_NAME}` },
      { name: "description", content: `Privacy policy and data handling for ${SITE_NAME}, including advertising cookies, third parties, user rights and opt-outs.` },
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
        <p className="text-sm text-muted-foreground">Last updated: November 2026</p>
        <p>
          This policy explains how <strong>{SITE_NAME}</strong> handles information that may be collected when you
          browse or use the site. {SITE_NAME} is aimed at an international audience and its operator is based in
          Argentina. For details on cookies and similar technologies, see our <a href="/cookies">Cookie Policy</a>.
        </p>
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
        <h2>Your rights</h2>
        <p>
          Depending on your location, you may have rights regarding personal data, including the right to access, correct, delete, or restrict processing of your information, and to object to or opt out of certain uses (such as personalized advertising). You can exercise these rights by contacting us or using the opt-out methods described below and in our Cookie Policy.
        </p>
        <h2>Opt-out methods</h2>
        <ul>
          <li>Manage cookies and local storage via your browser settings.</li>
          <li>Opt out of personalized advertising via Google Ad Settings (adssettings.google.com) or industry tools such as aboutads.info or your local equivalent.</li>
          <li>Use browser extensions or ad blockers if desired (note that this may affect site functionality and does not remove Adsterra advertising).</li>
          <li>Contact us for data access or deletion requests.</li>
        </ul>
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
