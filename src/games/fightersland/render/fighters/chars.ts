/**
 * The six Fightersland fighters: builds, materials, head bitmaps and weapons drawn as shape
 * parts (rotated analytically, so any weapon angle stays crisp).
 */
import type { CharId } from "../../core/types";
import { G, MAT, capsule, cells, compileBitmap, line, poly, px } from "./raster";
import type { Bitmap, Cells } from "./raster";
import { BASE_BUILD, add, blade, loc, perp } from "./rig";
import type { Build, CharDef, CharMats, DrawCtx } from "./rig";
import { variants16 } from "./rot";

/** Eye cells that shut on the hurt face: legend char -> replacement legend char. */
type FaceMap = Readonly<Record<string, string>>;

function hurtBitmap(bm: Bitmap, map: FaceMap): Bitmap {
  return {
    ...bm,
    rows: bm.rows.map((r) =>
      r
        .split("")
        .map((c) => map[c] ?? c)
        .join(""),
    ),
  };
}

interface CharSpec {
  name: string;
  build: Build;
  mats: CharMats;
  head: Bitmap;
  hurt: FaceMap;
  smear: CharDef["smear"];
  weaponSpan: readonly [number, number];
  drawBack?: (c: DrawCtx) => void;
  drawShieldBack?: (c: DrawCtx) => void;
  drawBody?: (c: DrawCtx) => void;
  drawTorso?: (c: DrawCtx) => void;
  drawWeapon?: (c: DrawCtx) => void;
  drawFront?: (c: DrawCtx) => void;
}

function makeChar(s: CharSpec): CharDef {
  const faces: Bitmap[] = [s.head, hurtBitmap(s.head, s.hurt)];
  const rotCache: (Cells | undefined)[][] = [[], []];
  const variantCache: (Bitmap[] | undefined)[] = [undefined, undefined];
  const head = compileBitmap(s.head);
  const headRot = (face: number, idx: number): Cells => {
    const f = face ? 1 : 0;
    const row = rotCache[f]!;
    let c = row[idx];
    if (!c) {
      const bm = faces[f]!;
      if (idx === 0) c = compileBitmap(bm);
      else {
        let v = variantCache[f];
        if (!v) {
          v = variants16(bm);
          variantCache[f] = v;
        }
        c = compileBitmap(v[idx] ?? bm);
      }
      row[idx] = c;
    }
    return c;
  };
  const def: CharDef = {
    name: s.name,
    build: s.build,
    mats: s.mats,
    head,
    headRot,
    smear: s.smear,
    weaponSpan: s.weaponSpan,
  };
  if (s.drawBack) def.drawBack = s.drawBack;
  if (s.drawShieldBack) def.drawShieldBack = s.drawShieldBack;
  if (s.drawBody) def.drawBody = s.drawBody;
  if (s.drawTorso) def.drawTorso = s.drawTorso;
  if (s.drawWeapon) def.drawWeapon = s.drawWeapon;
  if (s.drawFront) def.drawFront = s.drawFront;
  return def;
}

