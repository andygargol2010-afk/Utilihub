/**
 * Fightersland skeleton rig: forward kinematics for one fighter pose, the shared part drawing
 * order (far arm, legs, torso, head, weapon, near arm) and the swept-segment weapon smear.
 *
 * Angle conventions (degrees): limb directions 0 = down, 90 = forward (+x), 180 = up,
 * negative = backward; spine lean 0 = upright, + = forward. "F" limbs are the near-side ones
 * (drawn in front, full tone), "B" the far-side ones (drawn behind, one tone darker).
 */
import { BOX, BOY, G, MAT, capsule, cells, flatPoly, line } from "./raster";
import type { Buf, Cells, MatName, Pt } from "./raster";

const D2R = Math.PI / 180;

export type V2 = [number, number];
export const dir = (a: number): V2 => [Math.sin(a * D2R), Math.cos(a * D2R)];
export const upv = (a: number): V2 => [Math.sin(a * D2R), -Math.cos(a * D2R)];
export const add = (a: Pt, b: Pt, k = 1): V2 => [a[0] + b[0] * k, a[1] + b[1] * k];
export const perp = (d: Pt): V2 => [-d[1], d[0]];
/** Point at (u along d, v across d) from o. */
export const loc = (o: Pt, d: Pt, u: number, v: number): V2 => {
  const n = perp(d);
  return [o[0] + d[0] * u + n[0] * v, o[1] + d[1] * u + n[1] * v];
};

export interface Build {
  thigh: number;
  shin: number;
  foot: number;
  abdomen: number;
  chest: number;
  neck: number;
  uarm: number;
  farm: number;
  rPelvis: number;
  rWaist: number;
  rChest: number;
  rNeck: number;
  rThigh: readonly [number, number];
  rShin: readonly [number, number];
  rUarm: readonly [number, number];
  rFarm: readonly [number, number];
  rHand: number;
  rFoot: number;
  /** [forward px, down px] from the neck base / pelvis */
  shF: readonly [number, number];
  shB: readonly [number, number];
  hipF: readonly [number, number];
  hipB: readonly [number, number];
  /** distance from the near hand back along the weapon where the far hand grips (two-handed) */
  grip2: number;
}

export const BASE_BUILD: Build = {
  thigh: 13,
  shin: 13,
  foot: 5,
  abdomen: 7,
  chest: 9,
  neck: 2,
  uarm: 10,
  farm: 9,
  rPelvis: 4.5,
  rWaist: 4.5,
  rChest: 5.5,
  rNeck: 1.5,
  rThigh: [3.5, 2.5],
  rShin: [2.5, 1.5],
  rUarm: [2.5, 2.5],
  rFarm: [2.5, 1.5],
  rHand: 1.5,
  rFoot: 1.5,
  shF: [-2, 1],
  shB: [3, 1],
  hipF: [-2, 0],
  hipB: [2, 0],
  grip2: 4,
};

export interface PoseZ {
  /** far arm drawn in front of the torso (two-handed grips, guards) */
  armBFront?: boolean;
  /** near leg drawn in front of the torso */
  legFFront?: boolean;
  /** weapon drawn behind the torso */
  weaponBack?: boolean;
}

export interface Pose {
  rootX: number;
  rootY: number;
  /** auto-ground: the lowest joint touches the floor line */
  ground: boolean;
  /** whole-body rotation about the pelvis (clockwise, degrees) */
  rot: number;
  lean: number;
  bend: number;
  neck: number;
  /** head row shear (small tilt) */
  head: number;
  /** extra head bitmap rotation (degrees, snapped to 22.5) */
  headRot: number;
  armF: readonly [number, number];
  armB: readonly [number, number];
  legF: readonly [number, number];
  legB: readonly [number, number];
  footF: number;
  footB: number;
  weapon: number;
  grip2: boolean;
  /** vertical bone stretch (jump stretch / landing squash) */
  sy: number;
  /** weapon extension (chain length, etc.); 0 = character default */
  ext: number;
  /** 0 normal face, 1 hurt (eyes shut) */
  face: number;
  z: PoseZ;
}

export const BASE_POSE: Pose = {
  rootX: 0,
  rootY: 0,
  ground: true,
  rot: 0,
  lean: 6,
  bend: 4,
  neck: 0,
  head: 0,
  headRot: 0,
  armF: [20, 80],
  armB: [40, 110],
  legF: [-14, -30],
  legB: [28, -4],
  footF: 90,
  footB: 90,
  weapon: 125,
  grip2: false,
  sy: 1,
  ext: 0,
  face: 0,
  z: {},
};

