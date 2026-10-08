import { faq, makeTool } from "./types";

/** Gap: the password generator creates strings; it does not score a phrase the user already has. */
const tool = makeTool(
  "estimador-entropia-contrasena",
  "Password entropy estimator",
  "seguridad",
  "validator",
  "Estimate pool and Shannon entropy of a password without uploading it.",
  [
    "password entropy calculator",
    "password strength bits",
    "calcular entropia de contrasena",
    "bits de entropia contrasena",
    "charset password entropy",
  ],
  {
    mode: "password-entropy",
    title: "Password Entropy Calculator — Pool and Shannon Bits | UtiliHub",
    description:
      "Estimate password entropy in the browser from charset pool and Shannon bits. Tr0ub4dor&3 is about 72 pool bits. Not a crack-time promise.",
  },
);
tool.faq = [
  ...tool.faq,
  faq("Is pool entropy the same as crack time?", "No. Pool bits assume the attacker tries the whole charset at random. A dictionary phrase can be weaker than the formula."),
  faq("Does this send the password?", "No. Counting runs locally. Clear the field when you are done."),
];
export const PASSWORD_ENTROPY_TOOLS = [tool];
