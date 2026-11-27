/**
 * Headless Fightersland simulation check.
 *
 *   npx esbuild src/games/fightersland/dev/simcheck.ts --bundle --platform=node \
 *     --alias:@=./src --outfile=/tmp/simcheck.cjs && node /tmp/simcheck.cjs
 *
 * Runs scripted mechanic checks (frame timing, charge, block, chip, guard break, parry,
 * dodge invulnerability, chains and scaling, knockdown, finisher, time up, tutorial) and
 * AI-vs-AI matches for every pairing and level with per-tick invariants, then prints
 * win-rate tables. Exits with code 1 when any check fails.
 */
import type { AiLevel, CharId, FightEvent, FightState, InputFrame, PlayerIndex, Strength } from "../core/types";
import { CHAR_IDS, FINISHER, STAGE_MARGIN, STAGE_W, neutralInput } from "../core/constants";
import { CHARS, G, VARIANTS, cloneFight, createFight, hashFight, stepFight, getDebugBoxes } from "../sim";
import { createAi } from "../ai";
import { createTutorial } from "../tutorial";

declare const process: { exitCode: number | undefined; argv: string[] };

let failures = 0;
let passes = 0;
function check(cond: boolean, msg: string): void {
  if (cond) passes++;
  else {
    failures++;
    console.log("  FAIL: " + msg);
  }
}

type Btn = keyof InputFrame;
function inp(...btns: Btn[]): InputFrame {
  const f = neutralInput();
  for (const b of btns) f[b] = true;
  return f;
}
const N = neutralInput();

function versus(a: CharId, b: CharId, roundsToWin = 2, mode: "versus" | "tutorial" | "ai" = "versus"): FightState {
  const s = createFight({ chars: [a, b], map: "quay", mode, aiLevel: "normal", seed: 7, roundsToWin });
  let guard = 0;
  while (s.phase !== "fight" && guard++ < 400) stepFight(s, [N, N]);
  return s;
}

/** Step with the given inputs, collecting every event. */
function run(s: FightState, n: number, p0: (t: number) => InputFrame, p1: (t: number) => InputFrame = () => N): FightEvent[] {
  const evs: FightEvent[] = [];
  for (let t = 0; t < n; t++) {
    stepFight(s, [p0(t), p1(t)]);
    for (const e of s.events) evs.push(e);
  }
  return evs;
}

function place(s: FightState, gap: number): void {
  s.fighters[0].x = 300 - gap / 2;
  s.fighters[1].x = 300 + gap / 2;
  s.fighters[0].facing = 1;
  s.fighters[1].facing = -1;
}

function minGap(a: CharId, b: CharId): number {
  return CHARS[a].pushHalfW + CHARS[b].pushHalfW;
}

/** Tap `btn` on tick 0 (held for `hold` ticks). */
function tapAt(btn: Btn, at: number, hold = 1): (t: number) => InputFrame {
  return (t) => (t >= at && t < at + hold ? inp(btn) : N);
}

// ------------------------------------------------------------------------------------------
function checkFrameTiming(): void {
  console.log("frame timing");
  for (const c of CHAR_IDS) {
    for (const str of ["light", "medium", "heavy"] as Strength[]) {
      const s = versus(c, "grimvald");
      place(s, minGap(c, "grimvald") + 2);
      const v = VARIANTS[c][str][0];
      let whooshAt = -1;
      let hitAt = -1;
      for (let t = 0; t < 60; t++) {
        stepFight(s, [t === 0 ? inp(str) : N, N]);
        for (const e of s.events) {
          if (e.type === "whoosh" && whooshAt < 0) whooshAt = t;
          if (e.type === "hit" && hitAt < 0) hitAt = t;
        }
      }
      check(whooshAt === v.s, `${c} ${str}: active on frame ${whooshAt}, expected ${v.s}`);
      if (!(c === "maelis" && str === "heavy")) check(hitAt === v.s, `${c} ${str}: point-blank hit on frame ${hitAt} (expected ${v.s})`);
    }
  }
  // the lancer's polearm heavy has a deliberate dead zone up close but hits at range
  const s = versus("maelis", "asagiri");
  place(s, 60);
  const evs = run(s, 40, tapAt("heavy", 0));
  check(evs.some((e) => e.type === "hit"), "maelis heavy hits at mid range");
}

function checkBufferAndRecovery(): void {
  console.log("input buffer");
  const s = versus("asagiri", "asagiri");
  place(s, 120);
  const v = VARIANTS.asagiri.medium[0];
  const total = v.s + v.a + v.r;
  // press light 4 frames before the medium ends: it must come out on the first free frame
  let lightStart = -1;
  for (let t = 0; t < total + 20; t++) {
    const i = t === 0 ? inp("medium") : t === total - 4 ? inp("light") : N;
    stepFight(s, [i, N]);
    const f = s.fighters[0];
    if (lightStart < 0 && f.action === "attack" && f.move === "light") lightStart = t;
  }
  check(lightStart === total, `buffered light starts on frame ${lightStart}, expected ${total}`);
}

