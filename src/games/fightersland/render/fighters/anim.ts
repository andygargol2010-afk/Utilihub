/**
 * Clip building and frame selection: turns a FighterState into (clip, key index) at a low,
 * hand-animated pose rate, and rasterises each key once (cached per character).
 */
import { FINISHER } from "../../core/constants";
import type { CharId, FighterState, FightState, MoveId, SpriteFrame } from "../../core/types";
import { CHAR_DEFS } from "./chars";
import { ANIMS, TPL } from "./moves";
import type { CharAnim, MoveDef } from "./moves";
import { BOY, freshBuf, resolve } from "./raster";
import type { Tint } from "./raster";
import { blend, drawFighter, pose, solve } from "./rig";
import type { Pose, PoseDelta, Smear, SmearSrc } from "./rig";

interface Spec {
  pose: Pose;
  smears: Smear[] | null;
  tint: Tint;
}

/** Key index layout of an attack clip. */
interface AtkLayout {
  s: number;
  sn: number;
  c: number;
  cn: number;
  a: number;
  an: number;
  r: number;
  rn: number;
}

interface Clip {
  specs: Spec[];
  sprites: (SpriteFrame | undefined)[];
  atk: AtkLayout | null;
  /** finisher key start frames */
  at: number[] | null;
}

export type ClipName =
  | "idle"
  | "walk"
  | "jump"
  | "land"
  | "block"
  | "blockstun"
  | "stagger"
  | "dodge"
  | "hitL"
  | "hitM"
  | "hitH"
  | "launch"
  | "down"
  | "getup"
  | "dizzy"
  | "lose"
  | "win"
  | "intro"
  | "fin"
  | "atk_light"
  | "atk_medium"
  | "atk_heavy"
  | "atk_air"
  | "atkC_light"
  | "atkC_medium"
  | "atkC_heavy"
  | "atkC_air";

const ATK: Record<MoveId, ClipName> = { light: "atk_light", medium: "atk_medium", heavy: "atk_heavy", air: "atk_air" };
const ATKC: Record<MoveId, ClipName> = { light: "atkC_light", medium: "atkC_medium", heavy: "atkC_heavy", air: "atkC_air" };

const spec = (p: Pose, smears: Smear[] | null = null, tint: Tint = 0): Spec => ({ pose: p, smears, tint });

class CharClips {
  readonly anim: CharAnim;
  readonly id: CharId;
  private readonly clips = new Map<ClipName, Clip>();
  private pelvisH = -1;

  constructor(id: CharId) {
    this.id = id;
    this.anim = ANIMS[id];
  }

  /** Standing pelvis height above the ground point (for airborne poses). */
  private ph(): number {
    if (this.pelvisH < 0) {
      const J = solve(CHAR_DEFS[this.id].build, this.anim.idle);
      this.pelvisH = BOY - J.pelvis[1];
    }
    return this.pelvisH;
  }

  /** Delta on top of the idle stance; airborne rootY becomes relative to the standing pelvis. */
  mk(d: PoseDelta, base?: Pose): Pose {
    const p = pose(d, base ?? this.anim.idle);
    if (!p.ground) p.rootY = this.ph() + (d.rootY ?? 0);
    return p;
  }

  tpl(name: string, extra?: PoseDelta): Pose {
    const t = TPL[name];
    if (!t) return this.anim.idle;
    const { arms, ...rest } = t;
    const set = arms ? this.anim.arms[arms] : {};
    return this.mk({ ...set, ...rest, ...(extra ?? {}), z: { ...(set.z ?? {}), ...(rest.z ?? {}) } });
  }

  get(name: ClipName): Clip {
    let c = this.clips.get(name);
    if (!c) {
      c = this.build(name);
      this.clips.set(name, c);
    }
    return c;
  }

  sprite(name: ClipName, idx: number): SpriteFrame {
    const c = this.get(name);
    const i = idx < 0 ? 0 : idx >= c.specs.length ? c.specs.length - 1 : idx;
    let s = c.sprites[i];
    if (!s) {
      const sp = c.specs[i]!;
      const buf = freshBuf();
      drawFighter(buf, CHAR_DEFS[this.id], sp.pose, sp.smears);
      s = resolve(buf, sp.tint);
      c.sprites[i] = s;
    }
    return s;
  }

