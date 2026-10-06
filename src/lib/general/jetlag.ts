/** Pre-trip sleep shift. Positive shift: destination clock is ahead (eastbound). */

export type JetLagDirection = "east" | "west" | "none";

export type JetLagDay = {
  day: number;
  shiftHours: number;
  bedtimeLabel: string;
  note: "baseline" | "partial" | "caught-up";
};

export type JetLagPlan = {
  ok: boolean;
  error?: "nan" | "range" | "negative-days" | "step";
  shiftHours: number;
  direction: JetLagDirection;
  days: JetLagDay[];
  remainingHours: number;
  targetBedtime: string;
};

function foldShift(hours: number): number {
  let value = hours;
  while (value > 12) value -= 24;
  while (value <= -12) value += 24;
  return value;
}

export function formatClock(totalMinutes: number): string {
  const rounded = Math.round(totalMinutes);
  const wrapped = ((rounded % 1440) + 1440) % 1440;
  const hours = Math.floor(wrapped / 60);
  const minutes = wrapped % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function parseClock(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function planJetLag(input: {
  originOffset: number;
  destOffset: number;
  bedtimeMinutes: number;
  daysBefore: number;
  eastHoursPerDay: number;
  westHoursPerDay: number;
}): JetLagPlan {
  const fail = (error: NonNullable<JetLagPlan["error"]>): JetLagPlan => ({
    ok: false,
    error,
    shiftHours: 0,
    direction: "none",
    days: [],
    remainingHours: 0,
    targetBedtime: "",
  });
  const nums = [
    input.originOffset,
    input.destOffset,
    input.bedtimeMinutes,
    input.daysBefore,
    input.eastHoursPerDay,
    input.westHoursPerDay,
  ];
  if (nums.some((n) => Number.isNaN(n) || !Number.isFinite(n))) return fail("nan");
  if (input.originOffset < -12 || input.originOffset > 14 || input.destOffset < -12 || input.destOffset > 14) return fail("range");
  if (input.daysBefore < 0) return fail("negative-days");
  if (input.bedtimeMinutes < 0 || input.bedtimeMinutes >= 1440) return fail("range");
  if (input.eastHoursPerDay < 0 || input.westHoursPerDay < 0 || input.eastHoursPerDay > 4 || input.westHoursPerDay > 4) return fail("range");
  const shift = foldShift(input.destOffset - input.originOffset);
  const direction: JetLagDirection = shift > 0 ? "east" : shift < 0 ? "west" : "none";
  const step = direction === "east" ? input.eastHoursPerDay : direction === "west" ? input.westHoursPerDay : 0;
  if (direction !== "none" && !(step > 0)) return fail("step");
  const magnitude = Math.abs(shift);
  const count = Math.min(14, Math.floor(input.daysBefore));
  const days: JetLagDay[] = [];
  for (let day = 0; day <= count; day += 1) {
    const applied = Math.min(magnitude, step * day);
    const signed = direction === "east" ? -applied : applied;
    days.push({
      day,
      shiftHours: signed,
      bedtimeLabel: formatClock(input.bedtimeMinutes + signed * 60),
      note: day === 0 ? "baseline" : applied >= magnitude - 1e-9 ? "caught-up" : "partial",
    });
  }
  const appliedFinal = Math.min(magnitude, step * count);
  return {
    ok: true,
    shiftHours: shift,
    direction,
    days,
    remainingHours: Math.max(0, magnitude - appliedFinal),
    targetBedtime: formatClock(input.bedtimeMinutes + (direction === "east" ? -magnitude : magnitude) * 60),
  };
}

export function londonPreset() {
  return { originOffset: "-5", destOffset: "0", bedtime: "23:00", daysBefore: "3", east: "1", west: "1.5" };
}

export function laPreset() {
  return { originOffset: "-5", destOffset: "-8", bedtime: "23:00", daysBefore: "2", east: "1", west: "1.5" };
}
