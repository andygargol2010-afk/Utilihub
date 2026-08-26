import {makeTool} from "./types";
const g=(slug:string,name:string,operation:string,summary:string,fields:string[]=["text"])=>makeTool(slug,name,"geografia-mapas","local",summary,[name.toLowerCase(),"geografía","mapas","coordenadas","gps"],{operation,fields});
export const GEO_TOOLS=[
 g("decimal-a-dms","Decimal a DMS","decimal-dms","Convierte coordenadas decimales a grados, minutos y segundos.",["lat","lon"]),
 g("dms-a-decimal","DMS a decimal","dms-decimal","Convierte una coordenada DMS a decimal.",["text"]),
 g("distancia-coordenadas","Distancia entre coordenadas","distance","Calcula distancia Haversine entre dos puntos.",["lat1","lon1","lat2","lon2"]),
 g("rumbo-coordenadas","Rumbo entre coordenadas","bearing","Calcula el rumbo inicial entre dos puntos.",["lat1","lon1","lat2","lon2"]),
 g("punto-medio-coordenadas","Punto medio geográfico","midpoint","Calcula el punto medio de dos coordenadas.",["lat1","lon1","lat2","lon2"]),
 g("destino-coordenadas","Punto destino","destination","Calcula un punto dado origen, distancia y rumbo.",["lat","lon","distanceKm","bearing"]),
 g("coordenadas-validador","Validador de coordenadas","validate","Valida latitud y longitud dentro de sus rangos.",["lat","lon"]),
 g("latitud-antipoda","Antípoda de coordenada","antipode","Calcula la coordenada antipodal.",["lat","lon"]),
 g("convertir-radianes-grados","Radianes a grados","rad-deg","Convierte radianes a grados."),
 g("convertir-grados-radianes","Grados a radianes","deg-rad","Convierte grados a radianes."),
 g("distancia-nautica","Distancia náutica","nautical-distance","Convierte kilómetros a millas náuticas y viceversa.",["value","unit"]),
 g("km-a-millas","Kilómetros a millas","km-miles","Convierte kilómetros a millas."),
 g("millas-a-km","Millas a kilómetros","miles-km","Convierte millas a kilómetros."),
 g("metros-a-grados-aprox","Metros a grados aproximados","meters-degrees","Estima grados de latitud equivalentes a una distancia dada.",["meters","latitude"]),
 g("geohash-codificar","Codificar Geohash","geohash-encode","Codifica latitud y longitud en Geohash.",["lat","lon","precision"]),
 g("geohash-decoder","Decodificar Geohash","geohash-decode","Decodifica un Geohash a un centro de coordenadas.",["text"]),
 g("utm-conceptual","UTM: zona desde longitud","utm-zone","Calcula la zona UTM a partir de longitud.",["lon"]),
 g("zona-horaria-utc-offset","UTC offset a horas","utc-offset","Convierte un offset UTC textual a horas decimales."),
 g("coordenadas-a-json","Coordenadas a GeoJSON","geojson","Genera un punto GeoJSON desde latitud y longitud.",["lat","lon"]),
 g("geojson-a-coordenadas","GeoJSON a coordenadas","geojson-parse","Extrae coordenadas de un Point GeoJSON.",["text"]),
 g("area-triangulo-coordenadas","Área de triángulo geográfico","triangle-area","Calcula un área plana aproximada para tres coordenadas cercanas.",["lat1","lon1","lat2","lon2","lat3","lon3"]),
 g("promedio-coordenadas","Centroide simple","coordinate-average","Calcula el promedio de varias coordenadas como aproximación local.",["text"]),
] as const;

