import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  allowAllDraft,
  blockAiDraft,
  blockAllDraft,
  buildRobotsTxt,
  emptyGroup,
  emptyRule,
  pathDecision,
  publicSiteDraft,
  validateDraft,
  type RobotsDraft,
  type RobotsGroup,
} from "@/lib/general/robots-txt";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const PRESETS: { id: string; label: string; labelEs: string; draft: () => RobotsDraft }[] = [
  { id: "allow", label: "Allow all", labelEs: "Permitir todo", draft: allowAllDraft },
  { id: "block", label: "Block all", labelEs: "Bloquear todo", draft: blockAllDraft },
  { id: "public", label: "Public site", labelEs: "Sitio público", draft: publicSiteDraft },
  { id: "ai", label: "Block AI crawlers", labelEs: "Bloquear bots de IA", draft: blockAiDraft },
];

export function RobotsTxtTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [draft, setDraft] = useState<RobotsDraft>(publicSiteDraft);
  const [probe, setProbe] = useState("/admin/users");
  const [copied, setCopied] = useState(false);

  const issues = useMemo(() => validateDraft(draft, es), [draft, es]);
  const file = useMemo(() => (issues.length ? "" : buildRobotsTxt(draft)), [draft, issues]);
  const starGroup = draft.groups.find((group) => group.agent.trim() === "*") ?? draft.groups[0];
  const decision = starGroup && !issues.length ? pathDecision(starGroup, probe || "/") : null;

  function updateGroup(id: string, patch: Partial<RobotsGroup>) {
    setDraft((current) => ({
      ...current,
      groups: current.groups.map((group) => (group.id === id ? { ...group, ...patch } : group)),
    }));
  }

  async function copyFile() {
    if (!file) return;
    await navigator.clipboard.writeText(file);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadFile() {
    if (!file) return;
    const blob = new Blob([file], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "robots.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button key={preset.id} type="button" className={buttonClass} onClick={() => setDraft(preset.draft())}>
            {es ? preset.labelEs : preset.label}
          </button>
        ))}
        <button type="button" className={buttonClass} onClick={() => setDraft(allowAllDraft())}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <label className="block space-y-1 text-sm">
        <span>{es ? "Comentario (opcional)" : "Comment (optional)"}</span>
        <input
          className={inputClass}
          value={draft.comment}
          onChange={(event) => setDraft({ ...draft, comment: event.target.value })}
          placeholder={es ? "Staging: no indexar" : "Staging: do not index"}
        />
      </label>

      <div className="space-y-3">
        {draft.groups.map((group, index) => (
          <fieldset key={group.id} className="space-y-3 rounded-2xl border p-3">
            <legend className="px-1 text-sm font-medium">
              {es ? `Grupo ${index + 1}` : `Group ${index + 1}`}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1 text-sm">
                <span>User-agent</span>
                <input
                  className={inputClass}
                  value={group.agent}
                  onChange={(event) => updateGroup(group.id, { agent: event.target.value })}
                  placeholder="*"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span>Crawl-delay</span>
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={group.crawlDelay}
                  onChange={(event) => updateGroup(group.id, { crawlDelay: event.target.value })}
                  placeholder={es ? "vacío = omitir" : "empty = omit"}
                />
              </label>
            </div>
            <div className="space-y-2">
              {group.rules.map((rule) => (
                <div key={rule.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[9rem_1fr_auto]">
                  <select
                    className={inputClass}
                    value={rule.directive}
                    onChange={(event) =>
                      updateGroup(group.id, {
                        rules: group.rules.map((item) =>
                          item.id === rule.id ? { ...item, directive: event.target.value as "Allow" | "Disallow" } : item,
                        ),
                      })
                    }
                  >
                    <option value="Allow">Allow</option>
                    <option value="Disallow">Disallow</option>
                  </select>
                  <input
                    className={inputClass}
                    value={rule.path}
                    onChange={(event) =>
                      updateGroup(group.id, {
                        rules: group.rules.map((item) => (item.id === rule.id ? { ...item, path: event.target.value } : item)),
                      })
                    }
                    placeholder="/admin"
                  />
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={() => updateGroup(group.id, { rules: group.rules.filter((item) => item.id !== rule.id) })}
                  >
                    {es ? "Quitar" : "Remove"}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={buttonClass}
                onClick={() => updateGroup(group.id, { rules: [...group.rules, emptyRule({ path: "/" })] })}
              >
                {es ? "Agregar regla" : "Add rule"}
              </button>
              <button
                type="button"
                className={buttonClass}
                onClick={() => setDraft((current) => ({ ...current, groups: current.groups.filter((item) => item.id !== group.id) }))}
              >
                {es ? "Quitar grupo" : "Remove group"}
              </button>
            </div>
          </fieldset>
        ))}
      </div>

      <button
        type="button"
        className={buttonClass}
        onClick={() => setDraft((current) => ({ ...current, groups: [...current.groups, emptyGroup()] }))}
      >
        {es ? "Agregar user-agent" : "Add user-agent"}
      </button>

      <label className="block space-y-1 text-sm">
        <span>Sitemap</span>
        <input
          className={inputClass}
          value={draft.sitemap}
          onChange={(event) => setDraft({ ...draft, sitemap: event.target.value })}
          placeholder="https://www.example.com/sitemap.xml"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span>{es ? "Probar ruta en el grupo *" : "Check a path on the * group"}</span>
        <input className={inputClass} value={probe} onChange={(event) => setProbe(event.target.value)} placeholder="/blog" />
      </label>

      {issues.length > 0 ? (
        <ul className="space-y-1 rounded-2xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
          {issues.map((issue) => (
            <li key={issue.field}>{issue.message}</li>
          ))}
        </ul>
      ) : (
        <div className="space-y-2 rounded-2xl border p-3">
          <p className="text-sm font-medium">
            {decision === "disallow"
              ? es
                ? `Bloqueada para ${starGroup?.agent || "*"}`
                : `Blocked for ${starGroup?.agent || "*"}`
              : decision === "allow"
                ? es
                  ? `Permitida para ${starGroup?.agent || "*"}`
                  : `Allowed for ${starGroup?.agent || "*"}`
                : es
                  ? "Sin regla: permitida por defecto"
                  : "No rule: allowed by default"}
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-muted p-3 text-sm">{file}</pre>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonClass} onClick={copyFile}>
              {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
            </button>
            <button type="button" className={buttonClass} onClick={downloadFile}>
              {es ? "Descargar robots.txt" : "Download robots.txt"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