// ---------------------------------------------------------------- 1. ASAGIRI (samurai, katana)
const ASAGIRI = makeChar({
  name: "ASAGIRI",
  build: {
    ...BASE_BUILD,
    thigh: 12,
    shin: 12,
    chest: 8,
    rThigh: [4.5, 4.5],
    rShin: [4.5, 5.5],
    rUarm: [2.5, 3.5],
    rFarm: [3.5, 2.5],
    rPelvis: 5.5,
    grip2: 4,
  },
  mats: { skin: "skinL", torso: "white", sleeve: "white", hand: "skinL", legs: "indigo", feet: "bone", pelvis: "indigo" },
  head: {
    ax: 6,
    ay: 12,
    legend: {
      h: ["black", 2],
      H: ["black", 3],
      k: ["black", 1],
      s: ["skinL", 2],
      S: ["skinL", 3],
      d: ["skinL", 1],
      e: ["black", 0],
      r: ["red", 2],
      R: ["red", 3],
    },
    rows: [
      "..kh.........",
      ".khhh........",
      "..khhhhhh....",
      "..hhhHHHhhh..",
      ".khhhhHHHhhh.",
      ".khhhhhhhhhh.",
      ".rrrrrrrrrRR.",
      ".khhssssSSSs.",
      ".khhdsseSses.",
      ".kkhdsssssss.",
      "..kkdssssss..",
      "...kddssss...",
      ".....ddss....",
    ],
  },
  hurt: { e: "d" },
  smear: "sSteel",
  weaponSpan: [8, 30],
  drawBack({ buf, J }) {
    // headband tails
    const a: [number, number] = [J.headBase[0] - 6, J.headBase[1] - 6];
    capsule(buf, a, [a[0] - 5, a[1] + 2], 0.5, 0.5, MAT.red, G.back, { shade: "flat" });
    capsule(buf, [a[0] - 5, a[1] + 2], [a[0] - 8, a[1] + 6], 0.5, 0.5, MAT.red, G.back, { shade: "flat", dark: -1 });
    capsule(buf, a, [a[0] - 4, a[1] + 5], 0.5, 0.5, MAT.red, G.back, { shade: "flat", dark: -1 });
  },
  drawTorso({ buf, J }) {
    capsule(buf, [J.pelvis[0] - 1, J.pelvis[1] - 4], [J.pelvis[0] + 1, J.pelvis[1] - 4], 3.5, 3.5, MAT.black, G.body, {
      inner: false,
      deep: true,
    });
    line(buf, [J.neckBase[0] + 1, J.neckBase[1] + 1], [J.waist[0] + 3, J.waist[1] - 1], MAT.white, 1, G.body);
    px(buf, J.neckBase[0] + 1, J.neckBase[1] + 1, MAT.skinL, 1, G.body);
    px(buf, J.neckBase[0] + 2, J.neckBase[1] + 2, MAT.skinL, 2, G.body);
  },
  drawWeapon({ buf, J, p }) {
    const d = J.wDir;
    const h = J.haF;
    if (p.ext < 0) {
      // sheathed (ext < 0): lacquered scabbard along the blade line
      capsule(buf, add(h, d, 5), add(h, d, 29), 1.5, 1, MAT.black, G.weapon, { shade: "full", inner: false });
      line(buf, add(h, d, 6), add(h, d, 8), MAT.red, 2, G.weapon);
    }
    capsule(buf, add(h, d, -5), add(h, d, 3), 1, 1, MAT.black, G.weapon, { shade: "flat", dark: 1 });
    const g = add(h, d, 4);
    const n = perp(d);
    line(buf, add(g, n, -2), add(g, n, 2), MAT.gold, 2, G.weapon);
    if (p.ext >= 0) blade(buf, add(h, d, 5), d, 25, "steel");
  },
});

// ---------------------------------------------------------------- 2. YOIKAZE (ninja, twin daggers)
const YOIKAZE = makeChar({
  name: "YOIKAZE",
  build: {
    ...BASE_BUILD,
    thigh: 12,
    shin: 13,
    abdomen: 6,
    chest: 8,
    uarm: 9,
    farm: 9,
    rPelvis: 3.5,
    rWaist: 3.5,
    rChest: 4.5,
    rThigh: [3.5, 2.5],
    rShin: [2.5, 1.5],
    rUarm: [2.5, 1.5],
    rFarm: [1.5, 1.5],
    shF: [-2, 1],
    shB: [2, 1],
  },
  mats: {
    skin: "skinT",
    torso: "night",
    sleeve: "night",
    forearm: "bone",
    hand: "skinT",
    legs: "night",
    shin: "bone",
    feet: "night",
    pelvis: "night",
  },
  head: {
    ax: 5,
    ay: 10,
    legend: {
      n: ["night", 2],
      N: ["night", 3],
      k: ["night", 1],
      s: ["skinT", 2],
      S: ["skinT", 3],
      q: ["skinT", 1],
      e: ["black", 0],
      w: ["white", 3],
    },
    rows: [
      "...nnnnn...",
      "..nnNNNnnn.",
      ".knnnNNNnn.",
      ".knnnnnnnn.",
      ".knnnsssSS.",
      ".knnnsweSs.",
      ".kknnnnnnn.",
      ".kknnnnnnn.",
      "..kknnnnn..",
      "...kknnn...",
      "....kkn....",
    ],
  },
  hurt: { e: "q", w: "q" },
  smear: "sLime",
  weaponSpan: [2, 10],
  drawBack({ buf, J, p }) {
    // scarf: knot at the neck + long tail streaming back (flutters with the pose)
    const a: [number, number] = [J.neckBase[0] - 3, J.neckBase[1] - 1];
    const fl = Math.round(Math.sin((p.lean + p.legF[0]) * 0.15) * 2);
    const pts: [number, number][] = [
      a,
      [a[0] - 6, a[1] - 2],
      [a[0] - 12, a[1] + fl],
      [a[0] - 17, a[1] + 3 - fl],
      [a[0] - 21, a[1] + 2 + fl],
    ];
    const rr = [2.5, 1.5, 1.5, 1.5, 0.5];
    for (let i = 0; i < pts.length - 1; i++) {
      capsule(buf, pts[i]!, pts[i + 1]!, rr[i]!, rr[i + 1]!, MAT.lime, G.back, { shade: "full" });
    }
  },
  drawTorso({ buf, J }) {
    capsule(buf, [J.neckBase[0] - 3, J.neckBase[1]], [J.neckBase[0] + 3, J.neckBase[1] + 1], 1.5, 1.5, MAT.lime, G.extra, {
      shade: "full",
    });
    line(buf, [J.pelvis[0] - 3, J.pelvis[1] - 3], [J.pelvis[0] + 3, J.pelvis[1] - 3], MAT.lime, 1, G.body);
  },
  drawWeapon({ buf, J }) {
    // twin daggers: the blade continues along the weapon dir from each fist
    const d = J.wDir;
    const n = perp(d);
    const hands: [[number, number], number][] = [
      [J.haB, 1],
      [J.haF, 3],
    ];
    for (const [h, tone] of hands) {
      line(buf, add(h, d, 2), add(h, d, 9), MAT.steel, tone, G.weapon);
      line(buf, add(add(h, d, 2), n, 1), add(add(h, d, 7), n, 1), MAT.steel, Math.max(1, tone - 1), G.weapon);
    }
  },
});

