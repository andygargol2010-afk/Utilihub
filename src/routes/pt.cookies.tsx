import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/pt/cookies")({
  head: () => ({
    meta: [
      { title: `Política de Cookies | ${SITE_NAME}` },
      { name: "description", content: `Política de Cookies de ${SITE_NAME}: análise, cookies de publicidade (incluindo Adsterra e potenciais parceiros Google), armazenamento local, métodos de opt-out, processadores de terceiros e retenção.` },
      { property: "og:title", content: `Política de Cookies | ${SITE_NAME}` },
      { property: "og:description", content: `Como ${SITE_NAME} usa cookies e tecnologias semelhantes.` },
      { property: "og:url", content: absoluteUrl("/pt/cookies") },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/pt/cookies` },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/cookies") },
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
      <Breadcrumbs items={[{ label: "Início", to: "/pt" }, { label: "Política de Cookies" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Política de Cookies</h1>
        <p className="text-sm text-muted-foreground">Última atualização: 5 de novembro de 2026</p>
        <p>
          Esta Política de Cookies explica como <strong>{SITE_NAME}</strong> usa cookies e tecnologias semelhantes (como
          armazenamento local) quando você visita o site. Ela complementa nossa <a href="/pt/privacidade">Política de Privacidade</a>. O
          operador está baseado na Argentina e o site atende a um público internacional.
        </p>
        <h2>Pontos principais</h2>
        <ul>
          <li>Cookies de análise do Vercel para insights de desempenho agregados.</li>
          <li>Cookies de publicidade da Adsterra e potencialmente Google AdSense para entrega e medição.</li>
          <li>Armazenamento local para preferências que permanecem no seu dispositivo.</li>
          <li>Opções fáceis de opt-out via navegador ou ferramentas de preferência do setor.</li>
        </ul>

        <h2>O que são cookies?</h2>
        <p>
          Cookies são pequenos arquivos de texto armazenados no seu dispositivo por sites que você visita. Eles ajudam os sites a lembrar preferências,
          entender o uso e entregar conteúdo ou publicidade relevante. Também usamos armazenamento local no seu navegador para
          certas preferências que não saem do seu dispositivo.
        </p>

        <h2>Cookies e tecnologias que usamos</h2>
        <h3>Análise (Vercel)</h3>
        <p>
          Usamos <strong>Vercel Analytics</strong> e <strong>Vercel Speed Insights</strong> para coletar informações agregadas e
          anonimizadas sobre como os visitantes usam o site (páginas visualizadas, métricas de desempenho, padrões gerais de tráfego). Isso nos ajuda a melhorar velocidade, estabilidade e conteúdo. O Vercel processa esses dados técnicos sob sua
          própria política de privacidade.
        </p>

        <h3>Publicidade (Adsterra e parceiros, incluindo potencial Google AdSense)</h3>
        <p>
          Para manter {SITE_NAME} gratuito, exibimos anúncios da <strong>Adsterra</strong> e de seus parceiros de publicidade.
          Esses parceiros podem definir cookies ou usar tecnologias semelhantes para entregar e medir anúncios, prevenir fraudes
          e (quando permitido) personalizar a publicidade. Não controlamos os cookies definidos por esses terceiros. Seu
          uso é regido por suas próprias políticas.
        </p>
        <p>
          Também podemos trabalhar com redes de publicidade adicionais como Google AdSense. Fornecedores de terceiros, incluindo o Google, usam cookies para veicular anúncios com base em visitas anteriores do usuário a este site ou a outros sites. O uso do cookie de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios aos usuários com base em sua visita a este site e/ou a outros sites na Internet. Os usuários podem optar por não usar o cookie de publicidade para publicidade baseada em interesses visitando <a href="https://adssettings.google.com">Google Ad Settings</a> ou <a href="https://aboutads.info">aboutads.info</a>.
        </p>

        <h3>Preferências de armazenamento local</h3>
        <p>
          Certos recursos armazenam dados apenas no armazenamento local do seu navegador, como ferramentas favoritas, ferramentas usadas recentemente,
          preferências de interface e (se aplicável) escolhas de consentimento de cookies. Esses dados permanecem no seu dispositivo e não são
          enviados aos nossos servidores. Você pode limpar isso a qualquer momento através das configurações do navegador.
        </p>

        <h2>Métodos de opt-out e controle</h2>
        <ul>
          <li>
            <strong>Configurações do navegador:</strong> A maioria dos navegadores permite bloquear ou excluir cookies. Verifique a seção de ajuda do seu navegador
            para instruções. Bloquear todos os cookies pode afetar a funcionalidade do site.
          </li>
          <li>
            <strong>Preferências de publicidade:</strong> Você pode gerenciar publicidade baseada em interesses através de ferramentas do setor
            como a Digital Advertising Alliance (DAA), <a href="https://adssettings.google.com">Google Ad Settings</a>, <a href="https://optout.networkadvertising.org">Network Advertising Initiative</a> ou <a href="https://aboutads.info">aboutads.info</a>, ou usando um bloqueador de anúncios.
          </li>
          <li>
            <strong>Armazenamento local:</strong> Limpe os dados do site ou o armazenamento local deste domínio nas configurações do navegador para
            remover preferências armazenadas.
          </li>
          <li>
            Observe que algumas tecnologias de publicidade ainda podem operar com base em outros sinais mesmo se os cookies forem
            restritos. Não removemos ou desativamos a publicidade Adsterra.
          </li>
        </ul>

        <h2>Processadores de terceiros</h2>
        <p>
          Principais terceiros que podem processar dados técnicos ou de publicidade incluem:
        </p>
        <ul>
          <li><strong>Vercel</strong> — hospedagem, análise e insights de desempenho.</li>
          <li><strong>Adsterra</strong> e seus parceiros de publicidade — entrega e medição de anúncios.</li>
          <li>Potenciais parceiros adicionais como Google (AdSense) — entrega e personalização de publicidade (quando habilitado).</li>
        </ul>
        <p>
          Recomendamos revisar suas políticas de privacidade para detalhes completos. Não vendemos informações pessoais. Dados desses processadores são retidos de acordo com suas políticas e nossos interesses legítimos (tipicamente de curto prazo ou agregados).
        </p>

        <h2>Preparação para redes de publicidade</h2>
        <p>
          As divulgações de cookies são preparadas para apoiar requisitos comuns de redes de anúncios para transparência sobre cookies de terceiros e opt-outs. A Adsterra permanece totalmente ativa e inalterada.
        </p>

        <h2>Atualizações</h2>
        <p>
          Podemos atualizar esta Política de Cookies quando nosso uso de cookies ou serviços de terceiros mudar. A data acima
          reflete a última revisão.
        </p>

        <h2>Contato</h2>
        <p>
          Dúvidas sobre esta política? Envie um e-mail para{" "}
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> ou visite a página de Contato.
        </p>
      </article>
    </main>
  );
}