  clipLen(name: ClipName): number {
    return this.get(name).specs.length;
  }

  private plain(specs: Spec[]): Clip {
    return { specs, sprites: [], atk: null, at: null };
  }

  private build(name: ClipName): Clip {
    const A = this.anim;
    const idle = A.idle;
    switch (name) {
      case "idle": {
        const inh = this.mk(A.breathe);
        const half = blend(idle, inh, 0.5);
        return this.plain([spec(idle), spec(half), spec(inh), spec(half)]);
      }
      case "walk":
        return this.plain(this.walkCycle());
      case "jump":
        return this.plain([spec(this.tpl("jumpUp")), spec(this.tpl("jumpPeak")), spec(this.tpl("jumpFall"))]);
      case "land": {
        const l = this.tpl("land");
        return this.plain([spec(l), spec(blend(l, idle, 0.5))]);
      }
      case "block":
        return this.plain([spec(this.tpl("guard"))]);
      case "blockstun":
        return this.plain([spec(this.tpl("guardHit")), spec(this.tpl("guard"))]);
      case "stagger":
        return this.plain([spec(this.tpl("stagger1")), spec(this.tpl("stagger2"))]);
      case "dodge":
        return this.plain([
          spec(this.tpl("dodge1")),
          spec(this.tpl("dodge2")),
          spec(this.tpl("dodge3")),
          spec(this.tpl("dodge4")),
        ]);
      case "hitL": {
        const h = this.tpl("hitL");
        return this.plain([spec(h, null, 1), spec(h), spec(this.tpl("hitL2"))]);
      }
      case "hitM": {
        const h = this.tpl("hitGut");
        return this.plain([spec(h, null, 1), spec(h), spec(this.tpl("hitGut2"))]);
      }
      case "hitH": {
        const h = this.tpl("hitH");
        return this.plain([spec(h, null, 2), spec(h), spec(this.tpl("hitH2"))]);
      }
      case "launch":
        return this.plain([
          spec(this.tpl("launch"), null, 1),
          spec(this.tpl("launch")),
          spec(this.tpl("tumble")),
          spec(this.tpl("tumble2")),
          spec(this.tpl("bounce")),
        ]);
      case "down":
        return this.plain([spec(this.tpl("down"))]);
      case "getup":
        return this.plain([spec(this.tpl("getUp1")), spec(this.tpl("getUp2")), spec(this.tpl("getUp3"))]);
      case "dizzy":
        return this.plain([
          spec(this.tpl("dizzy1")),
          spec(this.tpl("dizzy2")),
          spec(this.tpl("dizzy3")),
          spec(this.tpl("dizzy2")),
        ]);
      case "lose":
        return this.plain([spec(this.tpl("lose")), spec(this.tpl("lose2"))]);
      case "win":
        return this.plain(A.win.map((d) => spec(this.mk(d))));
      case "intro":
        return this.plain(A.intro.map((d) => spec(this.mk(d))));
      case "fin":
        return this.finisherClip();
      case "atk_light":
        return this.attackClip(A.moves.light, false);
      case "atk_medium":
        return this.attackClip(A.moves.medium, false);
      case "atk_heavy":
        return this.attackClip(A.moves.heavy, false);
      case "atk_air":
        return this.attackClip(A.moves.air, false);
      case "atkC_light":
        return this.attackClip(A.moves.light, true);
      case "atkC_medium":
        return this.attackClip(A.moves.medium, true);
      case "atkC_heavy":
        return this.attackClip(A.moves.heavy, true);
      case "atkC_air":
        return this.attackClip(A.moves.air, true);
    }
  }

