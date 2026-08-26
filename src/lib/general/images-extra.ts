import {makeTool} from "./types";
const i=(slug:string,name:string,operation:string,summary:string,fields:string[]=["file"])=>makeTool(slug,name,"imagenes","local",summary,[name.toLowerCase(),"imagen","imágenes","fotos","local"],{operation,fields});
export const IMAGE_TOOLS=[
 i("dimensiones-imagen","Dimensiones de imagen","dimensions","Muestra ancho, alto y relación de aspecto de una imagen."),
 i("relacion-aspecto-imagen","Relación de aspecto","aspect","Calcula la relación de aspecto simplificada de una imagen.",["file"]),
 i("megapixeles-imagen","Megapíxeles de imagen","megapixels","Calcula los megapíxeles de una imagen.",["file"]),
 i("tamano-impresion","Tamaño de impresión","print-size","Calcula el tamaño físico a partir de píxeles y DPI.",["file","dpi"]),
 i("dpi-desde-tamano","DPI desde tamaño","dpi-from-size","Calcula DPI a partir de píxeles y tamaño físico.",["file","widthCm","heightCm"]),
 i("rotar-90-imagen","Rotar 90° imagen","rotate90","Rota una imagen 90 grados en el navegador."),
 i("voltear-horizontal-imagen","Voltear horizontal","flip-h","Invierte horizontalmente una imagen local."),
 i("voltear-vertical-imagen","Voltear vertical","flip-v","Invierte verticalmente una imagen local."),
 i("imagen-escala-grises","Imagen a escala de grises","grayscale","Convierte una imagen a escala de grises."),
 i("imagen-invertir","Invertir colores de imagen","invert","Invierte los colores de una imagen."),
 i("imagen-sepia","Efecto sepia","sepia","Aplica un efecto sepia localmente."),
 i("imagen-blanco-negro","Blanco y negro","threshold","Aplica un umbral para obtener blanco y negro."),
 i("imagen-brillo","Ajustar brillo","brightness","Ajusta brillo mediante un factor controlado.",["file","factor"]),
 i("imagen-contraste","Ajustar contraste","contrast","Ajusta contraste mediante un factor controlado.",["file","factor"]),
 i("imagen-pixelada","Pixelar imagen","pixelate","Reduce resolución visual para crear un efecto pixelado."),
 i("imagen-desenfoque","Desenfocar imagen","blur","Aplica desenfoque mediante Canvas.",["file","radius"]),
 i("imagen-data-url","Imagen a Data URL","data-url","Convierte una imagen local a Data URL."),
 i("data-url-a-imagen","Data URL a imagen","from-data-url","Convierte una Data URL en una imagen descargable.",["text","filename"]),
 i("promedio-color-imagen","Color medio de imagen","average-color","Calcula el color medio aproximado muestreando píxeles."),
 i("info-archivo-imagen","Información de archivo de imagen","file-info","Muestra formato, tamaño y dimensiones de una imagen."),
 i("paleta-imagen","Paleta de imagen","palette","Extrae una pequeña paleta aproximada muestreando la imagen.")
] as const;

const load=(file:File)=>new Promise<HTMLImageElement>((resolve,reject)=>{const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("No se pudo leer la imagen."))};img.src=url;});
const canvasFor=(img:HTMLImageElement,w=img.naturalWidth,h=img.naturalHeight)=>{const c=document.createElement("canvas");c.width=w;c.height=h;const ctx=c.getContext("2d",{willReadFrequently:true})!;ctx.drawImage(img,0,0,w,h);return[c,ctx] as const};
const blobFromCanvas=(c:HTMLCanvasElement,type="image/png",quality=0.92)=>new Promise<Blob>((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error("No se pudo generar la imagen.")),type,quality));
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
const output=(blob:Blob,filename:string,text:string)=>({text,download:{blob,filename}});

