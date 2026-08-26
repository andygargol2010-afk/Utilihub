import {useState} from "react";
import type {GeneralTool} from "@/lib/general/types";

type Field={label:string;unit:string;placeholder:string};
const A=6.02214076e23;
const R=8.314462618;

const fields:Record<string,Field[]>={
 molaridad:[{label:"Moles de soluto",unit:"mol",placeholder:"Ej.: 0.5"},{label:"Volumen de disolución",unit:"L",placeholder:"Ej.: 2"}],
 molalidad:[{label:"Moles de soluto",unit:"mol",placeholder:"Ej.: 0.5"},{label:"Masa del disolvente",unit:"kg",placeholder:"Ej.: 1.5"}],
 "moles-desde-masa":[{label:"Masa",unit:"g",placeholder:"Ej.: 18"},{label:"Masa molar",unit:"g/mol",placeholder:"Ej.: 18.015"}],
 "masa-desde-moles":[{label:"Moles",unit:"mol",placeholder:"Ej.: 2"},{label:"Masa molar",unit:"g/mol",placeholder:"Ej.: 18.015"}],
 "particulas-desde-moles":[{label:"Moles",unit:"mol",placeholder:"Ej.: 1"}],
 "moles-desde-particulas":[{label:"Partículas",unit:"partículas",placeholder:"Ej.: 6.022e23"}],
 "porcentaje-masa":[{label:"Masa de soluto",unit:"g",placeholder:"Ej.: 10"},{label:"Masa total",unit:"g",placeholder:"Ej.: 100"}],
 "porcentaje-volumen":[{label:"Volumen de soluto",unit:"mL",placeholder:"Ej.: 25"},{label:"Volumen total",unit:"mL",placeholder:"Ej.: 100"}],
 "ppm-quimica":[{label:"Masa de soluto",unit:"mg",placeholder:"Ej.: 5"},{label:"Volumen de disolución",unit:"L",placeholder:"Ej.: 2"}],
 "ph-quimica":[{label:"Concentración de H+",unit:"mol/L",placeholder:"Ej.: 0.001"}],
 "poh-quimica":[{label:"Concentración de OH−",unit:"mol/L",placeholder:"Ej.: 0.0001"}],
 "concentracion-h-desde-ph":[{label:"pH",unit:"pH",placeholder:"Ej.: 3"}],
 "concentracion-oh-desde-poh":[{label:"pOH",unit:"pOH",placeholder:"Ej.: 4"}],
 "pka-desde-ka":[{label:"Ka",unit:"adimensional",placeholder:"Ej.: 1.8e-5"}],
 "ka-desde-pka":[{label:"pKa",unit:"adimensional",placeholder:"Ej.: 4.74"}],
 "gas-ideal-presion":[{label:"Cantidad de sustancia",unit:"mol",placeholder:"Ej.: 1"},{label:"Temperatura",unit:"K",placeholder:"Ej.: 298.15"},{label:"Volumen",unit:"m³",placeholder:"Ej.: 0.0245"}],
 "gas-ideal-volumen":[{label:"Cantidad de sustancia",unit:"mol",placeholder:"Ej.: 1"},{label:"Temperatura",unit:"K",placeholder:"Ej.: 298.15"},{label:"Presión",unit:"Pa",placeholder:"Ej.: 101325"}],
 "gas-ideal-moles":[{label:"Presión",unit:"Pa",placeholder:"Ej.: 101325"},{label:"Volumen",unit:"m³",placeholder:"Ej.: 0.0245"},{label:"Temperatura",unit:"K",placeholder:"Ej.: 298.15"}],
 "densidad-quimica":[{label:"Masa",unit:"g",placeholder:"Ej.: 50"},{label:"Volumen",unit:"mL",placeholder:"Ej.: 25"}],
 "fraccion-molar":[{label:"Moles del componente",unit:"mol",placeholder:"Ej.: 2"},{label:"Moles totales",unit:"mol",placeholder:"Ej.: 5"}],
 dilucion:[{label:"Concentración inicial C1",unit:"mol/L",placeholder:"Ej.: 2"},{label:"Volumen inicial V1",unit:"L",placeholder:"Ej.: 0.25"},{label:"Concentración final C2",unit:"mol/L",placeholder:"Ej.: 0.5"}],
};

const n=(value:string)=>Number(value.replace(",","."));
const positive=(x:number)=>Number.isFinite(x)&&x>0;
const format=(x:number)=>Number.isFinite(x)?x.toLocaleString("es-AR",{maximumFractionDigits:8}):"—";