function checkCharge(): void {
  console.log("charge");
  for (const c of CHAR_IDS) {
    const s = versus(c, "grimvald");
    const t2 = VARIANTS[c].heavy[0].cf + 60;
    place(s, 70);
    const lv: number[] = [];
    let hitDmg = 0;
    let launch = false;
    let level2Tick = -1;
    let activeTick = -1;
    for (let t = 0; t < 200; t++) {
      // hold heavy until full charge, then release
      const holding = level2Tick < 0 && t < t2 + 60;
      stepFight(s, [holding ? inp("heavy") : N, N]);
      for (const e of s.events) {
        if (e.type === "charge") {
          lv.push(e.level);
          if (e.level === 2) level2Tick = t;
        }
        if (e.type === "whoosh" && activeTick < 0) activeTick = t;
        if (e.type === "hit" && hitDmg === 0) {
          hitDmg = e.damage;
          launch = e.launch;
        }
      }
      // walk the target into range so the lunge connects
      if (s.fighters[0].action === "attack" && s.fighters[0].phase === "charge") {
        s.fighters[1].x = s.fighters[0].x + 50;
      }
    }
    const v2 = VARIANTS[c].heavy[2];
    check(lv.length === 2 && lv[0] === 1 && lv[1] === 2, `${c}: charge events ${JSON.stringify(lv)}`);
    check(activeTick - level2Tick >= 1, `${c}: release after full charge`);
    check(hitDmg === v2.dmg, `${c}: full charge heavy deals ${hitDmg}, expected ${v2.dmg}`);
    check(launch, `${c}: full charge launches`);
    // full charge must be slow enough to react to (>= 28 frames press -> active)
    check(activeTick >= 28, `${c}: full charge too fast (${activeTick})`);
  }
}

function checkBlockChipGuardBreak(): void {
  console.log("block / chip / guard break / parry");
  for (const c of CHAR_IDS) {
    // medium blocked: no damage, blockstun, pushback
    let s = versus(c, "asagiri");
    place(s, minGap(c, "asagiri") + 4);
    const x1 = s.fighters[1].x;
    const hp1 = s.fighters[1].hp;
    let evs = run(s, 50, tapAt("medium", 0), () => inp("block"));
    check(evs.some((e) => e.type === "block"), `${c}: medium is blocked`);
    check(s.fighters[1].hp === hp1, `${c}: blocked medium deals no damage`);
    check(Math.abs(s.fighters[1].x - x1) > 3 || Math.abs(s.fighters[0].x - (300 - (minGap(c, "asagiri") + 4) / 2)) > 3, `${c}: block pushback`);
    check(!evs.some((e) => e.type === "hit"), `${c}: no hit through block`);

    // heavy blocked: chip, never KO from chip
    s = versus(c, "asagiri");
    place(s, minGap(c, "asagiri") + 20);
    s.fighters[1].hp = 3;
    evs = run(s, 60, tapAt("heavy", 0), () => inp("block"));
    const blk = evs.find((e) => e.type === "block");
    check(blk !== undefined && blk.type === "block" && blk.chip >= 0, `${c}: heavy blocked`);
    check(s.fighters[1].hp >= 1, `${c}: chip cannot KO`);

    // full charge breaks the guard and leaves the defender open for a punish
    s = versus(c, "asagiri");
    place(s, 60);
    let gbTick = -1;
    let punished = false;
    let charging = true;
    let pressedAt = -1;
    for (let t = 0; t < 260; t++) {
      const f0 = s.fighters[0];
      if (charging && f0.chargeLevel === 2) charging = false;
      let p0 = charging ? inp("heavy") : N;
      // punish with a light as soon as the attacker is free again
      if (gbTick >= 0 && pressedAt < 0 && f0.action === "idle") {
        p0 = inp("light");
        pressedAt = t;
      }
      stepFight(s, [p0, inp("block")]);
      if (charging && f0.action === "attack" && f0.phase === "charge") s.fighters[1].x = f0.x + f0.facing * 50;
      for (const e of s.events) {
        if (e.type === "guardBreak") gbTick = t;
        if (e.type === "hit" && gbTick >= 0) punished = true;
      }
    }
    check(gbTick >= 0, `${c}: full charge breaks guard`);
    check(punished, `${c}: guard break leaves the defender open`);

    // parry: pressing block just before the hit
    s = versus(c, "asagiri");
    place(s, minGap(c, "asagiri") + 4);
    const sm = VARIANTS[c].medium[0].s;
    evs = run(s, 40, tapAt("medium", 0), (t) => (t >= sm - 2 ? inp("block") : N));
    check(evs.some((e) => e.type === "parry"), `${c}: last-moment block parries`);
    check(s.fighters[0].action === "stagger" || evs.some((e) => e.type === "parry"), `${c}: parried attacker staggers`);
  }
  // guard meter: blocking forever eventually breaks
  const s = versus("grimvald", "yoikaze");
  place(s, minGap("grimvald", "yoikaze") + 6);
  const evs = run(
    s,
    1500,
    (t) => {
      const f = s.fighters[0];
      if (Math.abs(f.x - s.fighters[1].x) > 40) return inp(f.facing === 1 ? "right" : "left");
      return t % 30 === 0 ? inp("medium") : N;
    },
    () => inp("block"),
  );
  check(evs.some((e) => e.type === "guardBreak"), "guard meter eventually breaks under constant pressure");
}

