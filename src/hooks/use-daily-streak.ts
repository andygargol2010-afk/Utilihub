import { useCallback, useEffect, useState } from "react";

const KEY = "utilihub:daily-streak";
type StreakState = { count: number; lastActivity: number };
const dayMs = 24 * 60 * 60 * 1000;

function read(): StreakState {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null");
    return value && typeof value.count === "number" && typeof value.lastActivity === "number" ? value : { count: 0, lastActivity: 0 };
  } catch {
    return { count: 0, lastActivity: 0 };
  }
}

function dayIndex(timestamp: number) { return Math.floor(timestamp / dayMs); }

export function useDailyStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const current = read();
    if (current.lastActivity && Date.now() - current.lastActivity > 36 * 60 * 60 * 1000) {
      localStorage.setItem(KEY, JSON.stringify({ count: 0, lastActivity: 0 }));
      setStreak(0);
      return;
    }
    setStreak(current.count);
  }, []);

  const recordActivity = useCallback(() => {
    const now = Date.now();
    const current = read();
    const diff = current.lastActivity ? dayIndex(now) - dayIndex(current.lastActivity) : 0;
    const nextCount = !current.lastActivity
      ? 1
      : diff === 0
        ? current.count
        : diff === 1 && now - current.lastActivity <= 36 * 60 * 60 * 1000
          ? current.count + 1
          : 1;
    localStorage.setItem(KEY, JSON.stringify({ count: nextCount, lastActivity: now }));
    setStreak(nextCount);
  }, []);

  return { streak, recordActivity };
}
