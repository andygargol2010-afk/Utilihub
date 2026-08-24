import type { FinancialDefinition } from "./types";
import { money, pct } from "./types";
const f=(key:string,label:string,defaultValue:number,unit="")=>({key,label,defaultValue,unit});
export const TAX_TOOLS:FinancialDefinition[]=[
{slug:"salario-neto",fields:[f("gross","Salario bruto",200000,"$"),f("tax","Impuestos efectivos",20,"%"),f("contrib","Contribuciones",10,"%")],calculate:v=>{const net=v.gross*(1-v.tax/100-v.contrib/100);return[{label:"Salario neto estimado",value:money(net)},{label:"Descuentos totales",value:money(v.gross-net)},{label:"Tasa efectiva total",value:pct(v.tax+v.contrib)}]},note:"Las tasas son introducidas por el usuario. Los impuestos reales dependen del país, período, deducciones y situación fiscal."},
{slug:"calculadora-de-impuestos",fields:[f("income","Ingreso imponible",100000,"$"),f("rate","Tasa efectiva",25,"%"),f("deductions","Deducciones",5000,"$")],calculate:v=>{const taxable=Math.max(0,v.income-v.deductions),tax=taxable*v.rate/100;return[{label:"Base imponible",value:money(taxable)},{label:"Impuesto estimado",value:money(tax)},{label:"Ingreso después del impuesto",value:money(v.income-tax)}]},note:"No representa la legislación de un país concreto. Sirve para escenarios con una tasa efectiva conocida."},
];
