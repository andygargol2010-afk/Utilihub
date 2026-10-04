import { createFileRoute, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { EDUCATION_SUBJECTS, educationTopicTitle } from "@/lib/general/education";
import { allToolsByCategory } from "@/lib/all-tools";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage } from "@/lib/seo";

/** Spanish display names for education subjects (slug is shared with EN). */
const SUBJECT_NAME_ES: Record<string, string> = {
  matematicas: "Matemáticas",
  lengua: "Lengua y literatura",
  fisica: "Física",
  quimica: "Química",
  biologia: "Biología",
  historia: "Historia",
  geografia: "Geografía",
  ingles: "Inglés",
  informatica: "Informática",
  economia: "Economía",
  filosofia: "Filosofía",
  "ciencias-naturales": "Ciencias naturales",
};

const TOPIC_NAME_ES: Record<string, string> = {
  aritmetica: "Aritmética",
  algebra: "Álgebra",
  geometria: "Geometría",
  calculo: "Cálculo",
  estadistica: "Estadística",
  gramatica: "Gramática",
  ortografia: "Ortografía",
  comprension: "Comprensión",
  literatura: "Literatura",
  redaccion: "Redacción",
  mecanica: "Mecánica",
  energia: "Energía",
  electricidad: "Electricidad",
  ondas: "Ondas",
  "fisica-moderna": "Física moderna",
  atomos: "Átomos",
  estequiometria: "Estequiometría",
  organica: "Orgánica",
  equilibrio: "Equilibrio",
  "quimica-general": "Química general",
  celula: "Célula",
  genetica: "Genética",
  evolucion: "Evolución",
  ecologia: "Ecología",
  anatomia: "Anatomía",
  antiguedad: "Antigüedad",
  "edad-media": "Edad Media",
  "edad-moderna": "Edad Moderna",
  "edad-contemporanea": "Edad Contemporánea",
  "historia-argentina": "Historia argentina",
  mapas: "Mapas",
  relieve: "Relieve",
  clima: "Clima",
  poblacion: "Población",
  "geografia-economica": "Geografía económica",
  vocabulario: "Vocabulario",
  "gramatica-ingles": "Gramática inglesa",
  reading: "Reading",
  verbos: "Verbos",
  writing: "Writing",
  algoritmos: "Algoritmos",
  programacion: "Programación",
  "bases-datos": "Bases de datos",
  redes: "Redes",
  "seguridad-digital": "Seguridad digital",
  microeconomia: "Microeconomía",
  macroeconomia: "Macroeconomía",
  mercados: "Mercados",
  "finanzas-basicas": "Finanzas básicas",
  "economia-internacional": "Economía internacional",
  logica: "Lógica",
  etica: "Ética",
  epistemologia: "Epistemología",
  "filosofia-politica": "Filosofía política",
  "historia-filosofia": "Historia de la filosofía",
  materia: "Materia",
  tierra: "Tierra",
  ambiente: "Ambiente",
  "metodo-cientifico": "Método científico",
};

function topicTitleEs(topic: string) {
  return TOPIC_NAME_ES[topic] ?? educationTopicTitle(topic);
}

export const Route = createFileRoute("/es/educacion/$subject")({
  loader: ({ params }) => {
    const subject = EDUCATION_SUBJECTS.find(([slug]) => slug === params.subject);
    if (!subject) throw notFound();
    const [slug, nameEn, topics] = subject;
    const name = SUBJECT_NAME_ES[slug] ?? nameEn;
    const tools = allToolsByCategory("educacion").filter((tool) =>
      topics.some((topic) => tool.slug === `test-${params.subject}-${topic}`),
    );
    return { slug: params.subject, name, topics, tools };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Materia no encontrada | UtiliHub" },
          { name: "robots", content: "noindex, nofollow" },
        ],
      };
    }
    const { slug, name } = loaderData;
    const title = `Tests de ${name} online | Primaria, secundaria y universidad | UtiliHub`;
    const description = cleanDescription(
      `Genera tests de ${name} por tema para primaria, secundaria y universidad. Elige dificultad y cantidad de preguntas y practica gratis.`,
    );
    const url = absoluteUrl(`/es/educacion/${slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "es_ES" },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage() },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "es", href: url },
        { rel: "alternate", hrefLang: "en", href: absoluteUrl(`/education/${slug}`) },
        { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(`/education/${slug}`) },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "CollectionPage", name: title, description, url },
              breadcrumbSchema([
                { name: "Inicio", path: "/es" },
                { name: "Educación", path: "/es/categoria/educacion" },
                { name },
              ]),
            ],
          }),
        },
      ],
    };
  },
  component: SpanishEducationSubjectPage,
});

function SpanishEducationSubjectPage() {
  const { name, topics, tools } = Route.useLoaderData();
  return (
    <div className="container-page py-10">
      <Breadcrumbs
        locale="es"
        items={[
          { label: "Inicio", to: "/es" },
          { label: "Educación", to: "/es/categoria/$slug", params: { slug: "educacion" } },
          { label: name },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Tests de {name}</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Genera tests gratuitos de {name} por tema. Puedes elegir primaria, secundaria o universidad, más la dificultad y
        la cantidad de preguntas.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} locale="es" />
        ))}
      </div>
      <p className="mt-10 text-sm text-muted-foreground">
        Temas disponibles: {topics.map((t) => topicTitleEs(t)).join(", ")}.
      </p>
    </div>
  );
}
