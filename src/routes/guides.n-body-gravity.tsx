import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Interactive N-Body Gravity Simulations in the Browser | UtiliHub";
const description = cleanDescription(
  "Original guide to N-body and multi-attractor gravity simulations. Newtonian force summation, soft collisions, fading trails, body glow, presets (binary, mini-solar, chaotic, figure-8), zoom/pan, performance caps. Live N-Body Gravity Simulator explained with formulas and intuition.",
);

export const Route = createFileRoute("/guides/n-body-gravity")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/guides/n-body-gravity") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/guides/n-body-gravity") },
      ...hreflangLinks("/guides/n-body-gravity", "/es/guias/n-body-gravity"),
    ],
  }),
  component: NBodyGravityGuideEn,
});

function NBodyGravityGuideEn() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Guides", to: "/guides" }, { label: "N-Body Gravity" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Interactive N-Body and Multi-Attractor Gravity Simulations in the Browser</h1>
        <p className="lead">
          N-body gravity simulations let you place multiple celestial bodies that attract one another according to Newtonian mechanics and watch the resulting orbits, collisions and chaotic motion unfold in real time. This original guide explains the core ideas — force summation, soft collisions, fading trails, body glow, presets, camera controls and performance limits — and shows how the live N-Body Gravity Simulator on UtiliHub implements them.
        </p>

        <h2>What is an N-body simulation?</h2>
        <p>
          In an N-body problem every body exerts a gravitational force on every other body. There is no closed-form solution for N greater than 2, so we integrate the equations of motion numerically. Each body carries mass, position and velocity. At every time step we compute the net force on each body, convert force to acceleration, then update velocity and position.
        </p>
        <p>
          Browser implementations run this loop inside requestAnimationFrame (or a fixed timestep accumulator) so the motion stays smooth and interactive. Users can add bodies, change their initial conditions, pause, zoom and share the exact starting state via URL.
        </p>

        <h2>Newtonian force summation</h2>
        <p>
          The gravitational force between two point masses is
        </p>
        <p className="text-center font-mono text-lg">
          F = G · m₁ · m₂ / r²
        </p>
        <p>
          Direction is along the line connecting the bodies. In code we usually work with vectors:
        </p>
        <p className="text-center font-mono">
          aᵢ = Σⱼ≠ᵢ G · mⱼ · (xⱼ − xᵢ) / (|xⱼ − xᵢ|³ + ε)
        </p>
        <p>
          The softening parameter ε (or a small additive constant inside the distance term) prevents the force from becoming infinite when two bodies occupy nearly the same position. Every body sums the contributions from all others — an O(N²) operation that is fine for the modest body counts used in interactive demos.
        </p>
        <p>
          The N-Body Gravity Simulator uses exactly this pairwise summation with a configurable softening factor so orbits remain stable and visually interesting instead of exploding on close approaches.
        </p>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Try the live simulator</h3>
          <p className="mt-2 text-muted-foreground">
            Add bodies, choose presets (binary stars, mini solar system, chaotic cluster, figure-8), zoom, pan and share the scene.
          </p>
          <Link
            to="/n-body-gravity"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Open N-Body Gravity Simulator
          </Link>
        </div>

        <h2>Numerical integration in the browser</h2>
        <p>
          Once accelerations are known, the simulator must advance positions and velocities. The simplest scheme is forward Euler:
        </p>
        <p className="text-center font-mono">
          v ← v + a · Δt<br />
          x ← x + v · Δt
        </p>
        <p>
          Euler is easy to code but can add energy over time, making orbits spiral outward. A better practical choice for interactive gravity is semi-implicit (symplectic) Euler, which updates velocity first and then uses the new velocity for the position step. This conserves a nearby energy better and keeps long orbits more stable with almost no extra cost.
        </p>
        <p>
          Velocity Verlet and higher-order methods exist, but for real-time browser demos with a body cap of ~20 the semi-implicit Euler step is usually sufficient. The UtiliHub simulator uses a fixed or clamped timestep so the integration stays stable even if the frame rate drops, and it applies the soft-collision repulsion inside the same force evaluation before the velocity update.
        </p>
        <p>
          Numerical drift is inevitable: the figure-8 preset slowly leaves its exact periodic orbit after many minutes. That is expected and educational — it shows why production astrophysics codes use higher-order integrators and adaptive timesteps, while interactive toys prioritize responsiveness and visual clarity.
        </p>

        <h2>Energy, stability and the virial intuition</h2>
        <p>
          Total mechanical energy E = kinetic + potential. For an isolated gravitational system the true continuous equations conserve E exactly. Numerical schemes only approximate that conservation. Semi-implicit Euler keeps the error from growing without bound for many orbits, which is why binary stars and the figure-8 stay recognisable for minutes of real time.
        </p>
        <p>
          A useful rule of thumb is the virial relation for a self-gravitating system in approximate equilibrium: 2·KE + PE ≈ 0. If you launch bodies with too much speed the system is unbound (total energy positive) and everything flies apart. If you start them almost at rest they collapse into a tight, high-speed cluster. The built-in presets sit near the interesting middle ground where bound orbits, close encounters and occasional ejections coexist.
        </p>
        <p>
          Softening and soft collisions slightly alter the potential, so the conserved quantity is not exactly the Newtonian energy. That is a deliberate trade-off: the simulation remains visually stable and interactive instead of producing numerical singularities.
        </p>

        <h2>Soft collisions</h2>
        <p>
          Hard sphere collisions require precise detection and impulse resolution, which can be expensive and visually abrupt. Soft collisions approximate contact by adding a strong short-range repulsion (or by temporarily boosting the softening) when the distance between centers falls below the sum of radii.
        </p>
        <p>
          In the simulator, bodies that overlap receive an extra repulsive acceleration proportional to the penetration depth. Combined with the usual gravitational attraction this produces elastic-looking bounces without a separate collision pipeline, keeping the code simple and the frame budget predictable.
        </p>

        <h2>Fading trails and body glow</h2>
        <p>
          Trails make orbital paths readable. Instead of storing long position histories, the canvas is cleared with a semi-transparent fill each frame (alpha trail fade). Previous positions remain visible for a few frames and then disappear, creating the classic “motion blur” look of gravity visualizations.
        </p>
        <p>
          Body glow is a simple radial gradient or additive circle drawn under each body. A specular highlight (a small brighter spot offset toward a light direction) gives the spheres a sense of volume. Both effects are cheap 2D canvas operations and remain CWV-safe even on mobile when body count is capped.
        </p>

        <h2>Presets and interesting initial conditions</h2>
        <p>
          The simulator ships with several carefully chosen starting states:
        </p>
        <ul>
          <li><strong>Binary stars</strong> — two equal-mass bodies on a circular orbit around their common center of mass.</li>
          <li><strong>Mini solar system</strong> — a heavy central body plus several lighter orbiters with roughly circular velocities.</li>
          <li><strong>Chaotic cluster</strong> — many bodies of mixed masses and random velocities that quickly produce close encounters and ejections.</li>
          <li><strong>Figure-8</strong> — a known periodic three-body solution (Chenciner–Montgomery) that traces a figure-eight path. A nice demonstration that not every three-body problem is chaotic.</li>
        </ul>
        <p>
          Each preset can be loaded instantly and then modified. The resulting state is serializable into the URL so a share link reconstructs the exact initial conditions.
        </p>

        <h2>Building a circular binary by hand</h2>
        <p>
          A clean circular binary is a great way to understand the force balance. For two equal masses M orbiting their common center of mass at separation a (so each is at distance a/2 from the CM):
        </p>
        <p className="text-center font-mono">
          v = sqrt(G · M / a)
        </p>
        <p>
          Each body moves perpendicular to the line joining them, in opposite directions, with that speed. The centripetal acceleration v² / (a/2) is supplied exactly by the gravitational acceleration G·M / a².
        </p>
        <p>
          In the UtiliHub simulator the Binary stars preset loads essentially this configuration (softened slightly for numerical comfort). You can recreate it manually: place two equal-mass bodies, give them equal-and-opposite tangential velocities of the right magnitude, and watch a stable orbit. If the speed is a bit low the orbit becomes elliptical; if too high the bodies fly apart. Softening and the finite timestep make the “perfect” circular speed slightly different from the pure Newtonian formula — another educational reminder of the approximations we accept for interactivity.
        </p>
        <p>
          Try it, then compare with the one-click preset. The difference between “I tuned the numbers” and “the library did it” is exactly the kind of insight this guide is meant to give.
        </p>

        <h2>Tuning G, softening, timestep and scale</h2>
        <p>
          The visual character of an N-body scene is controlled by a handful of free parameters. Getting them into the “interesting” range is more art than exact science, but a few rules of thumb keep the simulation educational rather than explosive or frozen.
        </p>
        <p>
          <strong>Gravitational constant G.</strong> In pure Newtonian physics G is tiny (~6.67×10⁻¹¹). In a browser demo we treat G as a free scale factor. Too small and bodies barely move; too large and everything collapses or flings itself off-screen in a few frames. A practical starting point is to choose G so that a circular binary of the masses and separation you intend completes one orbit in roughly 2–4 seconds of real time. The simulator’s presets already embed a G that produces that cadence.
        </p>
        <p>
          <strong>Softening ε.</strong> Softening rounds the 1/r² singularity. Set it comparable to a fraction of the typical body radius (or a few pixels in world units). Too small and close encounters produce huge spikes that the integrator cannot handle; too large and the force becomes almost constant at short range, making bodies “sticky” and orbits overly circular. Soft collisions and softening work together — the repulsion kicks in before the pure softened gravity becomes extreme.
        </p>
        <p>
          <strong>Timestep Δt.</strong> The semi-implicit Euler step needs Δt small enough that the fastest orbital or collision motion is resolved by several steps. If the frame rate drops, the simulator clamps the effective Δt so energy does not explode. In practice a fixed Δt of 1/60 s (or slightly larger when the scene is quiet) is a good default. Adaptive timesteps are possible but add complexity that interactive toys usually skip.
        </p>
        <p>
          <strong>World scale.</strong> Positions, velocities and radii must be consistent. If you place bodies tens of units apart but give them velocities measured in pixels, the motion looks wrong. The URL deep-link and presets keep everything in the same internal units; when you build a scene by hand, keep the numbers in the same ballpark as the presets you already like.
        </p>
        <p>
          Common pitfalls: (1) velocities that make total energy strongly positive → immediate dispersal; (2) softening much smaller than body radii → numerical explosions on first contact; (3) Δt too large relative to orbital period → orbits spiral or precess wildly. The built-in presets avoid all three, which is why loading one and then tweaking is the fastest way to learn the trade-offs.
        </p>

        <h2>Camera: zoom, pan and pinch</h2>
        <p>
          A world-to-screen transform lets users explore large systems. Zoom is applied with the mouse wheel or pinch gesture; pan is a drag. The transform is stored as a scale and offset and is applied both when projecting body positions for drawing and when converting pointer coordinates back to world space for adding new bodies.
        </p>
        <p>
          Keyboard shortcuts (Space to pause, R to reset camera, C to clear, +/− for zoom) make the experience usable without a mouse. All of these are implemented in the live simulator.
        </p>

        <h2>Performance caps and Core Web Vitals</h2>
        <p>
          Interactive N-body is O(N²) per frame. The simulator therefore caps the number of bodies (typically around 20) so the update stays well under 16 ms on mid-range devices. The canvas is lazy-loaded on its own route, never imported into the home page, and uses a fixed aspect-ratio container to avoid layout shift.
        </p>
        <p>
          Trails use a single semi-transparent clear rather than per-body history arrays. Glow and specular highlights are drawn with a few canvas calls. The result is a visually rich experience that does not regress mobile CWV.
        </p>

        <h2>How the UtiliHub N-Body Gravity Simulator implements these ideas</h2>
        <p>
          The component maintains an array of body objects (mass, position, velocity, color, radius). Each animation frame:
        </p>
        <ol>
          <li>Computes pairwise gravitational accelerations with softening.</li>
          <li>Adds soft-collision repulsion when bodies overlap.</li>
          <li>Integrates velocity and position with a fixed or clamped timestep (semi-implicit Euler style).</li>
          <li>Applies the camera transform and draws trails (fade clear) + glowing bodies with specular highlights.</li>
        </ol>
        <p>
          Presets, zoom/pan, keyboard controls, PNG export (with baked title and branding) and URL deep-linking for initial conditions are all part of the same surface. English and Spanish routes stay in sync.
        </p>

        <h2>Frequently asked questions</h2>
        <p>
          <strong>Why do bodies sometimes fly apart?</strong> If the initial velocities are too high relative to the masses, the system is unbound. The presets are tuned to stay interesting; you can always lower velocities or increase masses.
        </p>
        <p>
          <strong>Is the figure-8 preset exact?</strong> It uses the well-known initial conditions of the Chenciner–Montgomery figure-eight solution. Numerical integration introduces tiny drift over long times, but the characteristic path is clearly visible.
        </p>
        <p>
          <strong>Why does energy slowly grow or shrink?</strong> Most simple integrators are not perfectly symplectic. Semi-implicit Euler keeps the error bounded for many orbits, but over minutes of real time you will see small drifts — an honest demonstration of numerical approximation.
        </p>
        <p>
          <strong>Does anything run on a server?</strong> No. All integration, drawing and PNG generation happen in the browser. Sharing a URL only shares the parameters.
        </p>
        <p>
          <strong>Can I reproduce a shared link?</strong> Yes. The URL encodes the initial masses, positions, velocities and colors. Opening the link restores the exact starting configuration before integration begins.
        </p>
        <p>
          <strong>Why is the body count limited?</strong> Pairwise force evaluation is O(N²). Capping around 20 bodies keeps the frame time comfortable on phones while still allowing rich multi-body dynamics.
        </p>
        <p>
          <strong>What does the softening parameter actually do?</strong> It replaces the true 1/r² singularity with a rounded potential that stays finite at r = 0. Small softening keeps close encounters dramatic; larger softening makes the system more “sticky” and less explosive. The simulator chooses a value that looks good with the body radii used for soft collisions.
        </p>

        <h2>Related experiences</h2>
        <ul>
          <li><Link to="/n-body-gravity">N-Body Gravity Simulator</Link> — the live interactive experience described above.</li>
          <li><Link to="/playgrounds/gravity-particles">Gravity Particles</Link> — many light particles attracted to user-placed fixed attractors.</li>
          <li><Link to="/playgrounds/aurora-particle-playground">Aurora Particle Playground</Link> — multi-mode bloom systems with trails and pointer forces.</li>
          <li><Link to="/guides/particle-physics">Particle Physics guide</Link> — broader introduction to particle systems and attractors.</li>
        </ul>

        <h2>Conclusion</h2>
        <p>
          N-body gravity simulations turn a short numerical integration loop into an engaging, shareable experience. By combining softened Newtonian summation, soft collisions, fading trails, body glow and carefully chosen presets, the browser can host surprisingly rich celestial dynamics without heavy dependencies or server-side computation.
        </p>
        <p>
          Open the live N-Body Gravity Simulator, try the presets, and experiment with your own initial conditions. Everything runs client-side.
        </p>
      </article>

      <div className="mt-12">
        <AdsterraBanner />
      </div>
    </div>
  );
}
