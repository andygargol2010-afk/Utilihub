/** IPv4 CIDR math. /31 follows RFC 3021 (both addresses usable). /32 is a single host. */

export type SubnetStatus = "empty" | "invalid" | "ok";

export type SubnetResult = {
  status: SubnetStatus;
  address: string;
  prefix: number | null;
  mask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  total: string;
  usable: string;
  note: "normal" | "p2p" | "host" | "";
};

const EMPTY: SubnetResult = {
  status: "empty",
  address: "",
  prefix: null,
  mask: "",
  wildcard: "",
  network: "",
  broadcast: "",
  firstHost: "",
  lastHost: "",
  total: "",
  usable: "",
  note: "",
};

export function formatIpv4(value: number): string {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
}

export function parseIpv4(raw: string): number | null {
  const parts = raw.trim().split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    value = (value << 8) + octet;
  }
  return value >>> 0;
}

export function parseCidr(raw: string): { address: number; prefix: number } | null {
  const text = raw.trim().replace(/\s+/g, "");
  if (!text) return null;
  const slash = text.lastIndexOf("/");
  if (slash <= 0) return null;
  const address = parseIpv4(text.slice(0, slash));
  const prefixText = text.slice(slash + 1);
  if (address === null || !/^\d{1,2}$/.test(prefixText)) return null;
  const prefix = Number(prefixText);
  if (prefix > 32) return null;
  return { address, prefix };
}

export function subnetFromCidr(raw: string): SubnetResult {
  if (!raw.trim()) return EMPTY;
  const parsed = parseCidr(raw);
  if (!parsed) return { ...EMPTY, status: "invalid" };
  const { address, prefix } = parsed;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const wildcard = (~mask) >>> 0;
  const network = (address & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const total = 2 ** (32 - prefix);
  let first = network;
  let last = broadcast;
  let usable = total;
  let note: SubnetResult["note"] = "normal";
  if (prefix <= 30) {
    first = (network + 1) >>> 0;
    last = (broadcast - 1) >>> 0;
    usable = total - 2;
  } else if (prefix === 31) {
    note = "p2p";
    usable = 2;
  } else {
    note = "host";
    usable = 1;
  }
  return {
    status: "ok",
    address: formatIpv4(address),
    prefix,
    mask: formatIpv4(mask),
    wildcard: formatIpv4(wildcard),
    network: formatIpv4(network),
    broadcast: formatIpv4(broadcast),
    firstHost: formatIpv4(first),
    lastHost: formatIpv4(last),
    total: String(total),
    usable: String(usable),
    note,
  };
}
