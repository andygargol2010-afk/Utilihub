import { useEffect, useRef, useState, useCallback } from 'react';
import { CHARACTERS, type Fighter, type AttackType, GROUND_Y, ARENA_WIDTH, ARENA_HEIGHT } from './types';

const PLAYER_CHAR = CHARACTERS[0]; // Kenshi the Blade
const AI_CHAR = CHARACTERS[1]; // Shadow Kaze

function createFighter(char: typeof PLAYER_CHAR, x: number, isPlayer: boolean): Fighter {
  return {
    id: char.id + (isPlayer ? '-p' : '-ai'),
    char,
    x,
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

export function FighterslandGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef(createFighter(PLAYER_CHAR, 200, true));
  const aiRef = useRef(createFighter(AI_CHAR, 700, false));
  const [round, setRound] = useState(1);
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [message, setMessage] = useState('Round 1');
  const [force, setForce] = useState(0);
  const keys = useRef<Set<string>>(new Set());
  const raf = useRef<number>(0);
  const lastChargeKey = useRef<AttackType | null>(null);

  const skipTutorial = useCallback(() => setShowTutorial(false), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current.add(k);
      if (['j', 'k', 'l', 's', 'a', 'd', ' '].includes(k)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const press = (k: string) => keys.current.add(k);
  const release = (k: string) => keys.current.delete(k);

  const applyHit = (attacker: Fighter, defender: Fighter) => {
    if (defender.state === 'dodge' || defender.state === 'block') return false;
    const base = attacker.attackType === 'strong' ? 18 : attacker.attackType === 'medium' ? 12 : 7;
    const chargeMult = 1 + (attacker.charge || 0) / 40;
    const dmg = Math.floor(base * chargeMult);
    defender.hp = Math.max(0, defender.hp - dmg);
    defender.state = defender.hp <= 0 ? 'ko' : 'hitstun';
    defender.hitstunTimer = 14;
    defender.vx = attacker.facing * 4;
    defender.charge = 0;
    defender.isCharging = false;
    return true;
  };

  const updateFighter = (f: Fighter, isAI: boolean, opponent: Fighter) => {
    if (f.state === 'ko' || f.hitstunTimer > 0) {
      f.hitstunTimer = Math.max(0, f.hitstunTimer - 1);
      f.x = Math.max(40, Math.min(ARENA_WIDTH - 40, f.x + f.vx));
      f.vx *= 0.82;
      if (f.hitstunTimer <= 0 && f.hp > 0) f.state = 'idle';
      return;
    }

    if (!isAI) {
      if (keys.current.has('a') || keys.current.has('arrowleft')) {
        f.x = Math.max(40, f.x - 4.2);
        f.facing = -1;
        f.state = 'walk';
      } else if (keys.current.has('d') || keys.current.has('arrowright')) {
        f.x = Math.min(ARENA_WIDTH - 40, f.x + 4.2);
        f.facing = 1;
        f.state = 'walk';
      } else if (f.state === 'walk') f.state = 'idle';

      if ((keys.current.has('shift') || keys.current.has(' ')) && f.dodgeTimer <= 0 && f.state !== 'attack') {
        f.state = 'dodge';
        f.dodgeTimer = 20;
        f.vx = f.facing * -7;
      }

      if (keys.current.has('s') && f.state !== 'attack' && f.dodgeTimer <= 0) {
        f.state = 'block';
        f.blockTimer = 10;
      } else if (f.blockTimer > 0) {
        f.blockTimer--;
        if (f.blockTimer <= 0 && f.state === 'block') f.state = 'idle';
      }

      const atkKey = keys.current.has('j') ? 'fast' as AttackType : keys.current.has('k') ? 'medium' : keys.current.has('l') ? 'strong' : null;
      if (atkKey && f.state !== 'attack' && f.dodgeTimer <= 0 && f.blockTimer <= 0) {
        f.isCharging = true;
        f.charge = Math.min(50, f.charge + 1.2);
        lastChargeKey.current = atkKey;
      } else if (f.isCharging && !atkKey) {
        const mult = 1 + f.charge / 35;
        f.state = 'attack';
        f.attackType = lastChargeKey.current || 'fast';
        f.attackTimer = Math.floor(14 * mult);
        f.isCharging = false;
      }
    } else {
      const dist = opponent.x - f.x;
      const absDist = Math.abs(dist);
      if (absDist > 90) {
        f.x += Math.sign(dist) * 2.4;
        f.facing = Math.sign(dist) as 1 | -1;
        f.state = 'walk';
      } else {
        f.state = 'idle';
        if (Math.random() < 0.045 && f.attackTimer <= 0 && f.dodgeTimer <= 0) {
          const types: AttackType[] = ['fast', 'medium', 'strong'];
          f.state = 'attack';
          f.attackType = types[Math.floor(Math.random() * 3)];
          f.attackTimer = 16;
          f.charge = Math.random() < 0.3 ? 20 : 0;
        }
        if (Math.random() < 0.025 && opponent.state === 'attack') f.state = 'block';
      }
    }

    if (f.dodgeTimer > 0) {
      f.dodgeTimer--;
      f.x = Math.max(40, Math.min(ARENA_WIDTH - 40, f.x + f.vx));
      if (f.dodgeTimer <= 0) { f.state = 'idle'; f.vx = 0; }
    }

    if (f.state === 'attack') {
      f.attackTimer--;
      if (f.attackTimer > 4 && f.attackTimer < 10 && Math.abs(f.x - opponent.x) < 78) {
        applyHit(f, opponent);
      }
      if (f.attackTimer <= 0) {
        f.state = 'idle';
        f.charge = 0;
      }
    }
  };

  const loop = useCallback(() => {
    const p = playerRef.current;
    const a = aiRef.current;

    updateFighter(p, false, a);
    updateFighter(a, true, p);

    if (p.hp <= 0 && p.state !== 'ko') {
      p.state = 'ko';
      setAiWins(w => w + 1);
      setMessage('AI wins the round!');
      setForce(f => f + 1);
    }
    if (a.hp <= 0 && a.state !== 'ko') {
      a.state = 'ko';
      setPlayerWins(w => w + 1);
      setMessage('You win the round!');
      setForce(f => f + 1);
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) draw(ctx, p, a);

    raf.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [loop]);

  useEffect(() => {
    if (playerRef.current.hp <= 0 || aiRef.current.hp <= 0) {
      const t = setTimeout(() => {
        playerRef.current = createFighter(PLAYER_CHAR, 200, true);
        aiRef.current = createFighter(AI_CHAR, 700, false);
        setRound(r => r + 1);
        setMessage(`Round ${round + 1}`);
        setForce(f => f + 1);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [force, round]);

  return (
    <div className="relative w-full h-[calc(100vh-56px)] bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={ARENA_WIDTH}
        height={ARENA_HEIGHT}
        className="border-2 border-slate-600 shadow-2xl max-w-full max-h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      {showTutorial && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
          <div className="bg-slate-800 p-6 rounded-lg text-center max-w-md text-white">
            <h2 className="text-xl font-bold mb-3">Fightersland - Tutorial</h2>
            <p className="mb-2 text-sm">A/D o flechas: mover<br />J/K/L: golpes rápido/medio/fuerte (mantén para charge)<br />S: bloquear<br />Shift/Espacio: esquivar atrás</p>
            <p className="mb-4 text-xs opacity-80">Mejor de 3 rounds. Sin sangre.</p>
            <button onClick={skipTutorial} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded font-bold">Saltar</button>
          </div>
        </div>
      )}
      <div className="absolute top-2 left-4 text-white text-sm font-mono">{message} | P {playerWins} - {aiWins} AI | R{round}</div>

      <div className="absolute bottom-4 left-4 flex gap-2 md:hidden">
        <button onPointerDown={() => press('a')} onPointerUp={() => release('a')} className="w-12 h-12 bg-slate-700 rounded text-white">←</button>
        <button onPointerDown={() => press('d')} onPointerUp={() => release('d')} className="w-12 h-12 bg-slate-700 rounded text-white">→</button>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2 md:hidden">
        <button onPointerDown={() => press('j')} onPointerUp={() => release('j')} className="w-12 h-12 bg-red-700 rounded text-white text-xs">R</button>
        <button onPointerDown={() => press('k')} onPointerUp={() => release('k')} className="w-12 h-12 bg-orange-700 rounded text-white text-xs">M</button>
        <button onPointerDown={() => press('l')} onPointerUp={() => release('l')} className="w-12 h-12 bg-yellow-700 rounded text-white text-xs">F</button>
        <button onPointerDown={() => press('s')} onPointerUp={() => release('s')} className="w-12 h-12 bg-blue-700 rounded text-white text-xs">Blk</button>
      </div>
    </div>
  );
}

function draw(ctx: CanvasRenderingContext2D, p: Fighter, a: Fighter) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, GROUND_Y + 20, ARENA_WIDTH, 120);
  ctx.fillStyle = '#334155';
  ctx.fillRect(20, 20, 300, 18);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(20, 20, 300 * (p.hp / 100), 18);
  ctx.fillStyle = '#334155';
  ctx.fillRect(ARENA_WIDTH - 320, 20, 300, 18);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(ARENA_WIDTH - 320, 20, 300 * (a.hp / 100), 18);
  drawFighter(ctx, p);
  drawFighter(ctx, a);
}

function drawFighter(ctx: CanvasRenderingContext2D, f: Fighter) {
  const { x, y, facing, char, state } = f;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.fillStyle = char.color;
  ctx.fillRect(-12, -50, 24, 40);
  ctx.fillStyle = char.accent;
  ctx.fillRect(-8, -68, 16, 16);
  if (state === 'attack') {
    ctx.fillStyle = '#fbbf24';
    const len = 20 + (f.charge || 0) / 2;
    ctx.fillRect(8, -32, len, 8);
  }
  if (state === 'block') {
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(6, -42, 10, 32);
  }
  if (state === 'hitstun') {
    ctx.fillStyle = '#f87171';
    ctx.fillRect(-4, -20, 8, 8);
  }
  if (f.isCharging) {
    ctx.fillStyle = '#facc15';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(-20, -80, 40, 4);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
