// Part 2 of 3 — split from FormulaTool.tsx on 2026-11-04. Edit here; FormulaTool.tsx re-exports.

export const integer=(v:number)=>Number.isInteger(v);
export const fact=(v:number)=>{if(!integer(v)||v<0||v>170)throw new Error("Use an integer between 0 and 170.");let r=1;for(let i=2;i<=v;i++)r*=i;return r};
export const generic=(op:string,A:number,B:number,C:number,fixed?:number)=>{
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
export const esError=(m:string)=>({
  "Enter the required values.":"Introduce los valores requeridos.",
  "The result is not finite with those values.":"El resultado no es finito con esos valores.",
  "The known value cannot be 0.":"El valor conocido no puede ser 0.",
  "Use valid cases.":"Usa casos válidos.",
  "Use integers with 0 ≤ r ≤ n.":"Usa enteros con 0 ≤ r ≤ n.",
  "Use an integer between 0 and 170.":"Usa un entero entre 0 y 170.",
  "Select °C or °F.":"Selecciona °C o °F.",
  "Invalid input.":"Entrada no válida.",
}[m]??m);

export const ES_LABELS:Record<string,string>={"Value":"Valor","Rate %":"Tasa %","Amount":"Cantidad","Known":"Conocido","Cases":"Casos","Total":"Total","n":"n","r":"r","Base":"Base","Exponent":"Exponente","Servings":"Porciones","Target servings":"Porciones destino","Distance km":"Distancia km","Time h":"Tiempo h","Consumption L/100km":"Consumo L/100km","Coffee g":"Café g","Water ml":"Agua ml","Temperature":"Temperatura"};
export const ES_UNIT:Record<string,string>={"%":"%","km":"km","h":"h","L":"L","g":"g","ml":"ml","°C":"°C","°F":"°F"};

export const defs:Record<string,{label:string;placeholder:string;unit?:string}[]>={
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
