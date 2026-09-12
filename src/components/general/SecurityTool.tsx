import {useState} from "react";
import type {GeneralTool} from "@/lib/general/types";

async function digest(algorithm:string,text:string){const data=new TextEncoder().encode(text);const hash=await crypto.subtle.digest(algorithm,data);return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,"0")).join("")}
const entropy=(text:string)=>{let pool=0;if(/[a-z]/.test(text))pool+=26;if(/[A-Z]/.test(text))pool+=26;if(/[0-9]/.test(text))pool+=10;if(/[^A-Za-z0-9]/.test(text))pool+=33;return pool?text.length*Math.log2(pool):0};
const secureRandomInt=(max:number)=>{if(!Number.isInteger(max)||max<=0)throw new Error("Invalid random range.");const range=max;const limit=Math.floor(0x100000000/range)*range;const buf=new Uint32Array(1);do{crypto.getRandomValues(buf)}while(buf[0]>=limit);return buf[0]%range};

export function SecurityTool({tool,locale="en"}:{tool:GeneralTool;locale?:"en"|"es"}){
 const [text,setText]=useState(""),[secret,setSecret]=useState(""),[expected,setExpected]=useState(""),[out,setOut]=useState("");
 const es=locale==="es";
 const process=async()=>{
  if(tool.slug==="hash-sha256"||tool.slug==="hash-sha512"||tool.slug==="hash-sha384"||tool.slug==="hash-sha1"){
   const alg=tool.slug==="hash-sha256"?"SHA-256":tool.slug==="hash-sha512"?"SHA-512":tool.slug==="hash-sha384"?"SHA-384":"SHA-1";setOut(await digest(alg,text));return;
  }
  if(tool.slug==="checksum"){setOut(await digest("SHA-256",text));return}
  if(tool.slug==="password-strength"){const bits=entropy(text);const level=bits<40?(es?"Débil":"Weak"):bits<60?(es?"Moderada":"Moderate"):bits<80?(es?"Fuerte":"Strong"):(es?"Muy fuerte":"Very strong");setOut(es?`${level} · entropía aproximada: ${bits.toFixed(1)} bits`:`${level} · approximate entropy: ${bits.toFixed(1)} bits`);return}
  if(tool.slug==="passphrase"){const words=["luna","rio","nube","cobre","bosque","pixel","mate","brisa","roble","sol","viento","delta"];setOut(Array.from({length:4},()=>words[secureRandomInt(words.length)]).join("-"));return}
  if(tool.slug==="hmac-sha256"){if(!secret){setOut(es?"Introduce una clave secreta.":"Enter a secret key.");return}const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);const sig=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(text));setOut([...new Uint8Array(sig)].map(x=>x.toString(16).padStart(2,"0")).join(""));return}
  if(tool.slug==="token-seguro"){const bytes=new Uint8Array(32);crypto.getRandomValues(bytes);setOut([...bytes].map(x=>x.toString(16).padStart(2,"0")).join(""));return}
  if(tool.slug==="comparador-hashes"){if(!expected.trim()){setOut(es?"Introduce el hash esperado.":"Enter the expected hash.");return}const actual=await digest("SHA-256",text);setOut(actual.toLowerCase()===expected.trim().toLowerCase()?(es?"Coincide con SHA-256.":"Matches SHA-256."):(es?"No coincide con SHA-256.":"Does not match SHA-256."));return}
  if(tool.slug==="generador-claves-api"){const bytes=new Uint8Array(24);crypto.getRandomValues(bytes);setOut(`uh_live_${[...bytes].map(x=>x.toString(16).padStart(2,"0")).join("")}`);return}
  if(tool.slug==="analizador-entropia"){const bits=entropy(text);setOut(es?`Entropía aproximada: ${bits.toFixed(1)} bits\nLongitud: ${text.length} caracteres\nRecomendación: ${bits<60?"Usa más longitud y variedad.":"La contraseña tiene una entropía razonable; evita reutilizarla."}`:`Approximate entropy: ${bits.toFixed(1)} bits\nLength: ${text.length} characters\nRecommendation: ${bits<60?"Use more length and variety.":"The password has reasonable entropy; avoid reusing it."}`);return}
  if(tool.slug==="verificador-hash-multi"){const [sha256,sha512]=await Promise.all([digest("SHA-256",text),digest("SHA-512",text)]);setOut(`SHA-256:\n${sha256}\n\nSHA-512:\n${sha512}`);return}
  setOut(es?"Introduce los datos y procesa la herramienta.":"Enter the data and process the tool.");
 };
 return <div className="space-y-4">
  <label className="space-y-1 block"><span className="text-sm font-medium">{es?"Texto o datos":"Text or data"}</span><textarea value={text} onChange={e=>setText(e.target.value)} className="min-h-32 w-full rounded-xl border bg-background p-4" placeholder={es?"Escribe o pega aquí…":"Type or paste here…"}/></label>
  {tool.slug==="hmac-sha256"?<label className="space-y-1 block"><span className="text-sm font-medium">{es?"Clave secreta":"Secret key"}</span><input value={secret} onChange={e=>setSecret(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label>:null}
  {tool.slug==="comparador-hashes"?<label className="space-y-1 block"><span className="text-sm font-medium">{es?"Hash SHA-256 esperado":"Expected SHA-256 hash"}</span><input value={expected} onChange={e=>setExpected(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3" placeholder={es?"Pega el hash aquí":"Paste the hash here"}/></label>:null}
  <button className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground" onClick={process}>{es?"Procesar":"Process"}</button>
  {out&&<output className="block break-all rounded-xl border bg-muted/30 p-4">{out}</output>}
 </div>
}
