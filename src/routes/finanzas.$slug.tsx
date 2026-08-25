import{createFileRoute,notFound,Link}from"@tanstack/react-router";
import{ArrowLeft}from"lucide-react";
import{FINANCIAL_UI}from"@/components/financial/registry";
import{financialToolBySlug}from"@/lib/financial-tools";

export const Route=createFileRoute("/finanzas/$slug")({
 loader:({params})=>{const tool=financialToolBySlug(params.slug);if(!tool||!FINANCIAL_UI[tool.slug])throw notFound();return{tool}},
 head:({loaderData})=>loaderData?{meta:[{title:`${loaderData.tool.name} | UtiliHub`},{name:"description",content:loaderData.tool.description},{name:"keywords",content:loaderData.tool.keywords.join(", ")},{name:"robots",content:"index, follow"}],links:[{rel:"canonical",href:`/finanzas/${loaderData.tool.slug}` }]}:{meta:[{title:"Calculadora financiera no encontrada | UtiliHub"},{name:"robots",content:"noindex, nofollow"}]},
 component:FinancialPage
});

function FinancialPage(){const{tool}=Route.useLoaderData();const ui=FINANCIAL_UI[tool.slug]!;return <main className="container-page py-10 sm:py-14">
 <Link to="/finanzas" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="size-4"/> Todas las calculadoras financieras</Link>
 <div className="mt-7 max-w-3xl"><h1 className="text-3xl font-black tracking-tight sm:text-4xl">{tool.name}</h1><p className="mt-3 text-base leading-7 text-muted-foreground">{tool.description}</p></div>
 <section className="surface-card mt-8 p-5 sm:p-7" aria-label={tool.name}>{ui()}</section>
 <p className="mt-8 max-w-3xl text-xs leading-5 text-muted-foreground">Los resultados son estimaciones matemáticas. Verifica las condiciones reales de cualquier producto financiero antes de tomar decisiones.</p>
 </main>}
