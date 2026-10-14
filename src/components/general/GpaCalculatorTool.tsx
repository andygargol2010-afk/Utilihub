import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

type Course = { grade: string; credits: string };

const gradePoints: Record<string, number> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

export function GpaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [courses, setCourses] = useState<Course[]>([
    { grade: "A", credits: "3" },
    { grade: "B+", credits: "4" },
  ]);
  const [copied, setCopied] = useState(false);

  const totalPoints = courses.reduce((sum, c) => {
    const pts = gradePoints[c.grade.toUpperCase()] ?? 0;
    const cr = parseFloat(c.credits) || 0;
    return sum + pts * cr;
  }, 0);
  const totalCredits = courses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  function updateCourse(i: number, field: keyof Course, value: string) {
    setCourses((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  }

  function addCourse() {
    setCourses((prev) => [...prev, { grade: "A", credits: "3" }]);
  }

  function removeCourse(i: number) {
    setCourses((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function copy() {
    const text = es
      ? `GPA: ${gpa.toFixed(2)}\nCr\u00e9ditos totales: ${totalCredits}`
      : `GPA: ${gpa.toFixed(2)}\nTotal credits: ${totalCredits}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setCourses([
      { grade: "A", credits: "3" },
      { grade: "B+", credits: "4" },
    ]);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        <p className="text-2xl font-semibold">GPA: {gpa.toFixed(2)}</p>
        <p className="text-sm">{es ? "Cr\u00e9ditos totales" : "Total credits"}: {totalCredits}</p>
      </div>

      <div className="space-y-3">
        {courses.map((c, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 items-end">
            <label className="block space-y-1 text-sm">
              <span className="font-medium">{es ? "Nota" : "Grade"}</span>
              <select value={c.grade} onChange={(e) => updateCourse(i, "grade", e.target.value)} className={fieldClass}>
                {Object.keys(gradePoints).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">{es ? "Cr\u00e9ditos" : "Credits"}</span>
              <input type="number" value={c.credits} onChange={(e) => updateCourse(i, "credits", e.target.value)} className={fieldClass} min="0" step="0.5" />
            </label>
            <button type="button" className={buttonClass} onClick={() => removeCourse(i)}>
              {es ? "Quitar" : "Remove"}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={addCourse}>
          {es ? "Agregar curso" : "Add course"}
        </button>
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
