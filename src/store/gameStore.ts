import { create } from 'zustand';
import type { PlayerData, OwnedSpirit, BattleState, BattleSpirit, Skill } from '../types';
import { createOwnedSpirit, createBattleSpirit, addExp, calcDamage, summonSpirit, generateUid } from '../utils/spiritUtils';
import { SPIRITS } from '../data/spirits';
import { STAGES } from '../data/stages';
import { getSpiritById } from '../data/spirits';

interface GameStore {
  player: PlayerData;
  battle: BattleState | null;

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

  initPlayer: () => {
    const starter = createOwnedSpirit(SPIRITS.find(s => s.id === 'sp_emberpup')!, 1);
    const extra1 = createOwnedSpirit(SPIRITS.find(s => s.id === 'sp_droplet')!, 1);
    const extra2 = createOwnedSpirit(SPIRITS.find(s => s.id === 'sp_sparkling')!, 1);
    set(state => ({
      player: {
        ...DEFAULT_PLAYER,
        spirits: [starter, extra1, extra2],
        team: [starter.uid, extra1.uid, extra2.uid],
      }
    }));
  },

  addSpirit: (spirit) => set(state => ({
    player: { ...state.player, spirits: [...state.player.spirits, spirit] }
  })),

  setTeam: (uids) => set(state => ({
    player: { ...state.player, team: uids.slice(0, 9) }
  })),

  spendGold: (amount) => {
    const { player } = get();
    if (player.gold < amount) return false;
    set(state => ({ player: { ...state.player, gold: state.player.gold - amount } }));
    return true;
  },

  spendGems: (amount) => {
    const { player } = get();
    if (player.gems < amount) return false;
    set(state => ({ player: { ...state.player, gems: state.player.gems - amount } }));
    return true;
  },

  earnGold: (amount) => set(state => ({
    player: { ...state.player, gold: state.player.gold + amount }
  })),

  earnGems: (amount) => set(state => ({
    player: { ...state.player, gems: state.player.gems + amount }
  })),

  summonSpirit: () => {
    const ok = get().spendGems(10);
    if (!ok) return null;
    const base = summonSpirit();
    const owned = createOwnedSpirit(base, 1);
    get().addSpirit(owned);
    return owned;
  },

  claimDailyReward: () => {
    const today = new Date().toDateString();
    const { player } = get();
    if (player.lastDailyReward === today) return;
    get().earnGold(200);
    get().earnGems(5);
    set(state => ({ player: { ...state.player, lastDailyReward: today } }));
  },

  startStageBattle: (stageId) => {
    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return;
    const { player } = get();

    const teamSpirits = player.team
      .map((uid, i) => {
        const spirit = player.spirits.find(s => s.uid === uid);
        return spirit ? createBattleSpirit({ ...spirit, currentHp: spirit.stats.hp, currentMana: spirit.stats.mana }, i) : null;
      });

    const enemySpirits: (BattleSpirit | null)[] = Array(9).fill(null);
    for (const enemy of stage.enemies) {
      const base = getSpiritById(enemy.spiritId);
      if (!base) continue;
      const owned = createOwnedSpirit(base, enemy.level);
      enemySpirits[enemy.position] = createBattleSpirit(owned, enemy.position);
    }

    set({
      battle: {
        phase: 'player_turn',
        turn: 1,
        playerTeam: teamSpirits,
        enemyTeam: enemySpirits,
        selectedSpirit: null,
        selectedSkill: null,
        log: [`第 ${stageId} 关 - ${stage.nameZh} 战斗开始！`],
      }
    });
  },

  selectSpirit: (position) => set(state => ({
    battle: state.battle ? { ...state.battle, selectedSpirit: position, selectedSkill: null } : null
  })),

  selectSkill: (skill) => set(state => ({
    battle: state.battle ? { ...state.battle, selectedSkill: skill } : null
  })),

  executeSkill: (targetPosition) => {
    const { battle, player } = get();
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
        log.push(`${attacker.nameZh} 对 ${target.nameZh} 使用 ${selectedSkill.nameZh}，造成 ${dmg} 点伤害！`);
      }
    }

    if (selectedSkill.heal) {
      const healAmt = selectedSkill.heal;
      const newHp = Math.min(updatedAttacker.stats.hp, updatedAttacker.currentHp + healAmt);
      newPlayerTeam[selectedSpirit] = { ...updatedAttacker, currentHp: newHp };
      log.push(`${attacker.nameZh} 使用 ${selectedSkill.nameZh}，恢复了 ${healAmt} 点生命！`);
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
      }
    });

    if (allEnemiesDead) {
      // victory handled by overlay in BattleScreen
    } else {
      setTimeout(() => get().runEnemyTurn(), 800);
    }
  },

  endPlayerTurn: () => {
    set(state => ({
      battle: state.battle ? { ...state.battle, phase: 'enemy_turn' } : null
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

      const alivePlayers = newPlayerTeam
        .map((s, i) => ({ s, i }))
        .filter(({ s }) => s && s.isAlive);
      if (alivePlayers.length === 0) break;

      const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const skill = enemy.skills[0];

      if (skill.damage) {
        const dmg = calcDamage(enemy, target.s!, skill.damage);
        const newHp = Math.max(0, target.s!.currentHp - dmg);
        newPlayerTeam[target.i] = { ...target.s!, currentHp: newHp, isAlive: newHp > 0 };
        log.push(`${enemy.nameZh} 对 ${target.s!.nameZh} 使用 ${skill.nameZh}，造成 ${dmg} 点伤害！`);
      }
    }

    const allPlayersDead = newPlayerTeam.every(p => !p || !p.isAlive);

    // Tick cooldowns for player team
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
      }
    });
  },

  resetBattle: () => set({ battle: null }),
}));
