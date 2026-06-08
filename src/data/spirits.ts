import type { SpiritBase, Skill } from '../types';

// ── Skills ─────────────────────────────────────────────────────────────────

const flameBite: Skill = {
  id: 's_flame_bite', name: 'Flame Bite', nameZh: '烈焰噬咬',
  description: '喷出火焰撕咬敌人', element: 'fire', manaCost: 20,
  damage: 40, effect: 'damage', target: 'single', cooldown: 1,
};
const inferno: Skill = {
  id: 's_inferno', name: 'Inferno', nameZh: '业火爆炎',
  description: '引发大范围火焰爆炸，伤害所有敌人', element: 'fire', manaCost: 50,
  damage: 65, effect: 'damage', target: 'all', cooldown: 3,
};
const emberShield: Skill = {
  id: 's_ember_shield', name: 'Ember Shield', nameZh: '炎盾护体',
  description: '以火焰为盾，提升自身防御', element: 'fire', manaCost: 25,
  effect: 'buff', target: 'self', cooldown: 2,
};

const tidalWave: Skill = {
  id: 's_tidal_wave', name: 'Tidal Wave', nameZh: '浪涛冲击',
  description: '掀起巨浪冲击敌人', element: 'water', manaCost: 25,
  damage: 45, effect: 'damage', target: 'single', cooldown: 1,
};
const oceanHeal: Skill = {
  id: 's_ocean_heal', name: 'Ocean Heal', nameZh: '海洋治愈',
  description: '以水之力治愈己方', element: 'water', manaCost: 30,
  heal: 50, effect: 'heal', target: 'self', cooldown: 2,
};
const frozenTide: Skill = {
  id: 's_frozen_tide', name: 'Frozen Tide', nameZh: '冰封潮汐',
  description: '冰冻敌方全体，降低速度', element: 'water', manaCost: 45,
  damage: 35, effect: 'debuff', target: 'all', cooldown: 3,
};

const thornStrike: Skill = {
  id: 's_thorn_strike', name: 'Thorn Strike', nameZh: '荆棘刺击',
  description: '以尖锐荆棘刺穿敌人', element: 'wood', manaCost: 20,
  damage: 38, effect: 'damage', target: 'single', cooldown: 1,
};
const forestRegen: Skill = {
  id: 's_forest_regen', name: 'Forest Regen', nameZh: '森林回春',
  description: '借助森林之力持续回复生命', element: 'wood', manaCost: 35,
  heal: 30, effect: 'heal', target: 'self', cooldown: 2,
};

const ironSlash: Skill = {
  id: 's_iron_slash', name: 'Iron Slash', nameZh: '金铁劈斩',
  description: '以金属利刃斩击敌人', element: 'metal', manaCost: 22,
  damage: 50, effect: 'damage', target: 'single', cooldown: 1,
};
const bladeStorm: Skill = {
  id: 's_blade_storm', name: 'Blade Storm', nameZh: '刃雨风暴',
  description: '召唤无数刀刃攻击所有敌人', element: 'metal', manaCost: 55,
  damage: 55, effect: 'damage', target: 'all', cooldown: 3,
};

const rockCrush: Skill = {
  id: 's_rock_crush', name: 'Rock Crush', nameZh: '岩石粉碎',
  description: '以大地之力粉碎敌人', element: 'earth', manaCost: 28,
  damage: 42, effect: 'damage', target: 'single', cooldown: 1,
};
const earthFortify: Skill = {
  id: 's_earth_fortify', name: 'Earth Fortify', nameZh: '厚土坚盾',
  description: '借大地之力强化防御', element: 'earth', manaCost: 30,
  effect: 'buff', target: 'self', cooldown: 2,
};

const lightningBolt: Skill = {
  id: 's_lightning_bolt', name: 'Lightning Bolt', nameZh: '雷霆一击',
  description: '释放强大雷电攻击敌人', element: 'thunder', manaCost: 30,
  damage: 55, effect: 'damage', target: 'single', cooldown: 1,
};
const thunderRoar: Skill = {
  id: 's_thunder_roar', name: 'Thunder Roar', nameZh: '雷鸣咆哮',
  description: '雷霆咆哮震慑所有敌人', element: 'thunder', manaCost: 50,
  damage: 45, effect: 'debuff', target: 'all', cooldown: 3,
};