export type PoseDelta = Partial<Omit<Pose, "z">> & { z?: PoseZ };

export function pose(o: PoseDelta, base: Pose = BASE_POSE): Pose {
  return { ...base, ...o, z: { ...base.z, ...(o.z ?? {}) } };
}

const lerpN = (a: number, b: number, t: number): number => a + (b - a) * t;
const lerp2 = (a: readonly [number, number], b: readonly [number, number], t: number): [number, number] => [
  lerpN(a[0], b[0], t),
  lerpN(a[1], b[1], t),
];

/** Linear blend of two poses (booleans and z-order come from b once t >= 0.5). */
export function blend(a: Pose, b: Pose, t: number): Pose {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const h = t >= 0.5 ? b : a;
  return {
    rootX: lerpN(a.rootX, b.rootX, t),
    rootY: lerpN(a.rootY, b.rootY, t),
    ground: h.ground,
    rot: lerpN(a.rot, b.rot, t),
    lean: lerpN(a.lean, b.lean, t),
    bend: lerpN(a.bend, b.bend, t),
    neck: lerpN(a.neck, b.neck, t),
    head: Math.round(lerpN(a.head, b.head, t)),
    headRot: lerpN(a.headRot, b.headRot, t),
    armF: lerp2(a.armF, b.armF, t),
    armB: lerp2(a.armB, b.armB, t),
    legF: lerp2(a.legF, b.legF, t),
    legB: lerp2(a.legB, b.legB, t),
    footF: lerpN(a.footF, b.footF, t),
    footB: lerpN(a.footB, b.footB, t),
    weapon: lerpN(a.weapon, b.weapon, t),
    grip2: h.grip2,
    sy: lerpN(a.sy, b.sy, t),
    ext: lerpN(a.ext, b.ext, t),
    face: h.face,
    z: h.z,
  };
}

export interface Joints {
  pelvis: V2;
  waist: V2;
  neckBase: V2;
  headBase: V2;
  shF: V2;
  shB: V2;
  hipF: V2;
  hipB: V2;
  elF: V2;
  haF: V2;
  elB: V2;
  haB: V2;
  knF: V2;
  anF: V2;
  toF: V2;
  knB: V2;
  anB: V2;
  toB: V2;
  /** weapon direction (unit vector) */
  wDir: V2;
}
type JointKey = Exclude<keyof Joints, "wDir">;
const JOINT_KEYS: readonly JointKey[] = [
  "pelvis",
  "waist",
  "neckBase",
  "headBase",
  "shF",
  "shB",
  "hipF",
  "hipB",
  "elF",
  "haF",
  "elB",
  "haB",
  "knF",
  "anF",
  "toF",
  "knB",
  "anB",
  "toB",
];

function ik2(S: V2, Tg: V2, l1: number, l2: number): { el: V2; hand: V2 } {
  const dx = Tg[0] - S[0];
  const dy = Tg[1] - S[1];
  let d = Math.hypot(dx, dy);
  d = Math.max(Math.abs(l1 - l2) + 0.01, Math.min(l1 + l2 - 0.01, d));
  const a = Math.atan2(dy, dx);
  const A = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const e1: V2 = [S[0] + Math.cos(a + A) * l1, S[1] + Math.sin(a + A) * l1];
  const e2: V2 = [S[0] + Math.cos(a - A) * l1, S[1] + Math.sin(a - A) * l1];
  const el = e1[1] > e2[1] || (e1[1] === e2[1] && e1[0] < e2[0]) ? e1 : e2; // elbow hangs low / back
  return { el, hand: [S[0] + Math.cos(a) * d, S[1] + Math.sin(a) * d] };
}

