import type { GeneralTool } from "@/lib/general/types";
import { Modeler3DApp } from "./modeler3d-app";

/** Thin re-export so the large 3D app stays behind a small entry (push size limits). */
export function Modeler3D(props: { tool: GeneralTool; locale?: "en" | "es" }) {
  return <Modeler3DApp {...props} />;
}
