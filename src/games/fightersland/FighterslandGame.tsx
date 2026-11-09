import { useEffect, useRef, useState, useCallback } from 'react';
import { CHARACTERS, MAPS, type Fighter, type AttackType, GROUND_Y, ARENA_WIDTH, ARENA_HEIGHT, type CharacterDef, type MapDef } from './types';

function createFighter(char: CharacterDef, x: number, isPlayer: boolean): Fighter {
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
  const playerRef = useRef<Fighter | null>(null);
  const aiRef = useRef<Fighter | null>(null);
  const [playerChar, setPlayerChar] = useState<CharacterDef | null>(null);
  const [aiChar, setAiChar] = useState<CharacterDef | null>(null);
  const [selectedMap, setSelectedMap] = useState<MapDef>(MAPS[0]);
  const [round, setRound] = useState(1);
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [message, setMessage] = useState('Elige modo y fighter');
  const [force, setForce] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [inSelect, setInSelect] = useState(true);
  const [mode, setMode] = useState<'vsai' | '2p'>('vsai');
  const [p2CharSelect, setP2CharSelect] = useState<CharacterDef | null>(null);
  const keys = useRef<Set<string>>(new Set());
  const raf = useRef<number>(0);
  const lastChargeKey = useRef<AttackType | null>(null);
  const lastChargeKeyP2 = useRef<AttackType | null>(null);
  const hitstop = useRef(0);
  const shake = useRef(0);
  const winsRef = useRef({ player: 0, ai: 0 });

  const skipTutorial = useCallback(() => setShowTutorial(false), []);

  const startFight = useCallback((pChar: CharacterDef, p2Char?: CharacterDef) => {
    let aChar: CharacterDef;
    if (mode === '2p' && p2Char) {
      aChar = p2Char;
    } else {
      const others = CHARACTERS.filter(c => c.id !== pChar.id);
      aChar = others[Math.floor(Math.random() * others.length)];
    }
    setPlayerChar(pChar);
    setAiChar(aChar);
    playerRef.current = createFighter(pChar, 200, true);
    aiRef.current = createFighter(aChar, 700, mode === '2p');
    setInSelect(false);
    setMessage('Round 1');
    setRound(1);
    setPlayerWins(0);
    setAiWins(0);
    winsRef.current = { player: 0, ai: 0 };
    setGameOver(false);
    setForce(f => f + 1);
  }, [mode]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current.add(k);
      if (['j', 'k', 'l', 's', 'a', 'd', ' ', 'u', 'i', 'o', 'arrowleft', 'arrowright', 'arrowdown', 'enter'].includes(k)) e.preventDefault();
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
    defender.hitstunTimer = 20 + Math.floor(attacker.charge / 8);
    defender.vx = attacker.facing * (6 + attacker.charge / 12);
    defender.charge = 0;
    defender.isCharging = false;
    hitstop.current = 8 + Math.floor(attacker.charge / 15);
    shake.current = 5 + attacker.charge / 20;
    return true;
  };

  const updateFighter = (f: Fighter, isAI: boolean, opponent: Fighter, isP2 = false) => {
    if (hitstop.current > 0) return;
    if (f.state === 'ko' || f.hitstunTimer > 0) {
      f.hitstunTimer = Math.max(0, f.hitstunTimer - 1);
      f.x = Math.max(40, Math.min(ARENA_WIDTH - 40, f.x + f.vx));
      f.vx *= 0.75;
      if (f.hitstunTimer <= 0 && f.hp > 0) f.state = 'idle';
      return;
    }

    if (!isAI) {
      const moveLeft = isP2 ? 'arrowleft' : 'a';
      const moveRight = isP2 ? 'arrowright' : 'd';
      const blockKey = isP2 ? 'arrowdown' : 's';
      const dodgeKey = isP2 ? 'enter' : ' ';
      const fastKey = isP2 ? 'u' : 'j';
      const medKey = isP2 ? 'i' : 'k';
      const strongKey = isP2 ? 'o' : 'l';
      const chargeRef = isP2 ? lastChargeKeyP2 : lastChargeKey;

      if (keys.current.has(moveLeft)) {
        f.x = Math.max(40, f.x - 4.2);
        f.facing = -1;
        f.state = 'walk';
      } else if (keys.current.has(moveRight)) {
        f.x = Math.min(ARENA_WIDTH - 40, f.x + 4.2);
        f.facing = 1;
        f.state = 'walk';
      } else if (f.state === 'walk') f.state = 'idle';

      if (keys.current.has(dodgeKey) && f.dodgeTimer <= 0 && f.state !== 'attack') {
        f.state = 'dodge';
        f.dodgeTimer = 22;
        f.vx = f.facing * -8;
      }

      if (keys.current.has(blockKey) && f.state !== 'attack' && f.dodgeTimer <= 0) {
        f.state = 'block';
        f.blockTimer = 14;
      } else if (f.blockTimer > 0) {
        f.blockTimer--;
        if (f.blockTimer <= 0 && f.state === 'block') f.state = 'idle';
      }

      const atkKey = keys.current.has(fastKey) ? 'fast' as AttackType : keys.current.has(medKey) ? 'medium' : keys.current.has(strongKey) ? 'strong' : null;
      if (atkKey && f.state !== 'attack' && f.dodgeTimer <= 0 && f.blockTimer <= 0) {
        f.isCharging = true;
        f.charge = Math.min(55, f.charge + 1.4);
        chargeRef.current = atkKey;
      } else if (f.isCharging && !atkKey) {
        const mult = 1 + f.charge / 32;
        f.state = 'attack';
        f.attackType = chargeRef.current || 'fast';
        f.attackTimer = Math.floor(16 * mult);
        f.isCharging = false;
      }
    } else {
      const dist = opponent.x - f.x;
      const absDist = Math.abs(dist);
      if (absDist > 90) {
        f.x += Math.sign(dist) * 2.8;
        f.facing = Math.sign(dist) as 1 | -1;
        f.state = 'walk';
      } else {
        f.state = 'idle';
        if (Math.random() < 0.06 && f.attackTimer <= 0 && f.dodgeTimer <= 0) {
          const types: AttackType[] = ['fast', 'medium', 'strong'];
          f.state = 'attack';
          f.attackType = types[Math.floor(Math.random() * 3)];
          f.attackTimer = 16;
          f.charge = Math.random() < 0.4 ? 20 + Math.random() * 20 : 0;
        }
        if (Math.random() < 0.04 && opponent.state === 'attack') {
          f.state = 'block';
          f.blockTimer = 10;
        }
      }
    }

    if (f.dodgeTimer > 0) {
      f.dodgeTimer--;
      f.x = Math.max(40, Math.min(ARENA_WIDTH - 40, f.x + f.vx));
      if (f.dodgeTimer <= 0) { f.state = 'idle'; f.vx = 0; }
    }

    if (f.state === 'attack') {
      f.attackTimer--;
      if (f.attackTimer > 4 && f.attackTimer < 12 && Math.abs(f.x - opponent.x) < 85) {
        applyHit(f, opponent);
      }
      if (f.attackTimer <= 0) {
        f.state = 'idle';
        f.charge = 0;
      }
    }
  };

  const loop = useCallback(() => {
    if (gameOver || inSelect || !playerRef.current || !aiRef.current) {
      raf.current = requestAnimationFrame(loop);
      return;
    }
    if (hitstop.current > 0) {
      hitstop.current--;
    } else {
      const p = playerRef.current;
      const a = aiRef.current;

      updateFighter(p, false, a, false);
      updateFighter(a, mode !== '2p', p, mode === '2p');

      if (p.hp <= 0 && p.state !== 'ko') {
        p.state = 'ko';
        winsRef.current.ai += 1;
        setAiWins(winsRef.current.ai);
        const winner = mode === '2p' ? (aiChar?.name ?? 'P2') : 'AI';
        setMessage(winsRef.current.ai >= 2 ? `${winner} gana el match!` : `${winner} gana el round!`);
        if (winsRef.current.ai >= 2) setGameOver(true);
        setForce(f => f + 1);
      }
      if (a.hp <= 0 && a.state !== 'ko') {
        a.state = 'ko';
        winsRef.current.player += 1;
        setPlayerWins(winsRef.current.player);
        const winner = mode === '2p' ? (playerChar?.name ?? 'P1') : 'T\u00fa';
        setMessage(winsRef.current.player >= 2 ? `\u00a1${winner} ganas el match!` : `\u00a1${winner} ganas el round!`);
        if (winsRef.current.player >= 2) setGameOver(true);
        setForce(f => f + 1);
      }
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && playerRef.current && aiRef.current) {
      if (shake.current > 0) {
        shake.current *= 0.82;
        if (shake.current < 0.5) shake.current = 0;
      }
      draw(ctx, playerRef.current, aiRef.current, shake.current, selectedMap);
    }

    raf.current = requestAnimationFrame(loop);
  }, [gameOver, inSelect, selectedMap, mode, playerChar, aiChar]);

  useEffect(() => {
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [loop]);

  useEffect(() => {
    if (!inSelect && !gameOver && ((playerRef.current?.hp ?? 1) <= 0 || (aiRef.current?.hp ?? 1) <= 0)) {
      const t = setTimeout(() => {
        if (winsRef.current.player < 2 && winsRef.current.ai < 2 && playerChar && aiChar) {
          playerRef.current = createFighter(playerChar, 200, true);
          aiRef.current = createFighter(aiChar, 700, mode === '2p');
          setRound(r => r + 1);
          setMessage(`Round ${round + 1}`);
          setForce(f => f + 1);
        }
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [force, round, gameOver, inSelect, playerChar, aiChar, mode]);

  if (inSelect) {
    return (
      <div className="relative w-full h-[calc(100vh-56px)] bg-slate-900 flex flex-col items-center justify-center overflow-hidden text-white">
        <h1 className="text-3xl font-bold mb-2 text-amber-400">Fightersland</h1>
        <p className="mb-2 text-slate-300">Modo</p>
        <div className="flex gap-4 mb-4">
          <button onClick={() => setMode('vsai')} className={`px-4 py-2 rounded border-2 ${mode === 'vsai' ? 'border-amber-500 bg-slate-700' : 'border-slate-600'}`}>Vs IA</button>
          <button onClick={() => setMode('2p')} className={`px-4 py-2 rounded border-2 ${mode === '2p' ? 'border-amber-500 bg-slate-700' : 'border-slate-600'}`}>2 Jugadores Local</button>
        </div>
        <p className="mb-4 text-slate-300">{mode === 'vsai' ? 'Elige tu fighter (IA aleatoria)' : 'Elige P1 y P2'}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl px-4 mb-6">
          {CHARACTERS.map(c => (
            <button
              key={c.id}
              onClick={() => {
                if (mode === 'vsai') startFight(c);
                else if (!p2CharSelect) setP2CharSelect(c);
                else startFight(p2CharSelect, c); // wait, better flow
              }}
              className="p-4 rounded-lg border-2 border-slate-600 hover:border-amber-500 bg-slate-800 text-left transition"
              style={{ borderColor: c.color }}
            >
              <div className="font-bold" style={{ color: c.accent }}>{c.name}</div>
              <div className="text-xs opacity-70 mt-1">{c.id}</div>
              <div className="mt-2 h-3 w-full rounded" style={{ background: c.color }} />
            </button>
          ))}
        </div>
        {mode === '2p' && p2CharSelect && (
          <p className="mb-2">P1: {p2CharSelect.name} seleccionado. Ahora elige P2.</p>
        )}
        <p className="mb-2 text-slate-300">Elige mapa</p>
        <div className="flex gap-4 mb-4">
          {MAPS.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMap(m)}
              className={`px-4 py-2 rounded border-2 ${selectedMap.id === m.id ? 'border-amber-500 bg-slate-700' : 'border-slate-600 bg-slate-800'}`}
            >
              {m.name}
            </button>
          ))}
        </div>
        {showTutorial && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
            <div className="bg-slate-800 p-6 rounded-lg text-center max-w-md">
              <h2 className="text-xl font-bold mb-3">Fightersland - Tutorial</h2>
              <p className="mb-2 text-sm">P1: A/D mover, J/K/L golpes (mant\u00e9n charge), S bloquear, Espacio esquivar<br />P2 (local): Flechas izq/der, U/I/O golpes, Abajo bloquear, Enter esquivar</p>
              <p className="mb-4 text-xs opacity-80">Mejor de 3 rounds. Personajes 100% ficticios. Sin sangre. Offline only.</p>
              <button onClick={skipTutorial} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded font-bold">Saltar</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-56px)] bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={ARENA_WIDTH}
        height={ARENA_HEIGHT}
        className="border-2 border-slate-600 shadow-2xl max-w-full max-h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute top-2 left-4 text-white text-sm font-mono">
        {message} | {playerChar?.name ?? 'P1'} {playerWins} - {aiWins} {aiChar?.name ?? (mode === '2p' ? 'P2' : 'AI')} | R{round} | {selectedMap.name} | {mode}
      </div>
      {gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
          <div className="bg-slate-800 p-6 rounded-lg text-center text-white">
            <h2 className="text-2xl font-bold mb-4">{winsRef.current.player >= 2 ? '\u00a1Victoria P1!' : 'Victoria P2/AI'}</h2>
            <button
              onClick={() => { setInSelect(true); setP2CharSelect(null); }}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 rounded font-bold"
            >
              Volver a seleccionar
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 flex gap-2 md:hidden">
        <button onPointerDown={() => press('a')} onPointerUp={() => release('a')} className="w-12 h-12 bg-slate-700 rounded text-white">←</button>
        <button onPointerDown={() => press('d')} onPointerUp={() => release('d')} className="w-12 h-12 bg-slate-700 rounded text-white">→</button>
        <button onPointerDown={() => press(' ')} onPointerUp={() => release(' ')} className="w-12 h-12 bg-purple-700 rounded text-white text-xs">Dodge</button>
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

function draw(ctx: CanvasRenderingContext2D, p: Fighter, a: Fighter, shakeAmt: number, map: MapDef) {
  ctx.save();
  if (shakeAmt > 0) {
    ctx.translate((Math.random() - 0.5) * shakeAmt, (Math.random() - 0.5) * shakeAmt);
  }
  ctx.fillStyle = map.bg;
  ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
  ctx.fillStyle = map.ground;
  ctx.fillRect(0, GROUND_Y + 20, ARENA_WIDTH, 120);
  ctx.strokeStyle = map.lines;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 30 + i * 18);
    ctx.lineTo(ARENA_WIDTH, GROUND_Y + 30 + i * 18);
    ctx.stroke();
  }
  // HP bars
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
  ctx.restore();
}

function drawFighter(ctx: CanvasRenderingContext2D, f: Fighter) {
  const { x, y, facing, char, state } = f;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  // Body
  ctx.fillStyle = char.color;
  ctx.fillRect(-14, -48, 28, 42);
  // Head
  ctx.fillStyle = char.accent;
  ctx.fillRect(-10, -70, 20, 18);
  // Simple face pixel
  ctx.fillStyle = '#111';
  ctx.fillRect(-4, -64, 3, 3);
  ctx.fillRect(2, -64, 3, 3);

  const anim = f.attackType && char.attackAnim ? char.attackAnim[f.attackType] : 'thrust';

  if (state === 'attack') {
    ctx.fillStyle = '#fbbf24';
    const chargeBoost = (f.charge || 0) / 3;
    if (anim === 'thrust' || anim === 'jab' || anim === 'bolt' || anim === 'vine' || anim === 'claw' || anim === 'axe') {
      ctx.fillRect(10, -34, 28 + chargeBoost, 6);
    } else if (anim === 'slash' || anim === 'kick' || anim === 'wave' || anim === 'root' || anim === 'flame' || anim === 'bash') {
      ctx.fillRect(8, -42, 22 + chargeBoost / 2, 14);
      ctx.fillRect(14, -28, 18, 8);
    } else {
      // strong / overhead / spin / etc
      ctx.fillRect(6, -56, 16 + chargeBoost / 2, 10);
      ctx.fillRect(12, -40, 26 + chargeBoost, 8);
    }
  }
  if (state === 'block') {
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(8, -46, 12, 36);
  }
  if (state === 'hitstun') {
    ctx.fillStyle = '#f87171';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(-6, -30, 12, 12);
    ctx.globalAlpha = 1;
  }
  if (state === 'dodge') {
    ctx.globalAlpha = 0.6;
  }
  if (f.isCharging) {
    ctx.fillStyle = '#facc15';
    ctx.globalAlpha = 0.75;
    const w = 10 + f.charge * 0.8;
    ctx.fillRect(-w / 2, -86, w, 6);
    ctx.globalAlpha = 1;
    // telegraph sparks
    if (f.charge > 30) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(-4, -92, 3, 3);
      ctx.fillRect(4, -94, 3, 3);
    }
  }
  ctx.restore();
}
