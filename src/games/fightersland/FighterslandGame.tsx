import { useEffect, useRef, useState, useCallback } from 'react';
import { CHARACTERS, type Fighter, type AttackType, GROUND_Y, ARENA_WIDTH, ARENA_HEIGHT } from './types';

const MAX_HP = 100;
const ROUND_TO_WIN = 2;

function createFighter(charIndex: number, isPlayer: boolean, x: number): Fighter {
  const char = CHARACTERS[charIndex % CHARACTERS.length];
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
    finisherTimer: 0,
  };
}

export function FighterslandGame({ locale = 'en' }: { locale?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showSelect, setShowSelect] = useState(false);
  const [mode, setMode] = useState<'ai' | '2p'>('ai');
  const [p1Char, setP1Char] = useState(0);
  const [p2Char, setP2Char] = useState(1);
  const [mapId, setMapId] = useState(0);
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
    mode: 'ai' | '2p';
    mapId: number;
    hitstop: number;
    shake: number;
  } | null>(null);

  const initGame = useCallback((m: 'ai' | '2p' = mode, c1 = p1Char, c2 = p2Char, mid = mapId) => {
    const oppIndex = m === 'ai' ? (c1 + 1 + Math.floor(Math.random() * (CHARACTERS.length - 1))) % CHARACTERS.length : c2;
    gameRef.current = {
      player: createFighter(c1, true, 200),
      ai: createFighter(oppIndex, false, 700),
      keys: {},
      lastTime: performance.now(),
      running: true,
      mode: m,
      mapId: mid,
      hitstop: 0,
      shake: 0,
    };
    setMode(m);
  }, [mode, p1Char, p2Char, mapId]);

  useEffect(() => {
    if (!showTutorial && !showSelect) initGame();
  }, [showTutorial, showSelect, initGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (!gameRef.current) return;
      const k = e.key.toLowerCase();
      gameRef.current.keys[k] = down;
      if (['j', 'k', 'l', 'u', 'i', 'a', 'd', 'arrowleft', 'arrowright', 'f', 'g', 'h', 'q', 'w'].includes(k)) {
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
    const is2p = g.mode === '2p';

    if (g.hitstop > 0) {
      g.hitstop = Math.max(0, g.hitstop - dt);
      g.shake *= 0.85;
      [p, a].forEach((f) => {
        if (f.finisherTimer && f.finisherTimer > 0) f.finisherTimer -= dt;
      });
      return;
    }
    if (g.shake > 0) g.shake *= 0.9;

    if (p.state !== 'hitstun' && p.state !== 'ko' && p.state !== 'attack') {
      if (g.keys['a']) {
        p.vx = -180;
        p.state = 'walk';
        p.facing = -1;
      } else if (g.keys['d']) {
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

    if (is2p) {
      if (a.state !== 'hitstun' && a.state !== 'ko' && a.state !== 'attack') {
        if (g.keys['f'] && !a.isCharging) startAttack(a, 'fast');
        if (g.keys['g'] && !a.isCharging) startAttack(a, 'medium');
        if (g.keys['h']) {
          if (!a.isCharging) {
            a.isCharging = true;
            a.charge = 0;
          }
          a.charge = Math.min(1.5, a.charge + dt * 1.2);
        } else if (a.isCharging) {
          startAttack(a, 'strong', a.charge);
          a.isCharging = false;
          a.charge = 0;
        }
        if (g.keys['q']) {
          a.state = 'block';
          a.blockTimer = 0.3;
        }
        if (g.keys['w'] && a.dodgeTimer <= 0) {
          a.state = 'dodge';
          a.dodgeTimer = 0.35;
          a.vx = -a.facing * 280;
        }
        if (g.keys['arrowleft']) {
          a.vx = -180;
          a.state = 'walk';
          a.facing = -1;
        } else if (g.keys['arrowright']) {
          a.vx = 180;
          a.state = 'walk';
          a.facing = 1;
        } else if (!g.keys['q'] && a.state !== 'dodge') {
          a.vx = 0;
          if (a.state === 'walk') a.state = 'idle';
        }
      }
    } else {
      updateAI(a, p, dt);
    }

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
      if (f.finisherTimer && f.finisherTimer > 0) f.finisherTimer -= dt;
      if (f.state !== 'attack' && f.state !== 'dodge') {
        f.facing = f.x < (f === p ? a.x : p.x) ? 1 : -1;
      }
    });

    checkHits(p, a);
    checkHits(a, p);

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
    const playerAttacking = player.state === 'attack' && player.attackTimer > 0.1 && player.attackTimer < 0.3;
    const close = abs < 120;
    const mid = abs < 180;

    if (playerAttacking && close && Math.random() < 0.6) {
      if (ai.dodgeTimer <= 0 && Math.random() < 0.4) {
        ai.state = 'dodge';
        ai.dodgeTimer = 0.4;
        ai.vx = -ai.facing * 260;
        return;
      } else {
        ai.state = 'block';
        ai.blockTimer = 0.45;
        ai.vx = 0;
        return;
      }
    }

    if (abs > 160) {
      ai.vx = Math.sign(dist) * (ai.hp < 40 ? 90 : 140);
      ai.state = 'walk';
    } else if (abs < 70) {
      ai.vx = -Math.sign(dist) * 80;
      ai.state = 'walk';
    } else {
      ai.vx = 0;
      if (ai.state === 'walk') ai.state = 'idle';
    }

    if (mid && Math.random() < (close ? 0.035 : 0.02)) {
      const r = Math.random();
      if (r < 0.45) startAttack(ai, 'fast');
      else if (r < 0.75) startAttack(ai, 'medium');
      else if (!ai.isCharging && Math.random() < 0.3) {
        ai.isCharging = true;
        ai.charge = 0;
      } else {
        startAttack(ai, 'strong', 0.5);
      }
    }

    if (ai.isCharging) {
      ai.charge = Math.min(1.4, ai.charge + dt * 1.1);
      if (ai.charge > 0.6 && Math.random() < 0.15) {
        startAttack(ai, 'strong', ai.charge);
        ai.isCharging = false;
        ai.charge = 0;
      }
    }

    if (Math.random() < 0.004 && ai.state === 'idle') {
      ai.state = 'block';
      ai.blockTimer = 0.3;
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
        const g = gameRef.current!;
        g.hitstop = 0.12;
        g.shake = 10;
      }
    }
  }

  function endRound(playerWon: boolean) {
    const g = gameRef.current!;
    g.running = false;
    let nextP = playerWins;
    let nextA = aiWins;
    if (playerWon) {
      nextP += 1;
      setPlayerWins(nextP);
      setMessage(locale === 'es' ? '¡Round ganado!' : 'Round won!');
      g.ai.finisherTimer = 1.8;
    } else {
      nextA += 1;
      setAiWins(nextA);
      setMessage(locale === 'es' ? 'Round perdido' : 'Round lost');
      g.player.finisherTimer = 1.8;
    }
    setTimeout(() => {
      if (nextP >= ROUND_TO_WIN || nextA >= ROUND_TO_WIN) {
        setMessage(nextP >= ROUND_TO_WIN ? (locale === 'es' ? '¡Victoria!' : 'Victory!') : (locale === 'es' ? 'Derrota' : 'Defeat'));
        setTimeout(() => {
          setPlayerWins(0);
          setAiWins(0);
          setRound(1);
          setShowSelect(true);
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
        g.player.finisherTimer = 0;
        g.ai.finisherTimer = 0;
        g.running = true;
        setMessage('');
      }
    }, 1200);
  }

  function draw(ctx: CanvasRenderingContext2D) {
    const g = gameRef.current!;
    const sx = g.shake > 0 ? (Math.random() - 0.5) * g.shake : 0;
    const sy = g.shake > 0 ? (Math.random() - 0.5) * g.shake : 0;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.clearRect(-10, -10, ARENA_WIDTH + 20, ARENA_HEIGHT + 20);
    if (g.mapId === 0) {
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
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, ARENA_HEIGHT);
      grad.addColorStop(0, '#bf360c');
      grad.addColorStop(0.5, '#e64a19');
      grad.addColorStop(1, '#ff9800');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(0, GROUND_Y + 20, ARENA_WIDTH, ARENA_HEIGHT - GROUND_Y);
      ctx.fillStyle = '#3e2723';
      for (let i = 0; i < ARENA_WIDTH; i += 10) {
        ctx.fillRect(i, GROUND_Y + 22, 5, 3);
      }
      ctx.fillStyle = '#d84315';
      ctx.beginPath();
      ctx.moveTo(100, GROUND_Y);
      ctx.lineTo(300, 300);
      ctx.lineTo(500, GROUND_Y);
      ctx.fill();
    }

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
    ctx.restore();
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
    if (f.isCharging) {
      ctx.fillStyle = '#ffeb3b';
      const chargeW = 4 + f.charge * 20;
      ctx.fillRect(-chargeW / 2, -105, chargeW, 6);
    }
    if (f.state === 'attack' && f.attackType) {
      ctx.fillStyle = f.char.accent;
      const anim = f.char.attackAnim[f.attackType];
      const prog = Math.max(0, 1 - f.attackTimer / (f.attackType === 'fast' ? 0.22 : f.attackType === 'medium' ? 0.38 : 0.55));
      switch (anim) {
        case 'thrust':
          ctx.fillRect(16, -50, 40 + prog * 30, 6);
          break;
        case 'slash':
          ctx.fillRect(10, -60 - prog * 10, 25, 20);
          break;
        case 'overhead':
          ctx.fillRect(-5, -90 + prog * 20, 15, 35);
          break;
        case 'jab':
          ctx.fillRect(18, -55, 20 + prog * 15, 8);
          break;
        case 'kick':
          ctx.fillRect(12, -40, 30, 10);
          break;
        case 'spin':
          ctx.beginPath();
          ctx.arc(0, -50, 25 + prog * 10, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'axe':
          ctx.fillRect(14, -65, 12, 30 + prog * 10);
          break;
        case 'bash':
          ctx.fillRect(8, -50, 28, 18);
          break;
        case 'charge':
          ctx.fillRect(10, -55, 40 + prog * 20, 12);
          break;
        case 'bolt':
          ctx.fillRect(20, -60, 8 + prog * 25, 4);
          break;
        case 'wave':
          ctx.fillRect(10, -40, 30, 8 + prog * 5);
          break;
        case 'tempest':
          ctx.fillRect(-10, -80, 40, 10 + prog * 15);
          break;
        case 'vine':
          ctx.fillRect(16, -45, 25 + prog * 15, 5);
          break;
        case 'root':
          ctx.fillRect(5, -30, 20, 15);
          break;
        case 'bloom':
          ctx.beginPath();
          ctx.arc(20, -50, 15 + prog * 12, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'claw':
          ctx.fillRect(18, -55, 15, 10);
          ctx.fillRect(22, -48, 12, 8);
          break;
        case 'flame':
          ctx.fillRect(12, -70, 18, 25);
          break;
        case 'erupt':
          ctx.fillRect(-8, -85 + prog * 15, 40, 12);
          break;
        default:
          ctx.fillRect(16, -50, 30, 8);
      }
    } else if (f.state === 'block') {
      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(8, -65, 12, 40);
    }
    if (f.finisherTimer && f.finisherTimer > 0) {
      const t = 1 - f.finisherTimer / 1.8;
      ctx.fillStyle = f.char.accent;
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2 + t * 3;
        const r = 30 + t * 80;
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * r, -50 + Math.sin(ang) * r * 0.6, 6 + t * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -50, 40 + t * 60, 0, Math.PI * 2);
      ctx.stroke();
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

  const startSelected = () => {
    setShowSelect(false);
    initGame(mode, p1Char, p2Char, mapId);
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-white z-10">
          <div className="max-w-md rounded-2xl bg-slate-900 p-6 text-center shadow-xl">
            <h2 className="mb-3 text-2xl font-bold">{locale === 'es' ? 'Tutorial' : 'Tutorial'}</h2>
            <p className="mb-4 text-sm leading-relaxed">
              {locale === 'es'
                ? 'P1: A/D mover, J rápido, K medio, L fuerte (mantené cargar), U bloqueo, I esquive. P2 (local): flechas mover, F/G/H golpes, Q bloqueo, W esquive. Mejor de 3. Personajes ficticios: Kenshi, Shadow Kaze, Bjorn, Aetherion, Thornroot, Emberclaw.'
                : 'P1: A/D move, J fast, K medium, L strong (hold charge), U block, I dodge. P2 (local): arrows move, F/G/H attacks, Q block, W dodge. Best of 3. Fictional roster: Kenshi, Shadow Kaze, Bjorn, Aetherion, Thornroot, Emberclaw.'}
            </p>
            <button
              onClick={() => { setShowTutorial(false); setShowSelect(true); }}
              className="rounded-full bg-emerald-500 px-6 py-2 font-bold text-white hover:bg-emerald-400"
            >
              {locale === 'es' ? 'Saltar' : 'Skip'}
            </button>
          </div>
        </div>
      )}
      {showSelect && !showTutorial && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 text-white z-10">
          <div className="max-w-lg rounded-2xl bg-slate-900 p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-center">{locale === 'es' ? 'Selección' : 'Select'}</h2>
            <div className="mb-4">
              <label className="block text-sm mb-1">{locale === 'es' ? 'Modo' : 'Mode'}</label>
              <select value={mode} onChange={(e) => setMode(e.target.value as 'ai' | '2p')} className="w-full bg-slate-800 p-2 rounded">
                <option value="ai">vs IA</option>
                <option value="2p">2 Jugadores local</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">P1</label>
              <select value={p1Char} onChange={(e) => setP1Char(Number(e.target.value))} className="w-full bg-slate-800 p-2 rounded">
                {CHARACTERS.map((c, i) => <option key={c.id} value={i}>{c.name}</option>)}
              </select>
            </div>
            {mode === '2p' && (
              <div className="mb-4">
                <label className="block text-sm mb-1">P2</label>
                <select value={p2Char} onChange={(e) => setP2Char(Number(e.target.value))} className="w-full bg-slate-800 p-2 rounded">
                  {CHARACTERS.map((c, i) => <option key={c.id} value={i}>{c.name}</option>)}
                </select>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm mb-1">{locale === 'es' ? 'Mapa' : 'Map'}</label>
              <select value={mapId} onChange={(e) => setMapId(Number(e.target.value))} className="w-full bg-slate-800 p-2 rounded">
                <option value={0}>{locale === 'es' ? 'Bosque Nocturno' : 'Night Forest'}</option>
                <option value={1}>{locale === 'es' ? 'Desierto Volcánico' : 'Volcanic Desert'}</option>
              </select>
            </div>
            <button onClick={startSelected} className="w-full rounded-full bg-emerald-500 py-2 font-bold text-white hover:bg-emerald-400">
              {locale === 'es' ? 'Empezar pelea' : 'Start Fight'}
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
