import { useCallback, useEffect, useRef, useState } from "react";
import {
 BASE_SIZE, HISTORY_MAX, NAME_PAIR, STORAGE_KEY,
 clampPos, clampSize, degToRad, makeGeometry, makeMaterial, normDeg, radToDeg, snapVal,
 type ShapeKind,
} from "./modeler3d-helpers";

// RESTORE_MARKER_WILL_BE_REPLACED
export function useModelerCore() { return {} as any; }
