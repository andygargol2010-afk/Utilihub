/** High-traffic legacy/core tools (calculator, etc.).
 *  Do NOT import from tool-seo-overrides.ts (circular). Inline the shape.
 */

type CoreSeoOverride = {
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  about: string[];
  aboutEs?: string[];
  steps: string[];
  stepsEs?: string[];
  faq: { q: string; a: string }[];
  faqEs?: { q: string; a: string }[];
};

export const TOOL_SEO_OVERRIDES_CORE: Record<string, CoreSeoOverride> = {
  calculadora: {
    metaTitle: "Online Calculator — Add, Subtract, Multiply, Divide | UtiliHub",
    metaTitleEs: "Calculadora online gratis — sumar, restar, multiplicar | UtiliHub",
    metaDescription:
      "Free online calculator with keyboard support, history, and basic arithmetic. No signup; runs in your browser.",
    metaDescriptionEs:
      "Calculadora online gratis con teclado, historial y operaciones básicas. Sin registro; funciona en el navegador.",
    about: [
      "A simple four-operation calculator for everyday math: add, subtract, multiply, and divide.",
      "Use the on-screen pad or your keyboard. History stays in the session until you reload.",
    ],
    aboutEs: [
      "Calculadora de cuatro operaciones para el día a día: sumar, restar, multiplicar y dividir.",
      "Usá el teclado en pantalla o el del dispositivo. El historial dura hasta recargar la página.",
    ],
    steps: [
      "Enter the first number.",
      "Choose an operation and the second number.",
      "Press equals to see the result.",
    ],
    stepsEs: [
      "Ingresá el primer número.",
      "Elegí la operación y el segundo número.",
      "Pulsá igual para ver el resultado.",
    ],
    faq: [
      { q: "Do I need an account?", a: "No. The calculator works in the browser with no signup." },
      { q: "Is data uploaded?", a: "No. Arithmetic runs locally on your device." },
    ],
    faqEs: [
      { q: "¿Necesito cuenta?", a: "No. Funciona en el navegador sin registro." },
      { q: "¿Se suben datos?", a: "No. El cálculo es local en tu dispositivo." },
    ],
  },
  "modelador-3d": {
    metaTitle: "Free 3D Modeler Online — Build & Export Scenes | UtiliHub",
    metaTitleEs: "Modelador 3D gratis online — crear y exportar escenas | UtiliHub",
    metaDescription:
      "Browser 3D modeler: primitives, materials, touch controls, PNG/STL/GLB export, and shareable scenes. No signup.",
    metaDescriptionEs:
      "Modelador 3D en el navegador: formas, materiales, gestos táctiles, export PNG/STL/GLB y escenas compartibles. Sin registro.",
    about: [
      "UtiliHub’s 3D modeler is a lightweight studio in the browser: add cubes, spheres, cylinders, and more; move, rotate, and scale with gizmos or keyboard shortcuts.",
      "Choose material presets (matte, metal, glass), export PNG screenshots, STL for printing workflows, or GLB for other 3D tools. Scenes autosave locally; you can also save named scenes and copy a share link.",
    ],
    aboutEs: [
      "El modelador 3D de UtiliHub es un estudio ligero en el navegador: agregá cubos, esferas, cilindros y más; mové, rotá y escalá con gizmo o atajos de teclado.",
      "Elegí materiales (mate, metal, vidrio), exportá capturas PNG, STL o GLB. Las escenas se guardan en el dispositivo; también podés nombrarlas y compartir un enlace.",
    ],
    steps: [
      "Open the tool and wait for the 3D engine to load.",
      "Tap a shape to add it; select it to transform with Move / Rotate / Scale.",
      "Adjust color and material, then export PNG, STL, or GLB — or copy a share link from Scenes.",
    ],
    stepsEs: [
      "Abrí la herramienta y esperá a que cargue el motor 3D.",
      "Tocá una forma para crear; seleccionála y usá Mover / Rotar / Escala.",
      "Ajustá color y material; exportá PNG, STL o GLB, o copiá un enlace desde Escenas.",
    ],
    faq: [
      { q: "Do I need an account?", a: "No. Everything runs in your browser with no signup." },
      { q: "Where is my scene stored?", a: "Autosave and named scenes use local storage on your device. Share links encode the scene in the URL hash." },
      { q: "Can I use it on mobile?", a: "Yes. One finger orbits; two fingers zoom and pan. The transform gizmo is enlarged on touch devices." },
    ],
    faqEs: [
      { q: "¿Necesito cuenta?", a: "No. Todo corre en el navegador sin registro." },
      { q: "¿Dónde se guarda la escena?", a: "El autoguardado y las escenas nombradas usan almacenamiento local. Los enlaces codifican la escena en el hash de la URL." },
      { q: "¿Sirve en el celular?", a: "Sí. Un dedo orbita; dos dedos hacen zoom y pan. El gizmo es más grande en pantallas táctiles." },
    ],
  },
};
