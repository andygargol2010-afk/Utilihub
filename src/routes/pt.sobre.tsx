import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/pt/sobre")({
  head: () => ({
    meta: [
      { title: `Sobre | ${SITE_NAME}` },
      { name: "description", content: `Sobre o ${SITE_NAME}: ferramentas online grátis, calculadoras, conversores e recursos educacionais. Sem cadastro. Operado da Argentina.` },
      { property: "og:title", content: `Sobre | ${SITE_NAME}` },
      { property: "og:description", content: `Ferramentas online grátis e recursos educacionais. Sem cadastro. Baseado no navegador.` },
      { property: "og:url", content: absoluteUrl("/pt/sobre") },
      { property: "og:locale", content: "pt_BR" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/sobre") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/sobre") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/about") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/acerca") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/about") },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Início", to: "/pt" }, { label: "Sobre" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Sobre o {SITE_NAME}</h1>
        <p>
          O {SITE_NAME} é uma coleção gratuita de ferramentas online, calculadoras, conversores, simuladores e recursos educacionais.
          Tudo roda no seu navegador — sem conta, sem instalação e sem dados pessoais armazenados em nossos servidores para as ferramentas em si.
        </p>
        <h2>O que oferecemos</h2>
        <p>
          Utilitários práticos para tarefas do dia a dia: finanças, texto, design, segurança, educação, jogos e experiências interativas.
          Os resultados são calculados localmente ou com fórmulas transparentes. São informativos e educacionais; não substituem aconselhamento profissional.
        </p>
        <h2>Como funciona</h2>
        <p>
          Abra qualquer ferramenta, insira seus dados e obtenha um resultado instantâneo. Muitas ferramentas suportam inglês e espanhol. Playgrounds interativos
          (mandalas, partículas, assinaturas, etc.) dão feedback visual imediato e podem ser exportados ou compartilhados.
        </p>
        <h2>Operador</h2>
        <p>
          O site é operado por uma pequena equipe baseada na Argentina. Para perguntas, relatórios de bugs ou sugestões escreva para
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> ou use a página de contato.
        </p>
        <h2>Privacidade e anúncios</h2>
        <p>
          As ferramentas não exigem login. Podemos exibir anúncios de terceiros (incluindo Adsterra) para apoiar o serviço gratuito.
          Veja nossa página de Privacidade para detalhes sobre cookies e opções de opt-out. Não vendemos dados pessoais.
        </p>
        <p>
          Construído para resolver problemas, não para criá-los.
        </p>
      </article>
    </main>
  );
}
