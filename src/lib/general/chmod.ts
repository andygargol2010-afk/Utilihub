/** Local Unix mode bits. Planning aid, not a live chmod on a server. */

export type ChmodStatus = "empty" | "invalid" | "ok";

export type ChmodResult = {
  status: ChmodStatus;
  octal: string;
  symbolic: string;
  owner: number;
  group: number;
  other: number;
  setuid: boolean;
  setgid: boolean;
  sticky: boolean;
};

const TRIAD = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];

export const CHMOD_PRESETS = {
  public: "755",
  private: "640",
  sticky: "1777",
  symbolic: "rwxr-xr-x",
} as const;

export function parseChmod(raw: string): ChmodResult {
  const text = raw.trim();
  const blank: ChmodResult = {
    status: "empty",
    octal: "",
    symbolic: "",
    owner: 0,
    group: 0,
    other: 0,
    setuid: false,
    setgid: false,
    sticky: false,
  };
  if (!text) return blank;
  const fromOctal = parseOctal(text);
  if (fromOctal) return fromOctal;
  const fromSymbolic = parseSymbolic(text);
  if (fromSymbolic) return fromSymbolic;
  const fromAssign = parseAssign(text);
  if (fromAssign) return fromAssign;
  return { ...blank, status: "invalid" };
}

function finish(owner: number, group: number, other: number, setuid: boolean, setgid: boolean, sticky: boolean): ChmodResult {
  const special = (sticky ? 1 : 0) + (setgid ? 2 : 0) + (setuid ? 4 : 0);
  return {
    status: "ok",
    octal: `${special}${owner}${group}${other}`,
    symbolic: symbolicOf(owner, group, other, setuid, setgid, sticky),
    owner,
    group,
    other,
    setuid,
    setgid,
    sticky,
  };
}

function parseOctal(text: string): ChmodResult | null {
  if (!/^[0-7]{3,4}$/.test(text)) return null;
  const padded = text.padStart(4, "0");
  const special = Number(padded[0]);
  return finish(Number(padded[1]), Number(padded[2]), Number(padded[3]), (special & 4) !== 0, (special & 2) !== 0, (special & 1) !== 0);
}

function parseSymbolic(text: string): ChmodResult | null {
  const compact = text.replace(/\s+/g, "");
  if (!/^[r-][w-][xsS-][r-][w-][xsS-][r-][w-][xtT-]{1}$/.test(compact) && !/^[r-][w-][xsS-][r-][w-][xsS-][r-][w-][xtT-]$/.test(compact)) return null;
  if (compact.length !== 9) return null;
  const owner = triadValue(compact[0], compact[1], compact[2]);
  const group = triadValue(compact[3], compact[4], compact[5]);
  const other = triadValue(compact[6], compact[7], compact[8]);
  if (owner < 0 || group < 0 || other < 0) return null;
  return finish(owner, group, other, compact[2] === "s" || compact[2] === "S", compact[5] === "s" || compact[5] === "S", compact[8] === "t" || compact[8] === "T");
}

function triadValue(r: string, w: string, x: string): number {
  if (r !== "r" && r !== "-") return -1;
  if (w !== "w" && w !== "-") return -1;
  const exec = x === "x" || x === "s" || x === "t";
  if (!exec && x !== "-" && x !== "S" && x !== "T") return -1;
  return (r === "r" ? 4 : 0) + (w === "w" ? 2 : 0) + (exec ? 1 : 0);
}

function parseAssign(text: string): ChmodResult | null {
  const parts = text.split(/[, ]+/).map((part) => part.trim()).filter(Boolean);
  if (!parts.length || !parts.every((part) => /^[ugoa]=[rwxst-]*$/i.test(part))) return null;
  let owner = 0;
  let group = 0;
  let other = 0;
  let setuid = false;
  let setgid = false;
  let sticky = false;
  for (const part of parts) {
    const [who, bits] = part.toLowerCase().split("=");
    const value = (bits.includes("r") ? 4 : 0) + (bits.includes("w") ? 2 : 0) + (bits.includes("x") || bits.includes("s") || bits.includes("t") ? 1 : 0);
    if (who.includes("u") || who.includes("a")) owner = value;
    if (who.includes("g") || who.includes("a")) group = value;
    if (who.includes("o") || who.includes("a")) other = value;
    if ((who.includes("u") || who.includes("a")) && bits.includes("s")) setuid = true;
    if ((who.includes("g") || who.includes("a")) && bits.includes("s")) setgid = true;
    if ((who.includes("o") || who.includes("a")) && bits.includes("t")) sticky = true;
  }
  return finish(owner, group, other, setuid, setgid, sticky);
}

function symbolicOf(owner: number, group: number, other: number, setuid: boolean, setgid: boolean, sticky: boolean): string {
  const o = TRIAD[owner];
  const g = TRIAD[group];
  const x = TRIAD[other];
  const ownerX = setuid ? (owner & 1 ? "s" : "S") : o[2];
  const groupX = setgid ? (group & 1 ? "s" : "S") : g[2];
  const otherX = sticky ? (other & 1 ? "t" : "T") : x[2];
  return `${o[0]}${o[1]}${ownerX}${g[0]}${g[1]}${groupX}${x[0]}${x[1]}${otherX}`;
}

export function triadLabel(value: number, es: boolean): string {
  const names = es
    ? ["nada", "ejecutar", "escribir", "escribir y ejecutar", "leer", "leer y ejecutar", "leer y escribir", "leer, escribir y ejecutar"]
    : ["none", "execute", "write", "write and execute", "read", "read and execute", "read and write", "read, write, and execute"];
  return names[value] ?? names[0];
}
