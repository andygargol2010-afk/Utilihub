import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Locale = "en" | "es";

interface Props {
  title: string;
  url: string;
  locale?: Locale;
  className?: string;
  variant?: "icon" | "button";
}

export function ExperienceShareButton({ title, url, locale = "en", className = "", variant = "button" }: Props) {
  const [status, setStatus] = useState("");
  const isEs = locale === "es";
  const copy = isEs
    ? { share: "Compartir", copied: "Enlace copiado", error: "No se pudo compartir", aria: "Compartir experiencia" }
    : { share: "Share", copied: "Link copied", error: "Could not share", aria: "Share experience" };

  const handleShare = async () => {
    trackEvent("share_click", { title, locale, url });
    const shareData = {
      title: `${title} | UtiliHub`,
      text: isEs
        ? `Mira esta experiencia interactiva en UtiliHub: ${title}`
        : `Check out this interactive experience on UtiliHub: ${title}`,
      url,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        setStatus(isEs ? "Compartido" : "Shared");
        setTimeout(() => setStatus(""), 1800);
        return;
      } catch {
        // User cancelled or failed; fall through to copy.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus(copy.copied);
    } catch {
      setStatus(copy.error);
    }
    setTimeout(() => setStatus(""), 1800);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void handleShare();
        }}
        className={`inline-flex items-center justify-center rounded-lg border border-border bg-card/90 p-1.5 text-xs hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${className}`}
        aria-label={copy.aria}
        data-event="share_click"
        title={copy.share}
      >
        {status ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${className}`}
      aria-label={copy.aria}
      data-event="share_click"
    >
      {status ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
      {status || copy.share}
    </button>
  );
}
