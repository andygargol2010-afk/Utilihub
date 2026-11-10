/**
 * Fightersland tutorial: tracks the player's progress through each lesson from the fight
 * events and drives the training dummy (player 1). The fight runs in mode "tutorial"
 * (no timer, HP regenerates, nobody is knocked out), so every step can always be finished.
 */
import type { FightState, InputFrame, TutorialController, TutorialStepId } from "../core/types";
import { neutralInput } from "../core/constants";
import { CHARS, VARIANTS } from "../sim/data";

const STEPS: readonly TutorialStepId[] = ["move", "jump", "light", "medium", "heavy", "charge", "block", "dodge", "combo", "free"];

/** Amount needed to clear each step. */
const GOAL: Record<TutorialStepId, number> = {
  move: 160, // px walked (either direction)
  jump: 2, // jumps
  light: 3, // light hits
  medium: 2,
  heavy: 2,
  charge: 2, // hits or guard breaks with a charged attack
  block: 3, // blocked (or parried) dummy attacks
  dodge: 2, // dodges performed while the dummy is attacking
  combo: 1, // one combo of 3+ hits
  free: 6, // any hits in free practice
};

/** Ticks between two dummy attacks in the block / dodge lessons. */
const DUMMY_PERIOD = 100;

export function createTutorial(): TutorialController {
  let step = 0;
  let count = 0;
  let lastX: number | null = null;
  let lastTick = -1;
  let lastAttackTick = -1000;
  let dummyPress = 0;
  const input: InputFrame = neutralInput();

  function current(): TutorialStepId | null {
    return STEPS[step] ?? null;
  }

  function advance(): void {
    step++;
    count = 0;
    lastAttackTick = -1000;
  }

  return {
    steps: STEPS,
    stepIndex(): number {
      return step;
    },
    progress(): number {
      const id = current();
      if (!id) return 1;
      return Math.max(0, Math.min(1, count / GOAL[id]));
    },
    update(state: FightState): void {
      const id = current();
      if (!id) return;
      const me = state.fighters[0];
      const dummy = state.fighters[1];
      if (state.tick <= lastTick) {
        // a new fight was started with the same controller
        lastX = null;
      }
      lastTick = state.tick;
      if (state.phase !== "fight") {
        lastX = me.x;
        return;
      }
      switch (id) {
        case "move":
          if (lastX !== null && (me.action === "walkF" || me.action === "walkB")) count += Math.abs(me.x - lastX);
          break;
        case "jump":
          for (const e of state.events) if (e.type === "jump" && e.player === 0) count++;
          break;
        case "light":
        case "medium":
        case "heavy":
          for (const e of state.events) if (e.type === "hit" && e.attacker === 0 && e.move === id) count++;
          break;
        case "charge":
          for (const e of state.events) {
            if (e.type === "hit" && e.attacker === 0 && e.charge > 0) count++;
            else if (e.type === "guardBreak" && e.defender === 1) count++;
          }
          break;
        case "block":
          for (const e of state.events) if ((e.type === "block" || e.type === "parry") && e.defender === 0) count++;
          break;
        case "dodge":
          for (const e of state.events) {
            if (e.type === "dodge" && e.player === 0 && (dummy.action === "attack" || state.tick - lastAttackTick < 40)) count++;
          }
          break;
        case "combo":
          for (const e of state.events) if (e.type === "hit" && e.attacker === 0 && e.combo >= 3) count++;
          break;
        case "free":
          for (const e of state.events) if (e.type === "hit" && e.attacker === 0) count++;
          break;
      }
      lastX = me.x;
      if (count >= GOAL[id]) advance();
    },
    dummyInput(state: FightState): InputFrame {
      input.left = input.right = input.up = input.light = input.medium = input.heavy = input.block = input.dodge = false;
      const id = current();
      if (state.phase !== "fight" || !id) return input;
      const me = state.fighters[0];
      const dummy = state.fighters[1];
      const dx = me.x - dummy.x;
      const d = Math.abs(dx);
      const toward = dx > 0 ? 1 : -1;
      const attacks = id === "block" || id === "dodge" || id === "free";
      if (!attacks) return input;
      if (dummyPress > 0) {
        dummyPress--;
        input.medium = true;
        return input;
      }
      const free = dummy.action === "idle" || dummy.action === "walkF" || dummy.action === "walkB";
      if (!free) return input;
      const m = VARIANTS[dummy.char].medium[0];
      const reach = m.hit.x + m.hit.w + m.lunge + CHARS[me.char].hurtHalfW - 4;
      const period = id === "free" ? DUMMY_PERIOD * 2 : DUMMY_PERIOD;
      if (d > reach) {
        // walk in slowly so the player is never out of reach for long
        if (state.tick % 3 !== 0) {
          if (toward > 0) input.right = true;
          else input.left = true;
        }
        return input;
      }
      if (state.tick - lastAttackTick >= period && me.action !== "down" && me.action !== "getup") {
        lastAttackTick = state.tick;
        // held a little: a slow, readable swing (a light charge, never a guard break)
        dummyPress = id === "free" ? 2 : 14;
        input.medium = true;
      }
      return input;
    },
  };
}
