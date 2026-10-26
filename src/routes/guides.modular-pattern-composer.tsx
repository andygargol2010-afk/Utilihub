import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Modular Pattern Composer: Tile Systems and Live Procedural Animations | UtiliHub";
const description = cleanDescription(
  "Original guide to the Modular Pattern Composer. Place modular tiles on a grid with live procedural animations (flow, pulse, morph, spin), multi-layer blend and opacity, symmetry (mirror, radial), tile library (geometric, organic, particle, hex, blob), color palettes and gradients, playback controls, brush size, PNG share with branding, URL deep-link and localStorage persistence. Distinct from freehand neon.",
);

export const Route = createFileRoute("/guides/modular-pattern-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/guides/modular-pattern-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/guides/modular-pattern-composer") },
      ...hreflangLinks("/guides/modular-pattern-composer", "/es/guias/modular-pattern-composer"),
    ],
  }),
  component: ModularPatternGuideEn,
});

function ModularPatternGuideEn() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Guides", to: "/guides" }, { label: "Modular Pattern Composer" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Modular Pattern Composer: Interactive Tile Systems with Live Procedural Animations</h1>
        <p className="lead">
          The Modular Pattern Composer lets you build repeatable visual systems by placing modular tiles on a grid. Each tile can run live procedural animations (flow, pulse, morph, spin), layers blend with independent opacity, and symmetry modes multiply placements. This original guide explains the grid model, animation modes, multi-layer flow, tile library, color systems, playback controls, brush editing, sharing and persistence — and how UtiliHub’s live experience implements them.
        </p>

        <h2>What is a modular pattern composer?</h2>
        <p>
          Unlike freehand drawing tools, a modular composer works on a discrete grid of cells. You pick a tile from the library, choose a brush size and stamp it onto one or more cells. The result is a repeatable, editable system rather than a continuous stroke. Procedural animations bring the tiles to life without you having to draw every frame by hand.
        </p>
        <p>
          This approach is excellent for patterns, backgrounds, generative art and design systems that need to stay consistent when scaled or shared. The composition is data, not just pixels, so it can be persisted, deep-linked and re-edited later.
        </p>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Try the live composer</h3>
          <p className="mt-2 text-muted-foreground">
            Place tiles, activate animations, add layers, apply symmetry and share your composition.
          </p>
          <Link
            to="/modular-pattern-composer"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Open Modular Pattern Composer
          </Link>
        </div>

        <h2>Grid and modular tiles</h2>
        <p>
          The canvas is divided into a regular grid (typically 12×12 cells for a good balance of detail and performance). Each cell can hold a tile instance that references a library entry plus optional parameters such as color, rotation or animation phase. Because tiles are modular, you can erase or overwrite individual cells without destroying the rest of the composition.
        </p>
        <p>
          Brush size lets you stamp a square of cells in one gesture. This speeds up filling regions while the result remains fully editable at cell level.
        </p>

        <h2>Live procedural animations</h2>
        <p>
          Each tile type can drive one or more procedural animations that run every frame:
        </p>
        <ul>
          <li><strong>Flow</strong> — continuous directional movement or noise-driven offset.</li>
          <li><strong>Pulse</strong> — rhythmic oscillation of scale or opacity.</li>
          <li><strong>Morph</strong> — shape or path interpolation over time.</li>
          <li><strong>Spin</strong> — constant or variable rotation.</li>
        </ul>
        <p>
          Animations are phase-offset per cell or per layer so the pattern feels organic rather than mechanical. Playback controls let you pause, restart or scrub the global timeline. Because animation is generated, the composition stays light and can be shared as parameters instead of a video file.
        </p>

        <h2>Multi-layer composition</h2>
        <p>
          Layers stack on top of each other with independent opacity and blend modes. You can build a base pattern then add accent layers, particle overlays or symmetry-driven decorations without flattening everything. A modest layer cap (around six) keeps memory and draw cost predictable.
        </p>
        <p>
          Each layer can have its own set of tiles, color palette and animation timing, giving you genuine compositional depth while remaining fully interactive.
        </p>

        <h2>Symmetry modes</h2>
        <p>
          Symmetry multiplies every placement:
        </p>
        <ul>
          <li><strong>Mirror</strong> — reflection across one or both axes.</li>
          <li><strong>Radial</strong> — rotational copies around the center.</li>
        </ul>
        <p>
          Because symmetry is applied at stamp time (or as a live transform), the underlying data stays simple. You can turn symmetry off and edit individual cells afterwards if you want to break the pattern intentionally.
        </p>

        <h2>Tile library</h2>
        <p>
          The library contains several families:
        </p>
        <ul>
          <li>Geometric — polygons, grids, lines, arcs.</li>
          <li>Organic — blobs, curves, soft shapes.</li>
          <li>Particle — small emitters or point clouds that animate.</li>
          <li>Hex and blob variants for tighter packing or fluid forms.</li>
        </ul>
        <p>
          Each tile is a lightweight procedural definition rather than a bitmap, so it can be recolored, scaled and animated at runtime. Adding a new tile type does not increase the size of saved compositions.
        </p>

        <h2>Color palettes and gradients</h2>
        <p>
          Palettes let you recolor an entire layer or a selection instantly. Gradients can be applied across the grid or inside individual tiles. Because colors are stored as parameters, changing the palette updates every affected tile without redrawing from scratch. This is especially useful when you want several variations of the same structure.
        </p>

        <h2>Playback, brush and editing</h2>
        <p>
          Global playback controls (play/pause, speed, loop) affect all animated tiles. The brush-size control determines how many cells a click or drag covers. Erase mode removes tiles from the brush area. Combined with layer isolation, these tools make both rapid exploration and precise refinement possible.
        </p>

        <h2>Sharing, deep links and persistence</h2>
        <p>
          PNG export bakes the current frame together with a title, UtiliHub branding and a tile count so the image is self-explanatory when shared. The URL deep-link encodes essential settings (active tiles, layers, palette, symmetry, animation state) so anyone who opens the link reconstructs the composition. Automatic localStorage persistence saves the work in the browser so you can leave and return without losing progress.
        </p>

        <h2>Distinction from freehand neon</h2>
        <p>
          The Neon Layer Composer is a freehand canvas with continuous strokes, bloom and particle emitters. The Modular Pattern Composer is grid-based and modular: placements are discrete, repeatable and animated by procedural rules rather than freehand paths. One is better for expressive drawing; the other is better for systems, patterns and generative structures that need to stay editable and shareable as data.
        </p>

        <h2>Practical composition tips</h2>
        <ul>
          <li>Start with a simple geometric base layer, then add an organic or particle layer on top.</li>
          <li>Use radial symmetry for mandala-like results; mirror for architectural or textile patterns.</li>
          <li>Offset animation phases so neighboring tiles do not pulse in perfect unison.</li>
          <li>Keep the layer count modest on mobile; visual payoff comes from smart tile choice more than stacking many layers.</li>
          <li>Export a PNG early and often — the baked title and tile count make the image useful even outside the tool.</li>
        </ul>

        <h2>Performance and Core Web Vitals</h2>
        <p>
          The grid is capped (12×12), layers are capped and the canvas loads lazily on its own route. Animations use simple procedural math rather than heavy shaders or large textures. No new heavy dependencies are introduced. The result stays CWV-safe on mobile while still delivering live interactive motion.
        </p>

        <h2>How UtiliHub’s Modular Pattern Composer implements these ideas</h2>
        <p>
          The component stores a sparse map of cell → tile references plus layer metadata. Each animation frame:
        </p>
        <ol>
          <li>Updates procedural parameters (phase, flow offset, pulse scale) for every active tile.</li>
          <li>Applies symmetry transforms when drawing.</li>
          <li>Composites layers with their blend and opacity.</li>
          <li>Renders the final frame to the canvas for display and for PNG export.</li>
        </ol>
        <p>
          URL parameters and localStorage keep the composition restorable. English and Spanish routes stay in sync. Adsterra remains intact on the page.
        </p>

        <h2>Worked example: Flowing radial mandala</h2>
        <p>
          Start with a radial symmetry layer using geometric arcs and a slow spin animation. Add a second layer with organic blobs on a flow animation, slightly phase-offset. Apply a complementary gradient palette. The result is a living mandala that can be paused, recolored and shared via PNG or deep link in seconds.
        </p>

        <h2>Related experiences</h2>
        <ul>
          <li><Link to="/neon-layer-composer">Neon Layer Composer</Link> — freehand multi-layer neon drawing.</li>
          <li><Link to="/n-body-gravity">N-body Gravity</Link> — multi-body physics simulation.</li>
          <li><Link to="/aurora">Aurora Particle Playground</Link> — open particle canvas.</li>
          <li><Link to="/guides/n-body-gravity">N-body Gravity Guide</Link> — companion long-form guide.</li>
        </ul>

        <h2>Frequently asked questions</h2>
        <p>
          <strong>Can I break the grid afterwards?</strong> Yes. Once tiles are placed you can erase individual cells or turn symmetry off and edit freely. The grid is a placement aid, not a permanent constraint.
        </p>
        <p>
          <strong>Are animations baked into the PNG?</strong> The PNG captures the current frame (plus title and branding). Live animations continue in the browser and are restored via the deep link.
        </p>
        <p>
          <strong>Does anything leave the browser?</strong> No. Persistence is localStorage; sharing is via URL parameters or a client-side PNG.
        </p>
        <p>
          <strong>How is this different from a normal pattern generator?</strong> Most generators are one-shot. Here you can edit, layer, animate and share the exact state, then return later and continue.
        </p>
        <p>
          <strong>Will it work on mobile?</strong> Yes. Grid and layer caps keep the cost modest. Brush and symmetry reduce the number of precise taps needed.
        </p>
        <p>
          <strong>Can I export only one layer?</strong> The PNG captures the current composited frame. You can temporarily hide layers (opacity 0) before export to isolate one, then restore.
        </p>
        <p>
          <strong>How do I share a composition with a friend?</strong> Use the PNG export for a static image, or copy the URL (deep-link) so they open the exact same editable state. The deep-link restores tiles, layers, palette and animation settings.
        </p>

        <p className="mt-8">
          <Link to="/modular-pattern-composer" className="font-semibold text-primary">
            Open the Modular Pattern Composer and start composing →
          </Link>
        </p>
      </article>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
