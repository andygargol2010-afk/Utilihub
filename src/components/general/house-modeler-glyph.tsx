import type { PartKind } from "./house-modeler-lib";

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
        <path d="M6 26 H14 V20 H22 V14 H30 V8" fill="none" stroke="#c4a882" strokeWidth="1.4" />
        <path d="M32 8 V26" stroke="#6d4a30" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "railing") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <path d="M4 26 V8 M20 26 V8 M36 26 V8" stroke="#6d4a30" strokeWidth="2.2" />
        <path d="M4 9 H36" stroke="#8b5a32" strokeWidth="2.4" />
        <path d="M6 24 H18 M22 24 H34" stroke="#c4a882" strokeWidth="1.4" />
        <path d="M8 22 V12 M12 22 V12 M16 22 V12 M24 22 V12 M28 22 V12 M32 22 V12" stroke="#a67c52" strokeWidth="1" />
      </svg>
    );
  }
  if (kind === "beam") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="6" y="24" width="6" height="3" fill="#b7ab9a" />
        <rect x="28" y="24" width="6" height="3" fill="#b7ab9a" />
        <rect x="7.5" y="8" width="3" height="16" fill="#8b5a32" />
        <rect x="29.5" y="8" width="3" height="16" fill="#8b5a32" />
        <rect x="4" y="6" width="32" height="4" fill="#6d4a30" />
        <path d="M11 10 L16 7 M29 10 L24 7" stroke="#c4a882" strokeWidth="1.4" />
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
