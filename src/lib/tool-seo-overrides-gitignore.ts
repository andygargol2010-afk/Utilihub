import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GITIGNORE: Record<string, ToolSeoOverride> = {
  "generador-gitignore": {
    metaTitle: "Gitignore Generator — Node, Python, macOS, Next.js | UtiliHub",
    metaTitleEs: "Generador de .gitignore — Node, Python y macOS | UtiliHub",
    metaDescription:
      "Build a .gitignore from Node, Python, macOS, VS Code, and Next.js stacks. Duplicate lines collapse and an empty selection does not invent a file. Runs locally.",
    metaDescriptionEs:
      "Armá un .gitignore con Node, Python, macOS, VS Code y Next.js. Las líneas repetidas se unen y una selección vacía no inventa archivo. Corre en el navegador.",
    about: [
      "This is a starter ignore file, not a dump of every GitHub template. Each stack adds a short fixed list.",
      "Node covers dependencies, build output, logs, and env files. Python covers bytecode, virtualenvs, and pytest cache.",
      "macOS adds Finder files, VS Code ignores the local editor folder, and Next.js ignores the build and export directories.",
    ],
    aboutEs: [
      "Es un ignore de arranque, no el volcado de todas las plantillas de GitHub. Cada stack suma una lista fija corta.",
      "Node cubre dependencias, salida de build, logs y archivos de entorno. Python cubre bytecode, entornos virtuales y la caché de pytest.",
      "macOS agrega archivos de Finder, VS Code ignora la carpeta local del editor y Next.js ignora el build y la exportación.",
    ],
    steps: [
      "Turn on Node and macOS, or use the Python + VS Code example.",
      "Add extra patterns if you need them. Blank lines and control characters are dropped.",
      "Copy the file. With no stack and no extra line, nothing is generated.",
    ],
    stepsEs: [
      "Activá Node y macOS, o usá el ejemplo de Python + VS Code.",
      "Sumá patrones extra si los necesitás. Las líneas vacías y los caracteres de control se descartan.",
      "Copiá el archivo. Sin stack y sin línea extra no se genera nada.",
    ],
    faq: [
      { q: "What does Node + macOS include?", a: "node_modules/, dist/, *.log, .env, .env.*, .DS_Store, and .AppleDouble." },
      { q: "Does Python + VS Code ignore the editor folder?", a: "Yes. It adds __pycache__/, *.py[cod], .venv/, venv/, .pytest_cache/, and .vscode/." },
      { q: "Is the file uploaded?", a: "No. The text is built in the browser. Copy it into your repo yourself." },
    ],
    faqEs: [
      { q: "¿Qué incluye Node + macOS?", a: "node_modules/, dist/, *.log, .env, .env.*, .DS_Store y .AppleDouble." },
      { q: "¿Python + VS Code ignora la carpeta del editor?", a: "Sí. Suma __pycache__/, *.py[cod], .venv/, venv/, .pytest_cache/ y .vscode/." },
      { q: "¿Se sube el archivo?", a: "No. El texto se arma en el navegador. Lo copiás vos al repo." },
    ],
  },
};
