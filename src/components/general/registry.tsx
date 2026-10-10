import type { ReactNode } from "react";
import { lazy, Suspense } from "react";

const LoremIpsumTool = lazy(() =>
  import("./LoremIpsumTool").then((m) => ({ default: m.LoremIpsumTool })),
);

function LoremWrapper({ locale }: { locale: "en" | "es" }) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <LoremIpsumTool locale={locale} />
    </Suspense>
  );
}

/** Minimal registry. Most tools use the ConfiguredTool fallback in DeferredToolUi.
 * Custom component tools can be added here as lazy entries.
 */
export const GENERAL_TOOL_UI: Record<string, () => ReactNode> = {
  "generador-lorem-ipsum": () => <LoremWrapper locale="en" />,
};

export const GENERAL_TOOL_UI_ES: Record<string, () => ReactNode> = {
  "generador-lorem-ipsum": () => <LoremWrapper locale="es" />,
};
