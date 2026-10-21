export type GeneralCategory={slug:string;name:string;title:string;description:string;intro:string};
export type GeneralTool={slug:string;name:string;title:string;description:string;summary:string;category:string;keywords:string[];about:string[];steps:string[];faq:{q:string;a:string}[];kind:string;config?:Record<string,unknown>};
export const faq=(q:string,a:string)=>({q,a});

function defaultSteps(kind: string): string[] {
  const k = (kind || "").toLowerCase();
  if (k === "image" || k === "media") {
    return [
      "Choose or drop the image to process (it stays on your device).",
      "Adjust options if available (quality, size, format).",
      "Process and download the result — nothing is uploaded to a server.",
    ];
  }
  if (k === "pdf") {
    return [
      "Select the PDF file(s) to process.",
      "Set pages, order, or rotation if the tool asks for them.",
      "Process and download the result. Compatible work runs in your browser.",
    ];
  }
  if (k === "document") {
    return [
      "Upload the file or paste the text / CSV / Markdown to analyze.",
      "Run the process — analysis happens in your browser when possible.",
      "Review the result and copy what you need.",
    ];
  }
  if (k === "design" || k === "color") {
    return [
      "Enter a HEX color (e.g. #2563eb) or the values the tool asks for.",
      "Review the conversion, contrast, mix, or CSS snippet on the same page.",
      "Copy the value or snippet into your design or stylesheet.",
    ];
  }
  if (k === "text" || k === "code" || k === "encode") {
    return [
      "Paste or type the text you want to process.",
      "Run the action (convert, count, sort, encode, etc.).",
      "Copy the result for your next step.",
    ];
  }
  if (k === "converter" || k === "conversion" || k === "unit") {
    return [
      "Enter the value to convert and choose units if needed.",
      "The result updates instantly on the same page.",
      "Copy the converted value if you need it elsewhere.",
    ];
  }
  return [
    "Enter the values you want to calculate or process.",
    "The result updates instantly on the same page.",
    "Copy, share, or export the result if the tool allows it.",
  ];
}

function defaultFaq(kind: string): { q: string; a: string }[] {
  const k = (kind || "").toLowerCase();
  if (k === "image" || k === "media" || k === "pdf" || k === "document") {
    return [
      faq("Is my file uploaded to a server?", "No for compatible operations. Processing runs in your browser and the file stays on your device."),
      faq("Do I need an account?", "No. You can use the tool immediately without signing up."),
    ];
  }
  if (k === "design" || k === "color") {
    return [
      faq("What color format should I use?", "Most tools expect a 6-digit HEX. Many also show RGB or HSL in the result."),
      faq("Do I need an account?", "No. You can use the tool immediately without signing up."),
    ];
  }
  return [
    faq("Do I need to sign up?", "No. The tool works without an account."),
    faq("Are my data uploaded?", "Compatible operations run locally in the browser."),
  ];
}

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
    steps: defaultSteps(kind),
    faq: defaultFaq(kind),
    kind,
    config,
  };
};
