import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Orbit Pulse Catcher: Radial Timing Game Guide | UtiliHub";
const description = cleanDescription(
  "Original long-form guide to the Orbit Pulse Catcher interactive timing game. Explains radial orbit mechanics, zone matching that grows to 8 zones, combo multipliers, power-up pulses, particle bursts, haptic feedback, wide touch zones, keyboard controls, PNG share with branding and stats, and localStorage high scores. Strategies, rhythm patterns, common mistakes, distinctions from other pulse games, and deep links to the live experience.",
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
          Orbit Pulse Catcher is an interactive timing game built around radial orbit mechanics. Pulses travel along circular orbits while matching zones grow from a few up to eight. Catch them at the right moment to build combos, trigger power-ups, and chase high scores. This original guide covers the core loop, scoring systems, visual and haptic feedback, controls, sharing, persistence, practical strategies, rhythm patterns, common mistakes, and how it differs from related pulse and arcade experiences on UtiliHub.
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
          The radial layout keeps everything in view on both desktop and mobile. Because the motion is circular rather than linear, peripheral vision and rhythm recognition become useful skills. Zones start at four and increase by roughly one every two levels (capped at eight), so the angular window for each zone shrinks as the run progresses.
        </p>

        <h2>Combo multipliers and scoring</h2>
        <p>
          Consecutive successful catches increase a combo multiplier. Higher combos award more points per catch and unlock visual milestones. Missing a pulse resets the combo. The best scores come from long, unbroken chains rather than occasional perfect hits.
        </p>
        <p>
          Points per successful catch scale with combo length, current level, and any active power-up boost. A base value is multiplied by a combo factor (growing with successive catches), a level factor, and a temporary boost multiplier when a power-up is active. Combo milestones at 5 and 10 trigger extra particle celebrations without changing the underlying formula.
        </p>

        <h2>Power-up pulses</h2>
        <p>
          Certain pulses are power-ups. Catching them grants temporary bonuses such as an extra life or a score boost. These appear less frequently than normal pulses and are usually visually distinct (different hue and stronger glow). Using them at the right moment can extend a high-combo run or recover from a near-miss. Lives are capped, and the score boost is time-limited.
        </p>

        <h2>Particle bursts, haptic feedback, and visual polish</h2>
        <p>
          Successful catches, level-ups, and combo milestones (especially at 5 and 10) trigger particle bursts. The effects are modest in count and lifetime so they stay performant. Wide touch zones include ripple feedback. On devices that support it, haptic pulses give tactile confirmation without relying solely on sight or sound. Catch rings expand outward from the hit location, and power-up hits produce denser sparks.
        </p>

        <h2>Controls: touch and keyboard</h2>
        <p>
          On touch screens the zones are large enough for comfortable tapping. Keyboard support maps number keys 1–N and nearby QWERTY keys to the active zones, letting desktop players stay precise without looking at the keyboard. Both input methods feed the same timing and scoring logic. Zone numbers are drawn inside the arcs for quick reference.
        </p>

        <h2>PNG share and localStorage high scores</h2>
        <p>
          After a strong run you can export a PNG that includes the game title, UtiliHub branding, and your best score, level, and combo. High scores persist in localStorage so they survive page reloads and browser restarts. Nothing leaves the device except the image you choose to share.
        </p>

        <h2>Worked example: a mid-run high-score path</h2>
        <p>
          Imagine a player starting at level 1 with four zones. They catch the first few pulses cleanly, building a combo to 4. A power-up pulse appears (golden hue). They catch it, gaining one life and a temporary score boost. With the boost active they push the combo to 8 before the boost expires. At level 3 (five zones) they deliberately take safer center hits rather than edge clips, keeping the combo alive. By the time zones reach six or seven they have already banked enough points that a single miss is less devastating. They finish the run by exporting a PNG that shows the final score, level, and peak combo for later comparison.
        </p>
        <p>
          The example illustrates the practical trade-off: early power-up use to protect lives and amplify scoring, followed by more conservative timing once zone count rises.
        </p>

        <h2>Rhythm recognition and pattern anticipation</h2>
        <p>
          Because pulses follow continuous circular motion, the timing interval between successive zone hits is relatively stable on a given level. Players who internalize the period can start anticipating the next hit window instead of reacting purely visually. On early levels (four zones) the angular spacing is wide; a comfortable rhythm is one tap roughly every 0.6–0.8 seconds depending on orbit speed. As zones increase to six or seven the windows shrink and the required cadence becomes tighter—practice matching the beat of the orbit rather than chasing individual pulses.
        </p>
        <p>
          A useful drill: mute or ignore the visual pulse for a few seconds and tap only on the remembered interval, then re-sync. Successful runs often show a slight lead on the zone entry rather than a center hit, giving a small buffer against late reactions. Power-up pulses disrupt the pattern intentionally; treat them as a short rhythm break rather than a forced reset.
        </p>

        <h2>Common mistakes and how to avoid them</h2>
        <ul>
          <li><strong>Chasing edge clips for style:</strong> Early levels reward precision, but once zones exceed five the angular margin shrinks. Prefer center-of-zone hits to protect the combo.</li>
          <li><strong>Holding power-ups too long:</strong> The score boost is time-limited. Activate while a combo is already building so the multiplier applies to the highest-value catches.</li>
          <li><strong>Ignoring keyboard on desktop:</strong> Touch works, but number-key mapping (1–N) reduces latency and lets you keep eyes on the orbit. Map the zones once and stay on keys.</li>
          <li><strong>Panic after a near-miss:</strong> A single miss resets the combo but does not end the run if lives remain. Reset mentally to the new rhythm instead of over-correcting speed.</li>
          <li><strong>Skipping the PNG export:</strong> The baked stats (score, level, peak combo) are the only persistent record. Export after every personal best so progress is visible later.</li>
        </ul>

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
          <li>Note the zone growth pattern: four zones early, then one additional zone roughly every two levels, up to eight. Adjust your visual scan accordingly.</li>
          <li>Internalize the orbit period early; anticipation beats pure reaction once zones exceed five.</li>
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
          <li><Link to="/guides/n-body-gravity">N-Body Gravity Guide</Link> — related simulation guide with timing and particle systems.</li>
        </ul>

        <h2>Frequently asked questions</h2>
        <p>
          <strong>How many zones can appear?</strong> The matching zones grow up to a maximum of eight as levels progress. They start at four and increase roughly every two levels.
        </p>
        <p>
          <strong>Do power-ups stack?</strong> They provide temporary effects (extra life or score boost). Catching another while one is active usually refreshes or extends the benefit. Lives are capped.
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
        <p>
          <strong>What ends a combo?</strong> A missed pulse or a long pause without a successful catch resets the combo counter.
        </p>
        <p>
          <strong>How do I maximize the power-up boost?</strong> Catch the power-up while your combo is already elevated so the temporary multiplier applies to the highest-value catches.
        </p>
        <p>
          <strong>Is there a best orbit speed to aim for?</strong> Speed increases with level. Focus on matching the current period rather than forcing a fixed tempo; the radial layout makes the interval predictable once you have a few successful hits.
        </p>
        <p>
          <strong>Do particle effects affect timing?</strong> No. Particles are visual only and do not alter collision or scoring windows. They remain modest to protect performance.
        </p>
        <p>
          <strong>Can I restart a level without losing the whole run?</strong> Lives allow recovery from individual misses. A full restart (if available in the UI) clears the current score but preserves the localStorage high score.
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
