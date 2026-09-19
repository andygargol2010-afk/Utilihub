import { useCallback, useEffect, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const COLS=20, ROWS=20, CELL=16, TICK_MS=110;
type Pt={x:number;y:number}; type Dir="U"|"D"|"L"|"R";
const DELTA: Record<Dir,Pt>={U:{x:0,y:-1},D:{x:0,y:1},L:{x:-1,y:0},R:{x:1,y:0}};
function opposite(a:Dir,b:Dir){return (a==="U"&&b==="D")||(a==="D"&&b==="U")||(a==="L"&&b==="R")||(a==="R"&&b==="L");}
function randomFood(snake:Pt[]):Pt{
  for(let n=0;n<200;n++){const p={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)}; if(!snake.some(s=>s.x===p.x&&s.y===p.y)) return p;}
  return {x:0,y:0};
}
function initialSnake():Pt[]{return [{x:8,y:10},{x:7,y:10},{x:6,y:10}];}

export function SnakeGame({ locale="en" }: { locale?: GameLocale }) {
  const es=locale==="es";
  const [snake,setSnake]=useState<Pt[]>(initialSnake);
  const [food,setFood]=useState<Pt>(()=>randomFood(initialSnake()));
  const [dir,setDir]=useState<Dir>("R");
  const [pendingDir,setPendingDir]=useState<Dir>("R");
  const [score,setScore]=useState(0);
  const [best,setBest]=useState(0);
  const [alive,setAlive]=useState(true);
  const [paused,setPaused]=useState(false);
  const touchRef=useRef<{x:number;y:number}|null>(null);
  useEffect(()=>{setBest(readBestScore("snake"));},[]);
  const reset=useCallback(()=>{const s=initialSnake();setSnake(s);setFood(randomFood(s));setDir("R");setPendingDir("R");setScore(0);setAlive(true);setPaused(false);},[]);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      const map:Record<string,Dir>={ArrowUp:"U",ArrowDown:"D",ArrowLeft:"L",ArrowRight:"R",w:"U",s:"D",a:"L",d:"R",W:"U",S:"D",A:"L",D:"R"};
      const next=map[e.key]; if(next){e.preventDefault();setPendingDir(cur=>opposite(dir,next)?cur:next);}
      if(e.key===" "||e.key==="p"||e.key==="P"){e.preventDefault();setPaused(p=>!p);}
    };
    window.addEventListener("keydown",onKey); return ()=>window.removeEventListener("keydown",onKey);
  },[dir]);
  useEffect(()=>{
    if(!alive||paused) return;
    const id=window.setInterval(()=>{
      setDir(pendingDir);
      setSnake(prev=>{
        const d=DELTA[pendingDir]; const head=prev[0]!; const nx=head.x+d.x, ny=head.y+d.y;
        if(nx<0||ny<0||nx>=COLS||ny>=ROWS||prev.some(p=>p.x===nx&&p.y===ny)){
          setAlive(false); setBest(b=>writeBestScore("snake",Math.max(b,score))); return prev;
        }
        const nextHead={x:nx,y:ny}; const grew=nx===food.x&&ny===food.y;
        const body=grew?prev:prev.slice(0,-1);
        if(grew){setScore(s=>s+1); setFood(randomFood([nextHead,...body]));}
        return [nextHead,...body];
      });
    },TICK_MS);
    return ()=>window.clearInterval(id);
  },[alive,paused,pendingDir,food,score]);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-100/90">
        <span>{es?"Puntos":"Score"}: <span className="tabular-nums text-white">{score}</span></span>
        <span>{es?"Mejor":"Best"}: <span className="tabular-nums text-amber-300">{best}</span></span>
        <div className="flex gap-2">
          <GameSecondaryButton onClick={()=>setPaused(p=>!p)} active={paused}>{paused?(es?"Seguir":"Resume"):(es?"Pausa":"Pause")}</GameSecondaryButton>
          <GamePrimaryButton onClick={reset}>{es?"Nuevo":"New"}</GamePrimaryButton>
        </div>
      </div>
      {!alive&&<p className="text-sm font-bold text-rose-300">Game over</p>}
      <div className="touch-none rounded-xl border border-white/10 bg-black/40 p-1"
        onTouchStart={e=>{const t=e.touches[0]; if(t) touchRef.current={x:t.clientX,y:t.clientY};}}
        onTouchEnd={e=>{const start=touchRef.current; const t=e.changedTouches[0]; if(!start||!t) return;
          const dx=t.clientX-start.x, dy=t.clientY-start.y; if(Math.abs(dx)<24&&Math.abs(dy)<24) return;
          const next:Dir=Math.abs(dx)>Math.abs(dy)?(dx>0?"R":"L"):(dy>0?"D":"U");
          setPendingDir(cur=>opposite(dir,next)?cur:next);}}
        style={{width:COLS*CELL+8,height:ROWS*CELL+8}}>
        <svg width={COLS*CELL} height={ROWS*CELL} className="block">
          <rect x={food.x*CELL} y={food.y*CELL} width={CELL-1} height={CELL-1} rx={3} fill="#fbbf24"/>
          {snake.map((p,i)=>(
            <rect key={`${p.x}-${p.y}-${i}`} x={p.x*CELL} y={p.y*CELL} width={CELL-1} height={CELL-1} rx={3} fill={i===0?"#34d399":"#059669"}/>
          ))}
        </svg>
      </div>
      <p className="text-center text-[11px] text-white/50">{es?"Flechas / WASD · swipe · espacio = pausa":"Arrows / WASD · swipe · space = pause"}</p>
    </div>
  );
}
