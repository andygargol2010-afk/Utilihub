export type AttackType = 'fast' | 'medium' | 'strong';

export interface CharacterDef {
  id: string;
  name: string;
  color: string;
  accent: string;
  attackAnim: {
    fast: string;
    medium: string;
    strong: string;
  };
}

export const CHARACTERS: CharacterDef[] = [
  {
    id: 'samurai',
    name: 'Kenshi the Blade',
    color: '#c0392b',
    accent: '#f1c40f',
    attackAnim: {
      fast: 'thrust',
      medium: 'slash',
      strong: 'overhead',
    },
  },
  {
    id: 'ninja',
    name: 'Shadow Kaze',
    color: '#2c3e50',
    accent: '#3498db',
    attackAnim: {
      fast: 'jab',
      medium: 'kick',
      strong: 'spin',
    },
  },
  {
    id: 'viking',
    name: 'Bjorn the Frost',
    color: '#8e44ad',
    accent: '#ecf0f1',
    attackAnim: {
      fast: 'axe',
      medium: 'bash',
      strong: 'charge',
    },
  },
  {
    id: 'storm',
    name: 'Aetherion Storm',
    color: '#2980b9',
    accent: '#f39c12',
    attackAnim: {
      fast: 'bolt',
      medium: 'wave',
      strong: 'tempest',
    },
  },
  {
    id: 'grove',
    name: 'Thornroot Grove',
    color: '#27ae60',
    accent: '#f1c40f',
    attackAnim: {
      fast: 'vine',
      medium: 'root',
      strong: 'bloom',
    },
  },
  {
    id: 'ember',
    name: 'Emberclaw Forge',
    color: '#e67e22',
    accent: '#e74c3c',
    attackAnim: {
      fast: 'claw',
      medium: 'flame',
      strong: 'erupt',
    },
  },
];

export interface MapDef {
  id: string;
  name: string;
  bg: string;
  ground: string;
  lines: string;
}

export const MAPS: MapDef[] = [
  {
    id: 'arena',
    name: 'Arena Clásica',
    bg: '#1e293b',
    ground: '#334155',
    lines: '#475569',
  },
  {
    id: 'dojo',
    name: 'Dojo de Sombras',
    bg: '#1a1a2e',
    ground: '#16213e',
    lines: '#0f3460',
  },
];

export interface Fighter {
  id: string;
  char: CharacterDef;
  x: number;
  y: number;
  vx: number;
  facing: 1 | -1;
  hp: number;
  maxHp: number;
  state: 'idle' | 'walk' | 'attack' | 'block' | 'dodge' | 'hitstun' | 'ko';
  attackType?: AttackType;
  attackTimer: number;
  charge: number;
  isCharging: boolean;
  blockTimer: number;
  dodgeTimer: number;
  hitstunTimer: number;
  isPlayer: boolean;
  wins: number;
  finisherTimer?: number;
}

export const GROUND_Y = 420;
export const ARENA_WIDTH = 960;
export const ARENA_HEIGHT = 540;
