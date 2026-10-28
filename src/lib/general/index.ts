// Catalog index — exports GENERAL_CATEGORIES + GENERAL_TOOLS (anti-wipe restore 2026-10-20)
// Tool modules are imported in ./catalog-index/part-NN.ts (split 2026-10-28 so automations never write a huge file).
// Add new entries in the smallest file of ./catalog-index/; never rewrite files wholesale.
import { INNOVATOR_TOOLS } from "./innovator-tools";
import { GENERAL_CATEGORIES } from "./catalog";
import { GENERAL_TOOLS_PART_01 } from "./catalog-index/part-01";
import { GENERAL_TOOLS_PART_02 } from "./catalog-index/part-02";
import { GENERAL_TOOLS_PART_03 } from "./catalog-index/part-03";
import { GENERAL_TOOLS_PART_04 } from "./catalog-index/part-04";
import { GENERAL_TOOLS_PART_05 } from "./catalog-index/part-05";
import { GENERAL_TOOLS_PART_06 } from "./catalog-index/part-06";
import { GENERAL_TOOLS_PART_07 } from "./catalog-index/part-07";
import { GENERAL_TOOLS_PART_08 } from "./catalog-index/part-08";

export { GENERAL_CATEGORIES };

export const GENERAL_TOOLS = [
  ...INNOVATOR_TOOLS,
  ...GENERAL_TOOLS_PART_01,
  ...GENERAL_TOOLS_PART_02,
  ...GENERAL_TOOLS_PART_03,
  ...GENERAL_TOOLS_PART_04,
  ...GENERAL_TOOLS_PART_05,
  ...GENERAL_TOOLS_PART_06,
  ...GENERAL_TOOLS_PART_07,
  ...GENERAL_TOOLS_PART_08,
];