// ---------------------------------------------------------------- 3. GRIMVALD (viking, axe + shield)
const GRIMVALD = makeChar({
  name: "GRIMVALD",
  build: {
    ...BASE_BUILD,
    thigh: 12,
    shin: 12,
    abdomen: 8,
    chest: 11,
    uarm: 11,
    farm: 10,
    neck: 1,
    rPelvis: 6.5,
    rWaist: 6.5,
    rChest: 7.5,
    rThigh: [4.5, 3.5],
    rShin: [3.5, 2.5],
    rUarm: [3.5, 3.5],
    rFarm: [3.5, 2.5],
    rHand: 2.5,
    rFoot: 2.5,
    shF: [-4, 2],
    shB: [4, 2],
    hipF: [-3, 0],
    hipB: [3, 0],
    grip2: 7,
  },
  mats: {
    skin: "skinL",
    torso: "red",
    sleeve: "skinL",
    forearm: "leather",
    hand: "skinL",
    legs: "leather",
    shin: "bone",
    feet: "leather",
    pelvis: "leather",
  },
  head: {
    ax: 6,
    ay: 11,
    legend: {
      b: ["bone", 2],
      B: ["bone", 3],
      c: ["bone", 1],
      m: ["steel", 2],
      M: ["steel", 3],
      n: ["steel", 1],
      g: ["gold", 2],
      s: ["skinL", 2],
      S: ["skinL", 3],
      d: ["skinL", 1],
      e: ["black", 0],
      o: ["orange", 2],
      O: ["orange", 3],
      p: ["orange", 1],
    },
    rows: [
      "B..........B.",
      "bb.........Bb",
      ".bc.mmmmm.bb.",
      ".cbmmMMMmmb..",
      "..nmmmMMMmm..",
      "..nmmmmmmmm..",
      "..ggggggggmg.",
      "..pssssesmS..",
      "..poossssms..",
      "..pooooosoo..",
      "..poOOooooo..",
      "..ppoOOooo...",
      "...ppoooo....",
      "....ppoo.....",
      ".....po......",
    ],
  },
  hurt: { e: "d" },
  smear: "sSteel",
  weaponSpan: [12, 25],
  drawTorso({ buf, J }) {
    // fur mantle across the shoulders + belt
    capsule(buf, [J.neckBase[0] - 6, J.neckBase[1] + 2], [J.neckBase[0] + 6, J.neckBase[1] + 2], 3.5, 3.5, MAT.bone, G.extra, {
      shade: "full",
    });
    line(buf, [J.pelvis[0] - 6, J.pelvis[1] - 3], [J.pelvis[0] + 6, J.pelvis[1] - 3], MAT.leather, 1, G.body);
    px(buf, J.pelvis[0] + 2, J.pelvis[1] - 3, MAT.gold, 2, G.body);
    px(buf, J.pelvis[0] + 3, J.pelvis[1] - 3, MAT.gold, 3, G.body);
  },
  drawShieldBack({ buf, J, p }) {
    // round shield strapped to the far forearm
    const c: [number, number] = [Math.round((J.elB[0] + J.haB[0] * 2) / 3), Math.round((J.elB[1] + J.haB[1] * 2) / 3)];
    const dk = p.z.armBFront ? 0 : -1;
    capsule(buf, c, c, 8.5, 8.5, MAT.steel, G.shield, { shade: "full", dark: dk });
    capsule(buf, c, c, 6.5, 6.5, MAT.wood, G.shield, { shade: "flat", dark: dk, inner: false });
    line(buf, [c[0] - 6, c[1]], [c[0] + 6, c[1]], MAT.wood, Math.max(0, 1 + dk), G.shield);
    capsule(buf, c, c, 2.5, 2.5, MAT.steel, G.shield, { shade: "full", dark: dk, inner: false });
  },
  drawWeapon({ buf, J }) {
    // bearded axe
    const d = J.wDir;
    const h = J.haF;
    capsule(buf, add(h, d, -4), add(h, d, 21), 1, 1, MAT.wood, G.weapon, { shade: "noLight" });
    poly(
      buf,
      [loc(h, d, 22, 1), loc(h, d, 24, -8), loc(h, d, 13, -9), loc(h, d, 16, -3), loc(h, d, 15, 1)],
      MAT.steel,
      G.weapon,
      { shade: "full", inner: false },
    );
  },
});

