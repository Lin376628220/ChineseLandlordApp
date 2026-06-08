export type ElementType =
  | 'fire' | 'water' | 'wood' | 'metal' | 'earth'
  | 'thunder' | 'wind' | 'dark' | 'light' | 'time';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type SkillTarget = 'single' | 'all' | 'self' | 'adjacent';
export type SkillEffect = 'damage' | 'heal' | 'buff' | 'debuff' | 'resonance';

export interface Skill {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  element: ElementType;
  manaCost: number;
  damage?: number;
  heal?: number;
  effect?: SkillEffect;
  target: SkillTarget;
  cooldown: number;
}

export interface SpiritBase {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  element: ElementType;
  rarity: Rarity;
  emoji: string;
  color: string;
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    mana: number;
  };
  skills: Skill[];
  evolutionId?: string;
  evolutionLevel?: number;
}

export interface OwnedSpirit extends SpiritBase {
  uid: string;
  level: number;
  exp: number;
  currentHp: number;
  currentMana: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    mana: number;
  };
}

export interface BattleSpirit extends OwnedSpirit {
  position: number; // 0-8 on 3x3 grid
  cooldowns: Record<string, number>;
  buffs: BattleBuff[];
  isAlive: boolean;
}

export interface BattleBuff {
  type: 'attack_up' | 'defense_up' | 'speed_up' | 'attack_down' | 'defense_down' | 'poison' | 'regen';
  value: number;
  duration: number;
}

export type BattlePhase = 'setup' | 'player_turn' | 'enemy_turn' | 'victory' | 'defeat';

export interface BattleState {
  phase: BattlePhase;
  turn: number;
  playerTeam: (BattleSpirit | null)[];
  enemyTeam: (BattleSpirit | null)[];
  selectedSpirit: number | null;
  selectedSkill: Skill | null;
  log: string[];
  currentStageId?: number;
}

export interface PlayerData {
  name: string;
  level: number;
  exp: number;
  gold: number;
  gems: number;
  spirits: OwnedSpirit[];
  team: string[]; // uids, max 9
  stageProgress: number;
  lastDailyReward: string | null;
}

export type ScreenName =
  | 'Home'
  | 'Collection'
  | 'Battle'
  | 'Stage'
  | 'Shop'
  | 'SpiritDetail'
  | 'TeamSetup';