  /** 6-key walk cycle around the character's own stance (auto-grounding gives the bob). */
  private walkCycle(): Spec[] {
    const idle = this.anim.idle;
    const mid = (idle.legF[0] + idle.legB[0]) / 2;
    const amp = Math.max(16, Math.abs(idle.legB[0] - idle.legF[0]) / 2);
    const out: Spec[] = [];
    for (let i = 0; i < 6; i++) {
      const ph = (i / 6) * Math.PI * 2;
      const s = Math.sin(ph);
      const c = Math.cos(ph);
      const tF = mid - amp * s;
      const tB = mid + amp * s;
      const p = pose(
        {
          legF: [tF, tF - 14 - 34 * Math.max(0, c)],
          legB: [tB, tB - 14 - 34 * Math.max(0, -c)],
          lean: idle.lean + 2,
          armF: [idle.armF[0] + 3 * s, idle.armF[1] + 3 * s],
          armB: [idle.armB[0] - 4 * s, idle.armB[1] - 4 * s],
          weapon: idle.weapon + 2 * s,
        },
        idle,
      );
      out.push(spec(p));
    }
    return out;
  }

  private smears(from: Pose, src: readonly SmearSrc[], len = 1): Smear[] {
    return src.map((s) => ({ from, src: s, len }));
  }

  private attackClip(m: MoveDef, charged: boolean): Clip {
    const specs: Spec[] = [];
    const startup = m.startup.map((d) => this.mk(d));
    const charge = m.charge.map((d) => this.mk(d));
    const last = startup[startup.length - 1] ?? this.anim.idle;
    const windup = charged ? (charge[0] ?? last) : last;
    const lay: AtkLayout = { s: 0, sn: startup.length, c: 0, cn: 0, a: 0, an: 0, r: 0, rn: 0 };
    for (const p of startup) specs.push(spec(p));
    // charge: per key [still, tremble, glow, glow+tremble]
    lay.c = specs.length;
    lay.cn = charge.length;
    for (const p of charge) {
      const tr = pose({ rootX: p.rootX - 1, lean: p.lean - 1, head: p.head + 1 }, p);
      specs.push(spec(p), spec(tr), spec(p, null, 1), spec(tr, null, 1));
    }
    lay.a = specs.length;
    lay.an = m.active.length;
    m.active.forEach((d, i) => {
      const extra: PoseDelta = charged ? { rootX: (d.rootX ?? 0) + 3 } : {};
      const p = this.mk({ ...d, ...extra });
      specs.push(spec(p, this.smears(windup, m.sm, i === 0 ? 1 : 0.5), charged && i === 0 ? 1 : 0));
    });
    lay.r = specs.length;
    lay.rn = m.recovery.length;
    m.recovery.forEach((d, i) => {
      const extra: PoseDelta = charged && i === 0 ? { rootX: (d.rootX ?? 0) + 2 } : {};
      specs.push(spec(this.mk({ ...d, ...extra })));
    });
    return { specs, sprites: [], atk: lay, at: null };
  }

  private finisherClip(): Clip {
    const keys = this.anim.finisher;
    const poses = keys.map((k) => this.mk(k.d));
    const specs: Spec[] = keys.map((k, i) => {
      let sm: Smear[] | null = null;
      if (k.sm && k.from !== undefined) {
        const fi = keys.findIndex((q) => q.at === k.from);
        const from = fi >= 0 ? poses[fi] : undefined;
        if (from) sm = this.smears(from, k.sm);
      }
      return spec(poses[i]!, sm, k.tint ?? 0);
    });
    return { specs, sprites: [], atk: null, at: keys.map((k) => k.at) };
  }

  finisherIndex(frame: number): number {
    const at = this.get("fin").at;
    if (!at) return 0;
    let idx = 0;
    for (let i = 0; i < at.length; i++) if ((at[i] ?? 0) <= frame) idx = i;
    return idx;
  }

  atkLayout(name: ClipName): AtkLayout | null {
    return this.get(name).atk;
  }
}

const CLIPS = new Map<CharId, CharClips>();
export function clipsFor(id: CharId): CharClips {
  let c = CLIPS.get(id);
  if (!c) {
    c = new CharClips(id);
    CLIPS.set(id, c);
  }
  return c;
}

const seg = (n: number, f: number, len: number): number => {
  if (n <= 1) return 0;
  const i = Math.floor((f * n) / (len > 0 ? len : 1));
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};

