import type { SpiritBase } from '../types';
import { SPIRITS } from './spirits';

export interface StageEnemy {
  spiritId: string;
  level: number;
  position: number;
}

export interface Stage {
  id: number;
  name: string;
  nameZh: string;
  description: string;
  region: string;
  enemies: StageEnemy[];
  rewards: {
    exp: number;
    gold: number;
    gems?: number;
    spiritDrop?: string;
  };
  unlockStage: number;
}

export const STAGES: Stage[] = [
  {
    id: 1, name: 'Misty Meadow', nameZh: '迷雾草原', region: '起始之地',
    description: '冒险的起点，温柔的精灵在此栖居',
    enemies: [
      { spiritId: 'sp_emberpup', level: 3, position: 4 },
    ],
    rewards: { exp: 50, gold: 30 },
    unlockStage: 0,
  },
  {
    id: 2, name: 'Ember Forest', nameZh: '炎焰森林', region: '起始之地',
    description: '燃烧的树木间，火焰精灵在跳跃',
    enemies: [
      { spiritId: 'sp_emberpup', level: 5, position: 3 },
      { spiritId: 'sp_sparkling', level: 4, position: 5 },
    ],
    rewards: { exp: 80, gold: 50 },
    unlockStage: 1,
  },
  {
    id: 3, name: 'Crystal Lake', nameZh: '水晶湖', region: '起始之地',
    description: '清澈的湖水中，水灵悠然游弋',
    enemies: [
      { spiritId: 'sp_droplet', level: 6, position: 4 },
      { spiritId: 'sp_droplet', level: 5, position: 2 },
    ],
    rewards: { exp: 100, gold: 60, spiritDrop: 'sp_droplet' },
    unlockStage: 2,
  },
  {
    id: 4, name: 'Thunder Peak', nameZh: '雷霆山顶', region: '风暴高地',
    description: '电闪雷鸣的山峰，强大的雷电精灵盘踞',
    enemies: [
      { spiritId: 'sp_sparkling', level: 8, position: 1 },
      { spiritId: 'sp_sparkling', level: 8, position: 7 },
      { spiritId: 'sp_stormbird', level: 10, position: 4 },
    ],
    rewards: { exp: 150, gold: 90, gems: 5 },
    unlockStage: 3,
  },
  {
    id: 5, name: 'Ancient Grove', nameZh: '古老树林', region: '翠绿之地',
    description: '千年古树遮天蔽日，木系精灵守护于此',
    enemies: [
      { spiritId: 'sp_sproutling', level: 10, position: 0 },
      { spiritId: 'sp_sproutling', level: 10, position: 8 },
      { spiritId: 'sp_thornbear', level: 12, position: 4 },
    ],
    rewards: { exp: 180, gold: 110 },
    unlockStage: 4,
  },
  {
    id: 6, name: 'Iron Wastes', nameZh: '钢铁荒原', region: '金属荒地',
    description: '锈蚀的大地上，金属精灵四处游荡',
    enemies: [
      { spiritId: 'sp_scraprat', level: 12, position: 2 },
      { spiritId: 'sp_scraprat', level: 12, position: 6 },
      { spiritId: 'sp_ironwolf', level: 14, position: 4 },
    ],
    rewards: { exp: 200, gold: 130, spiritDrop: 'sp_ironwolf' },
    unlockStage: 5,
  },
  {
    id: 7, name: 'Shadow Valley', nameZh: '暗影峡谷', region: '黑暗领域',
    description: '永无天日的峡谷，暗系精灵在黑暗中潜伏',
    enemies: [
      { spiritId: 'sp_darkling', level: 14, position: 1 },
      { spiritId: 'sp_darkling', level: 14, position: 7 },
      { spiritId: 'sp_shadowpanther', level: 16, position: 4 },
    ],
    rewards: { exp: 250, gold: 150, gems: 10 },
    unlockStage: 6,
  },
  {
    id: 8, name: 'Sacred Temple', nameZh: '圣光神庙', region: '光明圣地',
    description: '神圣的庙宇中，光明精灵守护着古老的秘密',
    enemies: [
      { spiritId: 'sp_glowmoth', level: 16, position: 0 },
      { spiritId: 'sp_glowmoth', level: 16, position: 8 },
      { spiritId: 'sp_radiantcub', level: 18, position: 4 },
    ],
    rewards: { exp: 300, gold: 180, spiritDrop: 'sp_radiantcub' },
    unlockStage: 7,
  },
  {
    id: 9, name: 'Dragon\'s Lair', nameZh: '龙渊巢穴', region: '深海龙域',
    description: '深海巨龙的领地，充满了强大的水系精灵',
    enemies: [
      { spiritId: 'sp_tidewyrm', level: 18, position: 2 },
      { spiritId: 'sp_frostqueen', level: 20, position: 4 },
      { spiritId: 'sp_tidewyrm', level: 18, position: 6 },
    ],
    rewards: { exp: 400, gold: 220, gems: 15 },
    unlockStage: 8,
  },
  {
    id: 10, name: 'Time Rift', nameZh: '时空裂缝', region: '时间禁区',
    description: '时间与空间交汇之处，最强大的精灵在此沉睡',
    enemies: [
      { spiritId: 'sp_timesprite', level: 22, position: 1 },
      { spiritId: 'sp_chronotiger', level: 25, position: 4 },
      { spiritId: 'sp_timesprite', level: 22, position: 7 },
    ],
    rewards: { exp: 600, gold: 350, gems: 30, spiritDrop: 'sp_timesprite' },
    unlockStage: 9,
  },
];
