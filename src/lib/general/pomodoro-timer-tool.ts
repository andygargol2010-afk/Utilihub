import { makeTool, faq } from "./types";

export const POMODORO_TIMER_TOOLS = [
  makeTool(
    "temporizador-pomodoro",
    "Pomodoro Timer",
    "productividad",
    "time",
    "Focus with the Pomodoro technique: work intervals, short breaks, and long breaks. Customize durations, track completed sessions, and stay on task in the browser.",
    [
      "pomodoro timer",
      "pomodoro timer online",
      "temporizador pomodoro",
      "tecnica pomodoro",
      "focus timer",
      "pomodoro technique timer",
      "temporizador de concentracion",
    ],
    {
      title: "Pomodoro Timer — Free Online Focus Timer | UtiliHub",
      description:
        "Free Pomodoro timer online. Set work and break lengths, track sessions, and use the classic 25/5 technique or custom intervals. Runs fully in the browser, no signup.",
      summaryEs:
        "Temporizador Pomodoro gratis: intervalos de trabajo y descansos personalizables, con seguimiento de sesiones completadas. Todo en tu navegador.",
    },
  ),
];
(POMODORO_TIMER_TOOLS[0] as any).faq.push(
  faq(
    "What are the classic Pomodoro intervals?",
    "The classic technique uses 25-minute work sessions with 5-minute short breaks, and a longer 15-30 minute break after four sessions. You can customize all durations.",
  ),
);
