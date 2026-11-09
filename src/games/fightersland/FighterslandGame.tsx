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

const ATTACK_BASE_DAMAGE: Record<AttackType, number> = { fast: 8, medium: 14, strong: 20 };
const ATTACK_BASE_TIME: Record<AttackType, number> = { fast: 12, medium: 18, strong: 26 };

export function FighterslandGame({ locale = 'en' }: { locale?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [wins, setWins] = useState({ p1: 0, ai: 0 });
  const game = useRef({ p1: createFighter(true), ai: createFighter(false), running: false, roundOver: false });
  const keys = useRef(new Set<string>());
  const chargingKey = useRef<string | null>(null);

  const start = () => {
    game.current = { p1: createFighter(true), ai: createFighter(false), running: true, roundOver: false };
    setShowTutorial(false);
    setWins({ p1: 0, ai: 0 });
  };

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    let rafId = 0;

    const updateFighter = (f: Fighter, other: Fighter) => {
      if (f.hitstunTimer > 0) {
        f.hitstunTimer--;
        f.state = 'hitstun';
        return;
      }
      if (f.dodgeTimer > 0) {
        f.dodgeTimer--;
        f.state = 'dodge';
        f.x += f.facing * -3; // dodge back
        return;
      }
      if (f.blockTimer > 0) {
        f.blockTimer--;
        f.state = 'block';
        return;
      }
      if (f.isCharging) {
        f.charge = Math.min(60, f.charge + 1);
        f.state = 'idle';
        return;
      }
      if (f.state === 'attack') {
        f.attackTimer--;
        if (f.attackTimer <= 0) f.state = 'idle';
        // active frames roughly mid attack
        if (f.attackTimer > 4 && f.attackTimer < 10) {
          const dist = Math.abs(f.x - other.x);
          if (dist < 70 && other.state !== 'dodge' && other.hitstunTimer === 0) {
            let dmg = ATTACK_BASE_DAMAGE[f.attackType || 'medium'];
            if (f.charge > 10) dmg = Math.round(dmg * (1 + f.charge / 40));
            if (other.state === 'block') dmg = Math.round(dmg * 0.3);
            other.hp = Math.max(0, other.hp - dmg);
            other.hitstunTimer = other.state === 'block' ? 6 : 14;
            other.x += f.facing * (other.state === 'block' ? 8 : 20);
            if (other.hp <= 0) other.state = 'ko';
            f.charge = 0;
          }
        }
        return;
      }
      if (f.vx !== 0) f.state = 'walk';
      else f.state = 'idle';
      f.x = Math.max(50, Math.min(ARENA_WIDTH - 50, f.x + f.vx));
    };

    const loop = () => {
      const g = game.current;
      if (!g.running || g.roundOver) {
        rafId = requestAnimationFrame(loop);
        return;
      }
      const p = g.p1;
      const ai = g.ai;

      // Player movement
      p.vx = 0;
      if (keys.current.has('ArrowLeft') || keys.current.has('a') || keys.current.has('A')) p.vx = -4.5;
      if (keys.current.has('ArrowRight') || keys.current.has('d') || keys.current.has('D')) p.vx = 4.5;
      if (p.vx !== 0) p.facing = p.vx > 0 ? 1 : -1;

      // Simple AI
      const dist = p.x - ai.x;
      ai.vx = Math.abs(dist) > 80 ? (dist > 0 ? 2.2 : -2.2) : 0;
      if (ai.vx !== 0) ai.facing = ai.vx > 0 ? 1 : -1;
      if (Math.random() < 0.012 && ai.state === 'idle' && Math.abs(dist) < 90 && !ai.isCharging) {
        ai.state = 'attack';
        ai.attackType = Math.random() < 0.6 ? 'medium' : 'fast';
        ai.attackTimer = ATTACK_BASE_TIME[ai.attackType];
        ai.charge = Math.random() < 0.3 ? 25 : 0;
      }

      updateFighter(p, ai);
      updateFighter(ai, p);

      // Round check
      if ((p.hp <= 0 || ai.hp <= 0) && !g.roundOver) {
        g.roundOver = true;
        if (p.hp <= 0) {
          ai.wins++;
          setWins(w => ({ ...w, ai: ai.wins }));
        } else {
          p.wins++;
          setWins(w => ({ ...w, p1: p.wins }));
        }
        if (p.wins >= 2 || ai.wins >= 2) {
          g.running = false;
        } else {
          setTimeout(() => {
            const newP = createFighter(true);
            newP.wins = p.wins;
            const newA = createFighter(false);
            newA.wins = ai.wins;
            g.p1 = newP;
            g.ai = newA;
            g.roundOver = false;
          }, 1200);
        }
      }

      // Draw
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(0, GROUND_Y, ARENA_WIDTH, ARENA_HEIGHT - GROUND_Y);

      [p, ai].forEach(f => {
        ctx.save();
        ctx.translate(f.x, f.y);
        if (f.facing < 0) ctx.scale(-1, 1);
        // body
        ctx.fillStyle = f.char.color;
        ctx.fillRect(-20, -80, 40, 80);
        // head
        ctx.fillStyle = f.char.accent;
        ctx.fillRect(-12, -100, 24, 20);
        // charging indicator
        if (f.isCharging && f.charge > 5) {
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = '#ffdd00';
          ctx.fillRect(-25, -110, 50, 6);
          ctx.globalAlpha = 1;
        }
        // attack arm
        if (f.state === 'attack') {
          ctx.fillStyle = f.char.accent;
          ctx.fillRect(15, -55, 35, 10);
        }
        if (f.state === 'block') {
          ctx.fillStyle = '#888';
          ctx.fillRect(10, -70, 12, 50);
        }
        if (f.state === 'hitstun') {
          ctx.fillStyle = '#fff';
          ctx.globalAlpha = 0.5;
          ctx.fillRect(-22, -102, 44, 84);
          ctx.globalAlpha = 1;
        }
        ctx.restore();
      });

      // HP bars
      ctx.fillStyle = '#400';
      ctx.fillRect(30, 20, 250, 18);
      ctx.fillStyle = '#c00';
      ctx.fillRect(30, 20, (p.hp / 100) * 250, 18);
      ctx.fillStyle = '#400';
      ctx.fillRect(ARENA_WIDTH - 280, 20, 250, 18);
      ctx.fillStyle = '#c00';
      ctx.fillRect(ARENA_WIDTH - 280, 20, (ai.hp / 100) * 250, 18);

      ctx.fillStyle = '#fff';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`P1 ${wins.p1} - AI ${wins.ai}`, ARENA_WIDTH / 2, 50);
      if (g.roundOver) {
        ctx.font = '32px sans-serif';
        ctx.fillText(p.hp <= 0 ? 'KO! AI wins round' : 'KO! P1 wins round', ARENA_WIDTH / 2, 200);
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const startCharge = (key: string) => {
      const p = game.current.p1;
      if (p.state === 'idle' && !p.isCharging) {
        p.isCharging = true;
        p.charge = 0;
        p.attackType = key === 'z' || key === 'Z' ? 'fast' : key === 'x' || key === 'X' ? 'medium' : 'strong';
        chargingKey.current = key;
      }
    };

    const releaseCharge = () => {
      const p = game.current.p1;
      if (p.isCharging) {
        p.isCharging = false;
        const type = p.attackType || 'medium';
        const extra = Math.floor(p.charge / 15);
        p.state = 'attack';
        p.attackTimer = ATTACK_BASE_TIME[type] + extra;
        // charge stays for damage calc in update
        chargingKey.current = null;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key);
      if (['z', 'x', 'c', 'Z', 'X', 'C'].includes(e.key) && !e.repeat) {
        startCharge(e.key);
      }
      if (e.key === 'Shift') {
        const p = game.current.p1;
        if (p.state === 'idle') { p.state = 'block'; p.blockTimer = 20; }
      }
      if (e.key === ' ') {
        const p = game.current.p1;
        if (p.state === 'idle') { p.state = 'dodge'; p.dodgeTimer = 14; }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key);
      if (['z', 'x', 'c', 'Z', 'X', 'C'].includes(e.key) && chargingKey.current === e.key) {
        releaseCharge();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []); // stable, wins updated via setState inside

  return (
    <div className="relative bg-black" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {showTutorial && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 text-white">
          <div className="text-center max-w-lg p-6">
            <h2 className="text-3xl font-bold mb-4">Fightersland</h2>
            <p className="mb-2">Flechas o A/D: moverse.</p>
            <p className="mb-2">Z / X / C: ataque rápido / medio / fuerte (mantén pulsado para charge: más lento y más daño).</p>
            <p className="mb-2">Shift: bloqueo. Espacio: esquive hacia atrás.</p>
            <p className="mb-4 text-sm opacity-80">Mejor de 3 rounds. Sin sangre.</p>
            <button onClick={start} className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400">Saltar / Jugar</button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} width={ARENA_WIDTH} height={ARENA_HEIGHT} className="w-full h-full object-contain" />
      {/* Mobile controls */}
      <div className="absolute bottom-4 left-4 flex gap-2 md:hidden z-10">
        <button className="w-16 h-16 bg-slate-800/80 text-white rounded-xl text-2xl" onTouchStart={() => keys.current.add('ArrowLeft')} onTouchEnd={() => keys.current.delete('ArrowLeft')}>◀</button>
        <button className="w-16 h-16 bg-slate-800/80 text-white rounded-xl text-2xl" onTouchStart={() => keys.current.add('ArrowRight')} onTouchEnd={() => keys.current.delete('ArrowRight')}>▶</button>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2 md:hidden z-10">
        <button className="w-14 h-14 bg-red-700/90 text-white rounded-lg text-sm" onTouchStart={() => { const p=game.current.p1; if(p.state==='idle'&&!p.isCharging){p.isCharging=true;p.charge=0;p.attackType='fast';} }} onTouchEnd={() => { const p=game.current.p1; if(p.isCharging&&p.attackType==='fast'){p.isCharging=false;p.state='attack';p.attackTimer=ATTACK_BASE_TIME.fast + Math.floor(p.charge/15);} }}>R</button>
        <button className="w-14 h-14 bg-orange-700/90 text-white rounded-lg text-sm" onTouchStart={() => { const p=game.current.p1; if(p.state==='idle'&&!p.isCharging){p.isCharging=true;p.charge=0;p.attackType='medium';} }} onTouchEnd={() => { const p=game.current.p1; if(p.isCharging&&p.attackType==='medium'){p.isCharging=false;p.state='attack';p.attackTimer=ATTACK_BASE_TIME.medium + Math.floor(p.charge/15);} }}>M</button>
        <button className="w-14 h-14 bg-yellow-600/90 text-black rounded-lg text-sm" onTouchStart={() => { const p=game.current.p1; if(p.state==='idle'&&!p.isCharging){p.isCharging=true;p.charge=0;p.attackType='strong';} }} onTouchEnd={() => { const p=game.current.p1; if(p.isCharging&&p.attackType==='strong'){p.isCharging=false;p.state='attack';p.attackTimer=ATTACK_BASE_TIME.strong + Math.floor(p.charge/15);} }}>F</button>
        <button className="w-14 h-14 bg-blue-700/90 text-white rounded-lg" onTouchStart={() => { const p=game.current.p1; if(p.state==='idle'){p.state='block';p.blockTimer=22;} }}>B</button>
        <button className="w-14 h-14 bg-purple-700/90 text-white rounded-lg" onTouchStart={() => { const p=game.current.p1; if(p.state==='idle'){p.state='dodge';p.dodgeTimer=14;} }}>E</button>
      </div>
    </div>
  );
}
