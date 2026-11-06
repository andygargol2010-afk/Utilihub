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
}

export const GROUND_Y = 420;
export const ARENA_WIDTH = 960;
export const ARENA_HEIGHT = 540;
