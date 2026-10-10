import type { GeneralTool } from "@/lib/general/types";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

type PartKind = "wall" | "floor" | "roof" | "column" | "door" | "window" | "stairs" | "railing" | "chimney" | "beam" | "foundation" | "pergola" | "fence" | "path" | "planter" | "bench" | "lamp";