// ---------------------------------------------------------------- 4. MAELIS (tidewarden, glaive)
const MAELIS = makeChar({
  name: "MAELIS",
  build: {
    ...BASE_BUILD,
    thigh: 14,
    shin: 14,
    abdomen: 7,
    chest: 8,
    uarm: 10,
    farm: 10,
    rPelvis: 4.5,
    rWaist: 3.5,
    rChest: 4.5,
    rThigh: [3.5, 2.5],
    rShin: [2.5, 1.5],
    rUarm: [2.5, 1.5],
    rFarm: [1.5, 1.5],
    shF: [-2, 1],
    shB: [2, 1],
    grip2: 9,
  },
  mats: {
    skin: "frost",
    torso: "teal",
    sleeve: "frost",
    forearm: "white",
    hand: "frost",
    legs: "white",
    shin: "teal",
    feet: "teal",
    pelvis: "white",
  },
  head: {
    ax: 6,
    ay: 11,
    legend: {
      c: ["magenta", 2],
      C: ["magenta", 3],
      k: ["magenta", 1],
      f: ["frost", 2],
      F: ["frost", 3],
      d: ["frost", 1],
      e: ["blue", 0],
      g: ["gold", 3],
    },
    rows: [
      "CC...........",
      ".cCC.........",
      "..ccCCc......",
      "...cccCCcc...",
      "..kccccCCcc..",
      ".kcccccccccg.",
      ".kccffffFFF..",
      ".kccdffeFfe..",
      "kkc.dffffff..",
      "kc...dfffff..",
      "k.....ddff...",
      ".......df....",
    ],
  },
  hurt: { e: "d" },
  smear: "sWater",
  weaponSpan: [22, 42],
  drawBack({ buf, J }) {
    // long hair tail + waist sash streaming back
    const a: [number, number] = [J.headBase[0] - 5, J.headBase[1] - 2];
    const pts: [number, number][] = [a, [a[0] - 3, a[1] + 5], [a[0] - 6, a[1] + 10], [a[0] - 10, a[1] + 13]];
    for (let i = 0; i < pts.length - 1; i++) {
      capsule(buf, pts[i]!, pts[i + 1]!, 1.5, i === 2 ? 0.5 : 1.5, MAT.magenta, G.back, { shade: "full", dark: -1 });
    }
    const s: [number, number] = [J.pelvis[0] - 3, J.pelvis[1] - 2];
    const sp: [number, number][] = [s, [s[0] - 6, s[1] + 5], [s[0] - 11, s[1] + 12], [s[0] - 13, s[1] + 19]];
    for (let i = 0; i < sp.length - 1; i++) {
      capsule(buf, sp[i]!, sp[i + 1]!, 2.5, i === 2 ? 1.5 : 2.5, MAT.white, G.back, { shade: "full", dark: -1 });
    }
  },
  drawTorso({ buf, J }) {
    line(buf, [J.pelvis[0] - 4, J.pelvis[1] - 4], [J.pelvis[0] + 4, J.pelvis[1] - 4], MAT.gold, 2, G.body);
    px(buf, J.neckBase[0] + 1, J.neckBase[1] + 2, MAT.gold, 3, G.body);
  },
  drawWeapon({ buf, J }) {
    // tide glaive: long shaft + crescent blade
    const d = J.wDir;
    const h = J.haF;
    capsule(buf, add(h, d, -16), add(h, d, 26), 0.6, 0.6, MAT.bone, G.weapon, { shade: "flat" });
    poly(
      buf,
      [
        loc(h, d, 24, 1),
        loc(h, d, 27, -3),
        loc(h, d, 33, -5),
        loc(h, d, 39, -3),
        loc(h, d, 42, 2),
        loc(h, d, 37, 0),
        loc(h, d, 31, 0),
        loc(h, d, 27, 2),
      ],
      MAT.steel,
      G.weapon,
      { shade: "full", inner: false },
    );
    const e = add(h, d, -17);
    px(buf, e[0], e[1], MAT.gold, 2, G.weapon);
  },
});

