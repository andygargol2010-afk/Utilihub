export type GeneralCategory={slug:string;name:string;title:string;description:string;intro:string};
export type GeneralTool={slug:string;name:string;title:string;description:string;summary:string;category:string;keywords:string[];about:string[];steps:string[];faq:{q:string;a:string}[];kind:string;config?:Record<string,unknown>};
export const faq=(q:string,a:string)=>({q,a});
export const makeTool=(slug:string,name:string,category:string,kind:string,summary:string,keywords:string[]=[],config:Record<string,unknown>={})=>{
  const title = typeof config.title === "string" ? config.title : `${name} free online | UtiliHub`;
  const description =
    typeof config.description === "string"
      ? config.description
      : `${summary} Free, no signup, and with local processing when possible.`;
  return {
    slug,
    name,
    title,
    description,
    summary,
    category,
    keywords,
    about: [summary, "The tool runs directly in the browser for immediate results."],
    steps: ["Enter the data you want to process.", "Run the tool or wait for the automatic result.", "Review and copy the result."],
    faq: [faq("Do I need to sign up?", "No. The tool works without an account."), faq("Are my data uploaded?", "Compatible operations run locally in the browser.")],
    kind,
    config,
  };
};
