import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Grade = "A" | "B" | "C" | "D" | "F";

const POINTS: Record<Grade, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 };
const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

interface Course {
  id: number;
  grade: Grade;
  credits: number;
}

export function GpaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, grade: "A", credits: 3 },
    { id: 2, grade: "B", credits: 4 },
  ]);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const totalCredits = courses.reduce((s, c) => s + (c.credits > 0 ? c.credits : 0), 0);
    if (totalCredits === 0) return null;
    const totalPoints = courses.reduce((s, c) => s + POINTS[c.grade] * (c.credits > 0 ? c.credits : 0), 0);
    return totalPoints / totalCredits;
  }, [courses]);

  function addCourse() {
    setCourses((prev) => [...prev, { id: Date.now(), grade: "B", credits: 3 }]);
  }

  function update(id: number, field: keyof Course, value: string | number) {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: field === "credits" ? Number(value) || 0 : value } : c)),
    );
  }

  function remove(id: number) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  async function copy() {
    if (result == null) return;
    const text = result.toFixed(2);
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
      { id: 1, grade: "A", credits: 3 },
      { id: 2, grade: "B", credits: 4 },
    ]);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "GPA (escala 4.0)" : "GPA (4.0 scale)"}</p>
        {result != null ? (
          <p className="text-3xl font-semibold">{result.toFixed(2)}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Añade cursos con créditos positivos" : "Add courses with positive credits"}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {courses.map((c) => (
          <div key={c.id} className="flex gap-2 items-end">
            <label className="flex-1 space-y-1 text-sm">
              <span className="font-medium">{es ? "Nota" : "Grade"}</span>
              <select
                value={c.grade}
                onChange={(e) => update(c.id, "grade", e.target.value as Grade)}
                className={fieldClass}
              >
                {(["A", "B", "C", "D", "F"] as Grade[]).map((g) => (
                  <option key={g} value={g}>
                    {g} ({POINTS[g]})
                  </option>
                ))}
              </select>
            </label>
            <label className="w-24 space-y-1 text-sm">
              <span className="font-medium">{es ? "Créditos" : "Credits"}</span>
              <input
                type="number"
                min="0"
                step="0.5"
                value={c.credits}
                onChange={(e) => update(c.id, "credits", e.target.value)}
                className={fieldClass}
              />
            </label>
            <button type="button" className={buttonClass} onClick={() => remove(c.id)}>
              {es ? "Quitar" : "Remove"}
            </button>
          </div>
        ))}
        <button type="button" className={buttonClass} onClick={addCourse}>
          {es ? "+ Añadir curso" : "+ Add course"}
        </button>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "A (3 cr) + B (4 cr) → GPA 3.43" : "A (3 cr) + B (4 cr) → GPA 3.43"}</p>
        <p>{es ? "A (3), A (3), B (3) → GPA 3.67" : "A (3), A (3), B (3) → GPA 3.67"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar GPA" : "Copy GPA"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