const galeSlash: Skill = {
  id: 's_gale_slash', name: 'Gale Slash', nameZh: '疾风斩',
  description: '以风之速度高速斩击', element: 'wind', manaCost: 18,
  damage: 35, effect: 'damage', target: 'single', cooldown: 0,
};
const windStep: Skill = {
  id: 's_wind_step', name: 'Wind Step', nameZh: '踏风步',
  description: '御风而行，提升自身速度', element: 'wind', manaCost: 20,
  effect: 'buff', target: 'self', cooldown: 2,
};

const shadowStrike: Skill = {
  id: 's_shadow_strike', name: 'Shadow Strike', nameZh: '暗影偷袭',
  description: '从暗处发动偷袭', element: 'dark', manaCost: 30,
  damage: 60, effect: 'damage', target: 'single', cooldown: 2,
};
const voidCurse: Skill = {
  id: 's_void_curse', name: 'Void Curse', nameZh: '虚空诅咒',
  description: '降下诅咒削弱所有敌人', element: 'dark', manaCost: 55,
  damage: 30, effect: 'debuff', target: 'all', cooldown: 3,
};

const holyLight: Skill = {
  id: 's_holy_light', name: 'Holy Light', nameZh: '圣光照耀',
  description: '圣洁之光治愈并净化', element: 'light', manaCost: 35,
  heal: 60, effect: 'heal', target: 'self', cooldown: 2,
};
const divineStrike: Skill = {
  id: 's_divine_strike', name: 'Divine Strike', nameZh: '神圣打击',
  description: '以神圣之力重创敌人', element: 'light', manaCost: 40,
  damage: 65, effect: 'damage', target: 'single', cooldown: 2,
};

const timeBend: Skill = {
  id: 's_time_bend', name: 'Time Bend', nameZh: '时间扭曲',
  description: '扭曲时间，使敌人减速并对己方加速', element: 'time', manaCost: 60,
  effect: 'debuff', target: 'all', cooldown: 4,
};
const chronoStrike: Skill = {
  id: 's_chrono_strike', name: 'Chrono Strike', nameZh: '时空穿刺',
  description: '穿越时间斩击，无视防御', element: 'time', manaCost: 55,
  damage: 75, effect: 'damage', target: 'single', cooldown: 3,
};

// ── Spirits ────────────────────────────────────────────────────────────────