const R=6371;
const rad=(x:number)=>x*Math.PI/180;
const deg=(x:number)=>x*180/Math.PI;
const valid=(lat:number,lon:number)=>Number.isFinite(lat)&&Number.isFinite(lon)&&lat>=-90&&lat<=90&&lon>=-180&&lon<=180;
const dist=(a:number,b:number,c:number,d:number)=>{const p1=rad(a),p2=rad(c),dp=rad(c-a),dl=rad(d-b);const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;return 2*R*Math.asin(Math.min(1,Math.sqrt(h)))};
const bearing=(a:number,b:number,c:number,d:number)=>{const p1=rad(a),p2=rad(c),dl=rad(d-b);return (deg(Math.atan2(Math.sin(dl)*Math.cos(p2),Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl)))+360)%360};
const dms=(x:number,pos:string,neg:string)=>{const sign=x<0?neg:pos;const a=Math.abs(x),d=Math.floor(a),m0=(a-d)*60,m=Math.floor(m0),s=(m0-m)*60;return `${d}° ${m}' ${s.toFixed(3)}" ${sign}`};
const geohashBase="0123456789bcdefghjkmnpqrstuvwxyz";
const encodeHash=(lat:number,lon:number,precision:number)=>{let minLat=-90,maxLat=90,minLon=-180,maxLon=180,bits=0,bit=0,out="";for(let i=0;i<precision*5;i++){if(i%2===0){const mid=(minLon+maxLon)/2;if(lon>=mid){bits=(bits<<1)|1;minLon=mid}else{bits<<=1;maxLon=mid}}else{const mid=(minLat+maxLat)/2;if(lat>=mid){bits=(bits<<1)|1;minLat=mid}else{bits<<=1;maxLat=mid}}bit++;if(bit===5){out+=geohashBase[bits];bits=0;bit=0;}}return out};
const decodeHash=(hash:string)=>{let minLat=-90,maxLat=90,minLon=-180,maxLon=180,even=true;for(const ch of hash.toLowerCase()){const v=geohashBase.indexOf(ch);if(v<0)throw new Error("Geohash inválido.");for(let mask=16;mask;mask>>=1){if(even){const mid=(minLon+maxLon)/2;v&mask?minLon=mid:maxLon=mid;}else{const mid=(minLat+maxLat)/2;v&mask?minLat=mid:maxLat=mid;}even=!even;}}return{lat:(minLat+maxLat)/2,lon:(minLon+maxLon)/2};};

