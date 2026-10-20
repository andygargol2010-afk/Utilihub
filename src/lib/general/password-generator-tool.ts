import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-password",
  "Password Generator",
  "seguridad",
  "generator",
  "Generate strong random passwords with custom length and character sets.",
  [
    "password generator",
    "generador de contraseñas",
    "strong password",
    "random password",
  ],
  {
    title: "Password Generator — Strong Random Passwords | UtiliHub",
    description: "Free password generator. Choose length and character types for secure passwords. Runs in your browser.",
  },
);
tool.faq.push(faq("How long should a password be?", "At least 12–16 characters is recommended for strong security."));
tool.faq.push(faq("Is this safe?", "Yes, generation happens entirely in your browser; nothing is sent to a server."));

export const PASSWORD_GENERATOR_TOOLS = [tool];
