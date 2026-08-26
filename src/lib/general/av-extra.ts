import {makeTool} from "./types";
const a=(slug:string,name:string,operation:string,summary:string,fields:string[]=["text"])=>makeTool(slug,name,"audio-video","local",summary,[name.toLowerCase(),"audio","vídeo","multimedia"],{operation,fields});
export const AV_TOOLS=[
 a("formatear-duracion","Formatear duración","duration-format","Convierte segundos a HH:MM:SS."),
 a("duracion-a-segundos","Duración a segundos","duration-seconds","Convierte HH:MM:SS a segundos."),
 a("tasa-bits-a-tamano","Bitrate a tamaño","bitrate-size","Estima tamaño de archivo a partir de bitrate y duración.",["bitrate","duration"]),
 a("tamano-a-bitrate","Tamaño a bitrate","size-bitrate","Calcula bitrate medio desde tamaño y duración.",["sizeMB","duration"]),
 a("bitrate-audio-pcm","Bitrate PCM","pcm-bitrate","Calcula bitrate de audio PCM sin comprimir.",["sampleRate","bits","channels"]),
 a("tamano-wav","Tamaño WAV","wav-size","Estima tamaño de WAV PCM sin cabecera.",["sampleRate","bits","channels","duration"]),
 a("fps-a-duracion-frame","Duración de frame","frame-duration","Calcula duración de un frame según FPS."),
 a("frames-desde-duracion","Frames desde duración","frames-duration","Calcula frames totales desde duración y FPS.",["duration","fps"]),
 a("duracion-desde-frames","Duración desde frames","duration-frames","Calcula duración desde frames y FPS.",["frames","fps"]),
 a("timecode-a-frames","Timecode a frames","timecode-frames","Convierte HH:MM:SS:FF a número de frame.",["timecode","fps"]),
 a("frames-a-timecode","Frames a timecode","frames-timecode","Convierte frames a HH:MM:SS:FF.",["frames","fps"]),
 a("resolucion-pixel-count","Píxeles de resolución","pixels","Calcula píxeles totales de una resolución.",["width","height"]),
 a("relacion-aspecto-video","Relación de aspecto de vídeo","aspect","Simplifica la relación de aspecto de una resolución.",["width","height"]),
 a("escalar-resolucion-video","Escalar resolución","scale-resolution","Calcula una resolución manteniendo proporción.",["width","height","scale"]),
 a("bitrate-video-tamano","Bitrate de vídeo a tamaño","video-size","Estima almacenamiento de vídeo desde bitrate y duración.",["bitrate","duration"]),
 a("almacenamiento-minuto-video","Almacenamiento por minuto","minute-storage","Calcula almacenamiento aproximado por minuto según bitrate.",["bitrate"]),
 a("subtitulo-a-segundos","Timecode de subtítulo a segundos","subtitle-seconds","Convierte HH:MM:SS,mmm a segundos.",["timecode"]),
 a("segundos-a-subtitulo","Segundos a timecode","seconds-subtitle","Convierte segundos a HH:MM:SS,mmm."),
 a("metadatos-media","Metadatos multimedia","metadata","Lee metadatos básicos de un archivo de audio o vídeo mediante el navegador.",["file"]),
 a("duracion-media","Duración multimedia","media-duration","Lee duración, dimensiones y tipo de un archivo multimedia local.",["file"]),
 a("frecuencia-muestreo-guia","Guía de frecuencia de muestreo","sample-rate","Interpreta una frecuencia de muestreo de audio.")
] as const;