/** Solve joint positions in buffer pixels (rounded). */
export function solve(b0: Build, p: Pose): Joints {
  const s = p.sy;
  const thigh = b0.thigh * s;
  const shin = b0.shin * s;
  const abdomen = b0.abdomen * s;
  const chest = b0.chest * s;
  const sp1 = upv(p.lean);
  const sp2 = upv(p.lean + p.bend);
  const pelvis: V2 = [0, 0];
  const waist = add(pelvis, sp1, abdomen);
  const neckBase = add(waist, sp2, chest);
  const headBase = add(neckBase, upv(p.lean + p.bend + p.neck), b0.neck);
  const fw2: V2 = [Math.cos((p.lean + p.bend) * D2R), Math.sin((p.lean + p.bend) * D2R)];
  const off = (o: readonly [number, number], base: V2): V2 => [
    base[0] + fw2[0] * o[0] - sp2[0] * o[1],
    base[1] + fw2[1] * o[0] - sp2[1] * o[1],
  ];
  const shF = off(b0.shF, neckBase);
  const shB = off(b0.shB, neckBase);
  const hipF: V2 = [b0.hipF[0], b0.hipF[1]];
  const hipB: V2 = [b0.hipB[0], b0.hipB[1]];
  const elF = add(shF, dir(p.armF[0]), b0.uarm);
  const haF = add(elF, dir(p.armF[1]), b0.farm);
  let wDir = dir(p.weapon);
  let elB: V2;
  let haB: V2;
  if (p.grip2) {
    const g = add(haF, wDir, -b0.grip2);
    const r = ik2(shB, g, b0.uarm, b0.farm);
    elB = r.el;
    haB = r.hand;
  } else {
    elB = add(shB, dir(p.armB[0]), b0.uarm);
    haB = add(elB, dir(p.armB[1]), b0.farm);
  }
  const knF = add(hipF, dir(p.legF[0]), thigh);
  const anF = add(knF, dir(p.legF[1]), shin);
  const toF = add(anF, dir(p.footF), b0.foot);
  const knB = add(hipB, dir(p.legB[0]), thigh);
  const anB = add(knB, dir(p.legB[1]), shin);
  const toB = add(anB, dir(p.footB), b0.foot);
  const J: Joints = {
    pelvis,
    waist,
    neckBase,
    headBase,
    shF,
    shB,
    hipF,
    hipB,
    elF,
    haF,
    elB,
    haB,
    knF,
    anF,
    toF,
    knB,
    anB,
    toB,
    wDir,
  };
  if (p.rot) {
    const c = Math.cos(p.rot * D2R);
    const sn = Math.sin(p.rot * D2R);
    for (const k of JOINT_KEYS) {
      const v = J[k];
      J[k] = [v[0] * c - v[1] * sn, v[0] * sn + v[1] * c];
    }
    wDir = [wDir[0] * c - wDir[1] * sn, wDir[0] * sn + wDir[1] * c];
    J.wDir = wDir;
  }
  let dy = 0;
  if (p.ground) {
    let low = -1e9;
    for (const k of JOINT_KEYS) {
      const extra = k === "anF" || k === "anB" || k === "toF" || k === "toB" ? b0.rFoot : k === "pelvis" ? b0.rPelvis : 0;
      low = Math.max(low, J[k][1] + extra);
    }
    dy = -low;
  }
  for (const k of JOINT_KEYS) {
    const v = J[k];
    J[k] = [Math.round(BOX + p.rootX + v[0]), Math.round(BOY - p.rootY + v[1] + dy)];
  }
  return J;
}

/** Per-character drawing hooks receive this context. */
export interface DrawCtx {
  buf: Buf;
  J: Joints;
  b: Build;
  p: Pose;
  ch: CharDef;
}

export interface CharMats {
  skin: MatName;
  torso: MatName;
  sleeve: MatName;
  forearm?: MatName;
  hand: MatName;
  legs: MatName;
  shin?: MatName;
  feet: MatName;
  pelvis?: MatName;
}

/** Where a smear is swept from. */
export type SmearSrc = "weapon" | "handF" | "handB" | "footF" | "footB" | "weaponB";

export interface CharDef {
  name: string;
  build: Build;
  mats: CharMats;
  head: Cells;
  /** head variants: [normal 16 rotations, hurt 16 rotations]; filled lazily */
  headRot: (face: number, idx: number) => Cells;
  /** smear ramp */
  smear: MatName;
  /** [from, to] distance along the weapon from the near hand that the weapon smear sweeps */
  weaponSpan: readonly [number, number];
  drawBack?: (c: DrawCtx) => void;
  drawShieldBack?: (c: DrawCtx) => void;
  drawBody?: (c: DrawCtx) => void;
  drawTorso?: (c: DrawCtx) => void;
  drawWeapon?: (c: DrawCtx) => void;
  drawFront?: (c: DrawCtx) => void;
}

