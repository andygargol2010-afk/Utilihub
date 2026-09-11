import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: `Contact | ${SITE_NAME}` }, { name: "description", content: `Contact and support information for ${SITE_NAME}.` }], links: [{ rel: "canonical", href: `${SITE_URL}/contact` }] }),
  component: ContactPage,
});

function ContactPage() {
  return <main className="container-page py-8 sm:py-12"><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Contact" }]} /><article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
    <h1>Contact</h1>
    <p>If you need to ask about how {SITE_NAME} works, report a bug, suggest an improvement, or raise a legal or privacy question, you can reach us through these channels.</p>
    <h2>Contact channels</h2>
    <ul><li>Email: <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a></li><li>Phone: <a href="tel:+5491162517976">+54 9 11 6251-7976</a></li><li>Technical reports: <a href="https://github.com/andygargol2010-afk/Utilihub/issues" target="_blank" rel="noreferrer">GitHub repository issues</a></li></ul>
    <p>Our team is based in Argentina and handles inquiries from international users through the channels above.</p>
    <h2>What to include in a report</h2>
    <p>Indicate the affected tool or URL, the steps to reproduce the problem, the expected result, and the actual result. Do not include passwords, financial data, identity documents, or other confidential information.</p>
  </article></main>;
}
