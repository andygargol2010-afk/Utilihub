import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { getToolShowcase } from "@/lib/tool-showcase";
import { showcaseUi } from "@/lib/showcase-ui";
import { n } from "./FormulaTool.part1";
import { defs, generic, integer, fact, esError, ES_LABELS, ES_UNIT } from "./FormulaTool.part2";

export function FormulaTool({tool,locale="en"}:{tool:GeneralTool;locale?:"en"|"es"}){
  const es=locale==="es";
  const showcase=getToolShowcase(tool.slug);
  const ui=showcaseUi(showcase?.accent);
  const premium=Boolean(showcase);
  const config=(tool.config??{}) as Record<string,unknown>;
  const configuredFields=Array.isArray(config.fields)?config.fields.map(label=>({label:String(label),placeholder:es?"Introduce un valor":"Enter a value"})):null;
  const fs=defs[tool.slug]??configuredFields??[{label:es?"Entrada":"Input",placeholder:es?"Introduce un valor":"Enter a value"},{label:es?"Segundo valor":"Second value",placeholder:es?"Introduce un valor":"Enter a value"}];
  const[values,setValues]=useState<string[]>(fs.map((_,i)=>tool.slug==="horno"&&i===1?"°F":""));
  const[out,setOut]=useState("");
  const calculate=()=>{
    try{
      const A=n(values[0]??""),B=n(values[1]??""),C=n(values[2]??"");
      const operation=typeof config.operation==="string"?config.operation:"";
      if(tool.slug!=="horno"&&tool.slug!=="bases-numericas"&&(!Number.isFinite(A)||((fs.length>1||operation)&&!Number.isFinite(B))))throw new Error("Enter the required values.");
      let r="";
      if(operation){
        const fixed=typeof config.fixed==="number"?config.fixed:undefined;
        const result=generic(operation,A,B,C,fixed);
        if(!Number.isFinite(result))throw new Error("The result is not finite with those values.");
        r=`${es?"Resultado":"Result"}: ${Number.isInteger(result)?result:result.toFixed(6)}`;
      }else switch(tool.slug){
        case"porcentaje":r=`${es?"Resultado":"Result"}: ${(A*B/100).toFixed(4)}`;break;
        case"regla-de-tres":if(A===0)throw new Error("The known value cannot be 0.");r=`${es?"Resultado proporcional":"Proportional result"}: ${(B).toFixed(4)}`;break;
        case"probabilidad":if(B<=0||A<0||A>B)throw new Error("Use valid cases.");r=`${es?"Probabilidad":"Probability"}: ${(A/B*100).toFixed(2)} %`;break;
        case"combinaciones":if(!integer(A)||!integer(B)||A<0||B<0||B>A)throw new Error("Use integers with 0 ≤ r ≤ n.");r=`${es?"Combinaciones":"Combinations"}: ${(fact(A)/(fact(B)*fact(A-B))).toFixed(0)}`;break;
        case"permutaciones":if(!integer(A)||!integer(B)||A<0||B<0||B>A)throw new Error("Use integers with 0 ≤ r ≤ n.");r=`${es?"Permutaciones":"Permutations"}: ${(fact(A)/fact(A-B)).toFixed(0)}`;break;
        case"factorial":r=`${es?"Factorial":"Factorial"}: ${fact(A)}`;break;
        case"potencias-y-raices":if(A<0&&B%1!==0)throw new Error("Enter the required values.");r=`${es?"Potencia":"Power"}: ${(A**B).toFixed(6)}`;break;
        case"mcd-mcm":{
          const gcd=(x:number,y:number)=>{x=Math.abs(Math.trunc(x));y=Math.abs(Math.trunc(y));while(y){const t=y;y=x%y;x=t}return x};
          const g=gcd(A,B);const l=Math.abs(A*B)/g;
          r=`GCD: ${g}\nLCM: ${l}`;
          break;
        }
        case"propina":r=`${es?"Propina":"Tip"}: ${(A*B/100).toFixed(2)}\n${es?"Total":"Total"}: ${(A+A*B/100).toFixed(2)}`;break;
        case"escalador-recetas":if(B<=0||C<0)throw new Error("Enter the required values.");r=`${es?"Nueva cantidad":"New amount"}: ${(A*C/B).toFixed(2)}`;break;
        case"distancia-viaje":if(B<=0)throw new Error("Enter the required values.");r=`${es?"Velocidad media":"Average speed"}: ${(A/B).toFixed(2)} km/h`;break;
        case"combustible-viaje":if(A<0||B<0)throw new Error("Enter the required values.");r=`${es?"Combustible estimado":"Estimated fuel"}: ${(A*B/100).toFixed(2)} L`;break;
        case"cafe":if(B<=0)throw new Error("Enter the required values.");r=`${es?"Proporción":"Ratio"}: ${(A/B).toFixed(4)} g/ml`;break;
        case"horno":if(values[1]!=="°F"&&values[1]!=="°C")throw new Error("Select °C or °F.");r=values[1]==="°F"?`${A.toFixed(2)} °C = ${(A*9/5+32).toFixed(2)} °F`:`${A.toFixed(2)} °F = ${((A-32)*5/9).toFixed(2)} °C`;break;
        default:r=es?"Introduce los valores y calcula.":"Enter the values and calculate.";
      }
      setOut(r);
    }catch(e){
      const message=e instanceof Error?e.message:"Invalid input.";
      setOut(es?esError(message):message);
    }
  };
  const localizedFields=fs.map(f=>es?{...f,label:ES_LABELS[f.label]??f.label,unit:f.unit?(ES_UNIT[f.unit]??f.unit):f.unit,placeholder:f.placeholder.replace(/^e\.g\.\s*/i,"Ej.: ")}:f);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {localizedFields.map((f,i)=>tool.slug==="horno"&&i===1?(
          <label key={f.label} className="space-y-1">
            <span className="text-sm font-medium">{es?"Escala objetivo":"Target scale"}</span>
            <select value={values[i]??"°F"} onChange={e=>setValues(v=>v.map((x,j)=>j===i?e.target.value:x))} className={ui?.field ?? "h-11 w-full rounded-xl border bg-background px-3"}>
              <option value="°F">°F</option>
              <option value="°C">°C</option>
            </select>
          </label>
        ):(
          <label key={f.label} className="space-y-1">
            <span className="text-sm font-medium">{f.label}</span>
            <div className="flex">
              <input type="number" value={values[i]??""} onChange={e=>setValues(v=>v.map((x,j)=>j===i?e.target.value:x))} placeholder={f.placeholder} className={ui?.field ?? "h-11 min-w-0 flex-1 rounded-l-xl border bg-background px-3"}/>
              {f.unit&&<span className="flex h-11 items-center rounded-r-xl border border-l-0 bg-muted px-3 text-xs font-medium">{f.unit}</span>}
            </div>
          </label>
        ))}
      </div>
      <button type="button" onClick={calculate} className={ui?.btn ?? "rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground"}>{es?"Calcular":"Calculate"}</button>
      {out&&<output className={ui?.out ?? "block rounded-xl border bg-muted/30 p-4"}>{out}</output>}
    </div>
  );
}