export interface Smear {
  /** pose the swing started from */
  from: Pose;
  src: SmearSrc;
  /** override the character smear ramp */
  mat?: MatName;
  /** 0..1: fraction of the swing (from -> current) that is still visible; default 1 */
  len?: number;
}

function segOf(ch: CharDef, J: Joints, p: Pose, src: SmearSrc): [V2, V2] {
  switch (src) {
    case "weapon": {
      const ext = p.ext || 0;
      return [add(J.haF, J.wDir, ch.weaponSpan[0] + ext), add(J.haF, J.wDir, ch.weaponSpan[1] + ext)];
    }
    case "weaponB":
      return [add(J.haB, J.wDir, ch.weaponSpan[0]), add(J.haB, J.wDir, ch.weaponSpan[1])];
    case "handF":
      return [J.elF, add(J.haF, [J.haF[0] - J.elF[0], J.haF[1] - J.elF[1]], 0.25)];
    case "handB":
      return [J.elB, add(J.haB, [J.haB[0] - J.elB[0], J.haB[1] - J.elB[1]], 0.25)];
    case "footF":
      return [J.knF, J.toF];
    case "footB":
      return [J.knB, J.toB];
  }
}

const SMEAR_STEPS = 7;
function drawSmear(buf: Buf, ch: CharDef, p: Pose, sm: Smear): void {
  const mat = MAT[sm.mat ?? ch.smear];
  const len = sm.len ?? 1;
  const segs: [V2, V2][] = [];
  for (let k = 0; k <= SMEAR_STEPS; k++) {
    const t = 1 - len + (len * k) / SMEAR_STEPS;
    const q = blend(sm.from, p, t);
    segs.push(segOf(ch, solve(ch.build, q), q, sm.src));
  }
  for (let k = 0; k < SMEAR_STEPS; k++) {
    const a = segs[k]!;
    const b = segs[k + 1]!;
    const age = SMEAR_STEPS - 1 - k; // 0 = newest
    const tone = age <= 1 ? 3 : age <= 3 ? 2 : 1;
    const dither = age >= 5 ? 1 : 0;
    flatPoly(buf, [a[0], a[1], b[1], b[0]], mat, tone, G.fx, dither);
  }
  // bright leading edge along the tip path
  for (let k = Math.max(0, SMEAR_STEPS - 4); k < SMEAR_STEPS; k++) {
    line(buf, segs[k]![1], segs[k + 1]![1], mat, 3, G.fx);
  }
  // thrusts sweep along their own line (no area): draw speed streaks parallel to the strike
  const s0 = segs[0]!;
  const s1 = segs[SMEAR_STEPS]!;
  const d0: V2 = [s0[1][0] - s0[0][0], s0[1][1] - s0[0][1]];
  const d1: V2 = [s1[1][0] - s1[0][0], s1[1][1] - s1[0][1]];
  const l0 = Math.hypot(d0[0], d0[1]);
  const l1 = Math.hypot(d1[0], d1[1]);
  if (l0 > 0.5 && l1 > 0.5) {
    const cos = (d0[0] * d1[0] + d0[1] * d1[1]) / (l0 * l1);
    const tipA = s0[1];
    const tipB = s1[1];
    const run = Math.hypot(tipB[0] - tipA[0], tipB[1] - tipA[1]);
    const limb = sm.src !== "weapon" && sm.src !== "weaponB";
    if ((cos > 0.97 || limb) && run > 6) {
      const u: V2 = [(tipB[0] - tipA[0]) / run, (tipB[1] - tipA[1]) / run];
      const n = perp(u);
      const back = Math.min(run + 8, 34);
      for (const [off, tone, f0, f1] of STREAKS) {
        line(buf, add(add(tipB, u, -back * f0), n, off), add(add(tipB, u, -back * f1), n, off), mat, tone, G.fx);
      }
    }
  }
}
/** [perpendicular offset, tone, start fraction, end fraction] of thrust speed streaks */
const STREAKS: readonly (readonly [number, number, number, number])[] = [
  [-2, 3, 0.95, 0.15],
  [2, 3, 0.85, 0.1],
  [-4, 2, 0.7, 0.3],
  [4, 2, 0.6, 0.25],
  [0, 3, 1, 0.5],
];

