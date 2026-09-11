import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: `Privacy policy | ${SITE_NAME}` }, { name: "description", content: `Privacy policy and data handling for ${SITE_NAME}.` }], links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <main className="container-page py-8 sm:py-12"><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Privacy" }]} /><article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
    <h1>Privacy policy</h1>
    <p>This policy explains how <strong>{SITE_NAME}</strong> handles information that may be collected when you browse or use the site. {SITE_NAME} is aimed at an international audience and its operator is based in Argentina.</p>
    <h2>Information we may process</h2>
    <p>We may process basic technical browsing data, such as browser type, operating system, language, pages visited, session duration, IP address, and site security data, for statistics, technical maintenance, and protection against errors or abuse.</p>
    <p>Compatible calculators, converters, and utilities process the values you enter locally in the browser. We do not require accounts, passwords, or personal financial information to use the tools.</p>
    <h2>Local preferences</h2>
    <p>Some features, such as favorites, recent tools, or usage preferences, may be stored in your browser's local storage to improve the experience. You can remove them from your browser settings.</p>
    <h2>Analytics and performance</h2>
    <p>UtiliHub may use <strong>Vercel Analytics</strong> and <strong>Vercel Speed Insights</strong> to understand aggregated usage and performance metrics, detect technical issues, and improve stability. These providers may process technical visit information under their own policies.</p>
    <h2>Use of information</h2>
    <p>Information is used to improve the experience, maintain security, analyze general site behavior, and optimize content delivery. We do not sell personal data or share it in ways contrary to applicable law, except where there is a legal requirement, a contractual obligation, or express consent when applicable.</p>
    <h2>Rights and inquiries</h2>
    <p>To consult, correct, or request information about data processing, you can write to <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> or call <a href="tel:+5491162517976">+54 9 11 6251-7976</a>.</p>
    <h2>Updates</h2>
    <p>This policy may be updated when site features, the services used, or applicable regulations change.</p>
  </article></main>;
}