export function runGeo(operation:string,v:Record<string,string>):{text:string}{
 if(operation==="decimal-dms"){const lat=Number(v.lat),lon=Number(v.lon);if(!valid(lat,lon))return{text:"Coordenadas inválidas."};return{text:`Latitud: ${dms(lat,"N","S")}\nLongitud: ${dms(lon,"E","O")}`};}
 if(operation==="dms-decimal"){const m=v.text.trim().match(/^(\d+)\s*[° ]\s*(\d+)[' ]\s*([\d.]+)\"?\s*([NSEOW])$/i);if(!m)return{text:"Usa D M S y una dirección N/S/E/O."};const x=Number(m[1])+Number(m[2])/60+Number(m[3])/3600;const sign=/[SO]/i.test(m[4])?-1:1;return{text:String(sign*x)};}
 if(operation==="validate"){const a=Number(v.lat),b=Number(v.lon);return{text:valid(a,b)?"Coordenadas válidas.":"Latitud debe estar entre -90 y 90 y longitud entre -180 y 180."};}
 if(operation==="distance"){const a=Number(v.lat1),b=Number(v.lon1),c=Number(v.lat2),d=Number(v.lon2);return{text:valid(a,b)&&valid(c,d)?`${dist(a,b,c,d).toFixed(3)} km`:"Coordenadas inválidas."};}
 if(operation==="bearing"){const a=Number(v.lat1),b=Number(v.lon1),c=Number(v.lat2),d=Number(v.lon2);return{text:valid(a,b)&&valid(c,d)?`${bearing(a,b,c,d).toFixed(2)}°`:"Coordenadas inválidas."};}
 if(operation==="midpoint"){const a=Number(v.lat1),b=Number(v.lon1),c=Number(v.lat2),d=Number(v.lon2);if(!valid(a,b)||!valid(c,d))return{text:"Coordenadas inválidas."};const p1=rad(a),p2=rad(c),dl=rad(d-b);const bx=Math.cos(p2)*Math.cos(dl),by=Math.cos(p2)*Math.sin(dl);const lat=deg(Math.atan2(Math.sin(p1)+Math.sin(p2),Math.sqrt((Math.cos(p1)+bx)**2+by**2)));const lon=b+deg(Math.atan2(by,Math.cos(p1)+bx));return{text:`Latitud: ${lat}\nLongitud: ${((lon+540)%360)-180}`};}
 if(operation==="destination"){const a=Number(v.lat),b=Number(v.lon),km=Number(v.distanceKm),br=rad(Number(v.bearing));if(!valid(a,b)||!(km>=0)||!Number.isFinite(br))return{text:"Parámetros inválidos."};const p1=rad(a),l1=rad(b),ang=km/R;const p2=Math.asin(Math.sin(p1)*Math.cos(ang)+Math.cos(p1)*Math.sin(ang)*Math.cos(br));const l2=l1+Math.atan2(Math.sin(br)*Math.sin(ang)*Math.cos(p1),Math.cos(ang)-Math.sin(p1)*Math.sin(p2));return{text:`Latitud: ${deg(p2)}\nLongitud: ${((deg(l2)+540)%360)-180}`};}
 if(operation==="antipode"){const lat=Number(v.lat),lon=Number(v.lon);if(!valid(lat,lon))return{text:"Coordenadas inválidas."};return{text:`Latitud: ${-lat}\nLongitud: ${lon>0?lon-180:lon+180}`};}
 if(operation==="rad-deg"){const x=Number(v.text);return{text:Number.isFinite(x)?String(deg(x)):"Número inválido."};}
 if(operation==="deg-rad"){const x=Number(v.text);return{text:Number.isFinite(x)?String(rad(x)):"Número inválido."};}
 if(operation==="nautical-distance"){const x=Number(v.value);if(!(x>=0))return{text:"Valor inválido."};return{text:v.unit==="nm"?`${(x*1.852).toFixed(4)} km`:`${(x/1.852).toFixed(4)} nm`};}
 if(operation==="km-miles"){const x=Number(v.text);return{text:Number.isFinite(x)?`${(x*0.621371).toFixed(4)} mi`:"Número inválido."};}
 if(operation==="miles-km"){const x=Number(v.text);return{text:Number.isFinite(x)?`${(x*1.609344).toFixed(4)} km`:"Número inválido."};}
 if(operation==="meters-degrees"){const m=Number(v.meters),lat=Number(v.latitude);if(!(m>=0)||!Number.isFinite(lat)||Math.abs(lat)>90)return{text:"Parámetros inválidos."};const latDeg=m/111320,lonDeg=m/(111320*Math.cos(rad(lat)));return{text:`Latitud aproximada: ${latDeg.toFixed(6)}°\nLongitud aproximada: ${lonDeg.toFixed(6)}°`};}
 if(operation==="geohash-encode"){const lat=Number(v.lat),lon=Number(v.lon),p=Math.trunc(Number(v.precision)||7);if(!valid(lat,lon)||p<1||p>12)return{text:"Coordenadas o precisión inválidas."};return{text:encodeHash(lat,lon,p)};}
 if(operation==="geohash-decode"){try{const x=decodeHash(v.text.trim());return{text:`Latitud aproximada: ${x.lat}\nLongitud aproximada: ${x.lon}`};}catch(e){return{text:e instanceof Error?e.message:"Geohash inválido."}}}
 if(operation==="utm-zone"){const lon=Number(v.lon);return{text:Number.isFinite(lon)&&lon>=-180&&lon<=180?String(Math.floor((lon+180)/6)+1):"Longitud inválida."};}
 if(operation==="utc-offset"){const s=v.text.trim().toUpperCase().replace("UTC","");const m=s.match(/^([+-])(\d{1,2})(?::(\d{2}))?$/);if(!m)return{text:"Usa UTC+01, UTC-03 o un formato equivalente."};return{text:String((m[1]==="-"?-1:1)*(Number(m[2])+Number(m[3]||0)/60))};}
 if(operation==="geojson"){const lat=Number(v.lat),lon=Number(v.lon);return{text:valid(lat,lon)?JSON.stringify({type:"Point",coordinates:[lon,lat]},null,2):"Coordenadas inválidas."};}
 if(operation==="geojson-parse"){try{const x=JSON.parse(v.text);if(x.type!=="Point"||!Array.isArray(x.coordinates)||x.coordinates.length<2)return{text:"Se esperaba un GeoJSON Point."};const [lon,lat]=x.coordinates;if(!valid(lat,lon))return{text:"Coordenadas fuera de rango."};return{text:`Latitud: ${lat}\nLongitud: ${lon}`};}catch{return{text:"GeoJSON inválido."};}}
 if(operation==="triangle-area"){const pts=[[Number(v.lat1),Number(v.lon1)],[Number(v.lat2),Number(v.lon2)],[Number(v.lat3),Number(v.lon3)]];if(pts.some(p=>!valid(p[0],p[1])))return{text:"Coordenadas inválidas."};const lat0=rad((pts[0][0]+pts[1][0]+pts[2][0])/3);const xy=pts.map(([lat,lon])=>[R*rad(lon)*Math.cos(lat0),R*rad(lat)]);const area=Math.abs((xy[0][0]*(xy[1][1]-xy[2][1])+xy[1][0]*(xy[2][1]-xy[0][1])+xy[2][0]*(xy[0][1]-xy[1][1]))/2);return{text:`Área aproximada: ${area.toFixed(6)} km²`};}
 if(operation==="coordinate-average"){const rows=v.text.split(/\n/).filter(Boolean).map(x=>x.split(/[;,\s]+/).map(Number));if(!rows.length||rows.some(r=>r.length<2||!valid(r[0],r[1])))return{text:"Usa una coordenada latitud longitud por línea."};return{text:`Latitud media: ${rows.reduce((a,r)=>a+r[0],0)/rows.length}\nLongitud media: ${rows.reduce((a,r)=>a+r[1],0)/rows.length}`};}
 return{text:"Operación no implementada."};
}