// ---------------------------------------------------------------- 5. BAZALT (ember-fisted golem)
const BAZALT = makeChar({
  name: "BAZALT",
  build: {
    ...BASE_BUILD,
    thigh: 11,
    shin: 11,
    abdomen: 7,
    chest: 10,
    uarm: 10,
    farm: 10,
    neck: 0,
    rPelvis: 5.5,
    rWaist: 5.5,
    rChest: 7.5,
    rThigh: [4.5, 3.5],
    rShin: [3.5, 2.5],
    rUarm: [3.5, 3.5],
    rFarm: [3.5, 4.5],
    rHand: 4.5,
    rFoot: 2.5,
    shF: [-4, 2],
    shB: [4, 2],
    hipF: [-3, 0],
    hipB: [3, 0],
  },
  mats: {
    skin: "stone",
    torso: "stone",
    sleeve: "stone",
    forearm: "steel",
    hand: "orange",
    legs: "leather",
    shin: "stone",
    feet: "steel",
    pelvis: "leather",
  },
  head: {
    ax: 5,
    ay: 9,
    legend: {
      t: ["stone", 2],
      T: ["stone", 3],
      k: ["stone", 1],
      o: ["orange", 2],
      O: ["gold", 3],
      g: ["gold", 3],
      G: ["orange", 3],
      r: ["red", 2],
    },
    rows: [
      "....oO.....",
      "...roOo....",
      "..roOOor...",
      "..tttooTt..",
      ".kttttTTtt.",
      ".ktttttTTt.",
      ".kttttgGtt.",
      ".kktttttTt.",
      ".kkttttttt.",
      "..kkttttt..",
      "...kkktt...",
    ],
  },
  hurt: { g: "k", G: "k" },
  smear: "sEmber",
  weaponSpan: [0, 0],
  drawTorso({ buf, J }) {
    // leather strap across the chest + ember core
    line(buf, [J.neckBase[0] - 5, J.neckBase[1] + 2], [J.waist[0] + 4, J.waist[1] + 1], MAT.leather, 2, G.body);
    line(buf, [J.neckBase[0] - 5, J.neckBase[1] + 3], [J.waist[0] + 4, J.waist[1] + 2], MAT.leather, 1, G.body);
    px(buf, J.waist[0] + 2, J.waist[1] - 3, MAT.orange, 3, G.body);
    px(buf, J.waist[0] + 3, J.waist[1] - 3, MAT.gold, 3, G.body);
    px(buf, J.waist[0] + 2, J.waist[1] - 2, MAT.orange, 2, G.body);
  },
  drawFront({ buf, J, p }) {
    // glowing knuckle cracks on the gauntlets
    const hs: [number, number][] = p.z.armBFront ? [J.haF, J.haB] : [J.haF];
    for (const h of hs) {
      px(buf, h[0] + 1, h[1] - 1, MAT.gold, 3, G.armF);
      px(buf, h[0] + 2, h[1], MAT.gold, 3, G.armF);
      px(buf, h[0], h[1] + 1, MAT.gold, 2, G.armF);
    }
  },
});

