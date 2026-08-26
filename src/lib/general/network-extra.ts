import {makeTool} from "./types";
const n=(slug:string,name:string,operation:string,summary:string,fields:string[]=["text"])=>makeTool(slug,name,"redes-internet","local",summary,[name.toLowerCase(),"redes","internet","ip","url"],{operation,fields});
export const NETWORK_TOOLS=[
 n("validador-ipv4","Validador IPv4","ipv4-validate","Valida una dirección IPv4 y sus octetos.",["text"]),
 n("ipv4-a-binario","IPv4 a binario","ipv4-binary","Convierte IPv4 a sus 32 bits binarios.",["text"]),
 n("binario-a-ipv4","Binario a IPv4","binary-ipv4","Convierte 32 bits binarios a IPv4.",["text"]),
 n("ipv4-a-entero","IPv4 a entero","ipv4-int","Convierte IPv4 a entero sin signo de 32 bits.",["text"]),
 n("entero-a-ipv4","Entero a IPv4","int-ipv4","Convierte un entero IPv4 a notación decimal.",["text"]),
 n("mascara-a-prefijo","Máscara a prefijo CIDR","mask-prefix","Convierte una máscara IPv4 válida a /prefijo.",["text"]),
 n("prefijo-a-mascara","Prefijo CIDR a máscara","prefix-mask","Convierte /0–/32 a máscara decimal.",["text"]),
 n("cidr-calculadora","Calculadora CIDR","cidr","Calcula red, broadcast y hosts de un bloque IPv4.",["text"]),
 n("ip-privada-publica","IP privada o pública","ip-scope","Clasifica IPv4 según rangos privados y reservados.",["text"]),
 n("clase-ipv4","Clase IPv4","ip-class","Identifica la clase histórica A–E de una IPv4.",["text"]),
 n("validador-ipv6","Validador IPv6","ipv6-validate","Valida una dirección IPv6 usando el parser del navegador.",["text"]),
 n("validador-mac","Validador MAC","mac-validate","Valida y normaliza direcciones MAC habituales.",["text"]),
 n("analizador-url","Analizador de URL","url-parse","Separa protocolo, host, puerto, ruta, query y fragmento.",["text"]),
 n("origen-url","Origen de URL","url-origin","Obtiene esquema, host y puerto efectivos de una URL.",["text"]),
 n("resolver-url-relativa","Resolver URL relativa","url-resolve","Resuelve una ruta relativa respecto de una URL base.",["text","base"]),
 n("query-string-a-json","Query string a JSON","query-json","Convierte parámetros de consulta a un objeto JSON.",["text"]),
 n("json-a-query-string","JSON a query string","json-query","Convierte un objeto JSON plano a parámetros URL.",["text"]),
 n("analizador-user-agent","Analizador User-Agent","user-agent","Identifica patrones comunes de navegador, motor y sistema en un User-Agent.",["text"]),
 n("fecha-http","Fecha HTTP","http-date","Convierte fechas HTTP a fecha ISO y viceversa.",["text"]),
 n("clasificador-http","Clasificador HTTP","http-class","Clasifica un código HTTP por familia y significado habitual.",["text"]),
 n("puertos-comunes","Puertos comunes","ports","Consulta puertos TCP/UDP conocidos sin realizar conexiones.",["text"]),
 n("content-type","Analizador Content-Type","content-type","Separa tipo MIME, charset y parámetros de un Content-Type.",["text"]),
 n("ip-a-hex","IPv4 a hexadecimal","ipv4-hex","Convierte una IPv4 a representación hexadecimal de 32 bits.",["text"]),
 n("ordenar-ipv4","Ordenar IPv4","ip-sort","Ordena una lista de IPv4 numéricamente.",["text"]),
] as const;

