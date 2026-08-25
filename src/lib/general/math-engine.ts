export type MathResult={label:string;value:string};
const finite=(value:number)=>Number.isFinite(value);
const factorial=(n:number)=>{if(!Number.isInteger(n)||n<0||n>170)return null;let result=1;for(let i=2;i<=n;i++)result*=i;return result};
const gcd=(a:number,b:number)=>{let x=Math.abs(Math.trunc(a)),y=Math.abs(Math.trunc(b));while(y){const t=x%y;x=y;y=t}return x};
const format=(value:number)=>finite(value)?String(Number(value.toFixed(10))):"No definido";

export function calculateMath(slug:string,values:number[],options:{mode?:"aritmetica"|"geometrica";targetBase?:number}={}):MathResult[]{
 const [a,b,c]=values;
 if(!values.every(finite))return[{label:"Error",value:"Introduce valores numéricos válidos."}];
 switch(slug){
  case"porcentaje":return[{label:"Resultado",value:format(a*b/100)},{label:"Porcentaje",value:`${format(b)} % de ${format(a)}`}];
  case"regla-de-tres":return[{label:"Resultado",value:format(a*b/c)}];
  case"probabilidad":if(b<=0||a<0||a>b)return[{label:"Error",value:"Los casos favorables deben estar entre 0 y los casos posibles."}];return[{label:"Probabilidad",value:`${format(a/b*100)} %`},{label:"Probabilidad decimal",value:format(a/b)}];
  case"combinaciones":{const n=factorial(a),r=factorial(b),nr=factorial(a-b);if(n===null||r===null||nr===null||!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||b>a)return[{label:"Error",value:"n y r deben ser enteros con 0 ≤ r ≤ n ≤ 170."}];return[{label:"Combinaciones",value:format(n/(r*nr))}]}
  case"permutaciones":{const n=factorial(a),nr=factorial(a-b);if(n===null||nr===null||!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||b>a)return[{label:"Error",value:"n y r deben ser enteros con 0 ≤ r ≤ n ≤ 170."}];return[{label:"Permutaciones",value:format(n/nr)}]}
  case"factorial":{const result=factorial(a);return result===null?[{label:"Error",value:"Introduce un entero entre 0 y 170."}]:[{label:"Factorial",value:format(result)}]}
  case"potencias-y-raices":{const root=a>=0?Math.sqrt(a):NaN;return[{label:"Potencia",value:format(a**b)},{label:"Raíz cuadrada",value:root===root?format(root):"No definida en números reales"}]}
  case"logaritmos":if(a<=0||b<=0||b===1)return[{label:"Error",value:"El número debe ser > 0 y la base debe ser > 0 y distinta de 1."}];return[{label:`Log base ${format(b)}`,value:format(Math.log(a)/Math.log(b))},{label:"Logaritmo natural",value:format(Math.log(a))}];
  case"notacion-cientifica":return[{label:"Notación científica",value:a.toExponential(10)}];
  case"mcd-mcm":{if(!Number.isInteger(a)||!Number.isInteger(b))return[{label:"Error",value:"Introduce dos enteros."}];const d=gcd(a,b),l=d?Math.abs(a*b)/d:0;return[{label:"MCD",value:String(d)},{label:"MCM",value:String(l)}]}
  case"secuencias":{if(!Number.isInteger(c)||c<1||c>10000)return[{label:"Error",value:"El número de término debe ser un entero entre 1 y 10000."}];if(options.mode==="geometrica")return[{label:`Término ${c}`,value:format(a*Math.pow(b,c-1))},{label:"Tipo",value:"Geométrica"}];return[{label:`Término ${c}`,value:format(a+(c-1)*b)},{label:"Tipo",value:"Aritmética"}]}
  case"bases-numericas":{const source=Math.trunc(b),target=Math.trunc(options.targetBase??10);if(source<2||source>36||target<2||target>36)return[{label:"Error",value:"Las bases deben estar entre 2 y 36."}];const decimal=parseInt(String(a),source);if(Number.isNaN(decimal))return[{label:"Error",value:"El número no es válido para la base de origen."}];return[{label:`Base ${target}`,value:decimal.toString(target).toUpperCase()},{label:"Decimal",value:String(decimal)}]}
  default:return[{label:"Error",value:"Herramienta matemática no implementada."}];
 }
}
