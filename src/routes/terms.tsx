import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `Terms of Use | ${SITE_NAME}` },
      { name: "description", content: `Terms of Use for ${SITE_NAME}: acceptable use, liability, advertisements, intellectual property and contact.` },
      { property: "og:title", content: `Terms of Use | ${SITE_NAME}` },
      { property: "og:description", content: `Acceptable use, liability, ads and intellectual property for ${SITE_NAME}.` },
      { property: "og:url", content: absoluteUrl("/terms") },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/terms` },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/terms") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/terminos") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/terms") },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Terms of Use" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Terms of Use</h1>
        <p>
          These Terms of Use govern your access to and use of <strong>{SITE_NAME}</strong>, including all tools,
          calculators, interactive experiences, content and services. By using the site you agree to these terms.
          The operator is based in Argentina and the site is offered to an international audience.
        </p>

        <h2>Acceptable use</h2>
        <p>
          You may use the tools and content for personal, educational and non-commercial purposes. You agree not to:
        </p>
        <ul>
          <li>Use the site in any way that violates applicable law or the rights of others;</li>
          <li>Attempt to disrupt, overload, reverse-engineer or interfere with the operation of the site or its tools;</li>
          <li>Scrape, crawl or systematically extract content at a volume that impairs service for others;</li>
          <li>Upload or transmit malicious code, spam or content that is unlawful, defamatory or infringing.</li>
        </ul>
        <p>
          Results from calculators and simulators are informational and educational. They do not constitute professional,
          financial, legal, medical or other specialized advice. Always verify important decisions with a qualified professional.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The site design, branding, original text, illustrations and software are owned by the operator or its licensors
          and are protected by applicable intellectual property laws. You may not copy, modify, distribute or create
          derivative works from the site's proprietary materials without prior written permission, except for limited
          personal or educational use of individual tool outputs.
        </p>
        <p>
          Third-party trademarks, logos and content remain the property of their respective owners.
        </p>

        <h2>Advertisements</h2>
        <p>
          To keep {SITE_NAME} free, we may display third-party advertisements, including from <strong>Adsterra</strong>
          and other networks. These ads are provided by independent third parties. We do not control their content and
          are not responsible for the products, services or claims advertised. Your interaction with advertisers is
          solely between you and the advertiser. See our Privacy policy for information about cookies and tracking
          technologies used by advertising partners.
        </p>

        <h2>Disclaimer of warranties</h2>
        <p>
          The site and all tools are provided "as is" and "as available" without warranties of any kind, whether express
          or implied, including but not limited to warranties of merchantability, fitness for a particular purpose,
          accuracy or non-infringement. We do not warrant that the site will be uninterrupted, error-free or free of
          viruses or other harmful components.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by applicable law, the operator, its contributors and affiliates shall not be
          liable for any direct, indirect, incidental, special, consequential or punitive damages arising out of or
          related to your use of (or inability to use) the site, tools or content, even if advised of the possibility of
          such damages. This includes damages for loss of profits, data, goodwill or other intangible losses.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these Terms of Use from time to time. Continued use of the site after changes are posted
          constitutes acceptance of the revised terms. The date of the latest revision will be indicated when material
          changes are made.
        </p>

        <h2>Contact</h2>
        <p>
          For questions about these terms, please contact us at{" "}
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> or visit the Contact page.
        </p>
      </article>
    </main>
  );
}