function checkDodge(): void {
  console.log("dodge");
  for (const c of CHAR_IDS) {
    // attacker medium timed so its active frames overlap the defender's invulnerable frames
    const s = versus("asagiri", c);
    place(s, minGap("asagiri", c) + 2);
    const sm = VARIANTS.asagiri.medium[0].s;
    let evs = run(s, 40, tapAt("medium", 0), tapAt("dodge", sm - 3));
    check(evs.some((e) => e.type === "dodge"), `${c}: dodge starts`);
    check(!evs.some((e) => e.type === "hit" || e.type === "block"), `${c}: invulnerable dodge avoids the medium`);
    // the dodge cannot be repeated immediately
    const s2 = versus(c, "asagiri");
    place(s2, 120);
    evs = run(s2, 40, (t) => (t % 2 === 0 ? inp("dodge") : N));
    check(evs.filter((e) => e.type === "dodge").length === 1, `${c}: dodge has a cooldown`);
    // the recovery is punishable by a lunging heavy (bazalt) after the invulnerability
    const s3 = versus("bazalt", c);
    place(s3, minGap("bazalt", c) + 6);
    let hit = false;
    for (let t = 0; t < 60; t++) {
      const d = s3.fighters[1];
      const p0 = d.action === "dodge" && d.actionFrame === G.DODGE_INVULN - 1 ? inp("medium") : N;
      stepFight(s3, [p0, t === 0 ? inp("dodge") : N]);
      for (const e of s3.events) if (e.type === "hit") hit = true;
      if (d.action === "dodge" && d.actionFrame > G.DODGE_TRAVEL) s3.fighters[0].x = d.x - d.facing * -1 * (minGap("bazalt", c) + 8);
    }
    check(hit, `${c}: dodge recovery is punishable`);
  }
}

function comboFor(c: CharId, seq: Strength[]): { dmg: number; hits: number; combo: number } {
  const s = versus(c, "yoikaze");
  place(s, minGap(c, "yoikaze") + 2);
  s.fighters[1].hp = 5000;
  s.fighters[1].maxHp = 5000;
  let idx = 0;
  let dmg = 0;
  let hits = 0;
  let combo = 0;
  let pressNext = 0;
  for (let t = 0; t < 240; t++) {
    let p0 = N;
    if (t === 0) {
      p0 = inp(seq[0] ?? "light");
      idx = 1;
    } else if (pressNext > 0 && t === pressNext && idx < seq.length) {
      p0 = inp(seq[idx] ?? "light");
      idx++;
      pressNext = 0;
    }
    stepFight(s, [p0, N]);
    for (const e of s.events) {
      if (e.type === "hit" && e.attacker === 0) {
        dmg += e.damage;
        hits++;
        combo = Math.max(combo, e.combo);
        pressNext = t + 2;
      }
    }
  }
  return { dmg, hits, combo };
}

function checkCombos(): void {
  console.log("chains / scaling / no infinites");
  const minHp = Math.min(...CHAR_IDS.map((c) => CHARS[c].hp));
  for (const c of CHAR_IDS) {
    const lmh = comboFor(c, ["light", "medium", "heavy"]);
    check(lmh.hits === 3 && lmh.combo === 3, `${c}: L>M>H connects (${lmh.hits} hits)`);
    const v = VARIANTS[c];
    const exp = v.light[0].dmg + Math.round(v.medium[0].dmg * (G.SCALING[1] ?? 1)) + Math.round(v.heavy[0].dmg * (G.SCALING[2] ?? 1));
    check(lmh.dmg === exp, `${c}: L>M>H damage ${lmh.dmg}, expected ${exp} (scaled)`);
    const llmh = comboFor(c, ["light", "light", "medium", "heavy"]);
    check(llmh.hits === 4, `${c}: L>L>M>H connects (${llmh.hits})`);
    check(llmh.dmg <= minHp * 0.36, `${c}: L>L>M>H ${llmh.dmg} exceeds 36% of ${minHp}`);
    // heavy cannot be cancelled; three lights do not chain (only two)
    const lll = comboFor(c, ["light", "light", "light", "light", "light"]);
    check(lll.combo <= 2, `${c}: light mash combo ${lll.combo} (max 2)`);
    const hm = comboFor(c, ["heavy", "medium"]);
    check(hm.hits <= 1, `${c}: heavy does not cancel`);
  }
  // mashing every button can never loop forever
  for (const c of CHAR_IDS) {
    const s = versus(c, "asagiri");
    place(s, minGap(c, "asagiri") + 2);
    s.fighters[1].hp = 99999;
    s.fighters[1].maxHp = 99999;
    let maxCombo = 0;
    const order: Btn[] = ["light", "medium", "heavy"];
    for (let t = 0; t < 1200; t++) {
      const b = order[t % 3] ?? "light";
      stepFight(s, [t % 2 === 0 ? inp(b) : N, N]);
      for (const e of s.events) if (e.type === "hit") maxCombo = Math.max(maxCombo, e.combo);
    }
    check(maxCombo <= 5, `${c}: mashing reaches a ${maxCombo}-hit combo (max 5)`);
  }
}

function checkKnockdown(): void {
  console.log("knockdown / wake-up");
  const s = versus("asagiri", "bazalt");
  place(s, 60);
  let kd = -1;
  let getup = -1;
  let idle = -1;
  let hitWhileDown = false;
  for (let t = 0; t < 200; t++) {
    const d = s.fighters[1];
    // try to hit the fighter on the floor
    const p0 = t === 0 ? inp("heavy") : kd >= 0 && t % 2 === 0 ? inp("light") : N;
    if (kd >= 0 && (d.action === "down" || d.action === "getup")) s.fighters[0].x = d.x - minGap("asagiri", "bazalt") - 2;
    stepFight(s, [p0, N]);
    for (const e of s.events) {
      if (e.type === "knockdown") kd = t;
      if (e.type === "hit" && kd >= 0 && (d.action === "down" || d.action === "getup")) hitWhileDown = true;
    }
    if (d.action === "getup" && getup < 0) getup = t;
    if (getup >= 0 && idle < 0 && d.action !== "getup") idle = t;
  }
  check(kd > 0, "heavy knocks down");
  check(getup - kd >= G.KD_DOWN - 1, `down lasts ${getup - kd}`);
  check(idle - getup >= G.KD_GETUP - 1, `getup lasts ${idle - getup}`);
  check(!hitWhileDown, "no hits on a downed / rising fighter");
}

