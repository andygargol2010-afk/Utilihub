import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/pt/contato")({
  head: () => ({
    meta: [
      { title: `Contato | ${SITE_NAME}` },
      { name: "description", content: `Informações de contato e suporte para ${SITE_NAME}.` },
      { property: "og:title", content: `Contato | ${SITE_NAME}` },
      { property: "og:description", content: `Informações de contato e suporte para ${SITE_NAME}.` },
      { property: "og:url", content: absoluteUrl("/pt/contato") },
      { property: "og:locale", content: "pt_BR" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/contato") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/contato") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/contact") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/contacto") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/contact") },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Início", to: "/pt" }, { label: "Contato" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Contato</h1>
        <p>Se precisar perguntar como o {SITE_NAME} funciona, reportar um bug, sugerir uma melhoria ou levantar uma questão legal ou de privacidade, você pode nos alcançar pelos canais abaixo.</p>
        <h2>Canais de contato</h2>
        <ul>
          <li>Email: <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a></li>
          <li>Telefone: <a href="tel:+5491162517976">+54 9 11 6251-7976</a></li>
          <li>Relatos técnicos: <a href="https://github.com/andygargol2010-afk/Utilihub/issues" target="_blank" rel="noreferrer">Issues do repositório GitHub</a></li>
        </ul>
        <p>Nossa equipe está baseada na Argentina e atende consultas de usuários internacionais pelos canais acima.</p>
        <h2>O que incluir em um relato</h2>
        <p>Indique a ferramenta ou URL afetada, os passos para reproduzir o problema, o resultado esperado e o resultado atual. Não inclua senhas, dados financeiros, documentos de identidade ou outras informações confidenciais.</p>
      </article>
    </main>
  );
}
