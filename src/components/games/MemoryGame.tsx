import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton } from "./GameShell";

const ICONS = ["🍎","🍋","🍇","🍒","🥝","🍑","🍉","🍍"];
type Card = { id:number; icon:string; flipped:boolean; matched:boolean };

function buildDeck(): Card[] {
  const pairs = ICONS.flatMap((icon,i)=>[
    {id:i*2,icon,flipped:false,matched:false},
    {id:i*2+1,icon,flipped:false,matched:false},
  ]);
  for (let i=pairs.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pairs[i],pairs[j]]=[pairs[j]!,pairs[i]!]; }
  return pairs;
}

export function MemoryGame({ locale="en" }: { locale?: GameLocale }) {
  const es=locale==="es";
  const [cards,setCards]=useState<Card[]>(()=>buildDeck());
  const [open,setOpen]=useState<number[]>([]);
  const [moves,setMoves]=useState(0);
  const [locked,setLocked]=useState(false);
  const [best,setBest]=useState<number|null>(null);
  useEffect(()=>{ setBest(readBestLow("memory")); },[]);
  const matchedCount=useMemo(()=>cards.filter(c=>c.matched).length/2,[cards]);
  const done=matchedCount===ICONS.length;
  useEffect(()=>{ if(done) setBest(writeBestLow("memory",moves)); },[done,moves]);
  const reset=useCallback(()=>{ setCards(buildDeck()); setOpen([]); setMoves(0); setLocked(false); },[]);
  const flip=(index:number)=>{
    if(locked||done) return;
    const card=cards[index]; if(!card||card.flipped||card.matched||open.includes(index)) return;
    const nextOpen=[...open,index];
    setCards(cards.map((c,i)=>i===index?{...c,flipped:true}:c));
    if(nextOpen.length===1){ setOpen(nextOpen); return; }
    if(nextOpen.length===2){
      setMoves(m=>m+1); setOpen(nextOpen);
      const [a,b]=nextOpen; const ca=cards[a!]; const cb=cards[b!];
      // use updated icons from next state: compare via current cards + flipped index
      const iconA=(a===index?card.icon:cards[a!]!.icon);
      const iconB=(b===index?card.icon:cards[b!]!.icon);
      if(iconA===iconB){
        setCards(cur=>cur.map((c,i)=>i===a||i===b?{...c,matched:true,flipped:true}:c));
        setOpen([]);
      } else {
        setLocked(true);
        window.setTimeout(()=>{
          setCards(cur=>cur.map((c,i)=>i===a||i===b?{...c,flipped:false}:c));
          setOpen([]); setLocked(false);
        },650);
      }
    }
  };
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-100/90">
        <span>{es?"Movimientos":"Moves"}: <span className="tabular-nums text-white">{moves}</span></span>
        <span>{es?"Pares":"Pairs"}: <span className="tabular-nums text-white">{matchedCount}/{ICONS.length}</span></span>
        {best!=null&&<span>{es?"Mejor":"Best"}: <span className="tabular-nums text-amber-300">{best}</span></span>}
        <GamePrimaryButton onClick={reset}>{es?"Reiniciar":"Restart"}</GamePrimaryButton>
      </div>
      {done&&<p className="text-sm font-bold text-emerald-300">{es?`¡Completado en ${moves} movimientos!`:`Cleared in ${moves} moves!`}</p>}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card,i)=>{
          const show=card.flipped||card.matched;
          return (
            <button key={card.id} type="button" disabled={show||locked||done} onClick={()=>flip(i)}
              className={show
                ?"flex h-16 w-16 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/20 text-3xl sm:h-20 sm:w-20"
                :"flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-lg font-bold text-white/40 sm:h-20 sm:w-20"}>
              {show?card.icon:"?"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