function checkCornerAndPush(): void {
  console.log("pushboxes / corner");
  const s = versus("grimvald", "yoikaze");
  let overlap = false;
  let outside = false;
  for (let t = 0; t < 800; t++) {
    const p0 = t < 400 ? inp("right") : t % 20 === 0 ? inp("medium") : inp("right");
    stepFight(s, [p0, t < 400 ? inp("right") : inp("block")]);
    const [a, b] = s.fighters;
    if (a.y <= 0 && b.y <= 0 && Math.abs(a.x - b.x) < minGap(a.char, b.char) - 0.5) overlap = true;
    for (const f of s.fighters) if (f.x < STAGE_MARGIN || f.x > STAGE_W - STAGE_MARGIN) outside = true;
  }
  check(!overlap, "grounded pushboxes never overlap");
  check(!outside, "fighters stay inside the stage");
  check(s.fighters[1].x >= STAGE_W - STAGE_MARGIN - 0.01, "defender pinned in the corner");
  const boxes = getDebugBoxes(s, 0);
  check(boxes.hurt.w > 0 && boxes.push.w > 0, "debug boxes");
}

function checkFinisher(): void {
  console.log("finisher");
  for (const c of CHAR_IDS) {
    const s = versus(c, "oriel", 1);
    place(s, minGap(c, "oriel") + 4);
    s.fighters[1].hp = 1;
    let start = -1;
    const hits: { pf: number; final: boolean; index: number }[] = [];
    let matchEnd = -1;
    let koEvent = false;
    let synced = true;
    let loserKoAfterFinal = false;
    let matchEnds = 0;
    for (let t = 0; t < 500; t++) {
      stepFight(s, [t === 0 ? inp("medium") : N, N]);
      for (const e of s.events) {
        if (e.type === "finisherStart") {
          start = t;
          check(e.winner === 0 && e.char === c, `${c}: finisherStart payload`);
        }
        if (e.type === "finisherHit") {
          hits.push({ pf: t - start, final: e.final, index: e.index });
          check(s.phaseFrame === t - start, `${c}: phaseFrame matches the finisher timeline`);
        }
        if (e.type === "matchEnd") {
          matchEnd = t - start;
          matchEnds++;
        }
        if (e.type === "ko") koEvent = true;
      }
      if (s.phase === "finisher") {
        const w = s.fighters[0];
        if (w.action === "finisher" && w.actionFrame !== s.phaseFrame) synced = false;
        if (s.phaseFrame >= FINISHER.windup && w.action !== "finisher") synced = false;
        if (hits.some((h) => h.final) && s.fighters[1].action === "ko") loserKoAfterFinal = true;
      }
    }
    check(start >= 0, `${c}: finisher starts on the match-winning blow`);
    check(!koEvent, `${c}: no regular KO event on a finisher`);
    const expected = [...FINISHER.hits, FINISHER.final];
    check(hits.length === expected.length && hits.every((h, i) => h.pf === expected[i] && h.index === i), `${c}: finisher hits at ${JSON.stringify(hits.map((h) => h.pf))}`);
    check(hits.length > 0 && hits[hits.length - 1]?.final === true && hits.filter((h) => h.final).length === 1, `${c}: one final finisher hit`);
    check(matchEnd === FINISHER.total, `${c}: matchEnd at ${matchEnd}, expected ${FINISHER.total}`);
    check(matchEnds === 1, `${c}: one matchEnd`);
    check(synced, `${c}: winner in "finisher" action synced to the phase by the wind-up`);
    check(loserKoAfterFinal, `${c}: loser is thrown after the final blow`);
    check(s.phase === "matchEnd" && s.fighters[0].action === "win" && s.matchWinner === 0, `${c}: match ends with the winner posing`);
  }
}

function checkRoundFlow(): void {
  console.log("round flow / time up / double KO");
  // nobody moves: every round is a time-up draw; after MAX rounds player 0 wins
  let s = createFight({ chars: ["asagiri", "asagiri"], map: "frost", mode: "versus", aiLevel: "easy", seed: 1, roundsToWin: 2 });
  const evs = run(s, 60 * 60 * 7, () => N);
  const timeUps = evs.filter((e) => e.type === "timeUp");
  check(timeUps.length === 5 && timeUps.every((e) => e.type === "timeUp" && e.winner === "draw"), `5 time-up draws (${timeUps.length})`);
  check(s.phase === "matchEnd" && s.matchWinner === 0, "after 5 draws player 0 wins");
  check(evs.filter((e) => e.type === "roundIntro").length === 5, "five round intros");
  const finals = evs.filter((e) => e.type === "roundIntro" && e.final);
  check(finals.length >= 1, "final round announced");
  // time up with an HP lead
  s = versus("asagiri", "maelis");
  s.fighters[1].hp = 500;
  const evs2 = run(s, 60 * 61, () => N);
  const tu = evs2.find((e) => e.type === "timeUp");
  check(tu !== undefined && tu.type === "timeUp" && tu.winner === 0, "time up: higher HP% wins");
  check(s.wins[0] === 1, "time-up win counts");
  // double KO: identical lights on the same frame at 1 HP
  s = versus("yoikaze", "yoikaze");
  place(s, minGap("yoikaze", "yoikaze") + 4);
  s.fighters[0].hp = 1;
  s.fighters[1].hp = 1;
  const evs3 = run(s, 400, tapAt("light", 0), tapAt("light", 0));
  const ko = evs3.find((e) => e.type === "ko");
  check(ko !== undefined && ko.type === "ko" && ko.winner === "draw", "double KO is a draw");
  check(s.wins[0] === 0 && s.wins[1] === 0 && s.round === 2, "draw round replays without a point");
  // regular KO (not match-winning) goes through slow motion and the next round
  s = versus("bazalt", "asagiri");
  place(s, 60);
  s.fighters[1].hp = 1;
  const evs4 = run(s, 600, tapAt("heavy", 0));
  check(evs4.some((e) => e.type === "ko" && e.winner === 0), "KO event");
  check(evs4.some((e) => e.type === "roundEnd" && e.winner === 0), "roundEnd event");
  check(s.round === 2 && s.wins[0] === 1, "next round after a KO");
}

