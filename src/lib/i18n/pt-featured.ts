/** pt-BR strings for the home "featured" block (keys = internal tool slug). Missing keys fall back to EN. */
export const PT_FEATURED_TOOLS: Record<string, { name: string; summary: string }> = {
  pixelihub: {
    name: "PixeliHub",
    summary: "Estúdio de pixel art grátis: grade de 8 a 256, camadas, simetria, formas, exportação PNG e links compartilháveis, direto no navegador.",
  },
  "modelador-casas-3d": {
    name: "Modelador de casas 3D",
    summary: "Monte o protótipo de uma casa: coloque paredes, pisos e telhados num terreno aberto com câmera livre e céu realista. Arraste para mover as peças.",
  },
  "modelador-3d": {
    name: "Modelador 3D",
    summary: "Crie cenas 3D simples com cubos, esferas e cilindros. Mova, gire, mude a cor e exporte, no estilo Tinkercad e no navegador.",
  },
  "png-a-jpg": { name: "PNG para JPG", summary: "Converta imagens PNG em JPG localmente." },
  "unir-pdf": { name: "Juntar PDF", summary: "Junte documentos PDF localmente quando o navegador permitir." },
  "generador-de-contrasenas": { name: "Gerador de senhas", summary: "Senhas aleatórias configuráveis com estimativa de entropia." },
};

export const PT_FEATURED_COPY = {
  eyebrow: "Destaques",
  title: "Estúdios avançados e jogos",
  subtitle: "Ferramentas avançadas, estúdios 3D e jogos grátis no navegador, sem cadastro.",
  catalog: "Ver catálogo",
  tools: "Ferramentas avançadas",
  games: "Jogos",
  seeAll: "Ver todos",
} as const;

/** pt-BR category names (keys = internal category slug). */
export const PT_CATEGORY_NAMES: Record<string, string> = {
  finanzas: "Finanças",
  matematicas: "Matemática",
  texto: "Texto",
  desarrollo: "Desenvolvimento",
  conversiones: "Conversores",
  fechas: "Datas e tempo",
  generadores: "Geradores",
  diseno: "Design e cor",
  "herramientas-avanzadas": "Ferramentas avançadas",
  seguridad: "Segurança",
  ciencia: "Ciência",
  produtividade: "Produtividade",
  educacion: "Educação",
  cocina: "Cozinha",
  viajes: "Viagens",
  hogar: "Casa",
  utilidades: "Utilidades",
};

/** pt-BR names for the home quick links (keys = internal tool slug). */
export const PT_QUICK_TOOL_NAMES: Record<string, string> = {
  pixelihub: "PixeliHub",
  calculadora: "Calculadora",
  "calculadora-de-porcentajes": "Calculadora de porcentagem",
  "regla-de-tres": "Regra de três",
  "calculadora-de-fechas": "Calculadora de datas",
  "contador-de-palabras": "Contador de palavras",
  "generador-de-contrasenas": "Gerador de senhas",
  "conversor-de-temperatura": "Conversor de temperatura",
};