export function ChemistryTool({tool}:{tool:GeneralTool}){
 const fs=fields[tool.slug]||[];
 const [values,setValues]=useState<string[]>(()=>fs.map(()=>""));
 const [out,setOut]=useState("");
 const calculate=()=>{
  const v=values.map(n);
  const x=v[0]??NaN;
  const y=v[1]??NaN;
  const z=v[2]??NaN;
  if(v.some((value)=>!Number.isFinite(value))){setOut("Introduce todos los valores requeridos.");return;}
  let result="";
  switch(tool.slug){
   case "molaridad": if(!positive(y)){setOut("El volumen debe ser mayor que cero.");return;} result=`Molaridad: ${format(x/y)} mol/L`;break;
   case "molalidad": if(!positive(y)){setOut("La masa del disolvente debe ser mayor que cero.");return;} result=`Molalidad: ${format(x/y)} mol/kg`;break;
   case "moles-desde-masa": if(!positive(y)){setOut("La masa molar debe ser mayor que cero.");return;} result=`Cantidad de sustancia: ${format(x/y)} mol`;break;
   case "masa-desde-moles": result=`Masa: ${format(x*y)} g`;break;
   case "particulas-desde-moles": result=`Partículas: ${format(x*A)}`;break;
   case "moles-desde-particulas": result=`Cantidad de sustancia: ${format(x/A)} mol`;break;
   case "porcentaje-masa": if(!positive(y)){setOut("La masa total debe ser mayor que cero.");return;} result=`Porcentaje en masa: ${format(x/y*100)} %`;break;
   case "porcentaje-volumen": if(!positive(y)){setOut("El volumen total debe ser mayor que cero.");return;} result=`Porcentaje en volumen: ${format(x/y*100)} %`;break;
   case "ppm-quimica": if(!positive(y)){setOut("El volumen debe ser mayor que cero.");return;} result=`Concentración: ${format(x/y)} ppm`;break;
   case "ph-quimica": if(!positive(x)){setOut("La concentración de H+ debe ser mayor que cero.");return;} result=`pH: ${format(-Math.log10(x))}`;break;
   case "poh-quimica": if(!positive(x)){setOut("La concentración de OH− debe ser mayor que cero.");return;} result=`pOH: ${format(-Math.log10(x))}`;break;
   case "concentracion-h-desde-ph": result=`[H+]: ${format(10**(-x))} mol/L`;break;
   case "concentracion-oh-desde-poh": result=`[OH−]: ${format(10**(-x))} mol/L`;break;
   case "pka-desde-ka": if(!positive(x)){setOut("Ka debe ser mayor que cero.");return;} result=`pKa: ${format(-Math.log10(x))}`;break;
   case "ka-desde-pka": result=`Ka: ${format(10**(-x))}`;break;
   case "gas-ideal-presion": if(!positive(y)||!positive(z)){setOut("Temperatura y volumen deben ser mayores que cero.");return;} result=`Presión: ${format(x*R*y/z)} Pa`;break;
   case "gas-ideal-volumen": if(!positive(y)||!positive(z)){setOut("Temperatura y presión deben ser mayores que cero.");return;} result=`Volumen: ${format(x*R*y/z)} m³`;break;
   case "gas-ideal-moles": if(!positive(x)||!positive(y)||!positive(z)){setOut("Presión, volumen y temperatura deben ser mayores que cero.");return;} result=`Cantidad de sustancia: ${format(x*y/(R*z))} mol`;break;
   case "densidad-quimica": if(!positive(y)){setOut("El volumen debe ser mayor que cero.");return;} result=`Densidad: ${format(x/y)} g/mL`;break;
   case "fraccion-molar": if(!positive(y)){setOut("Los moles totales deben ser mayores que cero.");return;} result=`Fracción molar: ${format(x/y)}`;break;
   case "dilucion": if(!positive(z)){setOut("La concentración final debe ser mayor que cero.");return;} result=`Volumen final V2: ${format(x*y/z)} L`;break;
   default: result="Herramienta de química sin fórmula configurada.";
  }
  setOut(result);
 };
 return <div className="space-y-4"><div className={`grid gap-4 ${fs.length>2?"sm:grid-cols-3":"sm:grid-cols-2"}`}>{fs.map((f,i)=><label key={f.label} className="space-y-1"><span className="text-sm font-medium">{f.label}</span><div className="flex"><input value={values[i]||""} onChange={e=>setValues(current=>current.map((value,j)=>j===i?e.target.value:value))} placeholder={f.placeholder} type="number" inputMode="decimal" className="h-11 min-w-0 flex-1 rounded-l-xl border bg-background px-3"/><span className="flex h-11 items-center rounded-r-xl border border-l-0 bg-muted px-3 text-xs font-medium">{f.unit}</span></div></label>)}</div><button className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground" onClick={calculate}>Calcular</button>{out&&<output className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4">{out}</output>}</div>;
}