function checkTutorial(): void {
  console.log("tutorial");
  for (const c of CHAR_IDS) {
    const s = createFight({ chars: [c, "asagiri"], map: "quay", mode: "tutorial", aiLevel: "easy", seed: 3, roundsToWin: 2 });
    const tut = createTutorial();
    let t = 0;
    let comboStep = 0;
    let lastHitTick = -100;
    let minHp = Infinity;
    for (; t < 60 * 60 * 3 && tut.stepIndex() < tut.steps.length; t++) {
      const id = tut.steps[tut.stepIndex()];
      const me = s.fighters[0];
      const du = s.fighters[1];
      const d = Math.abs(du.x - me.x);
      const toward: Btn = du.x > me.x ? "right" : "left";
      const away: Btn = du.x > me.x ? "left" : "right";
      let p0 = N;
      switch (id) {
        case "move":
          p0 = inp(Math.floor(t / 50) % 2 === 0 ? "left" : "right");
          break;
        case "jump":
          p0 = t % 50 < 2 ? inp("up") : N;
          break;
        case "light":
        case "medium":
        case "heavy":
        case "free":
        {
          const str: Strength = id === "free" ? "light" : id;
          const v = VARIANTS[c][str][0];
          const far = v.hit.x + v.hit.w + v.lunge + CHARS[du.char].hurtHalfW - 6;
          const near = v.hit.x - CHARS[du.char].hurtHalfW + 4;
          if (d > far) p0 = inp(toward);
          else if (d < near) p0 = inp(away);
          else p0 = t % 45 === 0 ? inp(str) : N;
        }
          break;
        case "charge":
          if (d > 60 && me.action !== "attack") p0 = inp(toward);
          else p0 = me.action === "attack" && me.chargeLevel >= 1 ? N : t % 90 < 60 ? inp("heavy") : N;
          break;
        case "block":
          p0 = inp("block");
          break;
        case "dodge":
          p0 = du.action === "attack" && du.phase !== "recovery" ? inp("dodge") : d > 70 ? inp(toward) : N;
          break;
        case "combo": {
          if (d > 30 && comboStep === 0) p0 = inp(toward);
          else if (comboStep === 0 && me.action !== "attack" && t % 40 === 0) {
            p0 = inp("light");
            comboStep = 1;
          } else if (comboStep > 0 && t === lastHitTick + 2) {
            p0 = inp(comboStep === 1 ? "medium" : "heavy");
            comboStep++;
            if (comboStep > 2) comboStep = 0;
          } else if (me.action !== "attack" && t > lastHitTick + 30) comboStep = 0;
          break;
        }
        case undefined:
          break;
      }
      stepFight(s, [p0, tut.dummyInput(s)]);
      for (const e of s.events) if (e.type === "hit" && e.attacker === 0) lastHitTick = t;
      tut.update(s);
      minHp = Math.min(minHp, s.fighters[0].hp, s.fighters[1].hp);
      if (s.phase !== "fight" && s.phase !== "intro") break;
    }
    check(tut.stepIndex() === tut.steps.length, `${c}: tutorial completes (stuck at ${tut.steps[tut.stepIndex()] ?? "done"} after ${t} ticks)`);
    check(tut.progress() === 1, `${c}: tutorial progress 1 at the end`);
    check(minHp >= 1 && s.phase === "fight", `${c}: nobody is knocked out in the tutorial`);
    check(s.timer === 60 * 60, `${c}: tutorial has no timer`);
  }
}

// ------------------------------------------------------------------------------------------
interface MatchResult {
  winner: PlayerIndex;
  ticks: number;
  rounds: number;
  timeUps: number;
  counts: Record<string, number>;
}

function invariants(s: FightState, label: string, errs: string[]): void {
  for (const f of s.fighters) {
    const nums = [f.x, f.y, f.vx, f.vy, f.hp, f.actionFrame, f.phaseFrame, f.stun, f.invuln, f.combo];
    if (nums.some((n) => !Number.isFinite(n))) errs.push(`${label}: non-finite value in fighter ${f.index}`);
    if (f.x < STAGE_MARGIN - 0.001 || f.x > STAGE_W - STAGE_MARGIN + 0.001) errs.push(`${label}: fighter ${f.index} outside the stage (${f.x})`);
    if (f.hp < 0 || f.hp > f.maxHp) errs.push(`${label}: hp out of range ${f.hp}`);
    if (f.y < 0) errs.push(`${label}: below the floor`);
  }
  if (Math.abs(s.fighters[0].x - s.fighters[1].x) > G.MAX_SEP + 0.5) errs.push(`${label}: fighters too far apart`);
  if (s.timer < 0) errs.push(`${label}: timer negative`);
  for (const e of s.events) {
    if (e.type === "hit") {
      if (!(e.damage > 0) || !Number.isFinite(e.x) || !Number.isFinite(e.y)) errs.push(`${label}: bad hit event`);
      if (e.combo < 1) errs.push(`${label}: hit with combo ${e.combo}`);
    }
    if ((e.type === "hit" || e.type === "block" || e.type === "parry" || e.type === "guardBreak") && s.phase !== "fight" && s.phase !== "ko") {
      errs.push(`${label}: ${e.type} outside fight (${s.phase})`);
    }
  }
}

