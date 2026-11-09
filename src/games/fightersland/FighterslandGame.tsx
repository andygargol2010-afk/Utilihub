import { useEffect, useRef, useState } from 'react';
import { CHARACTERS, type Fighter, type AttackType, GROUND_Y, ARENA_WIDTH, ARENA_HEIGHT } from './types';

const CHAR = CHARACTERS[0];

function createFighter(isPlayer: boolean): Fighter {
  return {
    id: isPlayer ? 'p1' : 'ai',
    char: CHAR,
    x: isPlayer ? 200 : 700,
    y: GROUND_Y,
    vx: 0,
    facing: isPlayer ? 1 : -1,
    hp: 100,
    maxHp: 100,
    state: 'idle',
    attackTimer: 0,
    charge: 0,
    isCharging: false,
    blockTimer: 0,
    dodgeTimer: 0,
    hitstunTimer: 0,
    isPlayer,
    wins: 0,
  };
}

export function FighterslandGame({ locale = 'en' }: { locale?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [wins, setWins] = useState({ p1: 0, ai: 0 });
  const game = useRef({ p1: createFighter(true), ai: createFighter(false), running: false });
  const keys = useRef(new Set<string>());

  const start = () => {
    game.current = { p1: createFighter(true), ai: createFighter(false), running: true };
    setShowTutorial(false);
    setWins({ p1: 0, ai: 0 });
  };

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    let id = 0;
    const loop = () => {
      const g = game.current;
      if (!g.running) { id = requestAnimationFrame(loop); return; }
      const p = g.p1, ai = g.ai;
      p.vx = 0;
      if (keys.current.has('ArrowLeft') || keys.current.has('a')) p.vx = -4;
      if (keys.current.has('ArrowRight') || keys.current.has('d')) p.vx = 4;
      if (p.vx) p.facing = p.vx > 0 ? 1 : -1;
      const d = p.x - ai.x;
      ai.vx = Math.abs(d) > 70 ? (d > 0 ? 2 : -2) : 0;
      if (ai.vx) ai.facing = ai.vx > 0 ? 1 : -1;
      if (Math.random() < 0.015 && ai.state === 'idle' && Math.abs(d) < 100) {
        ai.state = 'attack'; ai.attackType = 'medium'; ai.attackTimer = 18;
      }
      [p, ai].forEach(f => {
        if (f.hitstunTimer > 0) { f.hitstunTimer--; f.state = 'hitstun'; }
        else if (f.state === 'attack') { f.attackTimer--; if (f.attackTimer <= 0) f.state = 'idle'; }
        else if (f.vx) f.state = 'walk';
        else f.state = 'idle';
        f.x = Math.max(40, Math.min(ARENA_WIDTH - 40, f.x + f.vx));
        if (f.state === 'attack' && f.attackTimer > 5 && f.attackTimer < 12) {
          const o = f === p ? ai : p;
          if (Math.abs(f.x - o.x) < 60 && o.state !== 'dodge' && !o.hitstunTimer) {
            o.hp -= 10; o.hitstunTimer = 10; o.x += f.facing * 15;
            if (o.hp <= 0) { o.hp = 0; o.state = 'ko'; }
          }
        }
      });
      if (p.hp <= 0 || ai.hp <= 0) {
        if (p.hp <= 0) { ai.wins++; setWins(w => ({...w, ai: ai.wins})); }
        else { p.wins++; setWins(w => ({...w, p1: p.wins})); }
        if (p.wins >= 2 || ai.wins >= 2) g.running = false;
        else setTimeout(() => { g.p1 = {...createFighter(true), wins: p.wins}; g.ai = {...createFighter(false), wins: ai.wins}; }, 1000);
      }
      ctx.fillStyle = '#111'; ctx.fillRect(0,0,ARENA_WIDTH,ARENA_HEIGHT);
      ctx.fillStyle = '#333'; ctx.fillRect(0, GROUND_Y, ARENA_WIDTH, 120);
      [p, ai].forEach(f => {
        ctx.fillStyle = f.char.color;
        ctx.fillRect(f.x - 20, f.y - 80, 40, 80);
        ctx.fillStyle = f.char.accent;
        ctx.fillRect(f.x - 12, f.y - 100, 24, 20);
        if (f.state === 'attack') ctx.fillRect(f.x + f.facing * 20, f.y - 50, 30, 8);
      });
      ctx.fillStyle = '#c00'; ctx.fillRect(30, 20, (p.hp/100)*250, 16);
      ctx.fillRect(ARENA_WIDTH-280, 20, (ai.hp/100)*250, 16);
      ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif';
      ctx.fillText(`P1 ${wins.p1} - AI ${wins.ai}`, ARENA_WIDTH/2 - 50, 50);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.key);
      if (['z','x','c'].includes(e.key) && g.p1.state === 'idle') {
        const t = e.key === 'z' ? 'fast' : e.key === 'x' ? 'medium' : 'strong';
        g.p1.state = 'attack'; g.p1.attackType = t as AttackType; g.p1.attackTimer = t === 'fast' ? 10 : 18;
      }
      if (e.key === 'Shift') { g.p1.state = 'block'; g.p1.blockTimer = 15; }
      if (e.key === ' ') { g.p1.state = 'dodge'; g.p1.dodgeTimer = 12; }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { cancelAnimationFrame(id); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [wins]);

  return (
    <div className="relative" style={{height: 'calc(100vh - 80px)'}}>
      {showTutorial && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 text-white">
          <div className="text-center max-w-lg p-6">
            <h2 className="text-3xl font-bold mb-4">Fightersland</h2>
            <p className="mb-4">Flechas/A-D: mover. Z/X/C: ataques (rápido/medio/fuerte). Shift: bloqueo. Espacio: esquive.</p>
            <button onClick={start} className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-lg">Saltar / Jugar</button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} width={ARENA_WIDTH} height={ARENA_HEIGHT} className="w-full h-full" />
      <div className="absolute bottom-6 left-6 flex gap-2 md:hidden">
        <button className="w-14 h-14 bg-slate-800 text-white rounded-lg text-xl" onTouchStart={() => keys.current.add('ArrowLeft')}>◀</button>
        <button className="w-14 h-14 bg-slate-800 text-white rounded-lg text-xl" onTouchStart={() => keys.current.add('ArrowRight')}>▶</button>
      </div>
      <div className="absolute bottom-6 right-6 flex gap-2 md:hidden">
        <button className="w-14 h-14 bg-red-700 text-white rounded-lg" onClick={() => { const p=game.current.p1; if(p.state==='idle'){p.state='attack';p.attackType='fast';p.attackTimer=10;} }}>R</button>
        <button className="w-14 h-14 bg-orange-700 text-white rounded-lg" onClick={() => { const p=game.current.p1; if(p.state==='idle'){p.state='attack';p.attackType='medium';p.attackTimer=16;} }}>M</button>
        <button className="w-14 h-14 bg-yellow-600 text-black rounded-lg" onClick={() => { const p=game.current.p1; if(p.state==='idle'){p.state='attack';p.attackType='strong';p.attackTimer=24;} }}>F</button>
        <button className="w-14 h-14 bg-blue-700 text-white rounded-lg" onClick={() => { game.current.p1.state='block'; game.current.p1.blockTimer=20; }}>B</button>
      </div>
    </div>
  );
}
