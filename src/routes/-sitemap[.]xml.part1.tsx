// Part 1 of 3 — split from sitemap[.]xml.tsx on 2026-11-04. Edit here; sitemap[.]xml.tsx re-exports.

/** Escape XML special chars without embedding &entity; literals that get mangled by some editors. */
export const escapeXml = (value: string) => {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (c === "&") out += "&" + "amp;";
    else if (c === "<") out += "&" + "lt;";
    else if (c === ">") out += "&" + "gt;";
    else if (c === '"') out += "&" + "quot;";
    else if (c === "'") out += "&" + "apos;";
    else out += c;
  }
  return out;
};
