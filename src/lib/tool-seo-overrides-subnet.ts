import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_SUBNET: Record<string, ToolSeoOverride> = {
  "calculadora-subred": {
    metaTitle: "IPv4 Subnet Calculator — CIDR, Mask, and Hosts | UtiliHub",
    metaTitleEs: "Calculadora de subredes IPv4 — CIDR y hosts | UtiliHub",
    metaDescription:
      "Calculate an IPv4 subnet from CIDR. 192.168.1.10/24 is network 192.168.1.0, broadcast .255, 254 hosts. /31 keeps both addresses. Free in the browser.",
    metaDescriptionEs:
      "Calculá una subred IPv4 desde el CIDR. 192.168.1.10/24 es red 192.168.1.0, broadcast .255, 254 hosts. /31 usa las dos direcciones. Gratis en el navegador.",
    about: [
      "The prefix length builds the mask. The network is the address AND the mask. The broadcast is the network OR the wildcard.",
      "Prefixes /0 to /30 reserve the network and broadcast, so usable hosts are 2^(32-prefix) minus 2.",
      "/31 follows RFC 3021 and treats both addresses as hosts. /32 is a single host. Empty input does not invent a network.",
    ],
    aboutEs: [
      "La longitud del prefijo arma la máscara. La red es la dirección AND la máscara. El broadcast es la red OR el wildcard.",
      "Los prefijos /0 a /30 reservan red y broadcast, así que los hosts útiles son 2^(32-prefijo) menos 2.",
      "/31 sigue el RFC 3021 y trata las dos direcciones como hosts. /32 es un solo host. Vacío no inventa una red.",
    ],
    steps: [
      "Type an IPv4 address and prefix, such as 192.168.1.10/24.",
      "Read the mask, network, broadcast, and usable range.",
      "Copy the summary. Nothing is uploaded.",
    ],
    stepsEs: [
      "Escribí una dirección IPv4 y el prefijo, como 192.168.1.10/24.",
      "Leé la máscara, la red, el broadcast y el rango útil.",
      "Copiá el resumen. No se sube nada.",
    ],
    faq: [
      { q: "What does 192.168.1.10/24 return?", a: "Network 192.168.1.0, mask 255.255.255.0, broadcast 192.168.1.255, usable 192.168.1.1–192.168.1.254 (254 hosts)." },
      { q: "Why does /31 show 2 hosts?", a: "RFC 3021 uses both addresses on a point-to-point link. There is no reserved network or broadcast." },
      { q: "Does this support IPv6?", a: "No. This calculator is IPv4 only and does not look up who owns the range." },
    ],
    faqEs: [
      { q: "¿Qué devuelve 192.168.1.10/24?", a: "Red 192.168.1.0, máscara 255.255.255.0, broadcast 192.168.1.255, útiles 192.168.1.1–192.168.1.254 (254 hosts)." },
      { q: "¿Por qué /31 muestra 2 hosts?", a: "El RFC 3021 usa las dos direcciones en un enlace punto a punto. No reserva red ni broadcast." },
      { q: "¿Sirve para IPv6?", a: "No. Esta calculadora es solo IPv4 y no consulta de quién es el rango." },
    ],
  },
};
