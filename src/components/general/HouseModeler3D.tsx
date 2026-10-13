import type { GeneralTool } from "@/lib/general/types";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

// RESTORE_MARKER: full file is 330489 bytes at blob aa9dbdb7ac9af7ad5ff14149fe716212f3d3faa6
// This temporary stub will be replaced - DO NOT LEAVE IN PLACE
export function HouseModeler3D({ locale = "en" }: { tool?: GeneralTool; locale?: "en" | "es" }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6 text-center">
      <p className="text-sm text-muted-foreground">
        {locale === "es" ? "Restaurando modelador…" : "Restoring modeler…"}
      </p>
    </div>
  );
}
