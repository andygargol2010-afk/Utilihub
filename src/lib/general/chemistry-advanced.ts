import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"ciencia","science",summary,name.toLowerCase().split(/\s+/),{mode:"advanced",operation,fields});
export const CHEMISTRY_ADVANCED_TOOLS=[
 t("molaridad","Molarity","Calculate molar concentration from moles and solution volume.",["Moles of solute","Solution volume (L)"],"molarity"),
 t("molalidad","Molality","Calculate molal concentration from moles and solvent mass.",["Moles of solute","Solvent mass (kg)"],"molality"),
 t("normalidad-quimica","Chemical normality","Calculate solute equivalents per liter of solution.",["Equivalents","Solution volume (L)"],"normality"),
 t("fraccion-molar","Mole fraction","Calculate the mole fraction of a component in a mixture.",["Component moles","Total moles"],"mole-fraction"),
 t("porcentaje-masa","Mass percent","Calculate the mass percent of a solute in a solution or mixture.",["Solute mass","Solution mass"],"mass-percent"),
 t("porcentaje-volumen","Volume percent","Calculate the volume percent of a component in a mixture.",["Component volume","Solution volume"],"volume-percent"),
 t("numero-moles","Number of moles","Calculate moles from mass and molar mass.",["Mass (g)","Molar mass (g/mol)"],"moles"),
 t("numero-moleculas","Number of molecules","Convert moles into number of molecules using Avogadro's constant.",["Moles"],"molecules"),
 t("numero-atomos","Number of atoms","Calculate the number of atoms given atoms per molecule.",["Moles of substance","Atoms per molecule"],"atoms"),
 t("estequiometria","Stoichiometry","Calculate product amount from reactant moles and a stoichiometric ratio.",["Reactant moles","Product mol per reactant mol","Product molar mass (g/mol)"],"stoichiometry"),
 t("reactivo-limitante","Limiting reagent","Determine which of two reactants limits a reaction from moles and stoichiometric coefficients.",["Reactant A moles","A coefficient","Reactant B moles","B coefficient"],"limiting-reagent"),
 t("rendimiento-porcentual","Percent yield","Calculate percent yield by comparing actual yield to theoretical yield.",["Actual yield (g)","Theoretical yield (g)"],"chemical-yield"),
 t("dilucion","Dilution","Calculate final volume or resulting concentration using C₁V₁=C₂V₂.",["Initial concentration","Initial volume (L)","Final concentration"],"dilution"),
 t("concentracion-mezcla","Concentration after mixing","Calculate final concentration when mixing two solutions of the same solute.",["Concentration 1","Volume 1 (L)","Concentration 2","Volume 2 (L)"],"mixed-concentration"),
 t("poh","pOH","Calculate pOH from hydroxide ion concentration.",["[OH⁻] (mol/L)"],"poh"),
 t("pka-pkb","pKa / pKb","Calculate pKa or pKb from the dissociation constant.",["Ka or Kb"],"pka-pkb"),
 t("henderson-hasselbalch","Henderson-Hasselbalch","Calculate buffer pH from pKa and the base/acid ratio.",["pKa","Conjugate base","Acid"],"henderson-hasselbalch"),
 t("masa-molecular","Molecular mass","Calculate the molar mass of a compound from its chemical formula.",["Chemical formula"],"molecular-formula"),
 t("gases-ideales","Ideal gas law","Calculate pressure using PV=nRT.",["Moles","Temperature (K)","Volume (L)"],"ideal-gas"),
 t("presion-parcial","Partial pressure","Calculate the partial pressure of a gas from its mole fraction and total pressure.",["Mole fraction","Total pressure"],"partial-pressure"),
];