export function drawFighter(buf: Buf, ch: CharDef, p: Pose, smears?: readonly Smear[] | null): Joints {
  const b = ch.build;
  const J = solve(b, p);
  const m = ch.mats;
  const ctx: DrawCtx = { buf, J, b, p, ch };
  if (ch.drawBack) ch.drawBack(ctx);
  const drawArm = (S: V2, E: V2, Hd: V2, dark: number, grp: number): void => {
    capsule(buf, S, E, b.rUarm[0], b.rUarm[1], MAT[m.sleeve], grp, { dark });
    capsule(buf, E, Hd, b.rFarm[0], b.rFarm[1], MAT[m.forearm ?? m.sleeve], grp, { dark });
    capsule(buf, Hd, Hd, b.rHand, b.rHand, MAT[m.hand], grp, { dark, shade: b.rHand > 2 ? "full" : "noLight" });
  };
  const drawLeg = (Hp: V2, K: V2, A: V2, To: V2, dark: number, grp: number): void => {
    capsule(buf, Hp, K, b.rThigh[0], b.rThigh[1], MAT[m.legs], grp, { dark });
    capsule(buf, K, A, b.rShin[0], b.rShin[1], MAT[m.shin ?? m.legs], grp, { dark });
    capsule(buf, [A[0] - 1, A[1]], To, b.rFoot, b.rFoot, MAT[m.feet], grp, { dark, shade: "noLight" });
  };
  if (!p.z.armBFront) {
    drawArm(J.shB, J.elB, J.haB, -1, G.armB);
    if (ch.drawShieldBack) ch.drawShieldBack(ctx);
  }
  drawLeg(J.hipB, J.knB, J.anB, J.toB, -1, G.legB);
  if (!p.z.legFFront) drawLeg(J.hipF, J.knF, J.anF, J.toF, 0, G.legF);
  if (p.z.weaponBack && ch.drawWeapon) ch.drawWeapon(ctx);
  if (ch.drawBody) ch.drawBody(ctx);
  else {
    const pm = MAT[m.pelvis ?? m.legs];
    capsule(buf, J.pelvis, J.pelvis, b.rPelvis, b.rPelvis, pm, G.body, { deep: true, inner: false });
    capsule(buf, J.pelvis, J.waist, b.rWaist, b.rWaist, MAT[m.torso], G.body, { deep: true, inner: false });
    capsule(buf, J.waist, J.neckBase, b.rWaist, b.rChest, MAT[m.torso], G.body, { deep: true, inner: false });
  }
  if (ch.drawTorso) ch.drawTorso(ctx);
  if (p.z.legFFront) drawLeg(J.hipF, J.knF, J.anF, J.toF, 0, G.legF);
  if (b.neck > 0) {
    capsule(buf, J.neckBase, J.headBase, b.rNeck, b.rNeck, MAT[m.skin], G.body, { dark: -1, shade: "flat", inner: false });
  }
  const a = p.rot + p.headRot;
  const idx = ((Math.round(a / 22.5) % 16) + 16) % 16;
  if (idx === 0) cells(buf, ch.headRot(p.face, 0), J.headBase[0], J.headBase[1], G.head, p.head);
  else cells(buf, ch.headRot(p.face, idx), J.headBase[0], J.headBase[1], G.head);
  if (p.z.armBFront) {
    drawArm(J.shB, J.elB, J.haB, -1, G.armB);
    if (ch.drawShieldBack) ch.drawShieldBack(ctx);
  }
  if (!p.z.weaponBack && ch.drawWeapon) ch.drawWeapon(ctx);
  drawArm(J.shF, J.elF, J.haF, 0, G.armF);
  if (ch.drawFront) ch.drawFront(ctx);
  if (smears) for (const sm of smears) drawSmear(buf, ch, p, sm);
  return J;
}

/** 2 px blade: edge line (light) + spine line offset one pixel away from the light. */
export function blade(buf: Buf, from: V2, d: V2, len: number, matName: MatName, edgeTone = 3, spineTone = 1): V2 {
  const n: V2 = Math.abs(d[0]) > Math.abs(d[1]) ? [0, 1] : [-1, 0];
  const tip = add(from, d, len);
  line(buf, add(from, n), add(add(from, d, len - 1), n), MAT[matName], spineTone, G.weapon);
  line(buf, from, tip, MAT[matName], edgeTone, G.weapon);
  return tip;
}
