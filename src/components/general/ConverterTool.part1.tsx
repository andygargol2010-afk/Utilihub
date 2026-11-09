// Part 1 of 3 — split from ConverterTool.tsx on 2026-11-04. Edit here; ConverterTool.tsx re-exports.

export const units: Record<string, Record<string, number>> = {
  area: { "m²": 1, "km²": 1e6, "ft²": 0.092903, acres: 4046.8564224, ha: 10000 },
  volume: { L: 1, mL: 0.001, gal: 3.785411784, "m³": 1000 },
  speed: { "km/h": 1, mph: 1.609344, "m/s": 3.6, kn: 1.852 },
  energy: { J: 1, cal: 4.184, kWh: 3600000, BTU: 1055.05585262 },
  power: { W: 1, kW: 1000, hp: 745.699872 },
  pressure: { Pa: 1, bar: 100000, atm: 101325, psi: 6894.757293 },
  frequency: { Hz: 1, kHz: 1000, MHz: 1e6, GHz: 1e9 },
  data: { bit: 1, byte: 8, KB: 8000, MB: 8e6, GB: 8e9, TB: 8e12 },
};
