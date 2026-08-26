import {makeTool} from "./types";

const f=(slug:string,name:string,operation:string,summary:string,fields:string[]=["text"])=>makeTool(slug,name,"archivos-documentos","local",summary,[name.toLowerCase(),"archivos","documentos","local"],{operation,fields});

export const FILES_TOOLS=[
 f("informacion-archivo","Información de archivo","file-info","Muestra nombre, tipo, tamaño y última modificación de un archivo.",["file"]),
 f("extension-archivo","Extensión de archivo","extension","Identifica la extensión y el nombre base de un archivo.",["file"]),
 f("mime-por-extension","MIME por extensión","mime","Obtiene el tipo MIME habitual a partir de una extensión.",["text"]),
 f("sanitizar-nombre-archivo","Sanitizar nombre de archivo","sanitize-name","Elimina caracteres problemáticos de un nombre de archivo.",["text"]),
 f("nombre-archivo-seguro","Nombre de archivo seguro","safe-name","Normaliza un nombre para uso multiplataforma.",["text"]),
 f("convertir-finales-linea","Convertir finales de línea","line-endings","Convierte entre LF, CRLF y CR.",["text","format"]),
 f("quitar-bom","Quitar BOM UTF-8","remove-bom","Elimina la marca BOM de un texto.",["text"]),
 f("detectar-codificacion-texto","Detectar codificación de texto","encoding-hint","Detecta BOM y ofrece una indicación conservadora de codificación.",["file"]),
 f("archivo-a-base64","Archivo a Base64","file-base64","Codifica un archivo local en Base64.",["file"]),
 f("base64-a-archivo","Base64 a archivo","base64-file","Convierte Base64 en un archivo descargable.",["text","filename"]),
 f("texto-a-archivo","Texto a archivo","text-file","Crea un archivo de texto descargable desde contenido local.",["text","filename"]),
 f("data-url-archivo","Archivo a Data URL","file-data-url","Convierte un archivo local a una Data URL.",["file"]),
 f("analizar-data-url","Analizar Data URL","parse-data-url","Separa MIME, codificación y contenido de una Data URL.",["text"]),
 f("checksum-sha256","SHA-256 de archivo","sha256","Calcula SHA-256 localmente con Web Crypto.",["file"]),
 f("detector-delimitador-csv","Detector de delimitador CSV","csv-delimiter","Estima el delimitador más frecuente de un CSV.",["text"]),
 f("csv-a-tsv","CSV a TSV","csv-tsv","Convierte un CSV sencillo a TSV respetando comillas básicas.",["text"]),
 f("tsv-a-csv","TSV a CSV","tsv-csv","Convierte TSV a CSV con escape de campos.",["text"]),
 f("jsonl-validador","Validador JSON Lines","jsonl-validate","Valida cada línea de un documento JSONL e identifica las líneas inválidas.",["text"]),
 f("jsonl-a-json","JSON Lines a JSON","jsonl-json","Convierte objetos JSONL a un array JSON.",["text"]),
 f("json-a-jsonl","JSON a JSON Lines","json-jsonl","Convierte un array JSON a JSON Lines.",["text"]),
 f("markdown-indice","Índice de Markdown","markdown-toc","Genera una tabla de contenidos a partir de encabezados Markdown.",["text"]),
 f("markdown-a-texto","Markdown a texto plano","markdown-strip","Elimina formato Markdown conservando el contenido textual.",["text"]),
 f("contar-bytes-texto","Bytes de texto","utf8-bytes","Calcula bytes UTF-8 de un texto.",["text"]),
 f("tamano-texto-formateado","Tamaño de texto","text-size","Muestra caracteres, palabras, líneas y bytes UTF-8.",["text"]),
] as const;

