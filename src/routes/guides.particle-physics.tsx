import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Particle Physics in the Browser: Gravity, Attraction & Systems | UtiliHub";
const description = cleanDescription(
  "Original guide to particle simulations in the browser. Learn how gravity, attraction forces and particle systems work with formulas, visual explanations and live examples. Try Gravity Particles Playground and River of Light.",
);

export const Route = createFileRoute("/guides/particle-physics")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/guides/particle-physics") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/guides/particle-physics") },
      ...hreflangLinks("/guides/particle-physics", "/es/guias/fisica-particulas"),
    ],
  }),
  component: ParticlePhysicsGuideEn,
});

function ParticlePhysicsGuideEn() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Guides", to: "/guides" }, { label: "Particle Physics" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Particle Physics in the Browser: How Gravity, Attraction and Systems Work</h1>
        <p className="lead">
          Particle simulations running entirely in the browser have become a powerful way to explore physics concepts, create interactive art and build engaging experiences. This original guide explains the core mechanics behind gravity, attraction forces and particle systems — with formulas, visual intuition and direct links to live playgrounds on UtiliHub.
        </p>

        <h2>What is a particle system?</h2>
        <p>
          A particle system is a collection of many small entities (particles) that move according to simple rules. Each particle typically has position, velocity and sometimes mass or lifetime. By applying forces to thousands of them simultaneously, complex emergent behaviors appear: orbits, rivers of light, explosions, fluid-like flows or star fields.
        </p>
        <p>
          In the browser we use the Canvas API or WebGL. The simulation loop runs every animation frame (requestAnimationFrame), updating positions with basic Newtonian mechanics approximated for real-time performance.
        </p>

        <h2>Gravity and attraction forces</h2>
        <p>
          The classic gravitational force between two bodies is given by Newton’s law:
        </p>
        <p className="text-center font-mono text-lg">
          F = G · (m1 · m2) / r²
        </p>
        <p>
          In interactive browser simulations we often simplify this. For a particle attracted toward a fixed attractor (a point the user places by clicking), the force direction is the vector from particle to attractor, and the magnitude is often:
        </p>
        <p className="text-center font-mono">
          acceleration = strength · (attractorPos - particlePos) / distance
        </p>
        <p>
          Or a softened version to avoid infinite force at zero distance:
        </p>
        <p className="text-center font-mono">
          force = strength / (distance² + softening)
        </p>
        <p>
          Velocity is then updated with <code>v += a · dt</code> and position with <code>p += v · dt</code>. Multiple attractors simply sum their forces. This is exactly the model used in the Gravity Particles Playground.
        </p>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Try it live</h3>
          <p className="mt-2 text-muted-foreground">
            Click to place attractors and watch particles orbit in real time. Tune gravity strength and particle count.
          </p>
          <Link
            to="/playgrounds/gravity-particles"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Open Gravity Particles Playground
          </Link>
        </div>

        <h2>Particle systems as continuous flows</h2>
        <p>
          Not every particle system is about discrete attractors. In the River of Light Journey, particles are emitted along a path defined by waypoints. Each particle follows a spline or interpolated curve between points, with persistent afterglow trails and soft bloom effects. Density, speed, color and loop mode control the visual density of the flowing river.
        </p>
        <p>
          The key idea is continuous emission + lifetime: new particles are born at the start of the path, travel toward the end, and fade. Overlapping many of them creates the solid glowing stream effect.
        </p>

        <div className="not-prose my-8 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <h3 className="text-lg font-bold">Experience the river</h3>
          <p className="mt-2 text-muted-foreground">
            Place waypoints and watch a continuous glowing river of particles flow between them.
          </p>
          <Link
            to="/river-light"
            className="mt-4 inline-flex rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Open River of Light Journey
          </Link>
        </div>

        <h2>Performance considerations in the browser</h2>
        <ul>
          <li>Use typed arrays or object pools to avoid garbage collection pauses.</li>
          <li>Batch drawing operations (single fill/stroke calls when possible).</li>
          <li>Limit particle count on mobile; the Gravity Particles Playground exposes a control for this.</li>
          <li>Prefer requestAnimationFrame and delta-time integration for consistent speed across devices.</li>
          <li>For more advanced effects, WebGL or WebGPU can handle tens of thousands of particles.</li>
        </ul>

        <h2>Further exploration</h2>
        <p>
          The same principles power many interactive experiences: particle signatures that form text, constellation maps, firework trails and kaleidoscopic patterns. Understanding the basic force and integration loop lets you invent new behaviors quickly.
        </p>
        <p>
          All simulations on UtiliHub run entirely client-side — no data is sent to servers for the physics itself. Experiment, share the resulting URLs, and download PNG snapshots.
        </p>
      </article>

      <div className="mt-12">
        <AdsterraBanner />
      </div>
    </div>
  );
}
