import {useState} from "react";
import type {GeneralTool} from "@/lib/general/types";
import {getToolShowcase} from "@/lib/tool-showcase";
import {showcaseUi} from "@/lib/showcase-ui";

const n=(v:string)=>Number(String(v).trim().replace(",","."));
const integer=(v:number)=>Number.isInteger(v);
const fact=(v:number)=>{if(!integer(v)||v<0||v>170)throw new Error("Use an integer between 0 and 170.");let r=1;for(let i=2;i<=v;i++)r*=i;return r};
const generic=(op:string,A:number,B:number,C:number,fixed?:number)=>{
  switch(op){
    case"percent":return A*B/100;
    case"percent-of":return A*B/100;
    case"rule-of-three":return A===0?NaN:A*B;
    case"add":return A+B;
    case"sub":return A-B;
    case"mul":return A*B;
    case"div":return B===0?NaN:A/B;
    case"pow":return A**B;
    case"sqrt":return Math.sqrt(A);
    case"fixed":return fixed??A;
    default:return NaN;
  }
};
const esError=(m:string)=>({
  "Enter the required values.":"Introduce los valores requeridos.",
  "The result is not finite with those values.":"El resultado no es finito con esos valores.",
  "The known value cannot be 0.":"El valor conocido no puede ser 0.",
  "Use valid cases.":"Usa casos válidos.",
  "Use integers with 0 ≤ r ≤ n.":"Usa enteros con 0 ≤ r ≤ n.",
  "Use an integer between 0 and 170.":"Usa un entero entre 0 y 170.",
  "Select °C or °F.":"Selecciona °C o °F.",
  "Invalid input.":"Entrada no válida.",
}[m]??m);

const ES_LABELS:Record<string,string>={"Value":"Valor","Rate %":"Tasa %","Amount":"Cantidad","Known":"Conocido","Cases":"Casos","Total":"Total","n":"n","r":"r","Base":"Base","Exponent":"Exponente","Servings":"Porciones","Target servings":"Porciones destino","Distance km":"Distancia km","Time h":"Tiempo h","Consumption L/100km":"Consumo L/100km","Coffee g":"Café g","Water ml":"Agua ml","Temperature":"Temperatura"};
const ES_UNIT:Record<string,string>={"%":"%","km":"km","h":"h","L":"L","g":"g","ml":"ml","°C":"°C","°F":"°F"};

const defs:Record<string,{label:string;placeholder:string;unit?:string}[]>={
  porcentaje:[{label:"Value",placeholder:"e.g. 200"},{label:"Rate %",placeholder:"e.g. 15",unit:"%"}],
  "regla-de-tres":[{label:"Known",placeholder:"e.g. 4"},{label:"Amount",placeholder:"e.g. 10"}],
  probabilidad:[{label:"Cases",placeholder:"e.g. 3"},{label:"Total",placeholder:"e.g. 10"}],
  combinaciones:[{label:"n",placeholder:"e.g. 10"},{label:"r",placeholder:"e.g. 3"}],
  permutaciones:[{label:"n",placeholder:"e.g. 10"},{label:"r",placeholder:"e.g. 3"}],
  factorial:[{label:"n",placeholder:"e.g. 6"}],
  "potencias-y-raices":[{label:"Base",placeholder:"e.g. 2"},{label:"Exponent",placeholder:"e.g. 8"}],
  "mcd-mcm":[{label:"A",placeholder:"e.g. 12"},{label:"B",placeholder:"e.g. 18"}],
  propina:[{label:"Amount",placeholder:"e.g. 50"},{label:"Rate %",placeholder:"e.g. 10",unit:"%"}],
  "escalador-recetas":[{label:"Amount",placeholder:"e.g. 200",unit:"g"},{label:"Servings",placeholder:"e.g. 4"},{label:"Target servings",placeholder:"e.g. 6"}],
  "distancia-viaje":[{label:"Distance km",placeholder:"e.g. 120",unit:"km"},{label:"Time h",placeholder:"e.g. 2",unit:"h"}],
  "combustible-viaje":[{label:"Distance km",placeholder:"e.g. 120",unit:"km"},{label:"Consumption L/100km",placeholder:"e.g. 7",unit:"L"}],
  cafe:[{label:"Coffee g",placeholder:"e.g. 18",unit:"g"},{label:"Water ml",placeholder:"e.g. 300",unit:"ml"}],
  horno:[{label:"Temperature",placeholder:"e.g. 180"},{label:"Scale",placeholder:"°F"}],
};

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