function aiMatch(a: CharId, b: CharId, la: AiLevel, lb: AiLevel, seed: number, errs: string[]): MatchResult {
  const s = createFight({ chars: [a, b], map: seed % 2 ? "quay" : "frost", mode: "ai", aiLevel: lb, seed, roundsToWin: 2 });
  const A = createAi(la, seed * 31 + 1);
  const B = createAi(lb, seed * 17 + 5);
  const counts: Record<string, number> = {};
  let timeUps = 0;
  let matchEnds = 0;
  let ticks = 0;
  const label = `${a}(${la}) vs ${b}(${lb}) #${seed}`;
  const LIMIT = 60 * 60 * 8;
  for (; ticks < LIMIT && s.phase !== "matchEnd"; ticks++) {
    const ia = A.next(s, 0);
    const ib = B.next(s, 1);
    stepFight(s, [ia, ib]);
    for (const e of s.events) {
      counts[e.type] = (counts[e.type] ?? 0) + 1;
      if (e.type === "timeUp") timeUps++;
      if (e.type === "matchEnd") matchEnds++;
      if (e.type === "hit" && e.charge > 0) counts["chargedHit"] = (counts["chargedHit"] ?? 0) + 1;
    }
    invariants(s, label, errs);
    if (errs.length > 20) break;
  }
  if (s.phase !== "matchEnd") errs.push(`${label}: match did not end in ${LIMIT} ticks (phase ${s.phase}, round ${s.round})`);
  if (s.phase === "matchEnd" && matchEnds !== 1) errs.push(`${label}: ${matchEnds} matchEnd events`);
  // a few extra ticks after the end must stay quiet and stable
  for (let k = 0; k < 120; k++) {
    stepFight(s, [A.next(s, 0), B.next(s, 1)]);
    invariants(s, label + " (after end)", errs);
    if (s.events.some((e) => e.type === "matchEnd" || e.type === "roundIntro")) errs.push(`${label}: events after matchEnd`);
  }
  return { winner: s.matchWinner ?? 0, ticks, rounds: s.round, timeUps, counts };
}

function checkAi(): void {
  const levels: AiLevel[] = ["easy", "normal", "hard"];
  const SEEDS = 10;
  const errs: string[] = [];
  for (const lvl of levels) {
    console.log(`AI vs AI (${lvl}, ${CHAR_IDS.length * CHAR_IDS.length * SEEDS} matches)`);
    const wins: Record<string, number> = {};
    const played: Record<string, number> = {};
    const totals: Record<string, number> = {};
    let ticks = 0;
    let rounds = 0;
    let timeUps = 0;
    let n = 0;
    for (const a of CHAR_IDS) {
      for (const b of CHAR_IDS) {
        for (let sd = 1; sd <= SEEDS; sd++) {
          const r = aiMatch(a, b, lvl, lvl, sd * 101 + n, errs);
          n++;
          ticks += r.ticks;
          rounds += r.rounds;
          timeUps += r.timeUps;
          for (const k of Object.keys(r.counts)) totals[k] = (totals[k] ?? 0) + (r.counts[k] ?? 0);
          if (a !== b) {
            const w = r.winner === 0 ? a : b;
            wins[w] = (wins[w] ?? 0) + 1;
            played[a] = (played[a] ?? 0) + 1;
            played[b] = (played[b] ?? 0) + 1;
          }
        }
      }
    }
    const row = CHAR_IDS.map((c) => `${c} ${(((wins[c] ?? 0) / (played[c] ?? 1)) * 100).toFixed(0)}%`).join("  ");
    console.log(`  win rate: ${row}`);
    console.log(
      `  avg match ${(ticks / n / 60).toFixed(1)} s, ${(rounds / n).toFixed(2)} rounds, time-ups ${((timeUps / rounds) * 100).toFixed(0)}% of rounds`,
    );
    const per = (k: string): string => ((totals[k] ?? 0) / n).toFixed(1);
    console.log(
      `  per match: hits ${per("hit")} blocks ${per("block")} parries ${per("parry")} guardBreaks ${per("guardBreak")} dodges ${per("dodge")} charges ${per("charge")} chargedHits ${per("chargedHit")} jumps ${per("jump")} knockdowns ${per("knockdown")}`,
    );
    for (const c of CHAR_IDS) {
      const wr = (wins[c] ?? 0) / (played[c] ?? 1);
      // easy plays deliberately badly (few blocks, sloppy pokes), so raw reach weighs more there
      const lo = lvl === "easy" ? 0.2 : 0.3;
      const hi = lvl === "easy" ? 0.8 : 0.7;
      check(wr >= lo && wr <= hi, `${lvl}: ${c} win rate ${(wr * 100).toFixed(0)}% outside ${lo * 100}..${hi * 100}%`);
    }
    check(timeUps / rounds < 0.5, `${lvl}: too many time-ups (${((timeUps / rounds) * 100).toFixed(0)}%)`);
  }
  // difficulty ordering
  for (const [hi, lo, min] of [["hard", "easy", 0.8], ["normal", "easy", 0.65], ["hard", "normal", 0.55]] as [AiLevel, AiLevel, number][]) {
    let w = 0;
    let n = 0;
    for (const a of CHAR_IDS) {
      for (const b of CHAR_IDS) {
        const r = aiMatch(a, b, hi, lo, 900 + n, errs);
        if (r.winner === 0) w++;
        n++;
      }
    }
    console.log(`  ${hi} beats ${lo}: ${((w / n) * 100).toFixed(0)}%`);
    check(w / n >= min, `${hi} beats ${lo} only ${((w / n) * 100).toFixed(0)}% (min ${min * 100}%)`);
  }
  for (const e of errs.slice(0, 20)) check(false, e);
  check(errs.length === 0, `${errs.length} invariant errors`);
}

