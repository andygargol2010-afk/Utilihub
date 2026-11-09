import { makeTool, faq } from "./types";

const tool = makeTool(
  "password-strength",
  "Password Strength Checker",
  "seguridad",
  "validator",
  "Estimate password strength with length, case, numbers, symbols, and repetition checks. Runs fully in the browser.",
  [
    "password strength checker",
    "password strength meter",
    "check password strength",
    "comprobar fuerza contraseña",
    "validador de contraseña",
    "fuerza de contraseña",
  ],
  {
    title: "Password Strength Checker — How Strong Is Your Password? | UtiliHub",
    description:
      "Free password strength meter. Type a password to see score, tips, and bar. Instant local check, no data sent, no signup.",
  },
);
tool.faq.push(
  faq(
    "Does this store my password?",
    "No. Everything runs in your browser. The password never leaves your device.",
  ),
);
tool.faq.push(
  faq(
    "Is a high score enough for security?",
    "A strong score helps against guessing, but use unique passwords per site and a password manager. This is only an estimate.",
  ),
);

export const PASSWORD_STRENGTH_TOOLS = [tool];
