import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useGameStore } from '../store/gameStore';
import BattleGrid from '../components/BattleGrid';
import VictoryModal from '../components/VictoryModal';
import FloatingDamage from '../components/FloatingDamage';
import type { Skill } from '../types';
import { elementColor } from '../utils/spiritUtils';

interface FloatEntry {
  id: number;
  value: number;
  type: 'damage' | 'heal';
}

let floatId = 0;

interface Props { navigation: any }

export default function BattleScreen({ navigation }: Props) {
  const { battle, selectSpirit, selectSkill, executeSkill, endPlayerTurn, resetBattle, handleVictory } = useGameStore();
  const [floats, setFloats] = useState<FloatEntry[]>([]);

  const addFloat = useCallback((value: number, type: 'damage' | 'heal') => {
    const id = floatId++;
    setFloats(prev => [...prev, { id, value, type }]);
  }, []);

  const removeFloat = useCallback((id: number) => {
    setFloats(prev => prev.filter(f => f.id !== id));
  }, []);

  if (!battle) {
    return (
      <View style={styles.center}>
        <Text style={styles.noData}>没有进行中的战斗</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>返回关卡</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { phase, playerTeam, enemyTeam, selectedSpirit, selectedSkill, log, turn } = battle;
  const selectedSpiritObj = selectedSpirit !== null ? playerTeam[selectedSpirit] : null;

  function handlePlayerCellPress(pos: number) {
    if (phase !== 'player_turn') return;
    if (selectedSkill) return;
    const s = playerTeam[pos];
    if (s && s.isAlive) selectSpirit(pos);
  }

  function handleEnemyCellPress(pos: number) {
    if (phase !== 'player_turn') return;
    if (!selectedSpiritObj || !selectedSkill) return;
    if (!enemyTeam[pos]?.isAlive) return;
    // Calculate approximate damage to show float
    if (selectedSkill.damage) {
      const approxDmg = Math.floor(
        (selectedSkill.damage * selectedSpiritObj.stats.attack) /
        ((enemyTeam[pos]?.stats.defense ?? 50) + 50)
      );
      addFloat(approxDmg, 'damage');
    }
    if (selectedSkill.heal) {
      addFloat(selectedSkill.heal, 'heal');
    }
    executeSkill(pos);
  }

  function handleSkillPress(skill: Skill) {
    if (!selectedSpiritObj) return;
    if ((selectedSpiritObj.cooldowns[skill.id] ?? 0) > 0) return;
    if (selectedSpiritObj.currentMana < skill.manaCost) return;

    selectSkill(selectedSkill?.id === skill.id ? null : skill);

    if (skill.target === 'all') {
      if (skill.damage) addFloat(skill.damage, 'damage');
      if (skill.heal) addFloat(skill.heal, 'heal');
      executeSkill(-1);
    } else if (skill.target === 'self') {
      if (skill.heal) addFloat(skill.heal, 'heal');
      executeSkill(selectedSpirit!);
    }
  }

  function handleVictoryClose() {
    if (battle?.currentStageId) handleVictory(battle.currentStageId);
    resetBattle();
    navigation.goBack();
  }

  function handleDefeatClose() {
    resetBattle();
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.turnText}>第 {turn} 回合</Text>
        <View style={[styles.phaseBadge, {
          backgroundColor:
            phase === 'player_turn' ? '#4CAF50' :
            phase === 'enemy_turn' ? '#F44336' : '#888',
        }]}>
          <Text style={styles.phaseText}>
            {phase === 'player_turn' ? '你的回合' :
             phase === 'enemy_turn' ? '敌方行动中...' :
             phase === 'victory' ? '🎉 胜利！' : '💀 战败'}
          </Text>
        </View>
      </View>

      {/* Floating damage numbers */}
      <View style={styles.floatLayer} pointerEvents="none">
        {floats.map(f => (
          <FloatingDamage
            key={f.id}
            value={f.value}
            type={f.type}
            onDone={() => removeFloat(f.id)}
          />
        ))}
      </View>

      {/* Enemy Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>敌方阵地</Text>
        <BattleGrid
          team={enemyTeam}
          isPlayer={false}
          targetable={!!(selectedSpiritObj && selectedSkill && phase === 'player_turn')}
          onSelectPos={handleEnemyCellPress}
        />
      </View>

      <View style={styles.vsDivider}>
        <View style={styles.vsLine} />
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.vsLine} />
      </View>

      {/* Player Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>我方阵地</Text>
        <BattleGrid
          team={playerTeam}
          isPlayer
          selectedPos={selectedSpirit}
          onSelectPos={handlePlayerCellPress}
        />
      </View>

      {/* Skills Panel */}
      {selectedSpiritObj && phase === 'player_turn' && (
        <View style={styles.skillPanel}>
          <Text style={styles.skillPanelTitle}>
            {selectedSpiritObj.emoji} {selectedSpiritObj.nameZh}
            <Text style={styles.manaText}>  💧{selectedSpiritObj.currentMana}/{selectedSpiritObj.stats.mana}</Text>
          </Text>
          <View style={styles.skillButtons}>
            {selectedSpiritObj.skills.map(skill => {
              const cd = selectedSpiritObj.cooldowns[skill.id] ?? 0;
              const noMana = selectedSpiritObj.currentMana < skill.manaCost;
              const disabled = cd > 0 || noMana;
              return (
                <TouchableOpacity
                  key={skill.id}
                  style={[
                    styles.skillBtn,
                    { borderColor: elementColor(skill.element) },
                    disabled && styles.skillBtnDisabled,
                    selectedSkill?.id === skill.id && styles.skillBtnSelected,
                  ]}
                  onPress={() => !disabled && handleSkillPress(skill)}
                  disabled={disabled}
                >
                  <Text style={[styles.skillBtnName, disabled && { color: '#555' }]}>
                    {skill.nameZh}
                  </Text>
                  <Text style={[styles.skillBtnMeta, disabled && { color: '#444' }]}>
                    💧{skill.manaCost}
                    {skill.damage ? `  ⚔️${skill.damage}` : ''}
                    {skill.heal ? `  💚${skill.heal}` : ''}
                    {cd > 0 ? `  ⏳${cd}` : ''}
                  </Text>
                  <Text style={styles.skillBtnTarget}>
                    {skill.target === 'all' ? '全体' : skill.target === 'self' ? '自身' : '单体→点敌人'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Hint when no spirit selected */}
      {phase === 'player_turn' && !selectedSpiritObj && (
        <View style={styles.actions}>
          <Text style={styles.hint}>👆 点击己方灵兽 → 选技能 → 点击敌人</Text>
          <TouchableOpacity style={styles.skipBtn} onPress={endPlayerTurn}>
            <Text style={styles.skipBtnText}>跳过回合</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Battle Log */}
      <View style={styles.logSection}>
        <ScrollView style={styles.logScroll} ref={r => r?.scrollToEnd({ animated: false })}>
          {log.slice(-6).map((entry, i) => (
            <Text key={i} style={styles.logEntry}>{entry}</Text>
          ))}
        </ScrollView>
      </View>

      {/* Victory Modal */}
      <VictoryModal
        stageId={battle?.currentStageId ?? 1}
        visible={phase === 'victory'}
        onClose={handleVictoryClose}
      />

      {/* Defeat overlay */}
      {phase === 'defeat' && (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>💀 战斗失败</Text>
          <Text style={styles.overlaySubtitle}>你的所有灵兽都倒下了...</Text>
          <TouchableOpacity style={styles.overlayBtn} onPress={handleDefeatClose}>
            <Text style={styles.overlayBtnText}>再战一次</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080812' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A1A' },
  noData: { color: '#888', fontSize: 16, marginBottom: 16 },
  btn: { backgroundColor: '#FF5722', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold' },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderColor: '#1A1A2E',
  },
  turnText: { color: '#888', fontSize: 13 },
  phaseBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  phaseText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },

  floatLayer: {
    position: 'absolute', top: 80, left: 0, right: 0,
    alignItems: 'center', zIndex: 999,
  },

  section: { alignItems: 'center', paddingVertical: 8 },
  sectionLabel: { color: '#444', fontSize: 10, marginBottom: 4, letterSpacing: 1 },

  vsDivider: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginVertical: 2,
  },
  vsLine: { flex: 1, height: 1, backgroundColor: '#1A1A2E' },
  vsText: { color: '#2A2A3A', fontSize: 11, marginHorizontal: 8 },

  skillPanel: {
    backgroundColor: '#0F0F1E', borderTopWidth: 1,
    borderColor: '#1A1A2E', padding: 10,
  },
  skillPanelTitle: { color: '#FFF', fontSize: 13, fontWeight: 'bold', marginBottom: 6 },
  manaText: { color: '#4FC3F7', fontWeight: 'normal' },
  skillButtons: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  skillBtn: {
    backgroundColor: '#16213E', borderRadius: 8,
    borderWidth: 1, padding: 8, flex: 1, minWidth: '30%',
  },
  skillBtnDisabled: { opacity: 0.35 },
  skillBtnSelected: { backgroundColor: '#1A2E1A' },
  skillBtnName: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  skillBtnMeta: { color: '#888', fontSize: 10, marginTop: 2 },
  skillBtnTarget: { color: '#555', fontSize: 9, marginTop: 1 },

  actions: { padding: 10, alignItems: 'center' },
  hint: { color: '#555', fontSize: 12, marginBottom: 6 },
  skipBtn: {
    backgroundColor: '#1A1A2E', borderRadius: 10,
    paddingHorizontal: 20, paddingVertical: 7,
  },
  skipBtnText: { color: '#666', fontSize: 13 },

  logSection: {
    flex: 1, minHeight: 55, maxHeight: 75,
    backgroundColor: '#05050F',
    borderTopWidth: 1, borderColor: '#1A1A2E',
    paddingHorizontal: 10,
  },
  logScroll: { flex: 1 },
  logEntry: { color: '#555', fontSize: 10, paddingVertical: 1, lineHeight: 15 },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center', justifyContent: 'center',
  },
  overlayTitle: { color: '#F44336', fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  overlaySubtitle: { color: '#AAA', fontSize: 16, marginBottom: 30 },
  overlayBtn: {
    backgroundColor: '#FF5722', borderRadius: 14,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  overlayBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
