// Part 1 of 3 — split from MediaTool.tsx on 2026-11-04. Edit here; MediaTool.tsx re-exports.

export const download = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