function checkDeterminism(): void {
  console.log("determinism");
  const errs: string[] = [];
  const r1 = aiMatch("maelis", "bazalt", "hard", "normal", 42, errs);
  const r2 = aiMatch("maelis", "bazalt", "hard", "normal", 42, errs);
  check(r1.ticks === r2.ticks && r1.winner === r2.winner && JSON.stringify(r1.counts) === JSON.stringify(r2.counts), "same seed, same match");
}

function checkClone(): void {
  console.log("clone / hash (online rollback)");
  const errs: string[] = [];
  const s = createFight({ chars: ["yoikaze", "grimvald"], map: "quay", mode: "versus", aiLevel: "hard", seed: 11, roundsToWin: 2 });
  const a0 = createAi("hard", 101);
  const a1 = createAi("hard", 202);
  const script: [InputFrame, InputFrame][] = [];
  // record a whole AI match, cloning at several points
  const clones: { at: number; c: FightState }[] = [];
  const marks = new Set([150, 333, 700, 1200, 2000, 3500]);
  let guard = 0;
  while (s.phase !== "matchEnd" && guard++ < 60 * 400) {
    const pair: [InputFrame, InputFrame] = [{ ...a0.next(s, 0) }, { ...a1.next(s, 1) }];
    if (marks.has(script.length)) clones.push({ at: script.length, c: cloneFight(s) });
    script.push(pair);
    stepFight(s, pair);
  }
  check(clones.length >= 3, `cloned mid-match ${clones.length} times`);
  check(s.phase === "matchEnd", "recorded match ended");
  const strip = (x: FightState): string => JSON.stringify(x);
  for (const { at, c } of clones) {
    // replay from scratch up to the clone point, then step both with the same inputs
    const o = createFight(s.config);
    for (let t = 0; t < at; t++) stepFight(o, script[t] ?? [N, N]);
    check(strip(o) === strip(c) && hashFight(o) === hashFight(c), `clone at ${at} equals a replay`);
    let same = true;
    let sameEvents = true;
    for (let t = at; t < script.length; t++) {
      const pair = script[t] ?? [N, N];
      stepFight(o, pair);
      const eo = JSON.stringify(o.events);
      stepFight(c, pair);
      if (eo !== JSON.stringify(c.events)) sameEvents = false;
      if ((t - at) % 50 === 0 && (strip(o) !== strip(c) || hashFight(o) !== hashFight(c))) same = false;
    }
    check(same && sameEvents, `clone at ${at}: stepping clone and original stays identical (${script.length - at} ticks)`);
    check(strip(c) === strip(s) && hashFight(c) === hashFight(s), `clone at ${at}: same final state as the recorded match`);
  }
  // stepping a clone never touches the original, and private data is part of the hash
  const base = versus("asagiri", "bazalt");
  const before = JSON.stringify(base);
  const h0 = hashFight(base);
  const fork = cloneFight(base);
  run(fork, 120, tapAt("heavy", 0, 40), tapAt("light", 10));
  check(JSON.stringify(base) === before && hashFight(base) === h0, "stepping a clone leaves the original untouched");
  check(hashFight(fork) !== h0, "hash changes when the state changes");
  const g1 = cloneFight(base);
  const g2 = cloneFight(base);
  stepFight(g1, [inp("light"), N]);
  stepFight(g2, [N, N]);
  stepFight(g1, [N, N]);
  stepFight(g2, [N, N]);
  check(hashFight(g1) !== hashFight(g2), "hash covers private data (buffered press)");
  check(fork.config === base.config, "clone shares the immutable config");
  for (const e of errs) check(false, e);
}

function rulesFight(rules: Partial<NonNullable<FightState["config"]["rules"]>>, roundsToWin = 2, a: CharId = "asagiri", b: CharId = "asagiri"): FightState {
  const s = createFight({
    chars: [a, b],
    map: "quay",
    mode: "versus",
    aiLevel: "normal",
    seed: 3,
    roundsToWin,
    rules: { hpMul: [1, 1], dmgMul: [1, 1], roundSeconds: 60, finisher: true, ...rules },
  });
  let guard = 0;
  while (s.phase !== "fight" && guard++ < 400) stepFight(s, [N, N]);
  return s;
}

function firstHit(s: FightState, btn: Btn, blockP1 = false): { dmg: number; chip: number } {
  place(s, minGap(s.fighters[0].char, s.fighters[1].char) + 4);
  const evs = run(s, 90, tapAt(btn, 0), () => (blockP1 ? inp("block") : N));
  let dmg = 0;
  let chip = 0;
  for (const e of evs) {
    if (e.type === "hit" && e.attacker === 0 && dmg === 0) dmg = e.damage;
    if (e.type === "block" && chip === 0) chip = e.chip;
  }
  return { dmg, chip };
}

