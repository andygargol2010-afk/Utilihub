import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/legal")({
  head: () => ({ meta: [{ title: `Legal notice | ${SITE_NAME}` }, { name: "description", content: `Legal notice, operator, and terms of use for ${SITE_NAME}.` }], links: [{ rel: "canonical", href: `${SITE_URL}/legal` }] }),
  component: LegalNoticePage,
});

function LegalNoticePage() {
  return <main className="container-page py-8 sm:py-12"><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Legal notice" }]} /><article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
    <h1>Legal notice</h1>
    <p><strong>{SITE_NAME}</strong> provides tools and content for informational and educational purposes to an international audience. The information does not replace professional advice or decisions made under individual judgment.</p>
    <h2>Site operator</h2>
    <p>Our team operates {SITE_NAME} and is based in Argentina. For site-related inquiries you can write to <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> or call <a href="tel:+5491162517976">+54 9 11 6251-7976</a>.</p>
    <p>The site is aimed at users in different countries. A residential address is not published; communications are received through the channels indicated.</p>
    <h2>Purpose</h2>
    <p>{SITE_NAME} offers calculators, converters, educational utilities, and practical resources to make everyday tasks easier and to support understanding of various concepts.</p>
    <p>Results are based on the parameters entered by the user and on simulation assumptions. They do not constitute investment recommendations, financial, medical, legal, or personalized professional advice.</p>
    <h2>Use and liability</h2>
    <p>The user uses the tools under their own responsibility and must assess the suitability of the results before making economic, financial, or any other significant decisions.</p>
    <p>To the extent permitted by applicable law, the operator shall not be liable for direct, indirect, incidental, or consequential damages arising from the use of the tools or the interpretation of their results.</p>
    <h2>Availability and third parties</h2>
    <p>There is no guarantee that all tools are free of errors, available at all times, or adapted to the laws of every country. The site may include third-party technical dependencies and resources, whose providers maintain their own terms and policies.</p>
  </article></main>;
}
