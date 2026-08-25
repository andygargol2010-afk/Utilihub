const randomInt = (min:number,max:number):number => Math.floor(Math.random()*(max-min+1))+min;
const pick = <T>(items:readonly T[]):T => {
  if(items.length===0) throw new Error("No se puede seleccionar un elemento de una lista vacía.");
  return items[randomInt(0,items.length-1)];
};
const randomAlphaNumeric=(length:number):string=>{
  if(length<0||!Number.isInteger(length)) throw new Error("La longitud debe ser un entero no negativo.");
  const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({length},()=>pick([...alphabet])).join("");
};
const randomName=():string=>pick(["Alex","Andy","Bruno","Camila","Daniel","Elena","Lucas","Mia","Nicolas","Sofia"]);
const lorem=():string=>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const generateBySlug=(slug:string):string=>{
  switch(slug){
    case "generador-numeros": return String(randomInt(1,100));
    case "generador-dados": return `Resultado: ${randomInt(1,6)}`;
    case "generador-nombres": return randomName();
    case "generador-usuarios": return `${randomName().toLowerCase()}_${randomInt(10,9999)}`;
    case "generador-pin": return String(randomInt(0,999999)).padStart(6,"0");
    case "generador-codigos": return randomAlphaNumeric(10);
    case "datos-prueba": return JSON.stringify({name:randomName(),id:randomInt(1000,9999),value:randomInt(1,100)},null,2);
    case "lorem-ipsum": return lorem();
    default: throw new Error(`Generador sin implementación específica: ${slug}`);
  }
};
