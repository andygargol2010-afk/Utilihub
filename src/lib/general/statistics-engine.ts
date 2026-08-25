export type StatisticsResult={label:string;value:string};

export function parseNumberList(raw:string):number[]{return raw.split(/[\n,;]+/).map((value)=>Number(value.trim().replace(",","."))).filter(Number.isFinite)}
const mean=(xs:number[])=>xs.reduce((sum,x)=>sum+x,0)/xs.length;
const variance=(xs:number[],sample:boolean)=>{const m=mean(xs);return xs.reduce((sum,x)=>sum+(x-m)**2,0)/Math.max(1,xs.length-(sample?1:0))};
const quantile=(xs:number[],p:number)=>{const sorted=[...xs].sort((a,b)=>a-b);const pos=(sorted.length-1)*p;const lo=Math.floor(pos),hi=Math.ceil(pos);return sorted[lo]+(sorted[hi]-sorted[lo])*(pos-lo)};
const fmt=(n:number)=>Number.isFinite(n)?String(Number(n.toFixed(10))):"No definido";
const mode=(xs:number[])=>{const counts=new Map<number,number>();for(const x of xs)counts.set(x,(counts.get(x)??0)+1);const max=Math.max(...counts.values());if(max===1)return "Sin moda";return [...counts.entries()].filter(([,count])=>count===max).map(([x])=>fmt(x)).join(", ")};
const covariance=(a:number[],b:number[],sample:boolean)=>{const ma=mean(a),mb=mean(b);return a.reduce((sum,x,i)=>sum+(x-ma)*(b[i]-mb),0)/Math.max(1,a.length-(sample?1:0))};
const correlation=(a:number[],b:number[])=>{const ma=mean(a),mb=mean(b);const numerator=a.reduce((sum,x,i)=>sum+(x-ma)*(b[i]-mb),0);const da=Math.sqrt(a.reduce((sum,x)=>sum+(x-ma)**2,0));const db=Math.sqrt(b.reduce((sum,x)=>sum+(x-mb)**2,0));return numerator/(da*db)};

export function calculateStatistics(slug:string,values:number[],secondary:number[]=[],parameter=50,sample=false):StatisticsResult[]{
 const xs=[...values];
 if(!xs.length)return[{label:"Error",value:"Introduce al menos un número."}];
 switch(slug){
  case"promedio":return[{label:"Promedio",value:fmt(mean(xs))}];
  case"mediana":return[{label:"Mediana",value:fmt(quantile(xs,.5))}];
  case"moda":return[{label:"Moda",value:mode(xs)}];
  case"rango":{const s=xs.sort((a,b)=>a-b);return[{label:"Mínimo",value:fmt(s[0])},{label:"Máximo",value:fmt(s.at(-1)!)},{label:"Rango",value:fmt(s.at(-1)!-s[0])}]}
  case"varianza":return[{label:sample?"Varianza muestral":"Varianza poblacional",value:fmt(variance(xs,sample))}];
  case"desviacion-estandar":return[{label:sample?"Desviación estándar muestral":"Desviación estándar poblacional",value:fmt(Math.sqrt(variance(xs,sample)))}];
  case"percentil":{if(parameter<0||parameter>100)return[{label:"Error",value:"El percentil debe estar entre 0 y 100."}];return[{label:`Percentil ${parameter}`,value:fmt(quantile(xs,parameter/100))}]}
  case"cuartiles":return[{label:"Q1",value:fmt(quantile(xs,.25))},{label:"Mediana (Q2)",value:fmt(quantile(xs,.5))},{label:"Q3",value:fmt(quantile(xs,.75))},{label:"RIC",value:fmt(quantile(xs,.75)-quantile(xs,.25))}];
  case"z-score":{const m=mean(xs),sd=Math.sqrt(variance(xs,false));if(!sd)return[{label:"Z-score",value:"No definido: la desviación estándar es 0."}];return[{label:"Z-score",value:fmt((parameter-m)/sd)},{label:"Media",value:fmt(m)},{label:"Desviación estándar",value:fmt(sd)}]}
  case"correlacion":{if(secondary.length!==xs.length||xs.length<2)return[{label:"Error",value:"Las dos series deben tener la misma cantidad de valores (mínimo 2)."}];return[{label:"Correlación de Pearson",value:fmt(correlation(xs,secondary))}]}
  case"covarianza":{if(secondary.length!==xs.length||xs.length<2)return[{label:"Error",value:"Las dos series deben tener la misma cantidad de valores (mínimo 2)."}];return[{label:sample?"Covarianza muestral":"Covarianza poblacional",value:fmt(covariance(xs,secondary,sample))}]}
  default:return[{label:"Error",value:"Herramienta estadística no implementada."}];
 }
}