export async function runImages(operation:string,v:Record<string,string>,file?:File):Promise<{text:string;download?:{blob:Blob;filename:string}}>{
 if(operation==="from-data-url"){try{const b=await fetch(v.text.trim()).then(r=>r.blob());return output(b,v.filename.trim()||"imagen.png",`Imagen preparada: ${v.filename.trim()||"imagen.png"}`);}catch{return{text:"Data URL inválida."};}}
 if(!file)return{text:"Selecciona una imagen."};
 try{
  const img=await load(file);
  if(operation==="dimensions")return{text:`Ancho: ${img.naturalWidth} px\nAlto: ${img.naturalHeight} px`};
  if(operation==="aspect"){const g=gcd(img.naturalWidth,img.naturalHeight);return{text:`${img.naturalWidth/g}:${img.naturalHeight/g}`};}
  if(operation==="megapixels")return{text:`${(img.naturalWidth*img.naturalHeight/1e6).toFixed(2)} MP`};
  if(operation==="print-size"){const dpi=Number(v.dpi);if(!Number.isFinite(dpi)||dpi<=0)return{text:"DPI inválido."};return{text:`Ancho: ${(img.naturalWidth/dpi*2.54).toFixed(2)} cm\nAlto: ${(img.naturalHeight/dpi*2.54).toFixed(2)} cm`};}
  if(operation==="dpi-from-size"){const w=Number(v.widthCm),h=Number(v.heightCm);if(!(w>0&&h>0))return{text:"Introduce ancho y alto físicos mayores que 0."};return{text:`DPI horizontal: ${(img.naturalWidth/(w/2.54)).toFixed(1)}\nDPI vertical: ${(img.naturalHeight/(h/2.54)).toFixed(1)}`};}
  if(operation==="file-info")return{text:[`Nombre: ${file.name}`,`Formato: ${file.type||"desconocido"}`,`Tamaño: ${file.size} bytes`,`Dimensiones: ${img.naturalWidth} × ${img.naturalHeight} px`].join("\n")};
  if(operation==="data-url")return{text:await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(r.error);r.readAsDataURL(file);})};
  if(operation==="average-color"||operation==="palette"){const [c,ctx]=canvasFor(img,Math.min(80,img.naturalWidth),Math.min(80,img.naturalHeight));const data=ctx.getImageData(0,0,c.width,c.height).data;const buckets:Record<string,number>={};let r=0,g=0,b=0,n=0;for(let i=0;i<data.length;i+=4){if(data[i+3]<20)continue;r+=data[i];g+=data[i+1];b+=data[i+2];n++;const key=`${Math.round(data[i]/32)*32},${Math.round(data[i+1]/32)*32},${Math.round(data[i+2]/32)*32}`;buckets[key]=(buckets[key]||0)+1;}if(!n)return{text:"No se encontraron píxeles opacos."};if(operation==="average-color")return{text:`RGB: ${Math.round(r/n)}, ${Math.round(g/n)}, ${Math.round(b/n)}\nHEX: #${[r/n,g/n,b/n].map(x=>Math.round(x).toString(16).padStart(2,"0")).join("")}`};const top=Object.entries(buckets).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([key])=>{const [R,G,B]=key.split(",").map(Number);return`#${[R,G,B].map(x=>Math.min(255,x).toString(16).padStart(2,"0")).join("")}`}).join("\n");return{text:top};}
  const [c,ctx]=canvasFor(img);
  if(operation==="rotate90"||operation==="flip-h"||operation==="flip-v"){const w=c.width,h=c.height;const outc=document.createElement("canvas");if(operation==="rotate90"){outc.width=h;outc.height=w;const o=outc.getContext("2d")!;o.translate(h,0);o.rotate(Math.PI/2);o.drawImage(c,0,0);}else{outc.width=w;outc.height=h;const o=outc.getContext("2d")!;o.translate(operation==="flip-h"?w:0,operation==="flip-v"?h:0);o.scale(operation==="flip-h"?-1:1,operation==="flip-v"?-1:1);o.drawImage(c,0,0);}const blob=await blobFromCanvas(outc,"image/png");return output(blob,`${file.name.replace(/\.[^.]+$/i,"")}-${operation}.png`,`Imagen procesada: ${outc.width} × ${outc.height} px`);}
  const data=ctx.getImageData(0,0,c.width,c.height);for(let i=0;i<data.data.length;i+=4){const d=data.data;if(operation==="grayscale"){const y=.299*d[i]+.587*d[i+1]+.114*d[i+2];d[i]=d[i+1]=d[i+2]=y;}else if(operation==="invert"){d[i]=255-d[i];d[i+1]=255-d[i+1];d[i+2]=255-d[i+2];}else if(operation==="sepia"){const r=d[i],g=d[i+1],b=d[i+2];d[i]=Math.min(255,.393*r+.769*g+.189*b);d[i+1]=Math.min(255,.349*r+.686*g+.168*b);d[i+2]=Math.min(255,.272*r+.534*g+.131*b);}else if(operation==="threshold"){const y=.299*d[i]+.587*d[i+1]+.114*d[i+2];const q=y>=128?255:0;d[i]=d[i+1]=d[i+2]=q;}else if(operation==="brightness"){const f=Math.max(0,Number(v.factor));d[i]=Math.min(255,d[i]*f);d[i+1]=Math.min(255,d[i+1]*f);d[i+2]=Math.min(255,d[i+2]*f);}else if(operation==="contrast"){const f=Number(v.factor);d[i]=Math.min(255,Math.max(0,(d[i]-128)*f+128));d[i+1]=Math.min(255,Math.max(0,(d[i+1]-128)*f+128));d[i+2]=Math.min(255,Math.max(0,(d[i+2]-128)*f+128));}}
  if(operation!=="pixelate"&&operation!=="blur")ctx.putImageData(data,0,0);
  if(operation==="pixelate"){const size=Math.max(2,Math.min(40,Math.trunc(Number(v.factor)||8)));const small=document.createElement("canvas");small.width=Math.ceil(c.width/size);small.height=Math.ceil(c.height/size);small.getContext("2d")!.drawImage(c,0,0,small.width,small.height);ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(small,0,0,c.width,c.height);}
  if(operation==="blur"){ctx.filter=`blur(${Math.max(0,Math.min(30,Number(v.radius)||4))}px)`;ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(img,0,0);ctx.filter="none";}
  const blob=await blobFromCanvas(c,"image/png");return output(blob,`${file.name.replace(/\.[^.]+$/i,"")}-${operation}.png`,`Imagen procesada: ${c.width} × ${c.height} px`);
 }catch(e){return{text:e instanceof Error?e.message:"No se pudo procesar la imagen."};}
}
