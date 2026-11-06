/** pt-BR site chrome (header + footer). /pt routes where they exist, EN pages only where there is no PT version. */
export const PT_NAV = [
  { href: "/pt/ferramentas", label: "Ferramentas" },
  { href: "/pt/kits", label: "Kits" },
  { href: "/pt/simuladores", label: "Simuladores" },
  { href: "/pt/playgrounds", label: "Playgrounds" },
  { href: "/pt/jornadas", label: "Jornadas" },
  { href: "/pt/jogos", label: "Jogos" },
] as const;

/** Category hubs have no PT version yet: link to EN. */
export const PT_CATEGORIES = [
  { href: "/category/advanced-tools", label: "Ferramentas avançadas (EN)" },
  { href: "/category/math", label: "Matemática (EN)" },
  { href: "/category/text", label: "Texto (EN)" },
  { href: "/finance", label: "Finanças (EN)" },
  { href: "/hubs/documents-and-files", label: "Documentos e arquivos (EN)" },
] as const;

export const PT_INFO = [
  { href: "/pt/ferramentas", label: "Todas as ferramentas" },
  { href: "/pt/jogos", label: "Jogos" },
  { href: "/pt/simuladores", label: "Simuladores" },
  { href: "/pt/kits", label: "Kits por objetivo" },
  { href: "/pt/sobre", label: "Sobre" },
  { href: "/pt/privacidade", label: "Privacidade" },
  { href: "/pt/cookies", label: "Política de cookies" },
  { href: "/pt/contato", label: "Contato" },
] as const;

export const PT_CHROME = {
  homeAria: "Início do UtiliHub",
  tagline: "Resolva em segundos",
  mainNav: "Principal",
  mobileNav: "Menu móvel",
  openMenu: "Abrir menu",
  closeMenu: "Fechar menu",
  home: "Início",
  categories: "Categorias",
  language: "Idioma",
  footerBlurb: "Ferramentas online grátis para calcular, converter e resolver tarefas sem complicação.",
  footerBadge: "Sem cadastro · Privacidade local",
  explore: "Explorar",
  info: "Informações",
  footerNote: "Feito para resolver problemas, não para criá-los.",
} as const;
