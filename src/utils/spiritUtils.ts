import type { SpiritBase, OwnedSpirit, BattleSpirit, ElementType } from '../types';
import { SPIRITS } from '../data/spirits';

let uidCounter = Date.now();
export function generateUid(): string {
  return `uid_${uidCounter++}`;
}

export function calcStats(base: SpiritBase['baseStats'], level: number) {
  const mul = 1 + (level - 1) * 0.08;
  return {
    hp: Math.floor(base.hp * mul),
    attack: Math.floor(base.attack * mul),
    defense: Math.floor(base.defense * mul),
    speed: Math.floor(base.speed * mul),
    mana: Math.floor(base.mana * mul),
  };
}

export function createOwnedSpirit(base: SpiritBase, level = 1): OwnedSpirit {
  const stats = calcStats(base.baseStats, level);
  return {
    ...base,
    uid: generateUid(),
    level,
    exp: 0,
    currentHp: stats.hp,
    currentMana: stats.mana,
    stats,
  };
}

export function createBattleSpirit(owned: OwnedSpirit, position: number): BattleSpirit {
  return {
    ...owned,
    position,
    cooldowns: {},
    buffs: [],
    isAlive: true,
  };
}

export function expForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function addExp(spirit: OwnedSpirit, exp: number): OwnedSpirit {
  let newExp = spirit.exp + exp;
  let newLevel = spirit.level;
  while (newExp >= expForLevel(newLevel) && newLevel < 50) {
    newExp -= expForLevel(newLevel);
    newLevel++;
  }
  const newStats = calcStats(spirit.baseStats, newLevel);
  return {
    ...spirit,
    level: newLevel,
    exp: newExp,
    stats: newStats,
    currentHp: Math.min(spirit.currentHp, newStats.hp),
    currentMana: Math.min(spirit.currentMana, newStats.mana),
  };
}

// Element advantage chart (attacker → defender)
const ELEMENT_CHART: Record<ElementType, ElementType[]> = {
  fire:    ['wood', 'metal'],
  water:   ['fire', 'earth'],
  wood:    ['earth', 'water'],
  metal:   ['wood', 'wind'],
  earth:   ['thunder', 'metal'],
  thunder: ['water', 'wind'],
  wind:    ['fire', 'thunder'],
  dark:    ['light', 'time'],
  light:   ['dark', 'void' as ElementType],
  time:    ['all' as ElementType],
};

export function getElementMultiplier(attackerEl: ElementType, defenderEl: ElementType): number {
  const strong = ELEMENT_CHART[attackerEl] || [];
  if (strong.includes(defenderEl)) return 1.5;
  const weak = (Object.entries(ELEMENT_CHART) as [ElementType, ElementType[]][])
    .filter(([, v]) => v.includes(attackerEl))
    .map(([k]) => k);
  if (weak.includes(defenderEl)) return 0.7;
  return 1.0;
}

export function calcDamage(
  attacker: BattleSpirit,
  defender: BattleSpirit,
  baseDamage: number,
): number {
  const atkBuff = attacker.buffs.filter(b => b.type === 'attack_up').reduce((a, b) => a + b.value, 0);
  const defBuff = defender.buffs.filter(b => b.type === 'defense_up').reduce((a, b) => a + b.value, 0);
  const atk = attacker.stats.attack * (1 + atkBuff / 100);
  const def = defender.stats.defense * (1 + defBuff / 100);
  const elMul = getElementMultiplier(attacker.element, defender.element);
  const rawDmg = (baseDamage * atk) / (def + 50);
  const variance = 0.9 + Math.random() * 0.2;
  return Math.max(1, Math.floor(rawDmg * elMul * variance));
}

export function rarityColor(rarity: string): string {
  switch (rarity) {
    case 'legendary': return '#FFD700';
    case 'epic':      return '#9C27B0';
    case 'rare':      return '#2196F3';
    default:          return '#9E9E9E';
  }
}

export function rarityLabel(rarity: string): string {
  switch (rarity) {
    case 'legendary': return '传说';
    case 'epic':      return '史诗';
    case 'rare':      return '稀有';
    default:          return '普通';
  }
}

export function elementLabel(el: ElementType): string {
  const map: Record<ElementType, string> = {
    fire: '火', water: '水', wood: '木', metal: '金',
    earth: '土', thunder: '雷', wind: '风', dark: '暗', light: '光', time: '时',
  };
  return map[el] || el;
}

export function elementColor(el: ElementType): string {
  const map: Record<ElementType, string> = {
    fire: '#FF5722', water: '#2196F3', wood: '#4CAF50', metal: '#9E9E9E',
    earth: '#795548', thunder: '#FFC107', wind: '#00BCD4', dark: '#673AB7',
    light: '#FFF176', time: '#E91E63',
  };
  return map[el] || '#999';
}

// Gacha summon
export function summonSpirit(): SpiritBase {
  const rand = Math.random();
  let pool: SpiritBase[];
  if (rand < 0.03) {
    pool = SPIRITS.filter(s => s.rarity === 'legendary');
  } else if (rand < 0.15) {
    pool = SPIRITS.filter(s => s.rarity === 'epic');
  } else if (rand < 0.45) {
    pool = SPIRITS.filter(s => s.rarity === 'rare');
  } else {
    pool = SPIRITS.filter(s => s.rarity === 'common');
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
