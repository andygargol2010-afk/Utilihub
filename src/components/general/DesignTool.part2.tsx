// Part 2 of 3 — split from DesignTool.tsx on 2026-11-04. Edit here; DesignTool.tsx re-exports.
import { hex } from "./DesignTool.part1";

export const validHex=(value:string)=>/^[0-9a-fA-F]{6}$/.test(hex(value));
export const toRgb=(value:string)=>{const h=hex(value);if(!validHex(value))return null;return{r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)}};
export const luminance=(value:string)=>{const rgb=toRgb(value);if(!rgb)return null;return[rgb.r,rgb.g,rgb.b].map(v=>{const x=v/255;return x<=.03928?x/12.92:((x+.055)/1.055)**2.4}).reduce((a,v,i)=>a+[.2126,.7152,.0722][i]*v,0)};
export const contrast=(a:string,b:string)=>{const x=luminance(a),y=luminance(b);if(x===null||y===null)return null;const hi=Math.max(x,y),lo=Math.min(x,y);return(hi+.05)/(lo+.05)};
export const rgbHex=(rgb:{r:number;g:number;b:number})=>`#${[rgb.r,rgb.g,rgb.b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("").toUpperCase()}`;
export const hsl=(value:string)=>{const rgb=toRgb(value);if(!rgb)return null;const r=rgb.r/255,g=rgb.g/255,b=rgb.b/255,max=Math.max(r,g,b),min=Math.min(r,g,b),l=(max+min)/2,d=max-min;let h=0,s=0;if(d){s=l>.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4}}return {h:Math.round(h*60),s:Math.round(s*100),l:Math.round(l*100),rgb}};
