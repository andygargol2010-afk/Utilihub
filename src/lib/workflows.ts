export type ToolWorkflow = {
  slug: string;
  title: string;
  description: string;
  audience: string;
  steps: string[];
};

export const TOOL_WORKFLOWS: ToolWorkflow[] = [
  {
    slug: "freelance",
    title: "Organiza tu trabajo freelance",
    description: "Calcula importes, reparte cantidades y deja tus números listos para compartir.",
    audience: "Para freelancers y pequeños negocios",
    steps: ["calculadora", "calculadora-de-porcentajes", "regla-de-tres"],
  },
  {
    slug: "estudio",
    title: "Estudia con más claridad",
    description: "Resuelve cálculos, convierte unidades y comprueba tus resultados en menos pasos.",
    audience: "Para estudiantes y docentes",
    steps: ["regla-de-tres", "conversor-de-unidades", "calculadora-de-porcentajes"],
  },
  {
    slug: "contenido-seo",
    title: "Prepara contenido para publicar",
    description: "Revisa la extensión del texto, limpia tus ideas y crea una contraseña segura para tus proyectos.",
    audience: "Para creadores y marketers",
    steps: ["contador-de-palabras", "generador-de-contrasenas", "contador-de-palabras"],
  },
  {
    slug: "vida-diaria",
    title: "Resuelve tareas cotidianas",
    description: "Convierte temperaturas, calcula fechas y resuelve operaciones rápidas desde el navegador.",
    audience: "Para cualquier tarea del día a día",
    steps: ["conversor-de-temperatura", "calculadora-de-fechas", "calculadora"],
  },
];

export function workflowForTool(slug: string) {
  return TOOL_WORKFLOWS.find((workflow) => workflow.steps.includes(slug));
}

export function toolStepIndex(workflow: ToolWorkflow, slug: string) {
  return workflow.steps.indexOf(slug);
}