// ---------------------------------------------------------------- 6. ORIEL (lantern-keeper monk)
const LANTERN = compileBitmap({
  ax: 3,
  ay: 0,
  legend: { g: ["gold", 2], G: ["gold", 3], k: ["gold", 1], b: ["blue", 3], w: ["white", 3] },
  rows: ["..gGg..", ".gkkkG.", ".gbwbg.", ".gwwwg.", ".gbwbg.", ".kgggk.", "..kgk.."],
});
/** Lantern chain length at rest (pose.ext adds to it). */
export const ORIEL_CHAIN = 9;
const ORIEL = makeChar({
  name: "ORIEL",
  build: {
    ...BASE_BUILD,
    thigh: 12,
    shin: 12,
    abdomen: 6,
    chest: 8,
    uarm: 9,
    farm: 9,
    rPelvis: 4.5,
    rWaist: 4.5,
    rChest: 4.5,
    rThigh: [3.5, 3.5],
    rShin: [3.5, 1.5],
    rUarm: [2.5, 1.5],
    rFarm: [1.5, 1.5],
  },
  mats: {
    skin: "skinD",
    torso: "gold",
    sleeve: "skinD",
    forearm: "leather",
    hand: "skinD",
    legs: "leather",
    shin: "leather",
    feet: "bone",
    pelvis: "leather",
  },
  head: {
    ax: 8,
    ay: 11,
    legend: {
      y: ["bone", 2],
      Y: ["bone", 3],
      k: ["bone", 1],
      m: ["magenta", 2],
      d: ["skinD", 2],
      D: ["skinD", 3],
      q: ["skinD", 1],
      e: ["black", 0],
      w: ["white", 3],
      h: ["black", 2],
    },
    rows: [
      "........yY.......",
      ".......yyYy......",
      "......yyyYYy.....",
      ".....mmmmmmmm....",
      "...kyyyyyyYYYyy..",
      ".kkyyyyyyyyyyYYy.",
      "....hhqqqdddd....",
      "....hhqdddwed....",
      ".....hqddddDd....",
      ".....hhqddddd....",
      "......hqdddd.....",
      "........qdd......",
    ],
  },
  hurt: { e: "q", w: "q" },
  smear: "sGold",
  weaponSpan: [ORIEL_CHAIN - 1, ORIEL_CHAIN + 6],
  drawBody({ buf, J, b }) {
    // poncho: A-line cloak from the shoulders to the hips
    capsule(buf, J.pelvis, J.pelvis, b.rPelvis, b.rPelvis, MAT.leather, G.body, { deep: true, inner: false });
    const n = J.neckBase;
    const pv = J.pelvis;
    poly(
      buf,
      [
        [n[0] - 5, n[1]],
        [n[0] + 5, n[1]],
        [pv[0] + 10, pv[1] - 2],
        [pv[0] + 8, pv[1] + 1],
        [pv[0] - 8, pv[1] + 1],
        [pv[0] - 10, pv[1] - 2],
      ],
      MAT.gold,
      G.body,
      { deep: true, inner: false },
    );
    line(buf, [pv[0] - 9, pv[1] - 1], [pv[0] + 9, pv[1] - 1], MAT.magenta, 2, G.body);
  },
  drawWeapon({ buf, J, p }) {
    // star lantern on a chain (dotted chain; the lantern bitmap never rotates)
    const h = J.haF;
    const d = J.wDir;
    const L = ORIEL_CHAIN + p.ext;
    const c = add(h, d, L);
    for (let i = 2; i < L - 1; i += 2) px(buf, h[0] + d[0] * i, h[1] + d[1] * i, MAT.steel, 3, G.weapon);
    cells(buf, LANTERN, c[0], c[1] - 1, G.weapon);
  },
});

export const CHAR_DEFS: Record<CharId, CharDef> = {
  asagiri: ASAGIRI,
  yoikaze: YOIKAZE,
  grimvald: GRIMVALD,
  maelis: MAELIS,
  bazalt: BAZALT,
  oriel: ORIEL,
};
