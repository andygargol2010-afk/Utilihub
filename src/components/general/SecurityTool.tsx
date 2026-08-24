import {useState} from "react";
import type {GeneralTool} from "@/lib/general/types";

async function digest(algorithm:string,text:string){const data=new TextEncoder().encode(text);const hash=await crypto.subtle.digest(algorithm,data);return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,"0")).join("")}
const entropy=(text:string)=>{let pool=0;if(/[a-z]/.test(text))pool+=26;if(/[A-Z]/.test(text))pool+=26;if(/[0-9]/.test(text))pool+=10;if(/[^A-Za-z0-9]/.test(text))pool+=33;return pool?text.length*Math.log2(pool):0};

export function SecurityTool({tool}:{tool:GeneralTool}){
 const [text,setText]=useState(""),[secret,setSecret]=useState(""),[expected,setExpected]=useState(""),[out,setOut]=useState("");
 const process=async()=>{
  if(tool.slug==="hash-sha256"||tool.slug==="hash-sha512"||tool.slug==="hash-sha384"||tool.slug==="hash-sha1"){
   const alg=tool.slug==="hash-sha256"?"SHA-256":tool.slug==="hash-sha512"?"SHA-512":tool.slug==="hash-sha384"?"SHA-384":"SHA-1";setOut(await digest(alg,text));return;
  }
  if(tool.slug==="checksum"){setOut(await digest("SHA-256",text));return}
  if(tool.slug==="password-strength"){const bits=entropy(text);const level=bits<40?"Débil":bits<60?"Moderada":bits<80?"Fuerte":"Muy fuerte";setOut(`${level} · entropía aproximada: ${bits.toFixed(1)} bits`);return}
  if(tool.slug==="passphrase"){const words=["luna","rio","nube","cobre","bosque","pixel","mate","brisa","roble","sol","viento","delta"];setOut(Array.from({length:4},()=>words[Math.floor(Math.random()*words.length)]).join("-"));return}
  if(tool.slug==="hmac-sha256"){if(!secret){setOut("Introduce una clave secreta.");return}const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);const sig=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(text));setOut([...new Uint8Array(sig)].map(x=>x.toString(16).padStart(2,"0")).join(""));return}
  if(tool.slug==="token-seguro"){const bytes=new Uint8Array(32);crypto.getRandomValues(bytes);setOut([...bytes].map(x=>x.toString(16).padStart(2,"0")).join(""));return}
  if(tool.slug==="comparador-hashes"){if(!expected.trim()){setOut("Introduce el hash esperado.");return}const actual=await digest("SHA-256",text);setOut(actual.toLowerCase()===expected.trim().toLowerCase()?"Coincide con SHA-256.":"No coincide con SHA-256.");return}
  setOut("Introduce los datos y procesa la herramienta.");
 };
 return <div className="space-y-4">
  <label className="space-y-1 block"><span className="text-sm font-medium">Texto o dato</span><textarea value={text} onChange={e=>setText(e.target.value)} className="min-h-32 w-full rounded-xl border bg-background p-4" placeholder="Escribe o pega aquí…"/></label>
  {tool.slug==="hmac-sha256"?<label className="space-y-1 block"><span className="text-sm font-medium">Clave secreta</span><input value={secret} onChange={e=>setSecret(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label>:null}
  {tool.slug==="comparador-hashes"?<label className="space-y-1 block"><span className="text-sm font-medium">Hash SHA-256 esperado</span><input value={expected} onChange={e=>setExpected(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3" placeholder="Pega aquí el hash"/></label>:null}
  <button className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground" onClick={process}>Procesar</button>
  {out&&<output className="block break-all rounded-xl border bg-muted/30 p-4">{out}</output>}
 </div>
}