function checkRules(): void {
  console.log("room rules (multipliers / time / finisher)");
  // defaults: explicit standard rules behave exactly like no rules
  const plain = versus("maelis", "bazalt");
  const std = rulesFight({}, 2, "maelis", "bazalt");
  const script = (t: number): InputFrame => (t % 37 < 3 ? inp("medium") : t % 53 < 20 ? inp("right") : N);
  run(plain, 900, script, tapAt("heavy", 30, 30));
  run(std, 900, script, tapAt("heavy", 30, 30));
  const noCfg = (x: FightState): string => JSON.stringify({ ...x, config: null });
  check(noCfg(plain) === noCfg(std), "standard rules = no rules");
  // health multipliers
  const baseHp = versus("asagiri", "grimvald").fighters.map((f) => f.maxHp);
  const hp = rulesFight({ hpMul: [0.5, 3] }, 2, "asagiri", "grimvald");
  check(hp.fighters[0].maxHp === Math.round((baseHp[0] ?? 0) * 0.5) && hp.fighters[0].hp === hp.fighters[0].maxHp, "hp x0.5 for player 0");
  check(hp.fighters[1].maxHp === (baseHp[1] ?? 0) * 3 && hp.fighters[1].hp === hp.fighters[1].maxHp, "hp x3 for player 1");
  // ... and they are re-applied at the start of every round
  hp.fighters[1].hp = 1;
  place(hp, minGap("asagiri", "grimvald") + 4);
  run(hp, 700, tapAt("medium", 0));
  check(hp.round === 2 && hp.fighters[1].hp === (baseHp[1] ?? 0) * 3 && hp.fighters[0].maxHp === Math.round((baseHp[0] ?? 0) * 0.5), "hp multipliers re-applied next round");
  // damage multipliers (hit and chip), per attacker
  const d1 = firstHit(rulesFight({}), "medium");
  for (const m of [0.5, 2, 3]) {
    const dm = firstHit(rulesFight({ dmgMul: [m, 1] }), "medium");
    check(d1.dmg > 0 && dm.dmg === Math.max(1, Math.round(d1.dmg * m)), `damage x${m}: ${dm.dmg} vs base ${d1.dmg}`);
  }
  const other = firstHit(rulesFight({ dmgMul: [1, 3] }), "medium");
  check(other.dmg === d1.dmg, "the rival's damage multiplier does not change my damage");
  const c1 = firstHit(rulesFight({}), "heavy", true);
  const c2 = firstHit(rulesFight({ dmgMul: [2, 1] }), "heavy", true);
  check(c1.chip > 0 && c2.chip === Math.round(c1.chip * 2), `chip x2: ${c2.chip} vs base ${c1.chip}`);
  // round time: 30 s and infinite
  const short = rulesFight({ roundSeconds: 30 });
  check(short.timer === 30 * 60, "30 s round timer");
  const evShort = run(short, 30 * 60 + 5, () => N);
  check(evShort.some((e) => e.type === "timeUp"), "time up after 30 s");
  const inf = rulesFight({ roundSeconds: null });
  const evInf = run(inf, 60 * 60 * 4, () => N);
  check(!evInf.some((e) => e.type === "timeUp") && inf.phase === "fight" && inf.round === 1, "infinite time: no time-out after 4 minutes");
  inf.fighters[1].hp = 1;
  place(inf, minGap("asagiri", "asagiri") + 4);
  run(inf, 500, tapAt("medium", 0));
  check(inf.wins[0] === 1 && inf.round === 2 && inf.phase !== "matchEnd", "infinite time: KOs still end the round");
  // finisher off: regular KO on the match-winning round
  const nf = rulesFight({ finisher: false }, 1);
  place(nf, minGap("asagiri", "asagiri") + 4);
  nf.fighters[1].hp = 1;
  const evNf = run(nf, 700, tapAt("medium", 0));
  check(!evNf.some((e) => e.type === "finisherStart" || e.type === "finisherHit"), "finisher off: no finisher events");
  check(evNf.some((e) => e.type === "ko" && e.winner === 0 && e.final), "finisher off: final KO event");
  check(evNf.filter((e) => e.type === "matchEnd").length === 1 && nf.phase === "matchEnd" && nf.matchWinner === 0, "finisher off: match ends once, player 0 wins");
  check(nf.fighters[0].action === "win", "finisher off: winner poses");
  const fin = rulesFight({ finisher: true }, 1);
  place(fin, minGap("asagiri", "asagiri") + 4);
  fin.fighters[1].hp = 1;
  check(run(fin, 700, tapAt("medium", 0)).some((e) => e.type === "finisherStart"), "finisher on: finisher plays");
  // rounds to win 3
  const r3 = rulesFight({}, 3);
  for (let k = 0; k < 3; k++) {
    let guard = 0;
    while (r3.phase !== "fight" && guard++ < 1000) stepFight(r3, [N, N]);
    place(r3, minGap("asagiri", "asagiri") + 4);
    r3.fighters[1].hp = 1;
    run(r3, 300, tapAt("medium", 0));
    check(r3.wins[0] === k + 1 && (k < 2 ? r3.matchWinner === null : r3.matchWinner === 0), `rounds to win 3: after round ${k + 1}`);
  }
}

const only = process.argv[2];
const all: [string, () => void][] = [
  ["timing", checkFrameTiming],
  ["buffer", checkBufferAndRecovery],
  ["charge", checkCharge],
  ["block", checkBlockChipGuardBreak],
  ["dodge", checkDodge],
  ["combo", checkCombos],
  ["knockdown", checkKnockdown],
  ["corner", checkCornerAndPush],
  ["finisher", checkFinisher],
  ["rounds", checkRoundFlow],
  ["tutorial", checkTutorial],
  ["determinism", checkDeterminism],
  ["clone", checkClone],
  ["rules", checkRules],
  ["ai", checkAi],
];
for (const [name, fn] of all) if (!only || only === name) fn();
console.log(`\n${passes} checks passed, ${failures} failed`);
if (failures > 0) process.exitCode = 1;
