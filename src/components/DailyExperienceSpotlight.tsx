import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";
import { trackEvent } from "@/lib/analytics";
import { type SpotlightExp, POOL } from "./DailyExperienceSpotlight.part1";
import { type Props, getDayIndex, getDayOfYear, hoursUntilMidnight, loadLast, saveLast } from "./DailyExperienceSpotlight.part2";

export function DailyExperienceSpotlight({ locale }: Props) {
  const [exp, setExp] = useState<SpotlightExp | null>(null);
  const [dayOfYear, setDayOfYear] = useState(0);
  const [hoursLeft, setHoursLeft] = useState(24);
  const isEs = locale === "es";
  const isPt = locale === "pt";

  useEffect(() => {
    const dayIdx = getDayIndex();
    const doy = getDayOfYear();
    setDayOfYear(doy);
    setHoursLeft(hoursUntilMidnight());
    let selected = POOL[dayIdx];
    const last = loadLast();
    if (last === selected.id && POOL.length > 1) {
      selected = POOL[(dayIdx + 1) % POOL.length];
    }
    setExp(selected);
    saveLast(selected.id);
    trackEvent("spotlight-view", { id: selected.id, locale, day: doy });
  }, [locale]);

  if (!exp) return null;

  const path = isPt ? exp.pathPt : isEs ? exp.pathEs : exp.pathEn;
  const title = isPt ? exp.titlePt : isEs ? exp.titleEs : exp.titleEn;
  const teaser = isPt ? exp.teaserPt : isEs ? exp.teaserEs : exp.teaserEn;
  const cta = isPt ? exp.ctaPt : isEs ? exp.ctaEs : exp.ctaEn;
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  const accent = exp.accent;

  const handleShareTrack = () => {
    trackEvent("spotlight-share", { id: exp.id, locale, day: dayOfYear });
  };

  const borderClass = "border-border";
  const bgFrom = "";
  const bgTo = "";
  const textAccent = "text-primary";
  const badgeBg = "bg-secondary";
  const badgeText = "text-secondary-foreground";
  const btnBg = "bg-primary";
  const btnHover = "hover:bg-primary/90";
  const btnOutline = "focus-visible:outline-ring";
  const shareBorder = "border-border";

  const dailyLabel = isPt ? "Destaque do dia" : isEs ? "Destacado del día" : "Daily Spotlight";
  const todayLabel = isPt ? "HOJE" : isEs ? "HOY" : "TODAY";
  const rotateMsg = isPt
    ? `Roda em ~${hoursLeft}h · Compartilhe e traga um amigo!`
    : isEs
    ? `Rota en ~${hoursLeft}h · ¡Comparte y trae a un amigo!`
    : `Rotates in ~${hoursLeft}h · Share and bring a friend!`;

  return (
    <section className="container-page py-4" aria-labelledby="spotlight-title">
      <div className={`rounded-xl border ${borderClass} bg-card p-4 sm:p-5 ${bgFrom}${bgTo}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-[13px] font-semibold ${textAccent}`}>
                {dailyLabel}
              </p>
              <span className={`inline-flex items-center rounded-full ${badgeBg} px-2.5 py-0.5 text-[10px] font-bold ${badgeText}`}>
                {todayLabel} · D{dayOfYear}
              </span>
            </div>
            <h2 id="spotlight-title" className="mt-1 text-lg font-bold tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{teaser}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground/90">
              {rotateMsg}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                to={path}
                className={`inline-flex items-center gap-1.5 rounded-xl ${btnBg} px-5 py-2.5 text-sm font-bold text-white shadow-sm ${btnHover} focus-visible:outline focus-visible:outline-2 ${btnOutline}`}
                data-event="spotlight-click"
                data-exp={exp.id}
                onClick={() => trackEvent("spotlight-click", { id: exp.id, locale, day: dayOfYear })}
              >
                {cta} <ArrowRight className="size-4" />
              </Link>
              <div onClick={handleShareTrack} className="inline-flex">
                <ExperienceShareButton
                  title={title}
                  url={fullUrl}
                  locale={locale}
                  variant="button"
                  className={`${shareBorder} font-semibold`}
                />
              </div>
            </div>
          </div>
          <Sparkles className={`size-9 ${textAccent} opacity-80 shrink-0`} aria-hidden />
        </div>
      </div>
    </section>
  );
}
