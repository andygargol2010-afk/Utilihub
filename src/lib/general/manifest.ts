/** Build a W3C web app manifest. Empty or invalid fields do not invent a file. */

export type ManifestDisplay = "browser" | "minimal-ui" | "standalone" | "fullscreen";
export type ManifestOrientation = "" | "any" | "portrait" | "landscape";

export type ManifestInput = {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  scope: string;
  display: ManifestDisplay;
  orientation: ManifestOrientation;
  themeColor: string;
  backgroundColor: string;
  lang: string;
  iconSrc: string;
  iconSizes: string;
};

export type ManifestResult =
  | { status: "ok"; output: string }
  | { status: "empty" | "invalid" | "too-big" };

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const LANG = /^[a-z]{2}(?:-[A-Z]{2})?$/;
const SIZES = /^\d+x\d+$/;
const DISPLAYS = new Set<ManifestDisplay>(["browser", "minimal-ui", "standalone", "fullscreen"]);

function pathOrUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function buildManifest(input: ManifestInput): ManifestResult {
  const name = input.name.trim();
  if (!name) return { status: "empty" };
  if (name.length > 48) return { status: "too-big" };
  const shortName = input.shortName.trim();
  if (shortName.length > 12) return { status: "too-big" };
  const description = input.description.trim();
  if (description.length > 300) return { status: "too-big" };
  const startUrl = input.startUrl.trim() || "/";
  if (!pathOrUrl(startUrl)) return { status: "invalid" };
  const scope = input.scope.trim();
  if (scope && !pathOrUrl(scope)) return { status: "invalid" };
  if (!DISPLAYS.has(input.display)) return { status: "invalid" };
  if (input.orientation && !["any", "portrait", "landscape"].includes(input.orientation)) return { status: "invalid" };
  const themeColor = input.themeColor.trim();
  const backgroundColor = input.backgroundColor.trim();
  if ((themeColor && !HEX.test(themeColor)) || (backgroundColor && !HEX.test(backgroundColor))) return { status: "invalid" };
  const lang = input.lang.trim();
  if (lang && !LANG.test(lang)) return { status: "invalid" };
  const iconSrc = input.iconSrc.trim();
  const iconSizes = input.iconSizes.trim();
  if (iconSrc && !pathOrUrl(iconSrc)) return { status: "invalid" };
  if (iconSizes && !SIZES.test(iconSizes)) return { status: "invalid" };
  if (iconSizes && !iconSrc) return { status: "invalid" };

  const manifest: Record<string, unknown> = {
    name,
    start_url: startUrl,
    display: input.display,
  };
  if (shortName) manifest.short_name = shortName;
  if (description) manifest.description = description;
  if (scope) manifest.scope = scope;
  if (input.orientation) manifest.orientation = input.orientation;
  if (themeColor) manifest.theme_color = themeColor;
  if (backgroundColor) manifest.background_color = backgroundColor;
  if (lang) manifest.lang = lang;
  if (iconSrc) {
    const icon: Record<string, string> = { src: iconSrc, type: iconSrc.endsWith(".svg") ? "image/svg+xml" : "image/png" };
    if (iconSizes) icon.sizes = iconSizes;
    manifest.icons = [icon];
  }
  const output = `${JSON.stringify(manifest, null, 2)}\n`;
  if (output.length > 8_000) return { status: "too-big" };
  return { status: "ok", output };
}
