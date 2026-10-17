import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: `Cookie Policy | ${SITE_NAME}` },
      { name: "description", content: `Cookie Policy for ${SITE_NAME}: analytics, advertising cookies, local storage, opt-out methods and third-party processors.` },
      { property: "og:title", content: `Cookie Policy | ${SITE_NAME}` },
      { property: "og:description", content: `How ${SITE_NAME} uses cookies and similar technologies.` },
      { property: "og:url", content: absoluteUrl("/cookies") },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/cookies` },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/cookies") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/cookies") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/cookies") },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cookie Policy" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Cookie Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: October 2026</p>
        <p>
          This Cookie Policy explains how <strong>{SITE_NAME}</strong> uses cookies and similar technologies (such as
          local storage) when you visit the site. It complements our <a href="/privacy">Privacy Policy</a>. The
          operator is based in Argentina and the site serves an international audience.
        </p>

        <h2>What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device by websites you visit. They help sites remember preferences,
          understand usage, and deliver relevant content or advertising. We also use local storage in your browser for
          certain preferences that do not leave your device.
        </p>

        <h2>Cookies and technologies we use</h2>
        <h3>Analytics (Vercel)</h3>
        <p>
          We use <strong>Vercel Analytics</strong> and <strong>Vercel Speed Insights</strong> to collect aggregated,
          anonymized information about how visitors use the site (pages viewed, performance metrics, general traffic
          patterns). This helps us improve speed, stability, and content. Vercel processes this technical data under its
          own privacy policy.
        </p>

        <h3>Advertising (Adsterra and partners)</h3>
        <p>
          To keep {SITE_NAME} free, we display advertisements from <strong>Adsterra</strong> and its advertising
          partners. These partners may set cookies or use similar technologies to deliver and measure ads, prevent fraud,
          and (where permitted) personalize advertising. We do not control the cookies set by these third parties. Their
          use is governed by their own policies.
        </p>

        <h3>Local storage preferences</h3>
        <p>
          Certain features store data only in your browser's local storage, such as favorite tools, recently used tools,
          interface preferences, and (if applicable) cookie consent choices. This data stays on your device and is not
          sent to our servers. You can clear it at any time through your browser settings.
        </p>

        <h2>Opt-out and control methods</h2>
        <ul>
          <li>
            <strong>Browser settings:</strong> Most browsers let you block or delete cookies. Check your browser's help
            section for instructions. Blocking all cookies may affect site functionality.
          </li>
          <li>
            <strong>Advertising preferences:</strong> You can manage interest-based advertising through industry tools
            such as the Digital Advertising Alliance (DAA) or your local equivalent, or by using an ad blocker.
          </li>
          <li>
            <strong>Local storage:</strong> Clear site data or local storage for this domain in your browser settings to
            remove stored preferences.
          </li>
          <li>
            Note that some advertising technologies may still operate based on other signals even if cookies are
            restricted. We do not remove or disable Adsterra advertising.
          </li>
        </ul>

        <h2>Third-party processors</h2>
        <p>
          Key third parties that may process technical or advertising data include:
        </p>
        <ul>
          <li><strong>Vercel</strong> — hosting, analytics, and performance insights.</li>
          <li><strong>Adsterra</strong> and its advertising partners — ad delivery and measurement.</li>
        </ul>
        <p>
          We recommend reviewing their privacy policies for full details. We do not sell personal information.
        </p>

        <h2>Updates</h2>
        <p>
          We may update this Cookie Policy when our use of cookies or third-party services changes. The date above
          reflects the latest revision.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> or visit the Contact page.
        </p>
      </article>
    </main>
  );
}
