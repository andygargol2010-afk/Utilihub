import { makeTool } from "./types";

/** Gap: overtime and hourly-rate tools price one person. This prices a meeting across attendees. */
export const MEETING_COST_TOOLS = [
  makeTool(
    "coste-reunion",
    "Meeting cost calculator",
    "productividad",
    "formula",
    "Estimate the salary cost of a meeting from attendee count, hourly rates, duration, and how often it repeats.",
    [
      "meeting cost calculator",
      "cost of a meeting",
      "meeting salary cost",
      "coste de una reunion",
      "calculadora de coste de reunion",
      "cuanto cuesta una reunion",
      "costo de reunion laboral",
    ],
    {
      mode: "meeting-cost",
      title: "Meeting cost calculator — salary time burned | UtiliHub",
      description:
        "Calculate what a meeting costs from attendees, hourly rates, duration, and recurrence. Standup and planning presets. Free in the browser.",
    },
  ),
];
