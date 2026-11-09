import { makeTool } from "./types";

/** Gap: UUID v4 exists; ULID is time-sortable Crockford base32, not a UUID. */
export const ULID_TOOLS = [
  makeTool(
    "generador-ulid",
    "ULID generator",
    "generadores",
    "generator",
    "Generate and decode ULIDs: 48-bit timestamp plus 80 bits of randomness.",
    [
      "ulid generator",
      "ulid decoder timestamp",
      "generador ulid",
      "decodificar ulid",
      "sortable unique id",
    ],
    {
      mode: "ulid",
      title: "ULID Generator and Timestamp Decoder | UtiliHub",
      description:
        "Generate a 26-character ULID or decode its timestamp. 01ARZ3NDEKTSV4RRFFQ69G5FAV is 2016-07-30T23:54:10.259Z. Not a UUID. In the browser.",
    },
  ),
];
