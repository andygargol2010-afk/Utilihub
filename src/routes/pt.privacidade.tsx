import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/pt/privacidade")({
  head: () => ({
    meta: [
      { title: `Política de privacidade | ${SITE_NAME}` },
      { name: "description", content: `Política de privacidade e tratamento de dados de ${SITE_NAME}, incluindo cookies publicitários, terceiros, direitos do usuário, opt-outs, retenção e bases legais.` },
      { property: "og:title", content: `Política de privacidade | ${SITE_NAME}` },
      { property: "og:description", content: `Política de privacidade e tratamento de dados de ${SITE_NAME}.` },
      { property: "og:url", content: absoluteUrl("/pt/privacidade") },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/pt/privacidade` },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/privacidade") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/privacy") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/privacidad") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/privacy") },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Início", to: "/pt" }, { label: "Privacidade" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Política de privacidade</h1>
        <p className="text-sm text-muted-foreground">Última atualização: 5 de novembro de 2026</p>
        <p>
          Esta política explica como <strong>{SITE_NAME}</strong> trata as informações que podem ser coletadas ao
          navegar ou usar o site. {SITE_NAME} é voltado para um público internacional e seu operador está baseado
          na Argentina. Para detalhes sobre cookies e tecnologias semelhantes, consulte nossa <a href="/pt/cookies">Política de Cookies</a>.
        </p>
        <h2>Pontos principais</h2>
        <ul>
          <li>Não são necessárias contas; as ferramentas processam dados localmente no seu navegador.</li>
          <li>Não vendemos dados pessoais.</li>
          <li>Parceiros publicitários de terceiros (incluindo Adsterra e potencialmente Google AdSense) podem definir cookies para entrega, medição e personalização de anúncios quando permitido.</li>
          <li>Você pode controlar ou optar por não receber publicidade personalizada através das configurações do navegador ou ferramentas do setor (ver Métodos de opt-out).</li>
          <li>Entre em contato conosco para qualquer solicitação de direitos sobre dados.</li>
        </ul>
        <h2>Informações que podemos processar</h2>
        <p>
          Podemos processar dados técnicos básicos de navegação, como tipo de navegador, sistema operacional, idioma,
          páginas visitadas, duração da sessão, endereço IP e dados de segurança do site, para fins de
          estatísticas, manutenção técnica e proteção contra erros ou abusos.
        </p>
        <p>
          Calculadoras, conversores e utilitários compatíveis processam os valores que você insere localmente no navegador. Não exigimos contas, senhas ou informações financeiras pessoais para usar as ferramentas.
        </p>
        <h2>Preferências locais</h2>
        <p>
          Alguns recursos, como favoritos, ferramentas recentes ou preferências de uso, podem ser armazenados no
          armazenamento local do seu navegador para melhorar a experiência. Você pode removê-los nas configurações do navegador.
        </p>
        <h2>Análise e desempenho</h2>
        <p>
          UtiliHub pode usar <strong>Vercel Analytics</strong> e <strong>Vercel Speed Insights</strong> para
          compreender o uso agregado e métricas de desempenho, detectar problemas técnicos e melhorar a estabilidade. Esses provedores podem processar informações técnicas de visitas sob suas próprias políticas.
        </p>
        <h2>Publicidade de terceiros e cookies</h2>
        <p>
          Para manter o site gratuito, podemos exibir anúncios de parceiros de terceiros, incluindo Adsterra e potencialmente Google AdSense ou redes semelhantes. Esses parceiros podem definir cookies ou usar tecnologias semelhantes (como web beacons ou identificadores de dispositivo) para entregar, medir e (quando permitido pela lei e suas escolhas) personalizar anúncios com base em suas visitas a este e outros sites. Não controlamos esses cookies de terceiros. Seu uso é regido pelas políticas de privacidade dos parceiros.
        </p>
        <p>
          Fornecedores de terceiros, incluindo o Google, podem usar cookies para veicular anúncios com base em visitas anteriores do usuário a este site ou a outros sites. O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios aos usuários com base em sua visita a este site e/ou a outros sites na Internet.
        </p>
        <h2>Preparação para redes de publicidade</h2>
        <p>
          Essas divulgações são estruturadas para atender às expectativas comuns de parceiros de publicidade (incluindo possível Google AdSense) sobre cookies de terceiros, processamento de dados, direitos do usuário e opt-outs. A publicidade Adsterra e menções relacionadas permanecem totalmente intactas e sem modificações.
        </p>
        <h2>Seus direitos</h2>
        <p>
          Dependendo da sua localização, você pode ter direitos em relação a dados pessoais, incluindo o direito de acessar, corrigir, excluir ou restringir o processamento de suas informações, e de se opor ou optar por não participar de certos usos (como publicidade personalizada). Você pode exercer esses direitos entrando em contato conosco ou usando os métodos de opt-out descritos abaixo e em nossa Política de Cookies.
        </p>
        <h2>Métodos de opt-out</h2>
        <ul>
          <li>Gerencie cookies e armazenamento local por meio das configurações do seu navegador.</li>
          <li>Opte por não receber publicidade personalizada via <a href="https://adssettings.google.com">Google Ad Settings</a>, a <a href="https://optout.networkadvertising.org">Network Advertising Initiative</a>, <a href="https://aboutads.info">aboutads.info</a> ou equivalente local.</li>
          <li>Use extensões de navegador ou bloqueadores de anúncios se desejar (observe que isso pode afetar a funcionalidade do site e não remove a publicidade Adsterra).</li>
          <li>Entre em contato conosco para solicitações de acesso ou exclusão de dados.</li>
        </ul>
        <h2>Retenção de dados</h2>
        <p>
          Dados técnicos e de análise são retidos apenas pelo tempo necessário para os fins descritos (tipicamente agregados ou logs de curto prazo). O armazenamento local permanece no seu dispositivo até que você o limpe. Não mantemos perfis pessoais de longo prazo.
        </p>
        <h2>Bases legais para o processamento</h2>
        <p>
          O processamento baseia-se em interesses legítimos (operação do site, segurança, análise), necessidade contratual quando aplicável, ou consentimento para recursos opcionais e publicidade personalizada quando exigido por lei.
        </p>
        <h2>Transferências internacionais de dados</h2>
        <p>
          Os dados podem ser processados por provedores localizados fora da Argentina ou do seu país (incluindo UE/EEE ou EUA). Contamos com salvaguardas apropriadas, como cláusulas contratuais padrão ou decisões de adequação quando aplicável.
        </p>
        <h2>Privacidade de crianças</h2>
        <p>
          O site não é direcionado a crianças menores de 16 anos. Não coletamos conscientemente informações pessoais de crianças. Se você acredita que uma criança forneceu dados, entre em contato conosco para exclusão.
        </p>
        <h2>Uso das informações</h2>
        <p>
          As informações são usadas para melhorar a experiência, manter a segurança, analisar o comportamento geral do site, otimizar a entrega de conteúdo e apoiar o acesso gratuito por meio de publicidade. Não vendemos dados pessoais nem os compartilhamos de forma contrária à lei aplicável, exceto quando houver exigência legal, obrigação contratual ou consentimento expresso quando aplicável.
        </p>
        <h2>Direitos e consultas</h2>
        <p>
          Para consultar, corrigir ou solicitar informações sobre o processamento de dados, você pode escrever para{" "}
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> ou ligar para{" "}
          <a href="tel:+5491162517976">+54 9 11 6251-7976</a>.
        </p>
        <h2>Atualizações</h2>
        <p>
          Esta política pode ser atualizada quando os recursos do site, os serviços usados ou as regulamentações aplicáveis mudarem. A data acima reflete a última revisão.
        </p>
      </article>
    </main>
  );
}
