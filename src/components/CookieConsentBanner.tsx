import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { getConsent, setConsent, type ConsentValue } from "@/lib/cookie-consent";

/**
 * Bottom cookie banner on first visit.
 * Accept → marketing ads may load. Reject → ads stay blocked.
 */
export function CookieConsentBanner() {
  const { pathname } = useLocation();
  const es = pathname === "/es" || pathname.startsWith("/es/");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only when no prior choice
    if (getConsent() === null) setVisible(true);
  }, []);

  const choose = (value: ConsentValue) => {
    setConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  const privacyHref = es ? "/es/privacidad" : "/privacy";

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={es ? "Consentimiento de cookies" : "Cookie consent"}
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border/80 bg-background/95 p-4 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">
            {es ? "Usamos cookies" : "We use cookies"}
          </p>
          <p className="mt-1 leading-relaxed">
            {es
              ? "Usamos cookies propias y de terceros (anuncios) para mejorar la experiencia y mostrar publicidad. Podés aceptar o rechazar las de marketing."
              : "We use first-party and third-party cookies (ads) to improve the experience and show advertising. You can accept or reject marketing cookies."}{" "}
            <a href={privacyHref} className="font-medium text-primary underline-offset-2 hover:underline">
              {es ? "Privacidad" : "Privacy"}
            </a>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="min-h-10 flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted sm:flex-none"
          >
            {es ? "Rechazar" : "Reject"}
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="min-h-10 flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95 sm:flex-none"
          >
            {es ? "Aceptar" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}
