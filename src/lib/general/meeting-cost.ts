import { makeTool, faq } from "./types";

/** Gap: overtime and hourly-rate tools price one person. This prices a meeting across attendees. */
const tool = makeTool(
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
);
tool.faq.push(faq("How is the cost of a meeting calculated?", "Meeting cost = attendees × average hourly rate × duration in hours × number of occurrences. Optional overhead can be added to reflect the full cost of an employee hour."));
tool.faq.push(faq("Why calculate the cost of meetings?", "Recurring meetings compound: a 30-minute standup with 8 people costs 4 working hours per day. Seeing the salary cost helps decide frequency, duration, and attendee list."));
tool.faq.push(faq("Is the meeting cost calculator free?", "Yes, it runs entirely in the browser, needs no sign-up, and stores nothing on a server."));

export const MEETING_COST_TOOLS = [tool];
