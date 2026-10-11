import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-codigo-qr",
  "QR Code Generator",
  "generadores",
  "generator",
  "Generate QR codes for text, URLs, or messages instantly in the browser. Download as PNG.",
  [
    "qr code generator",
    "generate qr code",
    "generador de codigo qr",
    "crear codigo qr",
    "qr code online free",
    "codigo qr gratis",
  ],
  {
    title: "QR Code Generator — Create QR codes online free | UtiliHub",
    description: "Free online QR code generator. Enter text or URL to generate a QR code instantly. Download PNG. No signup, runs in browser.",
  },
);
tool.faq.push(faq("What can I encode?", "Any text, URL, phone number, or short message."));
tool.faq.push(faq("Is the QR generated locally?", "Yes. The QR is created entirely in your browser."));
tool.faq.push(faq("Can I download it?", "Yes, download as PNG image."));
tool.faq.push(faq("Does it work on mobile?", "Yes, fully responsive."));

export const QR_CODE_GENERATOR_TOOLS = [tool];

void { "qr-code": () => 0 };
