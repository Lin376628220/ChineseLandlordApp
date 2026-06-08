import { create } from 'zustand';
import type { PlayerData, OwnedSpirit, BattleState, BattleSpirit, Skill } from '../types';
import { createOwnedSpirit, createBattleSpirit, addExp, calcDamage, summonSpirit as doSummon } from '../utils/spiritUtils';
import { savePlayer, loadPlayer } from '../utils/storage';
import { SPIRITS } from '../data/spirits';
import { STAGES } from '../data/stages';
import { getSpiritById } from '../data/spirits';

interface GameStore {
  player: PlayerData;
  battle: BattleState | null;
  isLoading: boolean;

  // persistence
  loadGame: () => Promise<void>;
  saveGame: () => Promise<void>;

  // player actions
  initPlayer: () => void;
  addSpirit: (spirit: OwnedSpirit) => void;
  setTeam: (uids: string[]) => void;
  spendGold: (amount: number) => boolean;
  spendGems: (amount: number) => boolean;
  earnGold: (amount: number) => void;
  earnGems: (amount: number) => void;
  summonSpirit: () => OwnedSpirit | null;
  claimDailyReward: () => void;

  // battle actions
  startStageBattle: (stageId: number) => void;
  selectSpirit: (position: number | null) => void;
  selectSkill: (skill: Skill | null) => void;
  executeSkill: (targetPosition: number) => void;
  endPlayerTurn: () => void;
  runEnemyTurn: () => void;
  handleVictory: (stageId: number) => void;
  resetBattle: () => void;
}

