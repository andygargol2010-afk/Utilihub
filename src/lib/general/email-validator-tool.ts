import { makeTool, faq } from "./types";

const tool = makeTool(
  "validador-email",
  "Email Validator",
  "desarrollo",
  "validator",
  "Check if an email address looks valid using a practical regex. Runs fully in the browser.",
  [
    "email validator",
    "validate email address",
    "email checker",
    "validador de email",
    "verificar correo electronico",
    "comprobar email",
  ],
  {
    title: "Email Validator — Check Email Address Format | UtiliHub",
    description:
      "Free email validator. Paste an address to see if the format is valid. Instant local check, no signup, no data sent.",
  },
);
tool.faq.push(
  faq(
    "Does this guarantee the email exists?",
    "No. It only checks the format (local part, @, domain). It does not connect to mail servers or verify delivery.",
  ),
);
tool.faq.push(
  faq(
    "What characters are allowed?",
    "The checker uses a practical pattern for common addresses. Exotic quoted local parts or IP-literal domains may not pass.",
  ),
);

export const EMAIL_VALIDATOR_TOOLS = [tool];
