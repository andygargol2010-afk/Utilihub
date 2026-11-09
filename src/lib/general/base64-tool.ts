import { makeTool, faq } from "./types";

const tool = makeTool(
  "base64-encoder-decoder",
  "Base64 Encoder/Decoder",
  "desarrollo",
  "encoder",
  "Encode text to Base64 or decode Base64 back to text instantly in the browser. Useful for developers, APIs, and data transfer.",
  [
    "base64 encode",
    "base64 decode",
    "base64 encoder decoder",
    "base64 converter",
    "codificador base64",
    "decodificador base64",
    "base64 online",
  ],
  {
    title: "Base64 Encoder Decoder — Encode & Decode Online Free | UtiliHub",
    description:
      "Free Base64 encoder and decoder. Convert text to Base64 or decode Base64 to text instantly. Runs entirely in your browser, no upload.",
  },
);
tool.faq.push(
  faq(
    "What is Base64?",
    "Base64 is a binary-to-text encoding that represents binary data in an ASCII string format. Commonly used in data URLs, email, and APIs.",
  ),
);
tool.faq.push(
  faq(
    "Is my data sent to a server?",
    "No. Encoding and decoding happen entirely in your browser using native btoa/atob.",
  ),
);

export const BASE64_TOOLS = [tool];
