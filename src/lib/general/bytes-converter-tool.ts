import { makeTool } from "./types";

const tool = makeTool(
  "conversor-bytes",
  "Bytes Converter",
  "conversiones",
  "converter",
  "Convert raw bytes to human-readable sizes (B, KB, MB, GB, TB) using base 1024.",
  [
    "bytes to human readable",
    "bytes converter",
    "conversor bytes",
    "bytes to mb",
    "bytes to kb",
  ],
  {
    title: "Bytes Converter — Human Readable Size | UtiliHub",
    description: "Free bytes to human-readable converter. Turn raw byte counts into B/KB/MB/GB/TB instantly in your browser.",
  },
);

export const BYTES_CONVERTER_TOOLS = [tool];