const sec=(s:string)=>{const n=Number(s);return Number.isFinite(n)&&n>=0?n:null};
const fmt=(s:number)=>{s=Math.max(0,s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${x.toFixed(3).padStart(6,"0")}`};
const mediaMeta=(file:File)=>new Promise<{duration:number;width:number;height:number}>((resolve,reject)=>{const url=URL.createObjectURL(file);const el=document.createElement(file.type.startsWith("audio/")?"audio":"video");el.preload="metadata";el.onloadedmetadata=()=>{URL.revokeObjectURL(url);resolve({duration:Number.isFinite(el.duration)?el.duration:0,width:"videoWidth" in el?(el as HTMLVideoElement).videoWidth:0,height:"videoHeight" in el?(el as HTMLVideoElement).videoHeight:0})};el.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("No se pudieron leer los metadatos multimedia."))};el.src=url;});

export async function runAV(operation:string,v:Record<string,string>,file?:File):Promise<{text:string}>{
 if(operation==="duration-format"){const s=sec(v.text);return{text:s===null?"Duración inválida.":fmt(s)}}
 if(operation==="duration-seconds"){const m=v.text.trim().match(/^(\d+):(\d{2}):(\d{2}(?:\.\d+)?)$/);if(!m)return{text:"Usa HH:MM:SS."};const mm=Number(m[2]),ss=Number(m[3]);if(mm>59||ss>=60)return{text:"Minutos y segundos deben estar entre 0 y 59."};const x=Number(m[1])*3600+mm*60+ss;return{text:Number.isFinite(x)?String(x):"Duración inválida."}}
 if(operation==="bitrate-size"||operation==="video-size"){const kb=Number(v.bitrate),d=Number(v.duration);if(!(kb>=0&&d>=0))return{text:"Bitrate y duración deben ser válidos."};const bytes=kb*1000*d/8;return{text:`Bytes: ${Math.round(bytes)}\nMB decimales: ${(bytes/1e6).toFixed(2)}\nGB decimales: ${(bytes/1e9).toFixed(3)}`}}
 if(operation==="size-bitrate"){const mb=Number(v.sizeMB),d=Number(v.duration);if(!(mb>=0&&d>0))return{text:"Tamaño válido y duración mayor que 0 requeridos."};return{text:`Bitrate medio: ${(mb*8e6/d/1000).toFixed(2)} kb/s`}}
 if(operation==="pcm-bitrate"){const sr=Number(v.sampleRate),bits=Number(v.bits),ch=Number(v.channels);if(!(sr>0&&bits>0&&ch>0))return{text:"Frecuencia, bits y canales deben ser mayores que 0."};return{text:`${(sr*bits*ch/1000).toFixed(2)} kb/s`}}
 if(operation==="wav-size"){const sr=Number(v.sampleRate),bits=Number(v.bits),ch=Number(v.channels),d=Number(v.duration);if(!(sr>0&&bits>0&&ch>0&&d>=0))return{text:"Parámetros WAV inválidos."};const bytes=sr*bits/8*ch*d;return{text:`Datos PCM: ${Math.round(bytes)} bytes\nAproximado con cabecera WAV: ${Math.round(bytes+44)} bytes`}}
 if(operation==="frame-duration"){const fps=Number(v.text);return{text:fps>0?`${(1000/fps).toFixed(3)} ms/frame`:"FPS inválidos."}}
 if(operation==="frames-duration"){const d=Number(v.duration),fps=Number(v.fps);return{text:d>=0&&fps>0?String(Math.round(d*fps)):"Duración o FPS inválidos."}}
 if(operation==="duration-frames"){const fr=Number(v.frames),fps=Number(v.fps);return{text:fr>=0&&fps>0?fmt(fr/fps):"Frames o FPS inválidos."}}
 if(operation==="timecode-frames"){const m=v.timecode.trim().match(/^(\d+):(\d{2}):(\d{2}):(\d{2})$/),fps=Number(v.fps);if(!m||!(fps>0))return{text:"Usa HH:MM:SS:FF y FPS válidos."};const ff=Number(m[4]),frameBase=Math.ceil(fps);if(ff>=frameBase)return{text:`El número de frame debe ser menor que ${frameBase}.`};return{text:String(((Number(m[1])*3600+Number(m[2])*60+Number(m[3]))*fps)+ff)}}
 if(operation==="frames-timecode"){const fr=Number(v.frames),fps=Number(v.fps);if(!(Number.isInteger(fr)&&fr>=0&&fps>0))return{text:"Frames entero no negativos y FPS válidos requeridos."};const f=fr,frameBase=Math.ceil(fps),ff=f%frameBase,total=Math.floor(f/fps),s=total%60,m=Math.floor(total/60)%60,h=Math.floor(total/3600);return{text:`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(ff).padStart(2,"0")}`}}
 if(operation==="pixels"){const w=Number(v.width),h=Number(v.height);return{text:w>0&&h>0?`${(w*h).toLocaleString("es-AR")} píxeles`:"Resolución inválida."}}
 if(operation==="aspect"){const w=Number(v.width),h=Number(v.height);if(!(w>0&&h>0))return{text:"Resolución inválida."};const g=(x:number,y:number):number=>y?g(y,x%y):x;const q=g(w,h);return{text:`${w/q}:${h/q}`}}
 if(operation==="scale-resolution"){const w=Number(v.width),h=Number(v.height),s=Number(v.scale);return{text:w>0&&h>0&&s>0?`${Math.round(w*s)} × ${Math.round(h*s)} px`:"Parámetros inválidos."}}
 if(operation==="minute-storage"){const kb=Number(v.bitrate);return{text:kb>=0?`${(kb*1000*60/8/1e6).toFixed(2)} MB/min`:"Bitrate inválido."}}
 if(operation==="subtitle-seconds"){const m=v.timecode.trim().match(/^(\d+):(\d{2}):(\d{2})[,.](\d{3})$/);if(!m)return{text:"Usa HH:MM:SS,mmm."};const mm=Number(m[2]),ss=Number(m[3]);if(mm>59||ss>59)return{text:"Minutos y segundos deben estar entre 0 y 59."};return{text:String(Number(m[1])*3600+mm*60+ss+Number(m[4])/1000)}}
 if(operation==="seconds-subtitle"){const s=Number(v.text);if(!(s>=0))return{text:"Segundos inválidos."};const ms=Math.round((s-Math.floor(s))*1000);const t=Math.floor(s)+(ms===1000?1:0),fixedMs=ms===1000?0:ms,ss=t%60,mm=Math.floor(t/60)%60,hh=Math.floor(t/3600);return{text:`${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")},${String(fixedMs).padStart(3,"0")}`}}
 if(operation==="metadata"||operation==="media-duration"){if(!file)return{text:"Selecciona un archivo multimedia."};try{const m=await mediaMeta(file);return{text:[`Nombre: ${file.name}`,`Tipo: ${file.type||"desconocido"}`,`Tamaño: ${file.size} bytes`,`Duración: ${fmt(m.duration)}`,m.width?`Resolución: ${m.width} × ${m.height} px`:""].filter(Boolean).join("\n")};}catch(e){return{text:e instanceof Error?e.message:"No se pudieron leer los metadatos."}}}
 if(operation==="sample-rate"){const x=Number(v.text);const common=[8000,16000,22050,24000,32000,44100,48000,88200,96000,192000];if(!(x>0))return{text:"Frecuencia inválida."};const nearest=common.reduce((a,b)=>Math.abs(b-x)<Math.abs(a-x)?b:a);return{text:`${x.toLocaleString("es-AR")} Hz\nReferencia cercana: ${nearest.toLocaleString("es-AR")} Hz`}}
 return{text:"Operación no implementada."};
}
