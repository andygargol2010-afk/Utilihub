import type { GeneralTool } from "@/lib/general/types";

/**
 * EMERGENCY STUB — full HouseModeler3D was accidentally overwritten.
 * Restore the real file from git history (commit before 5d17cc2) then re-apply
 * the unmount try/catch patch so client nav to /games does not hit the error boundary.
 */
export function HouseModeler3D(_props: { tool: GeneralTool; locale?: "en" | "es" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground" role="alert">
      <p className="font-semibold text-foreground">3D house modeler temporarily unavailable</p>
      <p className="mt-2">
        The studio source is being restored. Other pages and tools work normally.
      </p>
    </div>
  );
}
