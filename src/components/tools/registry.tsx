import { lazy, type ReactNode } from "react";
import { LENGTH_UNITS, MASS_UNITS } from "@/lib/units";

const Calculator = lazy(() => import("./Calculator"));
const PercentageCalculator = lazy(() => import("./PercentageCalculator"));
const RuleOfThree = lazy(() => import("./RuleOfThree"));
const DateDiff = lazy(() => import("./DateDiff"));
const WordCounter = lazy(() => import("./WordCounter"));
const PasswordGenerator = lazy(() => import("./PasswordGenerator"));
const TemperatureConverter = lazy(() => import("./TemperatureConverter"));
const UnitConverter = lazy(() => import("./UnitConverter"));

export const TOOL_UI: Record<string, () => ReactNode> = {
  calculadora: () => <Calculator />,
  "calculadora-de-porcentajes": () => <PercentageCalculator />,
  "regla-de-tres": () => <RuleOfThree />,
  "calculadora-de-fechas": () => <DateDiff />,
  "contador-de-palabras": () => <WordCounter />,
  "generador-de-contrasenas": () => <PasswordGenerator />,
  "conversor-de-temperatura": () => <TemperatureConverter />,
  "conversor-de-longitud": () => <UnitConverter units={LENGTH_UNITS} defaultFrom="m" defaultTo="ft" />,
  "conversor-de-peso": () => <UnitConverter units={MASS_UNITS} defaultFrom="kg" defaultTo="lb" />,
  "conversor-de-unidades": () => <UnitConverter allMagnitudes />,
};

export const TOOL_UI_ES: Record<string, () => ReactNode> = {
  ...TOOL_UI,
  calculadora: () => <Calculator locale="es" />,
  "calculadora-de-porcentajes": () => <PercentageCalculator locale="es" />,
  "regla-de-tres": () => <RuleOfThree locale="es" />,
  "calculadora-de-fechas": () => <DateDiff locale="es" />,
  "contador-de-palabras": () => <WordCounter locale="es" />,
  "generador-de-contrasenas": () => <PasswordGenerator locale="es" />,
  "conversor-de-temperatura": () => <TemperatureConverter locale="es" />,
  "conversor-de-longitud": () => (
    <UnitConverter locale="es" units={LENGTH_UNITS} defaultFrom="m" defaultTo="ft" />
  ),
  "conversor-de-peso": () => (
    <UnitConverter locale="es" units={MASS_UNITS} defaultFrom="kg" defaultTo="lb" />
  ),
  "conversor-de-unidades": () => <UnitConverter locale="es" allMagnitudes />,
};
