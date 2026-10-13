import * as THREE from "three";
import type { PartKind } from "./house-modeler-types";

export function StructureGlyph({ kind }: { kind: PartKind }) {
  if (kind === "wall") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="3" y="7" width="34" height="20" rx="1" fill="#d8d0c4" stroke="#8a7d6c" />
        <rect x="3" y="24" width="34" height="3.5" fill="#b7ab9a" />
        <rect x="14" y="12" width="6" height="9" fill="#6d8eaa" opacity="0.85" />
      </svg>
    );
  }
  if (kind === "floor") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <path d="M6 10 L34 6 L34 24 L6 28 Z" fill="#8b7355" stroke="#5c4634" />
        <path d="M6 18 L34 14" stroke="#c4a882" strokeWidth="1" />
        <path d="M16 9 L16 26" stroke="#c4a882" strokeWidth="1" />
      </svg>
    );
  }
  if (kind === "roof") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <path d="M4 22 L20 8 L36 22 L32 22 L20 12 L8 22 Z" fill="#6b3a2a" stroke="#3d2218" />
        <path d="M8 22 L32 22 L32 26 L8 26 Z" fill="#8a4e3a" />
      </svg>
    );
  }
  if (kind === "column") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="12" y="26" width="16" height="3" fill="#b7ab9a" stroke="#8a7d6c" />
        <rect x="15" y="6" width="10" height="20" fill="#d8d0c4" stroke="#8a7d6c" />
        <rect x="11" y="4" width="18" height="3" fill="#8b5a32" />
      </svg>
    );
  }
  if (kind === "door") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="10" y="6" width="20" height="22" fill="#8b5a32" stroke="#5c3a22" />
        <rect x="13" y="16" width="14" height="10" fill="#c4a882" />
        <rect x="14" y="8" width="12" height="6" fill="#9bb7c9" opacity="0.9" />
        <circle cx="24" cy="21" r="1.1" fill="#d8d0c4" />
      </svg>
    );
  }
  if (kind === "window") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="6" y="8" width="28" height="16" fill="#9bb7c9" stroke="#6d4a30" />
        <rect x="6" y="22" width="28" height="3" fill="#b7ab9a" />
        <path d="M20 8 V24 M6 16 H34" stroke="#6d4a30" strokeWidth="1.2" />
      </svg>
    );
  }
  if (kind === "stairs") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <path d="M6 26 H14 V20 H22 V14 H30 V8 H36" fill="none" stroke="#8b5a32" strokeWidth="3" />
        <path d="M6 26 H14 V20 H22 V14 H30 V8 H36" fill="none" stroke="#c4a882" strokeWidth="1" />
      </svg>
    );
  }
  if (kind === "railing") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <path d="M6 26 V12 M34 26 V12 M6 12 H34 M6 18 H34" stroke="#6d4a30" strokeWidth="2" />
        <path d="M12 12 V26 M20 12 V26 M28 12 V26" stroke="#8b5a32" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "chimney") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="12" y="10" width="16" height="18" fill="#a65d4a" stroke="#6b3a2a" />
        <rect x="10" y="8" width="20" height="3" fill="#8a4e3a" />
        <rect x="14" y="4" width="5" height="5" fill="#6d4a30" />
        <rect x="21" y="4" width="5" height="5" fill="#6d4a30" />
      </svg>
    );
  }
  if (kind === "beam") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="4" y="14" width="32" height="5" fill="#8b5a32" stroke="#5c3a22" />
        <rect x="6" y="12" width="4" height="9" fill="#6d4a30" />
        <rect x="30" y="12" width="4" height="9" fill="#6d4a30" />
      </svg>
    );
  }
  if (kind === "foundation") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="4" y="18" width="32" height="8" fill="#9a907e" stroke="#6d6660" />
        <rect x="4" y="16" width="32" height="3" fill="#b7ab9a" />
      </svg>
    );
  }
  if (kind === "pergola") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="6" y="8" width="3" height="18" fill="#8b5a32" />
        <rect x="31" y="8" width="3" height="18" fill="#8b5a32" />
        <rect x="5" y="7" width="30" height="3" fill="#6d4a30" />
        <path d="M8 12 H32 M8 15 H32 M8 18 H32" stroke="#c4a882" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "fence") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <path d="M6 26 V10 M14 26 V10 M22 26 V10 M30 26 V10 M34 26 V10" stroke="#8b5a32" strokeWidth="2" />
        <path d="M4 14 H36 M4 20 H36" stroke="#6d4a30" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "path") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="5" y="12" width="9" height="8" fill="#b7ab9a" />
        <rect x="15.5" y="12" width="9" height="8" fill="#c4b8a4" />
        <rect x="26" y="12" width="9" height="8" fill="#b7ab9a" />
        <rect x="3" y="9" width="34" height="1.4" fill="#8b5a32" />
        <rect x="3" y="21.6" width="34" height="1.4" fill="#8b5a32" />
      </svg>
    );
  }
  if (kind === "planter") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="6" y="16" width="28" height="10" fill="#8a4e3a" stroke="#5c3226" />
        <rect x="5" y="15" width="30" height="2.2" fill="#6b3a2a" />
        <rect x="9" y="17.5" width="22" height="2" fill="#9a907e" />
        <rect x="11" y="8" width="6" height="8" fill="#3f6b3a" />
        <rect x="17" y="6" width="7" height="10" fill="#4d7c45" />
        <rect x="24" y="9" width="5" height="7" fill="#3f6b3a" />
      </svg>
    );
  }
  if (kind === "bench") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="6" y="24" width="4" height="4" fill="#9a907e" />
        <rect x="30" y="24" width="4" height="4" fill="#9a907e" />
        <rect x="7" y="16" width="2.4" height="8" fill="#8b5a32" />
        <rect x="30.6" y="16" width="2.4" height="8" fill="#8b5a32" />
        <rect x="5" y="14" width="30" height="2.4" fill="#c4a882" />
        <rect x="6" y="11.2" width="28" height="1.6" fill="#a67c52" />
        <path d="M7 14 V7 M33 14 V7" stroke="#6d4a30" strokeWidth="1.6" />
        <path d="M7 8 H33 M7 10.4 H33" stroke="#c4a882" strokeWidth="1.2" />
      </svg>
    );
  }
  if (kind === "lamp") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="16" y="26" width="8" height="3" fill="#9a907e" />
        <rect x="18.6" y="10" width="2.8" height="16" fill="#6d4a30" />
        <rect x="14" y="8" width="12" height="7" fill="#9bb7c9" stroke="#5c6670" />
        <path d="M13 8 H27 L20 4 Z" fill="#8b5a32" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
      <rect x="12" y="10" width="16" height="16" fill="#b7ab9a" stroke="#8a7d6c" />
      <rect x="9" y="8" width="22" height="3" fill="#6b3a2a" />
      <rect x="14" y="3" width="5" height="6" fill="#6d4a30" />
      <rect x="21" y="3" width="5" height="6" fill="#6d4a30" />
      <rect x="15" y="2" width="3" height="2" fill="#5c3224" />
      <rect x="22" y="2" width="3" height="2" fill="#5c3224" />
    </svg>
  );
}
