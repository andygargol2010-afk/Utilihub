import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Canvas & WebGL Performance for Interactive Web Experiences | UtiliHub";
const description = cleanDescription(
  "Original guide to keeping particle systems, physics sims and playgrounds at smooth 60fps. requestAnimationFrame, object pooling, devicePixelRatio, reduced motion, mobile budgets and Performance API measurement.",
);

export const Route = createFileRoute("/guides/canvas-webgl-performance")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/guides/canvas-webgl-performance") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/guides/canvas-webgl-performance") },
      ...hreflangLinks("/guides/canvas-webgl-performance", "/es/guias/rendimiento-canvas-webgl"),
    ],
  }),
  component: CanvasWebGLPerformanceGuideEn,
});

function CanvasWebGLPerformanceGuideEn() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Guides" }, { label: "Canvas & WebGL Performance" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Canvas and WebGL Performance for Smooth Interactive Experiences</h1>
        <p className="lead">
          Interactive particle systems, physics simulations and playgrounds need to stay at a solid 60 frames per second on both desktop and mobile. This original guide covers practical techniques used on UtiliHub: requestAnimationFrame best practices, object pooling, devicePixelRatio handling, reduced-motion support, mobile budgets and measuring with the Performance API.
        </p>

        <h2>Why 60fps matters</h2>
        <p>
          At 60fps each frame has roughly 16.7 milliseconds. Any work that regularly exceeds that budget produces dropped frames, jank and a less responsive feel. Canvas 2D and WebGL are powerful, but they still run on the main thread alongside React, input handlers and layout. The goal is to keep the animation loop short and predictable.
        </p>

        <h2>requestAnimationFrame best practices</h2>
        <p>
          Always drive the simulation with <code>requestAnimationFrame</code>. It aligns with the display refresh rate and pauses automatically when the tab is backgrounded.
        </p>
        <ul>
          <li>Store the callback id so you can cancel it on unmount or when the component is hidden.</li>
          <li>Use a delta-time (dt) calculation from the previous timestamp, but clamp it (for example max 50 ms) so a long frame does not produce a huge jump.</li>
          <li>Prefer a fixed simulation timestep for physics stability, then render with interpolation if needed.</li>
          <li>Avoid allocating new objects, arrays or strings inside the loop.</li>
        </ul>

        <h2>Object pooling</h2>
        <p>
          Creating and discarding thousands of particle objects every second triggers garbage collection pauses. Object pooling reuses the same instances.
        </p>
        <p>
          Maintain a free list of inactive particles. When you need a new one, take from the free list (or grow the pool if empty). When a particle dies, reset its properties and push it back onto the free list. The same pattern works for temporary vectors, trail segments or WebGL buffers.
        </p>

        <h2>devicePixelRatio and high-DPI displays</h2>
        <p>
          High-DPI screens multiply the number of pixels you must fill. Setting the canvas backing store to <code>devicePixelRatio</code> gives crisp lines, but it can quadruple the fill rate on a 2× display.
        </p>
        <p>
          Practical approach: use a capped ratio (for example <code>Math.min(window.devicePixelRatio, 2)</code>) and only raise it when the experience is known to be light. For particle-heavy scenes, a ratio of 1 on mobile is often the better trade-off for smoothness.
        </p>

        <h2>Reduced motion and accessibility</h2>
        <p>
          Honor the <code>prefers-reduced-motion</code> media query. When it matches, lower particle counts, disable trails, slow or pause continuous motion, and avoid large animated gradients. This improves comfort for users who experience motion sensitivity and also reduces CPU/GPU load.
        </p>

        <h2>Mobile budgets</h2>
        <p>
          Mobile GPUs and thermal limits are tighter. Useful rules of thumb:
        </p>
        <ul>
          <li>Expose a particle-count or quality slider that defaults lower on small screens or coarse pointers.</li>
          <li>Skip expensive effects (bloom, large blur, high-resolution trails) below a width threshold.</li>
          <li>Pause the loop when the canvas is off-screen (IntersectionObserver).</li>
          <li>Keep the canvas CSS size fixed with an aspect-ratio box so layout does not shift.</li>
        </ul>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">See the techniques in action</h3>
          <p className="mt-2 text-muted-foreground">
            Gravity Particles and Particle Magnet Lab both use these patterns to stay smooth while you interact.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/playgrounds/gravity-particles" className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Gravity Particles
            </Link>
            <Link to="/playgrounds/particle-magnets" className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Particle Magnet Lab
            </Link>
          </div>
        </div>

        <h2>Measuring with the Performance API</h2>
        <p>
          Use the browser’s Performance API to see where time is actually spent.
        </p>
        <ul>
          <li><code>performance.now()</code> around update and draw phases.</li>
          <li><code>performance.mark</code> / <code>performance.measure</code> for named sections that appear in the DevTools Performance panel.</li>
          <li>Watch long frames (over 50 ms) and GC events. Object pooling and avoiding allocations usually remove the spikes.</li>
          <li>On supported browsers, <code>performance.memory</code> (Chrome) can hint at growing heap size if the pool is leaking.</li>
        </ul>
        <p>
          Record a short session while interacting, then look at the flame chart. The animation callback should be a small, regular slice of the frame.
        </p>

        <h2>Off-main-thread work</h2>
        <p>
          Heavy computation that does not need to touch the DOM or canvas can move to a Web Worker. Typical candidates are pathfinding, large particle updates that only need positions, or physics solvers. The main thread then only receives the latest state and draws it. Message passing has cost, so batch updates rather than sending every particle every frame.
        </p>

        <h2>Related experiences on UtiliHub</h2>
        <ul>
          <li><Link to="/playgrounds/gravity-particles">Gravity Particles</Link> — attractors and orbits.</li>
          <li><Link to="/playgrounds/particle-magnets">Particle Magnet Lab</Link> — magnetic forces.</li>
          <li><Link to="/simulators/double-pendulum">Double Pendulum Chaos</Link> — physics simulation.</li>
          <li><Link to="/guides/particle-physics">Particle Physics guide</Link> — the underlying force models.</li>
        </ul>

        <h2>Conclusion</h2>
        <p>
          Smooth 60fps interactive experiences come from disciplined loops, reuse of objects, sensible resolution choices and respect for mobile and reduced-motion constraints. Measure first, then optimize the hot path. The playgrounds linked above demonstrate these ideas in practice.
        </p>
      </article>

      <div className="mt-12">
        <AdsterraBanner />
      </div>
    </div>
  );
}
