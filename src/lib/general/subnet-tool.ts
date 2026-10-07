import { makeTool } from "./types";

/** Gap: HTTP/MIME lookups exist; no IPv4 CIDR host-range calculator. */
export const SUBNET_TOOLS = [
  makeTool(
    "calculadora-subred",
    "IPv4 subnet calculator",
    "desarrollo",
    "number",
    "Find the network, broadcast, mask, and usable hosts of an IPv4 CIDR.",
    [
      "ipv4 subnet calculator",
      "cidr host range calculator",
      "calculadora de subredes ipv4",
      "calcular mascara de red cidr",
      "rango de hosts /24",
    ],
    {
      mode: "subnet",
      title: "IPv4 Subnet Calculator — CIDR, Mask, and Hosts | UtiliHub",
      description:
        "Get the network, broadcast, mask, wildcard, and usable hosts for an IPv4 CIDR. 192.168.1.10/24 is 254 hosts. Runs in the browser.",
    },
  ),
];