function attackIndex(cc: CharClips, name: ClipName, f: FighterState): number {
  const L = cc.atkLayout(name);
  if (!L) return 0;
  switch (f.phase) {
    case "startup":
      return L.s + seg(L.sn, f.phaseFrame, f.phaseLen);
    case "charge": {
      if (L.cn === 0) return L.s + L.sn - 1;
      const cf = f.chargeFrames;
      const k = L.cn > 1 ? Math.floor(cf / 5) % L.cn : 0;
      const tremble = f.chargeLevel >= 1 ? Math.floor(cf / 3) % 2 : Math.floor(cf / 6) % 2;
      const glow = f.chargeLevel === 2 && Math.floor(cf / 4) % 2 === 0 ? 2 : 0;
      return L.c + k * 4 + tremble + glow;
    }
    case "active":
      return L.a + seg(L.an, f.phaseFrame, f.phaseLen);
    case "recovery":
      return L.r + seg(L.rn, f.phaseFrame, f.phaseLen);
    case null:
      return L.r + L.rn - 1;
  }
}

/** Selected clip + key for a fighter this frame (no allocation). */
export interface Selection {
  clip: ClipName;
  idx: number;
}

export function select(f: FighterState, fight: FightState | null, out: Selection): void {
  const cc = clipsFor(f.char);
  const af = f.actionFrame;
  switch (f.action) {
    case "intro": {
      const n = cc.clipLen("intro");
      out.clip = "intro";
      out.idx = Math.min(n - 1, Math.floor(af / 18));
      return;
    }
    case "idle":
      out.clip = "idle";
      out.idx = Math.floor(af / 12) % 4;
      return;
    case "walkF":
      out.clip = "walk";
      out.idx = Math.floor(af / 5) % 6;
      return;
    case "walkB":
      out.clip = "walk";
      out.idx = 5 - (Math.floor(af / 6) % 6);
      return;
    case "jump":
      out.clip = "jump";
      out.idx = f.vy > 1.5 ? 0 : f.vy < -1.5 ? 2 : 1;
      return;
    case "land":
      out.clip = "land";
      out.idx = af < 3 ? 0 : 1;
      return;
    case "attack":
    case "airAttack": {
      const mv: MoveId = f.move ?? (f.action === "airAttack" ? "air" : "light");
      const name = f.chargeLevel > 0 ? ATKC[mv] : ATK[mv];
      out.clip = name;
      out.idx = attackIndex(cc, name, f);
      return;
    }
    case "block":
      out.clip = "block";
      out.idx = 0;
      return;
    case "blockstun":
      out.clip = "blockstun";
      out.idx = f.stun > 3 ? 0 : 1;
      return;
    case "stagger":
      out.clip = "stagger";
      out.idx = Math.floor(af / 8) % 2;
      return;
    case "dodge":
      out.clip = "dodge";
      out.idx = af < 3 ? 0 : af < 11 ? 1 : af < 18 ? 2 : 3;
      return;
    case "hitstun": {
      const foe = fight ? fight.fighters[f.index === 0 ? 1 : 0] : null;
      out.clip = f.hurtKind === "heavy" ? "hitH" : foe && foe.move === "medium" ? "hitM" : "hitL";
      out.idx = af === 0 ? 0 : f.stun > 6 ? 1 : 2;
      return;
    }
    case "launch":
    case "ko":
      if (f.action === "ko" && f.y <= 0.5 && Math.abs(f.vy) < 0.01) {
        out.clip = "down";
        out.idx = 0;
        return;
      }
      out.clip = "launch";
      out.idx = af === 0 ? 0 : f.vy > 1 ? (af < 6 ? 1 : 2) : f.y > 14 ? 3 : 4;
      return;
    case "down":
      out.clip = "down";
      out.idx = 0;
      return;
    case "getup":
      out.clip = "getup";
      out.idx = seg(3, af, 18);
      return;
    case "dizzy":
      out.clip = "dizzy";
      out.idx = Math.floor(af / 14) % 4;
      return;
    case "finisher": {
      const fr = fight && fight.phase === "finisher" ? fight.phaseFrame : af;
      out.clip = "fin";
      out.idx = cc.finisherIndex(Math.min(fr, FINISHER.total));
      return;
    }
    case "win":
      out.clip = "win";
      out.idx = af < 36 ? 0 : 1 + (Math.floor((af - 36) / 24) % 2);
      return;
    case "lose":
      out.clip = "lose";
      out.idx = Math.floor(af / 30) % 2;
      return;
  }
}