export const SPIRITS: SpiritBase[] = [
  // ── Fire ──
  {
    id: 'sp_blazefox', name: 'Blazefox', nameZh: '烈焰狐',
    description: '身披火焰的九尾神狐，传说是太阳神的使者',
    element: 'fire', rarity: 'rare', emoji: '🦊', color: '#FF6B35',
    baseStats: { hp: 320, attack: 75, defense: 45, speed: 70, mana: 80 },
    skills: [flameBite, emberShield],
    evolutionId: 'sp_infernofox', evolutionLevel: 20,
  },
  {
    id: 'sp_infernofox', name: 'Infernofox', nameZh: '炎帝狐',
    description: '九尾狐的进化形态，能以意念操控烈焰',
    element: 'fire', rarity: 'epic', emoji: '🦊', color: '#FF3000',
    baseStats: { hp: 450, attack: 110, defense: 65, speed: 95, mana: 100 },
    skills: [flameBite, inferno, emberShield],
  },
  {
    id: 'sp_emberpup', name: 'Emberpup', nameZh: '火焰幼犬',
    description: '一只刚刚觉醒火焰之力的小狗',
    element: 'fire', rarity: 'common', emoji: '🐕', color: '#FF8C42',
    baseStats: { hp: 280, attack: 60, defense: 40, speed: 55, mana: 60 },
    skills: [flameBite],
    evolutionId: 'sp_blazefox', evolutionLevel: 15,
  },
  {
    id: 'sp_phoenixling', name: 'Phoenixling', nameZh: '幼凤',
    description: '不死鸟凤凰的幼体，每次死亡都会重生',
    element: 'fire', rarity: 'legendary', emoji: '🐦', color: '#FFD700',
    baseStats: { hp: 400, attack: 95, defense: 80, speed: 110, mana: 120 },
    skills: [flameBite, inferno, holyLight],
  },

  // ── Water ──
  {
    id: 'sp_tidewyrm', name: 'Tidewyrm', nameZh: '潮汐蛟',
    description: '深海中游弋的水龙，能呼风唤雨',
    element: 'water', rarity: 'rare', emoji: '🐉', color: '#4FC3F7',
    baseStats: { hp: 380, attack: 70, defense: 70, speed: 55, mana: 90 },
    skills: [tidalWave, oceanHeal],
    evolutionId: 'sp_abyssdragon', evolutionLevel: 22,
  },
  {
    id: 'sp_abyssdragon', name: 'Abyssdragon', nameZh: '深渊龙王',
    description: '海洋深处的王者，其咆哮能引发海啸',
    element: 'water', rarity: 'epic', emoji: '🐲', color: '#0277BD',
    baseStats: { hp: 560, attack: 105, defense: 100, speed: 70, mana: 110 },
    skills: [tidalWave, frozenTide, oceanHeal],
  },
  {
    id: 'sp_droplet', name: 'Droplet', nameZh: '水滴精',
    description: '由纯净泉水凝聚而成的水精灵',
    element: 'water', rarity: 'common', emoji: '💧', color: '#81D4FA',
    baseStats: { hp: 260, attack: 50, defense: 55, speed: 60, mana: 70 },
    skills: [tidalWave],
    evolutionId: 'sp_tidewyrm', evolutionLevel: 12,
  },
  {
    id: 'sp_frostqueen', name: 'Frostqueen', nameZh: '霜之女王',
    description: '掌控冰雪的神秘女王，美丽而冷酷',
    element: 'water', rarity: 'legendary', emoji: '❄️', color: '#E1F5FE',
    baseStats: { hp: 420, attack: 90, defense: 85, speed: 75, mana: 130 },
    skills: [frozenTide, tidalWave, oceanHeal],
  },

  // ── Wood ──
  {
    id: 'sp_thornbear', name: 'Thornbear', nameZh: '荆棘熊',
    description: '身披荆棘的巨熊，是森林的守护者',
    element: 'wood', rarity: 'common', emoji: '🐻', color: '#66BB6A',
    baseStats: { hp: 400, attack: 65, defense: 80, speed: 35, mana: 55 },
    skills: [thornStrike, forestRegen],
    evolutionId: 'sp_ancienttree', evolutionLevel: 18,
  },
  {
    id: 'sp_ancienttree', name: 'Ancienttree', nameZh: '古树守卫',
    description: '千年古树化形而成，守护整片森林',
    element: 'wood', rarity: 'epic', emoji: '🌳', color: '#2E7D32',
    baseStats: { hp: 620, attack: 85, defense: 130, speed: 25, mana: 70 },
    skills: [thornStrike, forestRegen],
  },
  {
    id: 'sp_sproutling', name: 'Sproutling', nameZh: '嫩芽精',
    description: '刚刚破土而出的小植物精灵',
    element: 'wood', rarity: 'common', emoji: '🌱', color: '#A5D6A7',
    baseStats: { hp: 240, attack: 40, defense: 50, speed: 45, mana: 60 },
    skills: [forestRegen],
    evolutionId: 'sp_thornbear', evolutionLevel: 10,
  },

  // ── Metal ──
  {
    id: 'sp_ironwolf', name: 'Ironwolf', nameZh: '铁甲狼',
    description: '全身覆盖金属甲壳的狼，是天生的战士',
    element: 'metal', rarity: 'rare', emoji: '🐺', color: '#B0BEC5',
    baseStats: { hp: 350, attack: 85, defense: 75, speed: 65, mana: 65 },
    skills: [ironSlash, bladeStorm],
    evolutionId: 'sp_steelwarden', evolutionLevel: 20,
  },
  {
    id: 'sp_steelwarden', name: 'Steelwarden', nameZh: '钢铁卫士',
    description: '铁甲狼的进化形态，可承受一切攻击',
    element: 'metal', rarity: 'epic', emoji: '🦴', color: '#607D8B',
    baseStats: { hp: 500, attack: 120, defense: 110, speed: 80, mana: 85 },
    skills: [ironSlash, bladeStorm],
  },
  {
    id: 'sp_scraprat', name: 'Scraprat', nameZh: '废铁鼠',
    description: '以金属为食的小老鼠，牙齿坚硬无比',
    element: 'metal', rarity: 'common', emoji: '🐭', color: '#CFD8DC',
    baseStats: { hp: 260, attack: 55, defense: 45, speed: 75, mana: 50 },
    skills: [ironSlash],
    evolutionId: 'sp_ironwolf', evolutionLevel: 12,
  },

  // ── Earth ──
  {
    id: 'sp_terracow', name: 'Terracow', nameZh: '土牛',
    description: '大地之牛，稳如磐石',
    element: 'earth', rarity: 'common', emoji: '🐄', color: '#A1887F',
    baseStats: { hp: 450, attack: 60, defense: 100, speed: 30, mana: 50 },
    skills: [rockCrush, earthFortify],
    evolutionId: 'sp_mountainox', evolutionLevel: 18,
  },
  {
    id: 'sp_mountainox', name: 'Mountainox', nameZh: '山岳神牛',
    description: '化身山岳的神牛，移山倒海不在话下',
    element: 'earth', rarity: 'epic', emoji: '🏔️', color: '#795548',
    baseStats: { hp: 700, attack: 90, defense: 160, speed: 20, mana: 60 },
    skills: [rockCrush, earthFortify],
  },
  {
    id: 'sp_pebbleling', name: 'Pebbleling', nameZh: '小石精',
    description: '由大地石块凝聚而成的小精灵',
    element: 'earth', rarity: 'common', emoji: '🪨', color: '#BCAAA4',
    baseStats: { hp: 300, attack: 45, defense: 70, speed: 25, mana: 40 },
    skills: [rockCrush],
    evolutionId: 'sp_terracow', evolutionLevel: 10,
  },

  // ── Thunder ──
  {
    id: 'sp_stormbird', name: 'Stormbird', nameZh: '风暴雷鸟',
    description: '翱翔雷云之中的神鸟，每次振翅都引发雷暴',
    element: 'thunder', rarity: 'rare', emoji: '⚡', color: '#FFF176',
    baseStats: { hp: 330, attack: 90, defense: 50, speed: 100, mana: 85 },
    skills: [lightningBolt, thunderRoar],
    evolutionId: 'sp_thundergod', evolutionLevel: 22,
  },
  {
    id: 'sp_thundergod', name: 'Thundergod', nameZh: '雷神之鸟',
    description: '雷鸟的神化形态，被称为行走的雷神',
    element: 'thunder', rarity: 'legendary', emoji: '🦅', color: '#F9A825',
    baseStats: { hp: 480, attack: 135, defense: 75, speed: 130, mana: 110 },
    skills: [lightningBolt, thunderRoar, bladeStorm],
  },
  {
    id: 'sp_sparkling', name: 'Sparkling', nameZh: '电火花精',
    description: '一只会放电的可爱小精灵',
    element: 'thunder', rarity: 'common', emoji: '✨', color: '#FFEE58',
    baseStats: { hp: 250, attack: 65, defense: 35, speed: 80, mana: 65 },
    skills: [lightningBolt],
    evolutionId: 'sp_stormbird', evolutionLevel: 12,
  },

  // ── Wind ──
  {
    id: 'sp_galehawk', name: 'Galehawk', nameZh: '疾风隼',
    description: '速度最快的精灵之一，快如闪电',
    element: 'wind', rarity: 'rare', emoji: '🦆', color: '#B2EBF2',
    baseStats: { hp: 290, attack: 80, defense: 40, speed: 130, mana: 75 },
    skills: [galeSlash, windStep],
    evolutionId: 'sp_hurricanelord', evolutionLevel: 20,
  },
  {
    id: 'sp_hurricanelord', name: 'Hurricanelord', nameZh: '飓风之主',
    description: '疾风隼的觉醒形态，能召唤飓风席卷战场',
    element: 'wind', rarity: 'epic', emoji: '🌪️', color: '#80DEEA',
    baseStats: { hp: 420, attack: 115, defense: 60, speed: 165, mana: 95 },
    skills: [galeSlash, windStep, bladeStorm],
  },
  {
    id: 'sp_breezeling', name: 'Breezeling', nameZh: '微风精',
    description: '随风飘游的轻盈小精灵',
    element: 'wind', rarity: 'common', emoji: '🍃', color: '#E0F7FA',
    baseStats: { hp: 220, attack: 50, defense: 30, speed: 100, mana: 60 },
    skills: [galeSlash],
    evolutionId: 'sp_galehawk', evolutionLevel: 10,
  },

  // ── Dark ──
  {
    id: 'sp_shadowpanther', name: 'Shadowpanther', nameZh: '暗影豹',
    description: '潜伏于黑暗之中的猎手，从不被猎物发现',
    element: 'dark', rarity: 'rare', emoji: '🐆', color: '#7E57C2',
    baseStats: { hp: 340, attack: 95, defense: 55, speed: 90, mana: 80 },
    skills: [shadowStrike, voidCurse],
    evolutionId: 'sp_voidlord', evolutionLevel: 22,
  },
  {
    id: 'sp_voidlord', name: 'Voidlord', nameZh: '虚空主宰',
    description: '暗影豹的终极形态，掌控黑暗与虚空',
    element: 'dark', rarity: 'legendary', emoji: '👁️', color: '#4A148C',
    baseStats: { hp: 520, attack: 140, defense: 80, speed: 110, mana: 120 },
    skills: [shadowStrike, voidCurse, chronoStrike],
  },
  {
    id: 'sp_darkling', name: 'Darkling', nameZh: '暗精灵',
    description: '在黑暗中诞生的小精灵，喜欢恶作剧',
    element: 'dark', rarity: 'common', emoji: '🦇', color: '#9C27B0',
    baseStats: { hp: 270, attack: 60, defense: 45, speed: 70, mana: 75 },
    skills: [shadowStrike],
    evolutionId: 'sp_shadowpanther', evolutionLevel: 14,
  },

  // ── Light ──
  {
    id: 'sp_solarlion', name: 'Solarlion', nameZh: '日耀狮',
    description: '承载太阳之力的圣狮，治愈者与战士的结合',
    element: 'light', rarity: 'epic', emoji: '🦁', color: '#FFD54F',
    baseStats: { hp: 480, attack: 100, defense: 90, speed: 70, mana: 110 },
    skills: [divineStrike, holyLight],
  },
  {
    id: 'sp_radiantcub', name: 'Radiantcub', nameZh: '光明幼狮',
    description: '日耀狮的幼体，全身散发柔和光芒',
    element: 'light', rarity: 'rare', emoji: '🐱', color: '#FFF9C4',
    baseStats: { hp: 320, attack: 70, defense: 65, speed: 60, mana: 90 },
    skills: [holyLight, divineStrike],
    evolutionId: 'sp_solarlion', evolutionLevel: 20,
  },
  {
    id: 'sp_glowmoth', name: 'Glowmoth', nameZh: '萤光蛾',
    description: '散发神圣光芒的蛾子，能驱散黑暗',
    element: 'light', rarity: 'common', emoji: '🦋', color: '#FFFDE7',
    baseStats: { hp: 240, attack: 45, defense: 40, speed: 65, mana: 80 },
    skills: [holyLight],
    evolutionId: 'sp_radiantcub', evolutionLevel: 12,
  },

  // ── Time ──
  {
    id: 'sp_chronotiger', name: 'Chronotiger', nameZh: '时间之虎',
    description: '掌控时间流速的神秘白虎，来自另一个时代',
    element: 'time', rarity: 'legendary', emoji: '🐯', color: '#CE93D8',
    baseStats: { hp: 460, attack: 120, defense: 85, speed: 120, mana: 140 },
    skills: [chronoStrike, timeBend, galeSlash],
  },
  {
    id: 'sp_timesprite', name: 'Timesprite', nameZh: '时间精灵',
    description: '在时间裂缝中穿梭的小精灵，行踪不定',
    element: 'time', rarity: 'rare', emoji: '⏰', color: '#E1BEE7',
    baseStats: { hp: 300, attack: 80, defense: 60, speed: 105, mana: 110 },
    skills: [timeBend, chronoStrike],
    evolutionId: 'sp_chronotiger', evolutionLevel: 25,
  },
];

export function getSpiritById(id: string): SpiritBase | undefined {
  return SPIRITS.find(s => s.id === id);
}

export function getSpiritsByElement(element: string): SpiritBase[] {
  return SPIRITS.filter(s => s.element === element);
}

export function getSpiritsByRarity(rarity: string): SpiritBase[] {
  return SPIRITS.filter(s => s.rarity === rarity);
}