const mimeMap:Record<string,string>={txt:"text/plain",csv:"text/csv",tsv:"text/tab-separated-values",json:"application/json",xml:"application/xml",html:"text/html",css:"text/css",js:"text/javascript",ts:"text/typescript",md:"text/markdown",pdf:"application/pdf",zip:"application/zip",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",svg:"image/svg+xml",mp3:"audio/mpeg",wav:"audio/wav",mp4:"video/mp4",webm:"video/webm"};
const escCsv=(v:string)=>`"${v.replace(/"/g,'""')}"`;
const parseDelimited=(s:string,d:string)=>s.split(/\r?\n/).filter(Boolean).map(line=>{const out:string[]=[];let cur="",quoted=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(quoted&&line[i+1]==='"'){cur+='"';i++;}else quoted=!quoted;}else if(c===d&&!quoted){out.push(cur);cur="";}else cur+=c;}out.push(cur);return out;});

export async function runFiles(operation:string,values:Record<string,string>,file?:File):Promise<{text:string;download?:{blob:Blob;filename:string}}>{
 if(operation==="file-info"){if(!file)return{text:"Selecciona un archivo."};return{text:[`Nombre: ${file.name}`,`Tipo: ${file.type||"desconocido"}`,`Tamaño: ${file.size} bytes (${(file.size/1024).toFixed(2)} KiB)`,`Última modificación: ${new Date(file.lastModified).toLocaleString("es-AR")}`].join("\n")};}
 if(operation==="extension"){const n=values.text.trim().split(/[\\/]/).pop()||"";const i=n.lastIndexOf(".");return{text:i>0?`Nombre base: ${n.slice(0,i)}\nExtensión: ${n.slice(i+1).toLowerCase()}`:`Nombre base: ${n}\nExtensión: (sin extensión)`};}
 if(operation==="mime"){const e=values.text.trim().replace(/^\./,"").toLowerCase();return{text:mimeMap[e]||"MIME no identificado en el catálogo local."};}
 if(operation==="sanitize-name"||operation==="safe-name"){const n=values.text.trim();const clean=n.normalize("NFC").replace(/[<>:"/\\|?*\u0000-\u001F]/g,"_").replace(/[. ]+$/g,"");return{text:clean||"nombre-archivo"};}
 if(operation==="line-endings"){const f=values.format||"LF";const normalized=values.text.replace(/\r\n/g,"\n").replace(/\r/g,"\n");return{text:f==="CRLF"?normalized.replace(/\n/g,"\r\n"):f==="CR"?normalized.replace(/\n/g,"\r"):normalized};}
 if(operation==="remove-bom")return{text:values.text.replace(/^\uFEFF/,"")};
 if(operation==="encoding-hint"){if(!file)return{text:"Selecciona un archivo."};const b=new Uint8Array(await file.slice(0,4).arrayBuffer());let hint="Sin BOM detectado; no se puede confirmar la codificación solo con estos bytes.";if(b[0]===0xEF&&b[1]===0xBB&&b[2]===0xBF)hint="BOM UTF-8 detectado.";else if(b[0]===0xFF&&b[1]===0xFE)hint="BOM UTF-16 LE detectado.";else if(b[0]===0xFE&&b[1]===0xFF)hint="BOM UTF-16 BE detectado.";return{text:hint};}
 if(operation==="file-base64"){if(!file)return{text:"Selecciona un archivo."};const bytes=new Uint8Array(await file.arrayBuffer());let binary="";const chunk=0x8000;for(let i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));return{text:btoa(binary)};}
 if(operation==="base64-file"){try{const raw=atob(values.text.replace(/\s/g,""));const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));const name=values.filename.trim()||"archivo.bin";return{text:`Archivo preparado: ${name}\nTamaño: ${bytes.length} bytes`,download:{blob:new Blob([bytes],{type:mimeMap[name.split(".").pop()?.toLowerCase()||""]||"application/octet-stream"}),filename:name}};}catch{return{text:"Base64 inválido."};}}
 if(operation==="text-file"){const name=values.filename.trim()||"texto.txt";return{text:`Archivo preparado: ${name}`,download:{blob:new Blob([values.text],{type:"text/plain;charset=utf-8"}),filename:name}};}
 if(operation==="file-data-url"){if(!file)return{text:"Selecciona un archivo."};return{text:await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(r.error);r.readAsDataURL(file);})};}
 if(operation==="parse-data-url"){const m=values.text.trim().match(/^data:([^;,]+)?(?:;(base64))?,(.*)$/s);if(!m)return{text:"Data URL inválida."};return{text:[`MIME: ${m[1]||"text/plain"}`,`Codificación: ${m[2]?"Base64":"texto/percent-encoded"}`,`Contenido: ${m[3].slice(0,200)}${m[3].length>200?"…":""}`].join("\n")};}
 if(operation==="sha256"){if(!file)return{text:"Selecciona un archivo."};const digest=await crypto.subtle.digest("SHA-256",await file.arrayBuffer());return{text:Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,"0")).join("")};}
 if(operation==="csv-delimiter"){const s=values.text;const candidates=[",",";","\t","|"];const counts=candidates.map(d=>[d,(s.split(/\r?\n/).slice(0,10).join("\n").match(new RegExp(d==="\t"?"\\t":`\\${d}`,"g"))||[]).length] as const);const best=counts.sort((a,b)=>b[1]-a[1])[0];return{text:`Delimitador estimado: ${best[0]==="\t"?"TAB":best[0]}\nOcurrencias de muestra: ${best[1]}`};}
 if(operation==="csv-tsv"||operation==="tsv-csv"){const from=operation==="csv-tsv"?",":"\t",to=operation==="csv-tsv"?"\t":",";const rows=parseDelimited(values.text,from);const out=rows.map(r=>operation==="csv-tsv"?r.join("\t"):r.map(escCsv).join(",")).join("\n");return{text:out};}
 if(operation==="jsonl-validate"){const lines=values.text.split(/\r?\n/).filter(x=>x.trim());const bad:number[]=[];lines.forEach((line,i)=>{try{JSON.parse(line);}catch{bad.push(i+1);}});return{text:bad.length?`JSONL inválido. Líneas: ${bad.join(", ")}`:`JSONL válido: ${lines.length} líneas.`};}
 if(operation==="jsonl-json"){try{const arr=values.text.split(/\r?\n/).filter(x=>x.trim()).map(JSON.parse);return{text:JSON.stringify(arr,null,2)};}catch{return{text:"Una o más líneas no son JSON válido."};}}
 if(operation==="json-jsonl"){try{const v=JSON.parse(values.text);if(!Array.isArray(v))return{text:"El JSON debe ser un array."};return{text:v.map(x=>JSON.stringify(x)).join("\n")};}catch{return{text:"JSON inválido."};}}
 if(operation==="markdown-toc"){const lines=values.text.split(/\r?\n/);const toc=lines.map(l=>{const m=l.match(/^(#{1,6})\s+(.+)$/);if(!m)return"";const title=m[2].replace(/[*_`]/g,"").trim();const slug=title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-");return`${"  ".repeat(m[1].length-1)}- [${title}](#${slug})`;}).filter(Boolean).join("\n");return{text:toc||"No se encontraron encabezados."};}
 if(operation==="markdown-strip"){return{text:values.text.replace(/^#{1,6}\s+/gm,"").replace(/!\[([^\]]*)\]\([^)]*\)/g,"$1").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/[`*_~]/g,"").replace(/^>\s?/gm,"").replace(/^[-*+]\s+/gm,"").replace(/^\d+\.\s+/gm,"")};}
 if(operation==="utf8-bytes"){return{text:`Bytes UTF-8: ${new TextEncoder().encode(values.text).length}`};}
 if(operation==="text-size"){const lines=values.text?values.text.split(/\r?\n/).length:0;const words=values.text.trim()?values.text.trim().split(/\s+/).length:0;const chars=[...values.text].length;const bytes=new TextEncoder().encode(values.text).length;return{text:`Caracteres: ${chars}\nPalabras: ${words}\nLíneas: ${lines}\nBytes UTF-8: ${bytes}`};}
 return{text:"Operación no implementada."};
}
