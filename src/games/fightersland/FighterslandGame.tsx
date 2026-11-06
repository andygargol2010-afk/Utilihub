import { useEffect, useRef, useState, useCallback } from 'react';
import { CHARACTERS, type Fighter, type AttackType, GROUND_Y, ARENA_WIDTH, ARENA_HEIGHT } from './types';

const MAX_HP = 100;
const ROUND_TO_WIN = 2;

function createFighter(charIndex: number, isPlayer: boolean, x: number): Fighter {
  const char = CHARACTERS[charIndex];
  return {
    id: char.id,
    char,
    x,
    y: GROUND_Y,
    vx: 0,
    facing: isPlayer ? 1 : -1,
    hp: MAX_HP,
    maxHp: MAX_HP,
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
  const [round, setRound] = useState(1);
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [message, setMessage] = useState('');
  const gameRef = useRef<{
    player: Fighter;
    ai: Fighter;
    keys: Record<string, boolean>;
    lastTime: number;
    running: boolean;
  } | null>(null);

  const initGame = useCallback(() => {
    gameRef.current = {
      player: createFighter(0, true, 200),
      ai: createFighter(1, false, 700),
      keys: {},
      lastTime: performance.now(),
      running: true,
    };
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (!gameRef.current) return;
      gameRef.current.keys[e.key.toLowerCase()] = down;
      if (['j', 'k', 'l', 'u', 'i', 'a', 'd', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const keyDown = (e: KeyboardEvent) => onKey(e, true);
    const keyUp = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    let animId: number;
    const loop = (now: number) => {
      if (!gameRef.current || !gameRef.current.running) {
        animId = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min((now - gameRef.current.lastTime) / 1000, 0.05);
      gameRef.current.lastTime = now;
      update(dt);
      draw(ctx);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  function update(dt: number) {
    const g = gameRef.current!;
    const p = g.player;
    const a = g.ai;

    // Player input
    if (p.state !== 'hitstun' && p.state !== 'ko' && p.state !== 'attack') {
      if (g.keys['a'] || g.keys['arrowleft']) {
        p.vx = -180;
        p.state = 'walk';
        p.facing = -1;
      } else if (g.keys['d'] || g.keys['arrowright']) {
        p.vx = 180;
        p.state = 'walk';
        p.facing = 1;
      } else {
        p.vx = 0;
        if (p.state === 'walk') p.state = 'idle';
      }
      if (g.keys['u']) {
        p.state = 'block';
        p.blockTimer = 0.3;
      }
      if (g.keys['i'] && p.dodgeTimer <= 0) {
        p.state = 'dodge';
        p.dodgeTimer = 0.35;
        p.vx = -p.facing * 280;
      }
      // Attacks
      if (g.keys['j'] && !p.isCharging) startAttack(p, 'fast');
      if (g.keys['k'] && !p.isCharging) startAttack(p, 'medium');
      if (g.keys['l']) {
        if (!p.isCharging) {
          p.isCharging = true;
          p.charge = 0;
        }
        p.charge = Math.min(1.5, p.charge + dt * 1.2);
      } else if (p.isCharging) {
        startAttack(p, 'strong', p.charge);
        p.isCharging = false;
        p.charge = 0;
      }
    }

    // Simple AI
    updateAI(a, p, dt);

    // Update both
    [p, a].forEach((f) => {
      f.x += f.vx * dt;
      f.x = Math.max(80, Math.min(ARENA_WIDTH - 80, f.x));
      if (f.attackTimer > 0) {
        f.attackTimer -= dt;
        if (f.attackTimer <= 0 && f.state === 'attack') f.state = 'idle';
      }
      if (f.blockTimer > 0) f.blockTimer -= dt;
      if (f.dodgeTimer > 0) {
        f.dodgeTimer -= dt;
        if (f.dodgeTimer <= 0 && f.state === 'dodge') f.state = 'idle';
      }
      if (f.hitstunTimer > 0) {
        f.hitstunTimer -= dt;
        if (f.hitstunTimer <= 0 && f.state === 'hitstun') f.state = 'idle';
      }
      // Face opponent
      if (f.state !== 'attack' && f.state !== 'dodge') {
        f.facing = f.x < (f === p ? a.x : p.x) ? 1 : -1;
      }
    });

    // Collision / hits
    checkHits(p, a);
    checkHits(a, p);

    // KO check
    if (p.hp <= 0 && a.hp > 0) endRound(false);
    else if (a.hp <= 0 && p.hp > 0) endRound(true);
  }

  function startAttack(f: Fighter, type: AttackType, charge = 0) {
    if (f.state === 'attack' || f.state === 'hitstun' || f.state === 'ko') return;
    f.state = 'attack';
    f.attackType = type;
    const baseTime = type === 'fast' ? 0.22 : type === 'medium' ? 0.38 : 0.55 + charge * 0.3;
    f.attackTimer = baseTime;
    f.vx = 0;
  }

  function updateAI(ai: Fighter, player: Fighter, dt: number) {
    if (ai.state === 'hitstun' || ai.state === 'ko' || ai.state === 'attack') return;
    const dist = player.x - ai.x;
    const abs = Math.abs(dist);
    if (abs > 140) {
      ai.vx = Math.sign(dist) * 120;
      ai.state = 'walk';
    } else {
      ai.vx = 0;
      if (Math.random() < 0.015) {
        const r = Math.random();
        if (r < 0.4) startAttack(ai, 'fast');
        else if (r < 0.7) startAttack(ai, 'medium');
        else startAttack(ai, 'strong', 0.4);
      } else if (Math.random() < 0.008) {
        ai.state = 'block';
        ai.blockTimer = 0.4;
      }
    }
  }

  function checkHits(attacker: Fighter, defender: Fighter) {
    if (attacker.state !== 'attack' || attacker.attackTimer < 0.05 || attacker.attackTimer > 0.35) return;
    const range = attacker.attackType === 'fast' ? 90 : attacker.attackType === 'medium' ? 110 : 130;
    const dx = defender.x - attacker.x;
    if (Math.abs(dx) < range && Math.sign(dx) === attacker.facing) {
      if (defender.state === 'block') {
        defender.vx = attacker.facing * 40;
      } else if (defender.state !== 'dodge') {
        const dmg = attacker.attackType === 'fast' ? 8 : attacker.attackType === 'medium' ? 14 : 22 + (attacker.charge || 0) * 10;
        defender.hp = Math.max(0, defender.hp - dmg);
        defender.state = 'hitstun';
        defender.hitstunTimer = 0.35;
        defender.vx = attacker.facing * 160;
      }
    }
  }

  function endRound(playerWon: boolean) {
    const g = gameRef.current!;
    g.running = false;
    if (playerWon) {
      setPlayerWins((w) => w + 1);
      setMessage(locale === 'es' ? '¡Round ganado!' : 'Round won!');
    } else {
      setAiWins((w) => w + 1);
      setMessage(locale === 'es' ? 'Round perdido' : 'Round lost');
    }
    setTimeout(() => {
      const pW = playerWon ? playerWins + 1 : playerWins;
      const aW = playerWon ? aiWins : aiWins + 1;
      if (pW >= ROUND_TO_WIN || aW >= ROUND_TO_WIN) {
        setMessage(pW >= ROUND_TO_WIN ? (locale === 'es' ? '¡Victoria!' : 'Victory!') : (locale === 'es' ? 'Derrota' : 'Defeat'));
        setTimeout(() => {
          setPlayerWins(0);
          setAiWins(0);
          setRound(1);
          initGame();
          setMessage('');
        }, 2000);
      } else {
        setRound((r) => r + 1);
        g.player.hp = MAX_HP;
        g.ai.hp = MAX_HP;
        g.player.x = 200;
        g.ai.x = 700;
        g.player.state = 'idle';
        g.ai.state = 'idle';
        g.running = true;
        setMessage('');
      }
    }, 1200);
  }

  function draw(ctx: CanvasRenderingContext2D) {
    const g = gameRef.current!;
    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
    const grad = ctx.createLinearGradient(0, 0, 0, ARENA_HEIGHT);
    grad.addColorStop(0, '#1a237e');
    grad.addColorStop(0.6, '#3949ab');
    grad.addColorStop(1, '#5c6bc0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, GROUND_Y + 20, ARENA_WIDTH, ARENA_HEIGHT - GROUND_Y);
    ctx.fillStyle = '#1b5e20';
    for (let i = 0; i < ARENA_WIDTH; i += 8) {
      ctx.fillRect(i, GROUND_Y + 20, 4, 4);
    }
    ctx.fillStyle = '#37474f';
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(200, 280);
    ctx.lineTo(400, GROUND_Y);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(500, GROUND_Y);
    ctx.lineTo(700, 250);
    ctx.lineTo(900, GROUND_Y);
    ctx.fill();

    drawFighter(ctx, g.player);
    drawFighter(ctx, g.ai);

    drawHUD(ctx, g.player, 40, true);
    drawHUD(ctx, g.ai, ARENA_WIDTH - 40 - 220, false);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`R${round}  ${playerWins} - ${aiWins}`, ARENA_WIDTH / 2, 40);
    if (message) {
      ctx.fillStyle = '#ffeb3b';
      ctx.font = 'bold 36px monospace';
      ctx.fillText(message, ARENA_WIDTH / 2, ARENA_HEIGHT / 2);
    }
  }

  function drawFighter(ctx: CanvasRenderingContext2D, f: Fighter) {
    const x = f.x;
    const y = f.y;
    const dir = f.facing;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    ctx.fillStyle = f.char.color;
    ctx.fillRect(-16, -70, 32, 50);
    ctx.fillStyle = '#ffe0b2';
    ctx.fillRect(-12, -95, 24, 25);
    ctx.fillStyle = f.char.accent;
    ctx.fillRect(-12, -20, 10, 25);
    ctx.fillRect(2, -20, 10, 25);
    if (f.state === 'attack') {
      ctx.fillStyle = f.char.accent;
      const prog = 1 - f.attackTimer / (f.attackType === 'fast' ? 0.22 : 0.4);
      if (f.char.attackAnim.fast === 'thrust' || f.attackType === 'fast') {
        ctx.fillRect(16, -50, 40 + prog * 20, 8);
      } else if (f.attackType === 'medium') {
        ctx.fillRect(10, -60, 20, 30);
      } else {
        ctx.fillRect(-10, -80, 30, 12);
      }
    } else if (f.state === 'block') {
      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(8, -65, 12, 40);
    }
    ctx.restore();
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(f.char.name, x, y - 110);
  }

  function drawHUD(ctx: CanvasRenderingContext2D, f: Fighter, x: number, left: boolean) {
    ctx.fillStyle = '#000';
    ctx.fillRect(x, 60, 220, 18);
    ctx.fillStyle = f.hp > 30 ? '#4caf50' : '#f44336';
    const w = (f.hp / f.maxHp) * 216;
    ctx.fillRect(left ? x + 2 : x + 218 - w, 62, w, 14);
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.textAlign = left ? 'left' : 'right';
    ctx.fillText(f.char.name, left ? x : x + 220, 54);
  }

  const press = (key: string, down: boolean) => {
    if (gameRef.current) gameRef.current.keys[key] = down;
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        width={ARENA_WIDTH}
        height={ARENA_HEIGHT}
        className="max-h-full max-w-full border border-white/20"
        style={{ imageRendering: 'pixelated' }}
      />
      {showTutorial && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-white">
          <div className="max-w-md rounded-2xl bg-slate-900 p-6 text-center shadow-xl">
            <h2 className="mb-3 text-2xl font-bold">{locale === 'es' ? 'Tutorial' : 'Tutorial'}</h2>
            <p className="mb-4 text-sm leading-relaxed">
              {locale === 'es'
                ? 'A/D o flechas: mover. J rápido, K medio, L fuerte (mantené para cargar). U bloqueo. I esquive atrás. Mejor de 3 rounds.'
                : 'A/D or arrows: move. J fast, K medium, L strong (hold to charge). U block. I dodge back. Best of 3 rounds.'}
            </p>
            <button
              onClick={() => setShowTutorial(false)}
              className="rounded-full bg-emerald-500 px-6 py-2 font-bold text-white hover:bg-emerald-400"
            >
              {locale === 'es' ? 'Saltar' : 'Skip'}
            </button>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 flex gap-2 md:hidden">
        <button className="rounded bg-white/20 px-4 py-3 text-white" onTouchStart={() => press('a', true)} onTouchEnd={() => press('a', false)}>◀</button>
        <button className="rounded bg-white/20 px-4 py-3 text-white" onTouchStart={() => press('d', true)} onTouchEnd={() => press('d', false)}>▶</button>
      </div>
      <div className="absolute bottom-4 right-4 flex flex-wrap gap-2 md:hidden">
        <button className="rounded bg-red-500/80 px-3 py-2 text-xs text-white" onTouchStart={() => press('j', true)} onTouchEnd={() => press('j', false)}>Fast</button>
        <button className="rounded bg-orange-500/80 px-3 py-2 text-xs text-white" onTouchStart={() => press('k', true)} onTouchEnd={() => press('k', false)}>Med</button>
        <button className="rounded bg-yellow-600/80 px-3 py-2 text-xs text-white" onTouchStart={() => press('l', true)} onTouchEnd={() => press('l', false)}>Strong</button>
        <button className="rounded bg-blue-500/80 px-3 py-2 text-xs text-white" onTouchStart={() => press('u', true)} onTouchEnd={() => press('u', false)}>Block</button>
        <button className="rounded bg-purple-500/80 px-3 py-2 text-xs text-white" onTouchStart={() => press('i', true)} onTouchEnd={() => press('i', false)}>Dodge</button>
      </div>
    </div>
  );
}
