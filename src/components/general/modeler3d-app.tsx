import type { GeneralTool } from "@/lib/general/types";
import { useEffect, useRef, useState } from "react";
import { useModelerCore } from "./modeler3d-core";
import { shapeList, COLORS } from "./modeler3d-helpers";

export function Modeler3DApp({ locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const core = useModelerCore(locale);
  return <div>Modeler restoring…</div>;
}
