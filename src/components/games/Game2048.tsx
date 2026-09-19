import { useCallback, useEffect, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton } from "./GameShell";

type Board = number[][];
function emptyBoard(): Board { return Array.from({length:4},()=>Array(4).fill(0)); }
function spawn(board: Board): Board {
  const empty:[number,number][]=[]; for(let r=0;r<4;r++) for(let c=0;c<4;c++) if(!board[r]![c]) empty.push([r,c]);
  if(!empty.length) return board;
  const [r,c]=empty[Math.floor(Math.random()*empty.length)]!;
  const next=board.map(row=>row.slice()); next[r]![c]=Math.random()<0.9?2:4; return next;
}
function initBoard(){ return spawn(spawn(emptyBoard())); }
function slideRow(row:number[]){ const f=row.filter(n=>n!==0); const out:number[]=[]; let gained=0;
  for(let i=0;i<f.length;i++){ if(i+1<f.length&&f[i]===f[i+1]){ const v=f[i]!*2; out.push(v); gained+=v; i++; } else out.push(f[i]!); }
  while(out.length<4) out.push(0); return {row:out,gained};
}
function transpose(b:Board):Board{ return [0,1,2,3].map(c=>[0,1,2,3].map(r=>b[r]![c]!)); }
function applyLeft(b:Board){ let gained=0; const board=b.map(row=>{ const {row:nr,gained:g}=slideRow(row); gained+=g; return nr; }); return {board,gained}; }
function move(board:Board, dir:"L"|"R"|"U"|"D"){
  let working=board.map(r=>r.slice()); let gained=0;
  if(dir==="L"){ const res=applyLeft(working); working=res.board; gained=res.gained; }
  else if(dir==="R"){ const res=applyLeft(working.map(r=>r.slice().reverse())); working=res.board.map(r=>r.slice().reverse()); gained=res.gained; }
  else if(dir==="U"){ const res=applyLeft(transpose(working)); working=transpose(res.board); gained=res.gained; }
  else { const t=transpose(working).map(r=>r.slice().reverse()); const res=applyLeft(t); working=transpose(res.board.map(r=>r.slice().reverse())); gained=res.gained; }
  const moved=working.some((row,r)=>row.some((v,c)=>v!==board[r]![c])); return {board:working,gained,moved};
}
function canMove(board:Board){ return (["L","R","U","D"] as const).some(d=>move(board,d).moved); }
const COLORS:Record<number,string>={0:"bg-white/5 text-transparent",2:"bg-stone-200 text-stone-800",4:"bg-stone-300 text-stone-800",8:"bg-orange-300 text-orange-950",16:"bg-orange-400 text-white",32:"bg-orange-500 text-white",64:"bg-orange-600 text-white",128:"bg-amber-400 text-amber-950",256:"bg-amber-500 text-white",512:"bg-yellow-400 text-yellow-950",1024:"bg-lime-400 text-lime-950",2048:"bg-emerald-400 text-emerald-950"};

export function Game2048({ locale="en" }: { locale?: GameLocale }) {
  const es=locale==="es";
  const [board,setBoard]=useState<Board>(()=>initBoard());
  const [score,setScore]=useState(0); const [best,setBest]=useState(0);
  const [won,setWon]=useState(false); const [over,setOver]=useState(false);
  const [touchStart,setTouchStart]=useState<{x:number;y:number}|null>(null);
  useEffect(()=>{setBest(readBestScore("2048"));},[]);
  const reset=useCallback(()=>{setBoard(initBoard());setScore(0);setWon(false);setOver(false);},[]);
  const applyDir=useCallback((dir:"L"|"R"|"U"|"D")=>{
    if(over) return; const {board:next,gained,moved}=move(board,dir); if(!moved) return;
    const withSpawn=spawn(next); const newScore=score+gained;
    setBoard(withSpawn); setScore(newScore); setBest(b=>writeBestScore("2048",Math.max(b,newScore)));
    if(!won&&withSpawn.some(row=>row.some(v=>v>=2048))) setWon(true);
    if(!canMove(withSpawn)) setOver(true);
  },[board,over,score,won]);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      const map:Record<string,"L"|"R"|"U"|"D">={ArrowLeft:"L",ArrowRight:"R",ArrowUp:"U",ArrowDown:"D",a:"L",d:"R",w:"U",s:"D",A:"L",D:"R",W:"U",S:"D"};
      const dir=map[e.key]; if(dir){e.preventDefault();applyDir(dir);}
    };
    window.addEventListener("keydown",onKey); return ()=>window.removeEventListener("keydown",onKey);
  },[applyDir]);
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-100/90">
        <span>{es?"Puntos":"Score"}: <span className="tabular-nums text-white">{score}</span></span>
        <span>{es?"Mejor":"Best"}: <span className="tabular-nums text-amber-300">{best}</span></span>
        <GamePrimaryButton onClick={reset}>{es?"Nuevo":"New"}</GamePrimaryButton>
      </div>
      {(won||over)&&<p className="text-sm font-bold text-emerald-300">{over?(es?"Sin movimientos":"No moves left"):(es?"¡2048!":"You reached 2048!")}</p>}
      <div className="grid grid-cols-4 gap-2 rounded-2xl bg-black/30 p-2 touch-none"
        onTouchStart={e=>{const t=e.touches[0]; if(t) setTouchStart({x:t.clientX,y:t.clientY});}}
        onTouchEnd={e=>{const t=e.changedTouches[0]; if(!touchStart||!t) return;
          const dx=t.clientX-touchStart.x, dy=t.clientY-touchStart.y; if(Math.abs(dx)<20&&Math.abs(dy)<20) return;
          if(Math.abs(dx)>Math.abs(dy)) applyDir(dx>0?"R":"L"); else applyDir(dy>0?"D":"U"); setTouchStart(null);}}>
        {board.flatMap((row,r)=>row.map((v,c)=>(
          <div key={`${r}-${c}`} className={`flex h-16 w-16 items-center justify-center rounded-lg text-lg font-black sm:h-[4.5rem] sm:w-[4.5rem] sm:text-xl ${COLORS[v]??"bg-emerald-500 text-white"}`}>{v||""}</div>
        )))}
      </div>
      <p className="text-center text-[11px] text-white/50">{es?"Flechas / WASD o swipe":"Arrows / WASD or swipe"}</p>
    </div>
  );
}
