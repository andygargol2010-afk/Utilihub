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
  const [player, setPlayer] = useState(() => createFighter(PLAYER_CHAR, 200, true));
  const [ai, setAi] = useState(() => createFighter(AI_CHAR, 700, false));
  const [round, setRound] = useState(1);
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [message, setMessage] = useState('Round 1');
  const keys = useRef<Set<string>>(new Set());
  const raf = useRef<number>(0);

  const skipTutorial = useCallback(() => setShowTutorial(false), []);

  // Input handlers
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
      if (['j', 'k', 'l', 's', 'a', 'd'].includes(e.key.toLowerCase())) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Mobile button helpers
  const press = (k: string) => keys.current.add(k);
  const release = (k: string) => keys.current.delete(k);

  const update = useCallback(() => {
    setPlayer((p) => {
      let np = { ...p };
      if (np.state === 'ko' || np.hitstunTimer > 0) {
        np.hitstunTimer = Math.max(0, np.hitstunTimer - 1);
        np.x += np.vx;
        np.vx *= 0.85;
        if (np.hitstunTimer <= 0 && np.hp > 0) np.state = 'idle';
        return np;
      }

      // Movement
      if (keys.current.has('a') || keys.current.has('arrowleft')) {
        np.x = Math.max(40, np.x - 4);
        np.facing = -1;
        np.state = 'walk';
      } else if (keys.current.has('d') || keys.current.has('arrowright')) {
        np.x = Math.min(ARENA_WIDTH - 40, np.x + 4);
        np.facing = 1;
        np.state = 'walk';
      } else if (np.state === 'walk') np.state = 'idle';

      // Dodge (back)
      if ((keys.current.has('shift') || keys.current.has(' ')) && np.dodgeTimer <= 0 && np.state !== 'attack') {
        np.state = 'dodge';
        np.dodgeTimer = 18;
        np.vx = np.facing * -6;
      }
      if (np.dodgeTimer > 0) {
        np.dodgeTimer--;
        np.x += np.vx;
        if (np.dodgeTimer <= 0) { np.state = 'idle'; np.vx = 0; }
      }

      // Block
      if (keys.current.has('s') && np.state !== 'attack' && np.dodgeTimer <= 0) {
        np.state = 'block';
        np.blockTimer = 8;
      } else if (np.blockTimer > 0) {
        np.blockTimer--;
        if (np.blockTimer <= 0) np.state = 'idle';
      }

      // Attacks + charge
      const attackKey = keys.current.has('j') ? 'fast' : keys.current.has('k') ? 'medium' : keys.current.has('l') ? 'strong' : null;
      if (attackKey && np.state !== 'attack' && np.dodgeTimer <= 0 && np.blockTimer <= 0) {
        np.isCharging = true;
        np.charge = Math.min(60, np.charge + 1);
      } else if (np.isCharging && attackKey === null) {
        // release
        const mult = 1 + np.charge / 40;
        np.state = 'attack';
        np.attackType = attackKey || 'fast';
        np.attackTimer = Math.floor(12 * mult);
        np.isCharging = false;
        np.charge = 0;
      }

      if (np.state === 'attack') {
        np.attackTimer--;
        if (np.attackTimer <= 0) np.state = 'idle';
      }

      return np;
    });

    setAi((a) => {
      let na = { ...a };
      if (na.state === 'ko' || na.hitstunTimer > 0) {
        na.hitstunTimer = Math.max(0, na.hitstunTimer - 1);
        na.x += na.vx;
        na.vx *= 0.85;
        if (na.hitstunTimer <= 0 && na.hp > 0) na.state = 'idle';
        return na;
      }

      // Simple AI
      const dist = player.x - na.x;
      if (Math.abs(dist) > 80) {
        na.x += Math.sign(dist) * 2.2;
        na.facing = Math.sign(dist) as 1 | -1;
        na.state = 'walk';
      } else {
        na.state = 'idle';
        if (Math.random() < 0.03 && na.attackTimer <= 0) {
          const types: AttackType[] = ['fast', 'medium', 'strong'];
          na.state = 'attack';
          na.attackType = types[Math.floor(Math.random() * 3)];
          na.attackTimer = 16;
        }
        if (Math.random() < 0.02) na.state = 'block';
      }
      if (na.state === 'attack') {
        na.attackTimer--;
        if (na.attackTimer <= 0) na.state = 'idle';
      }
      return na;
    });

    // Collision / hits (simplified)
    setPlayer((p) => {
      setAi((a) => {
        if (p.state === 'attack' && p.attackTimer > 6 && Math.abs(p.x - a.x) < 70 && a.state !== 'dodge' && a.state !== 'block') {
          const dmg = p.attackType === 'strong' ? 18 : p.attackType === 'medium' ? 12 : 7;
          const finalDmg = Math.floor(dmg * (1 + (p.charge || 0) / 50));
          a.hp = Math.max(0, a.hp - finalDmg);
          a.state = 'hitstun';
          a.hitstunTimer = 12;
          a.vx = p.facing * 3;
          if (a.hp <= 0) {
            a.state = 'ko';
            setPlayerWins((w) => w + 1);
            setMessage('Player wins round!');
          }
        }
        return a;
      });
      return p;
    });
  }, [player.x]);

  useEffect(() => {
    const loop = () => {
      update();
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) draw(ctx, player, ai, round, playerWins, aiWins);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [update, player, ai, round, playerWins, aiWins]);

  // Round reset (simplified)
  useEffect(() => {
    if (player.hp <= 0 || ai.hp <= 0) {
      setTimeout(() => {
        setPlayer((p) => ({ ...p, hp: 100, state: 'idle', x: 200, wins: playerWins }));
        setAi((a) => ({ ...a, hp: 100, state: 'idle', x: 700, wins: aiWins }));
        setRound((r) => r + 1);
        setMessage(`Round ${round + 1}`);
      }, 1500);
    }
  }, [player.hp, ai.hp]);

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
      <div className="absolute top-2 left-4 text-white text-sm font-mono">{message} | P {playerWins} - {aiWins} AI</div>

      {/* Mobile controls */}
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

function draw(ctx: CanvasRenderingContext2D, p: Fighter, a: Fighter, round: number, pw: number, aw: number) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
  // simple floor
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, GROUND_Y + 20, ARENA_WIDTH, 100);
  // HP bars
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(20, 20, 300 * (p.hp / 100), 16);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(20, 20, 300, 16);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(ARENA_WIDTH - 320, 20, 300 * (a.hp / 100), 16);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(ARENA_WIDTH - 320, 20, 300, 16);
  // fighters (pixel-ish rectangles + color)
  drawFighter(ctx, p);
  drawFighter(ctx, a);
}

function drawFighter(ctx: CanvasRenderingContext2D, f: Fighter) {
  const { x, y, facing, char, state } = f;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.fillStyle = char.color;
  // body
  ctx.fillRect(-12, -50, 24, 40);
  // head
  ctx.fillStyle = char.accent;
  ctx.fillRect(-8, -68, 16, 16);
  // simple attack telegraph
  if (state === 'attack') {
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(10, -30, 30, 6);
  }
  if (state === 'block') {
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(8, -40, 8, 30);
  }
  ctx.restore();
}