const ipv4=(s:string)=>{const p=s.trim().split(".");if(p.length!==4||p.some(x=>!/^(0|[1-9]\d*)$/.test(x)||+x>255))return null;return p.map(Number)};
const u32=(p:number[])=>((p[0]*256+p[1])*256+p[2])*256+p[3];
const fromU32=(x:number)=>[(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255].join(".");
const prefixToMask=(p:number)=>p===0?0:(0xffffffff<<(32-p))>>>0;
const maskToPrefix=(m:number)=>{let p=0,seenZero=false;for(let i=31;i>=0;i--){const bit=(m>>>i)&1;if(bit){if(seenZero)return null;p++;}else seenZero=true;}return p};
const ports:Record<number,string>={20:"FTP-data",21:"FTP",22:"SSH",23:"Telnet",25:"SMTP",53:"DNS",67:"DHCP-server",68:"DHCP-client",80:"HTTP",110:"POP3",123:"NTP",143:"IMAP",161:"SNMP",194:"IRC",389:"LDAP",443:"HTTPS",465:"SMTPS",587:"SMTP submission",993:"IMAPS",995:"POP3S",3306:"MySQL",5432:"PostgreSQL",6379:"Redis",8080:"HTTP alternativo"};
const http:Record<number,string>={100:"Continue",200:"OK",201:"Created",204:"No Content",301:"Moved Permanently",302:"Found",304:"Not Modified",400:"Bad Request",401:"Unauthorized",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",408:"Request Timeout",409:"Conflict",410:"Gone",413:"Content Too Large",415:"Unsupported Media Type",422:"Unprocessable Content",429:"Too Many Requests",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout"};

export function runNetwork(operation:string,v:Record<string,string>):{text:string}{
 if(operation==="ipv4-validate"){const p=ipv4(v.text);return{text:p?`IPv4 válida: ${p.join(".")}`:"IPv4 inválida."};}
 if(operation==="ipv4-binary"){const p=ipv4(v.text);return{text:p?p.map(x=>x.toString(2).padStart(8,"0")).join("."):"IPv4 inválida."};}
 if(operation==="binary-ipv4"){const parts=v.text.trim().split(".");if(parts.length!==4||parts.some(x=>!/^[01]{8}$/.test(x)))return{text:"Debe contener cuatro octetos binarios de 8 bits."};return{text:parts.map(x=>parseInt(x,2)).join(".")};}
 if(operation==="ipv4-int"){const p=ipv4(v.text);return{text:p?String(u32(p)):"IPv4 inválida."};}
 if(operation==="int-ipv4"){const x=Number(v.text.trim());return{text:Number.isInteger(x)&&x>=0&&x<=4294967295?fromU32(x):"Entero IPv4 inválido."};}
 if(operation==="mask-prefix"){const p=ipv4(v.text);if(!p)return{text:"Máscara inválida."};const pre=maskToPrefix(u32(p));return{text:pre===null?"Máscara no contigua.":`/${pre}`};}
 if(operation==="prefix-mask"){const p=Number(v.text.replace("/",""));if(!Number.isInteger(p)||p<0||p>32)return{text:"Prefijo inválido."};return{text:fromU32(prefixToMask(p))};}
 if(operation==="cidr"){const m=v.text.trim().match(/^(.+?)\/(\d{1,2})$/);if(!m)return{text:"Usa formato IPv4/prefijo, por ejemplo 192.168.1.20/24."};const ip=ipv4(m[1]),p=Number(m[2]);if(!ip||p<0||p>32)return{text:"CIDR inválido."};const mask=prefixToMask(p),x=u32(ip),network=x&mask,broadcast=(network|(~mask>>>0))>>>0;const hosts=p>=31?Math.pow(2,32-p):Math.max(0,Math.pow(2,32-p)-2);return{text:[`Red: ${fromU32(network)}`,`Máscara: ${fromU32(mask)}`,`Broadcast: ${fromU32(broadcast)}`,`Hosts utilizables: ${hosts}`].join("\n")};}
 if(operation==="ip-scope"){const p=ipv4(v.text);if(!p)return{text:"IPv4 inválida."};const [a,b,c]=p;const privateRange=(a===10)||(a===172&&b>=16&&b<=31)||(a===192&&b===168);const special=(a===0)||(a===100&&b>=64&&b<=127)||(a===127)||(a===169&&b===254)||(a===192&&b===0&&c===0)||(a===198&&b>=18&&b<=19)||(a>=224);return{text:privateRange?"Privada":special?"Reservada/especial":"Pública"};}
 if(operation==="ip-class"){const p=ipv4(v.text);if(!p)return{text:"IPv4 inválida."};const a=p[0];return{text:a<128?"Clase A":a<192?"Clase B":a<224?"Clase C":a<240?"Clase D (multicast)":"Clase E (experimental)"};}
 if(operation==="ipv6-validate"){try{const raw=v.text.trim();if(!raw||raw.includes("[")||raw.includes("]"))return{text:"IPv6 inválida."};const u=new URL(`http://[${raw}]/`);return{text:u.hostname?"IPv6 válida.":"IPv6 inválida."};}catch{return{text:"IPv6 inválida."};}}
 if(operation==="mac-validate"){const m=v.text.trim().replace(/[-.]/g,":").toUpperCase();return{text:/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(m)?`MAC válida: ${m}`:"MAC inválida."};}
 if(operation==="url-parse"){try{const u=new URL(v.text);return{text:[`Protocolo: ${u.protocol}`,`Host: ${u.hostname}`,`Puerto: ${u.port||"predeterminado"}`,`Ruta: ${u.pathname}`,`Query: ${u.search||"(vacía)"}`,`Fragmento: ${u.hash||"(vacío)"}`].join("\n")};}catch{return{text:"URL inválida."};}}
 if(operation==="url-origin"){try{return{text:new URL(v.text).origin};}catch{return{text:"URL inválida."};}}
 if(operation==="url-resolve"){try{return{text:new URL(v.text,v.base).href};}catch{return{text:"URL base o ruta inválida."};}}
 if(operation==="query-json"){try{const p=new URLSearchParams(v.text.replace(/^\?/,""));const o:Record<string,string|string[]>={};for(const [k,val] of p){if(k in o)o[k]=Array.isArray(o[k])?[...(o[k] as string[]),val]:[o[k] as string,val];else o[k]=val;}return{text:JSON.stringify(o,null,2)};}catch{return{text:"Query string inválida."};}}
 if(operation==="json-query"){try{const o=JSON.parse(v.text);if(!o||Array.isArray(o)||typeof o!=="object")return{text:"Introduce un objeto JSON plano."};const p=new URLSearchParams();for(const [k,val] of Object.entries(o)){if(val===null||val===undefined)continue;if(Array.isArray(val))val.forEach(x=>p.append(k,String(x)));else if(typeof val==="object")return{text:"Solo se admiten valores escalares o arrays."};else p.set(k,String(val));}return{text:p.toString()};}catch{return{text:"JSON inválido."};}}
 if(operation==="user-agent"){const s=v.text;const browser=/Edg\//.test(s)?"Edge":/OPR\//.test(s)?"Opera":/Chrome\//.test(s)?"Chrome":/Firefox\//.test(s)?"Firefox":/Safari\//.test(s)&&!/Chrome\//.test(s)?"Safari":"No identificado";const os=/Windows NT/.test(s)?"Windows":/Android/.test(s)?"Android":/(iPhone|iPad|CPU OS)/.test(s)?"iOS":/Mac OS X/.test(s)?"macOS":/Linux/.test(s)?"Linux":"No identificado";return{text:`Navegador: ${browser}\nSistema: ${os}`};}
 if(operation==="http-date"){const raw=v.text.trim();if(/^[-+]?\d+(?:\.\d+)?$/.test(raw)){const x=new Date(Number(raw)*1000);return{text:Number.isNaN(x.getTime())?"Timestamp inválido.":x.toISOString()+"\nHTTP: "+x.toUTCString()};}const d=new Date(raw);return{text:Number.isNaN(d.getTime())?"Fecha inválida.":d.toISOString()+"\nHTTP: "+d.toUTCString()};}
 if(operation==="http-class"){const code=Number(v.text.trim());return{text:Number.isInteger(code)&&code>=100&&code<600?(http[code]?`${code} — ${http[code]} (${Math.floor(code/100)}xx)`: `${Math.floor(code/100)}xx — código HTTP válido no incluido en el catálogo.`):"Código HTTP inválido."};}
 if(operation==="ports"){const p=Number(v.text.trim());return{text:Number.isInteger(p)&&p>=0&&p<=65535?(ports[p]?`${p}/tcp o UDP según servicio — ${ports[p]}`:`Puerto válido, no incluido en el catálogo común.`):"Puerto inválido."};}
 if(operation==="content-type"){const parts=v.text.split(";").map(x=>x.trim());if(!parts[0]||!/^[^\s/;]+\/[^\s;]+$/.test(parts[0]))return{text:"Content-Type inválido."};return{text:[`Tipo: ${parts[0]}`,...parts.slice(1).map(x=>`Parámetro: ${x}`)].join("\n")};}
 if(operation==="ipv4-hex"){const p=ipv4(v.text);return{text:p?`0x${u32(p).toString(16).padStart(8,"0")}`:"IPv4 inválida."};}
 if(operation==="ip-sort"){const list=v.text.split(/[\n,;]+/).map(x=>x.trim()).filter(Boolean);const parsed=list.map(x=>[x,ipv4(x)] as const);if(!list.length||parsed.some(x=>!x[1]))return{text:"La lista debe contener una o más IPv4 válidas."};return{text:parsed.sort((a,b)=>u32(a[1]!)-u32(b[1]!)).map(x=>x[0]).join("\n")};}
 return{text:"Operación no implementada."};
}
