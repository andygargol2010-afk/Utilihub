import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Orbit Pulse Catcher: Radial Timing Game Guide | UtiliHub";
const description = cleanDescription(
  "Original long-form guide to the Orbit Pulse Catcher interactive timing game. Explains radial orbit mechanics, zone matching that grows to 8 zones, combo multipliers, power-up pulses, particle bursts, haptic feedback, wide touch zones, keyboard controls, PNG share with branding and stats, and localStorage high scores. Strategies, distinctions from other pulse games, and deep links to the live experience.",
);

export const Route = createFileRoute("/guides/orbit-pulse-catcher")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/guides/orbit-pulse-catcher") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/guides/orbit-pulse-catcher") },
      ...hreflangLinks("/guides/orbit-pulse-catcher", "/es/guias/orbit-pulse-catcher"),
    ],
  }),
  component: OrbitPulseCatcherGuideEn,
});

function OrbitPulseCatcherGuideEn() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Guides", to: "/guides" }, { label: "Orbit Pulse Catcher" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Orbit Pulse Catcher: Master Radial Timing, Combos, and High Scores</h1>
        <p className="lead">
          Orbit Pulse Catcher is an interactive timing game built around radial orbit mechanics. Pulses travel along circular orbits while matching zones grow from a few up to eight. Catch them at the right moment to build combos, trigger power-ups, and chase high scores. This original guide covers the core loop, scoring systems, visual and haptic feedback, controls, sharing, persistence, practical strategies, and how it differs from related pulse and arcade experiences on UtiliHub.
        </p>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Play the live game</h3>
          <p className="mt-2 text-muted-foreground">
            Match pulses on radial orbits, grow your combo, and share your best score.
          </p>
          <Link
            to="/games/orbit-pulse-catcher"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Open Orbit Pulse Catcher
          </Link>
        </div>

        <h2>Radial orbit mechanics and zone matching</h2>
        <p>
          Pulses move continuously along one or more circular orbits. Matching zones appear as radial sectors or arcs that you must hit while the pulse is inside them. Early levels use fewer zones; as difficulty rises the number of active zones grows toward a maximum of eight. Timing precision matters more than raw speed: a pulse that just clips the edge of a zone can still count, but late or early misses break the combo.
        </p>
        <p>
          The radial layout keeps everything in view on both desktop and mobile. Because the motion is circular rather than linear, peripheral vision and rhythm recognition become useful skills.
        </p>

        <h2>Combo multipliers and scoring</h2>
        <p>
          Consecutive successful catches increase a combo multiplier. Higher combos award more points per catch and unlock visual milestones. Missing a pulse resets the combo. The best scores come from long, unbroken chains rather than occasional perfect hits.
        </p>

        <h2>Power-up pulses</h2>
        <p>
          Certain pulses are power-ups. Catching them grants temporary bonuses such as an extra life or a score boost. These appear less frequently than normal pulses and are usually visually distinct. Using them at the right moment can extend a high-combo run or recover from a near-miss.
        </p>

        <h2>Particle bursts, haptic feedback, and visual polish</h2>
        <p>
          Successful catches, level-ups, and combo milestones (especially at 5 and 10) trigger particle bursts. The effects are modest in count and lifetime so they stay performant. Wide touch zones include ripple feedback. On devices that support it, haptic pulses give tactile confirmation without relying solely on sight or sound.
        </p>

        <h2>Controls: touch and keyboard</h2>
        <p>
          On touch screens the zones are large enough for comfortable tapping. Keyboard support maps number keys 1–N and nearby QWERTY keys to the active zones, letting desktop players stay precise without looking at the keyboard. Both input methods feed the same timing and scoring logic.
        </p>

        <h2>PNG share and localStorage high scores</h2>
        <p>
          After a strong run you can export a PNG that includes the game title, UtiliHub branding, and your best score, level, and combo. High scores persist in localStorage so they survive page reloads and browser restarts. Nothing leaves the device except the image you choose to share.
        </p>

        <h2>Distinction from related games</h2>
        <p>
          Pulse Catch Arena focuses on linear or arena-style pulse catching with different spatial rules. Refraction Challenge is a physics-based aiming and light-bending puzzle rather than a pure timing game. Orbit Pulse Catcher is defined by its radial orbit layout, growing zone count, and emphasis on sustained combo rhythm.
        </p>

        <h2>Practical high-score strategies</h2>
        <ul>
          <li>Prioritize consistency over greed: a medium combo sustained across levels usually beats a short ultra-high burst that ends early.</li>
          <li>Watch the orbit speed and zone count together; when zones multiply, reduce your risk tolerance on edge hits.</li>
          <li>Save power-up pulses for moments when your combo is already high or when you need the extra life to finish a level.</li>
          <li>Use keyboard on desktop for tighter timing; touch ripples help confirm mobile hits.</li>
          <li>Export a PNG of your best run — the baked stats make it easy to track progress over time.</li>
        </ul>

        <h2>Performance and Core Web Vitals</h2>
        <p>
          The canvas loads lazily on its own route. Particle counts and lifetimes are capped. No heavy new dependencies are introduced. The result stays CWV-safe on mobile while delivering clear visual and haptic feedback.
        </p>

        <h2>How UtiliHub implements the game</h2>
        <p>
          The game component maintains orbit positions, active zones, combo state, lives, and score. Each frame advances the pulses, checks zone intersections, triggers particles and haptics on hits, and updates the high-score store. English and Spanish routes stay in sync. Adsterra remains intact.
        </p>

        <h2>Related experiences</h2>
        <ul>
          <li><Link to="/games/pulse-catch-arena">Pulse Catch Arena</Link> — alternative pulse-catching rules.</li>
          <li><Link to="/games/refraction-challenge">Refraction Challenge</Link> — physics aiming puzzle.</li>
          <li><Link to="/guides/modular-pattern-composer">Modular Pattern Composer Guide</Link> — companion long-form guide on another interactive surface.</li>
        </ul>

        <h2>Frequently asked questions</h2>
        <p>
          <strong>How many zones can appear?</strong> The matching zones grow up to a maximum of eight as levels progress.
        </p>
        <p>
          <strong>Do power-ups stack?</strong> They provide temporary effects (extra life or score boost). Catching another while one is active usually refreshes or extends the benefit.
        </p>
        <p>
          <strong>Is the high score shared online?</strong> No. Scores stay in localStorage on your device. The PNG share is the way to show others your result.
        </p>
        <p>
          <strong>Does it work offline?</strong> Yes, once the page has loaded. All logic and persistence are client-side.
        </p>
        <p>
          <strong>Can I use both touch and keyboard?</strong> Yes. Both inputs are active and map to the same zones.
        </p>

        <p className="mt-8">
          <Link to="/games/orbit-pulse-catcher" className="font-semibold text-primary">
            Open Orbit Pulse Catcher and start your high-score run →
          </Link>
        </p>
      </article>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