const DEFAULT_PLAYER: PlayerData = {
  name: '灵界旅人',
  level: 1,
  exp: 0,
  gold: 500,
  gems: 30,
  spirits: [],
  team: [],
  stageProgress: 0,
  lastDailyReward: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  player: DEFAULT_PLAYER,
  battle: null,
  isLoading: true,

  loadGame: async () => {
    const saved = await loadPlayer();
    if (saved && saved.spirits.length > 0) {
      set({ player: saved, isLoading: false });
    } else {
      get().initPlayer();
      set({ isLoading: false });
    }
  },

  saveGame: async () => {
    await savePlayer(get().player);
  },

  initPlayer: () => {
    const starter = createOwnedSpirit(SPIRITS.find(s => s.id === 'sp_emberpup')!, 1);
    const extra1  = createOwnedSpirit(SPIRITS.find(s => s.id === 'sp_droplet')!, 1);
    const extra2  = createOwnedSpirit(SPIRITS.find(s => s.id === 'sp_sparkling')!, 1);
    const player: PlayerData = {
      ...DEFAULT_PLAYER,
      spirits: [starter, extra1, extra2],
      team: [starter.uid, extra1.uid, extra2.uid],
    };
    set({ player });
    savePlayer(player);
  },

  addSpirit: (spirit) => {
    set(state => ({ player: { ...state.player, spirits: [...state.player.spirits, spirit] } }));
    get().saveGame();
  },

  setTeam: (uids) => {
    set(state => ({ player: { ...state.player, team: uids.slice(0, 9) } }));
    get().saveGame();
  },

  spendGold: (amount) => {
    const { player } = get();
    if (player.gold < amount) return false;
    set(state => ({ player: { ...state.player, gold: state.player.gold - amount } }));
    get().saveGame();
    return true;
  },

  spendGems: (amount) => {
    const { player } = get();
    if (player.gems < amount) return false;
    set(state => ({ player: { ...state.player, gems: state.player.gems - amount } }));
    get().saveGame();
    return true;
  },

  earnGold: (amount) => {
    set(state => ({ player: { ...state.player, gold: state.player.gold + amount } }));
    get().saveGame();
  },

  earnGems: (amount) => {
    set(state => ({ player: { ...state.player, gems: state.player.gems + amount } }));
    get().saveGame();
  },

  summonSpirit: () => {
    const ok = get().spendGems(10);
    if (!ok) return null;
    const base = doSummon();
    const owned = createOwnedSpirit(base, 1);
    get().addSpirit(owned);
    return owned;
  },

  claimDailyReward: () => {
    const today = new Date().toDateString();
    const { player } = get();
    if (player.lastDailyReward === today) return;
    const newPlayer = {
      ...player,
      gold: player.gold + 200,
      gems: player.gems + 5,
      lastDailyReward: today,
    };
    set({ player: newPlayer });
    savePlayer(newPlayer);
  },

  startStageBattle: (stageId) => {
    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return;
    const { player } = get();

    const playerTeam = player.team.map((uid, i) => {
      const spirit = player.spirits.find(s => s.uid === uid);
      return spirit
        ? createBattleSpirit({ ...spirit, currentHp: spirit.stats.hp, currentMana: spirit.stats.mana }, i)
        : null;
    });

    const enemyTeam: (BattleSpirit | null)[] = Array(9).fill(null);
    for (const enemy of stage.enemies) {
      const base = getSpiritById(enemy.spiritId);
      if (!base) continue;
      const owned = createOwnedSpirit(base, enemy.level);
      enemyTeam[enemy.position] = createBattleSpirit(owned, enemy.position);
    }

    set({
      battle: {
        phase: 'player_turn',
        turn: 1,
        playerTeam,
        enemyTeam,
        selectedSpirit: null,
        selectedSkill: null,
        log: [`⚔️ 第 ${stageId} 关 - ${stage.nameZh} 战斗开始！`],
        currentStageId: stageId,
      } as any,
    });
  },

  selectSpirit: (position) => set(state => ({
    battle: state.battle
      ? { ...state.battle, selectedSpirit: position, selectedSkill: null }
      : null,
  })),

  selectSkill: (skill) => set(state => ({
    battle: state.battle ? { ...state.battle, selectedSkill: skill } : null,
  })),

  executeSkill: (targetPosition) => {
    const { battle } = get();
    if (!battle || battle.phase !== 'player_turn') return;
    const { selectedSpirit, selectedSkill, playerTeam, enemyTeam } = battle;
    if (selectedSpirit === null || !selectedSkill) return;

    const attacker = playerTeam[selectedSpirit];
    if (!attacker || !attacker.isAlive) return;
    if ((attacker.cooldowns[selectedSkill.id] ?? 0) > 0) return;
    if (attacker.currentMana < selectedSkill.manaCost) return;

    const newPlayerTeam = [...playerTeam];
    const newEnemyTeam = [...enemyTeam];
    const log = [...battle.log];

    const updatedAttacker = {
      ...attacker,
      currentMana: attacker.currentMana - selectedSkill.manaCost,
      cooldowns: { ...attacker.cooldowns, [selectedSkill.id]: selectedSkill.cooldown },
    };
    newPlayerTeam[selectedSpirit] = updatedAttacker;

    if (selectedSkill.damage) {
      const targets = selectedSkill.target === 'all'
        ? newEnemyTeam.map((_, i) => i).filter(i => newEnemyTeam[i]?.isAlive)
        : [targetPosition];

      for (const ti of targets) {
        const target = newEnemyTeam[ti];
        if (!target || !target.isAlive) continue;
        const dmg = calcDamage(updatedAttacker, target, selectedSkill.damage);
        const newHp = Math.max(0, target.currentHp - dmg);
        newEnemyTeam[ti] = { ...target, currentHp: newHp, isAlive: newHp > 0 };
        log.push(`💥 ${attacker.nameZh} 对 ${target.nameZh} 使用 ${selectedSkill.nameZh}，造成 ${dmg} 点伤害！`);
      }
    }

    if (selectedSkill.heal) {
      const newHp = Math.min(updatedAttacker.stats.hp, updatedAttacker.currentHp + selectedSkill.heal);
      newPlayerTeam[selectedSpirit] = { ...updatedAttacker, currentHp: newHp };
      log.push(`💚 ${attacker.nameZh} 使用 ${selectedSkill.nameZh}，恢复 ${selectedSkill.heal} 点生命！`);
    }

    const allEnemiesDead = newEnemyTeam.every(e => !e || !e.isAlive);

    set({
      battle: {
        ...battle,
        playerTeam: newPlayerTeam,
        enemyTeam: newEnemyTeam,
        selectedSpirit: null,
        selectedSkill: null,
        phase: allEnemiesDead ? 'victory' : 'enemy_turn',
        log,
      },
    });

    if (!allEnemiesDead) {
      setTimeout(() => get().runEnemyTurn(), 800);
    }
  },

  endPlayerTurn: () => {
    set(state => ({
      battle: state.battle ? { ...state.battle, phase: 'enemy_turn' } : null,
    }));
    setTimeout(() => get().runEnemyTurn(), 500);
  },

  runEnemyTurn: () => {
    const { battle } = get();
    if (!battle || battle.phase !== 'enemy_turn') return;

    const newPlayerTeam = [...battle.playerTeam];
    const newEnemyTeam = [...battle.enemyTeam];
    const log = [...battle.log];

    for (let i = 0; i < newEnemyTeam.length; i++) {
      const enemy = newEnemyTeam[i];
      if (!enemy || !enemy.isAlive) continue;

      const alive = newPlayerTeam.map((s, idx) => ({ s, idx })).filter(({ s }) => s?.isAlive);
      if (alive.length === 0) break;

      const { s: target, idx: ti } = alive[Math.floor(Math.random() * alive.length)];
      const skill = enemy.skills[0];
      if (!skill?.damage) continue;

      const dmg = calcDamage(enemy, target!, skill.damage);
      const newHp = Math.max(0, target!.currentHp - dmg);
      newPlayerTeam[ti] = { ...target!, currentHp: newHp, isAlive: newHp > 0 };
      log.push(`👾 ${enemy.nameZh} 对 ${target!.nameZh} 使用 ${skill.nameZh}，造成 ${dmg} 点伤害！`);
    }

    const allPlayersDead = newPlayerTeam.every(p => !p || !p.isAlive);

    const tickedTeam = newPlayerTeam.map(s => {
      if (!s) return s;
      const cd: Record<string, number> = {};
      for (const [k, v] of Object.entries(s.cooldowns)) {
        if (v > 0) cd[k] = v - 1;
      }
      const manaRegen = Math.floor(s.stats.mana * 0.1);
      return { ...s, cooldowns: cd, currentMana: Math.min(s.stats.mana, s.currentMana + manaRegen) };
    });

    set({
      battle: {
        ...battle,
        playerTeam: tickedTeam,
        enemyTeam: newEnemyTeam,
        phase: allPlayersDead ? 'defeat' : 'player_turn',
        turn: battle.turn + 1,
        log,
      },
    });
  },

  handleVictory: (stageId) => {
    const { player } = get();
    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return;

    // Give EXP to all team spirits
    let updatedSpirits = [...player.spirits];
    for (const uid of player.team) {
      const idx = updatedSpirits.findIndex(s => s.uid === uid);
      if (idx === -1) continue;
      updatedSpirits[idx] = addExp(updatedSpirits[idx], stage.rewards.exp);
    }

    // Gold / gem rewards
    const newGold = player.gold + stage.rewards.gold;
    const newGems = player.gems + (stage.rewards.gems ?? 0);

    // Spirit drop chance (30%)
    if (stage.rewards.spiritDrop && Math.random() < 0.3) {
      const base = getSpiritById(stage.rewards.spiritDrop);
      if (base) {
        const dropped = createOwnedSpirit(base, Math.max(1, stageId - 1));
        updatedSpirits.push(dropped);
      }
    }

    // Update stage progress
    const newProgress = Math.max(player.stageProgress, stageId);

    // Player EXP / level up
    const newPlayerExp = player.exp + Math.floor(stage.rewards.exp / 2);
    const expThreshold = player.level * 200;
    const newPlayerLevel = newPlayerExp >= expThreshold ? player.level + 1 : player.level;

    const newPlayer = {
      ...player,
      spirits: updatedSpirits,
      gold: newGold,
      gems: newGems,
      stageProgress: newProgress,
      exp: newPlayerExp % expThreshold,
      level: newPlayerLevel,
    };
    set({ player: newPlayer });
    savePlayer(newPlayer);
  },

  resetBattle: () => set({ battle: null }),
}));
