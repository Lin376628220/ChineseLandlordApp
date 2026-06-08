import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { STAGES } from '../data/stages';
import { getSpiritById } from '../data/spirits';

interface Props { navigation: any }

export default function StageScreen({ navigation }: Props) {
  const { player, startStageBattle } = useGameStore();

  function handleStart(stageId: number) {
    if (player.team.length === 0) {
      alert('请先在「组建队伍」中配置你的灵兽队伍！');
      return;
    }
    startStageBattle(stageId);
    navigation.navigate('Battle');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>关卡选择</Text>
      <FlatList
        data={STAGES}
        keyExtractor={s => String(s.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item: stage }) => {
          const unlocked = stage.unlockStage <= player.stageProgress;
          const cleared = player.stageProgress >= stage.id;
          const enemies = stage.enemies
            .map(e => getSpiritById(e.spiritId))
            .filter(Boolean);

          return (
            <View style={[styles.stageCard, !unlocked && styles.locked]}>
              <View style={styles.stageHeader}>
                <View>
                  <Text style={styles.stageName}>
                    {cleared ? '✅ ' : ''}{stage.id}. {stage.nameZh}
                  </Text>
                  <Text style={styles.stageRegion}>{stage.region}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.startBtn, !unlocked && styles.startBtnLocked]}
                  onPress={() => unlocked && handleStart(stage.id)}
                  disabled={!unlocked}
                >
                  <Text style={styles.startBtnText}>
                    {!unlocked ? '🔒' : cleared ? '重挑' : '出发'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.stageDesc}>{stage.description}</Text>

              <View style={styles.enemyRow}>
                <Text style={styles.enemyLabel}>敌方:</Text>
                {enemies.map((e, i) => (
                  <View key={i} style={styles.enemyBadge}>
                    <Text>{e!.emoji}</Text>
                    <Text style={styles.enemyName}>{e!.nameZh}</Text>
                    <Text style={styles.enemyLevel}>Lv.{stage.enemies[i].level}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.rewardRow}>
                <Text style={styles.rewardLabel}>奖励:</Text>
                <Text style={styles.reward}>⚔️{stage.rewards.exp}EXP</Text>
                <Text style={styles.reward}>💰{stage.rewards.gold}</Text>
                {stage.rewards.gems && <Text style={styles.reward}>💎{stage.rewards.gems}</Text>}
                {stage.rewards.spiritDrop && (
                  <Text style={styles.reward}>
                    {getSpiritById(stage.rewards.spiritDrop)?.emoji}概率掉落
                  </Text>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  title: { color: '#FFD700', fontSize: 22, fontWeight: 'bold', padding: 16, paddingBottom: 8 },
  list: { padding: 12, gap: 10 },
  stageCard: {
    backgroundColor: '#16213E', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#2A2A4A',
  },
  locked: { opacity: 0.5 },
  stageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  stageName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  stageRegion: { color: '#888', fontSize: 11, marginTop: 2 },
  startBtn: {
    backgroundColor: '#FF5722', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  startBtnLocked: { backgroundColor: '#333' },
  startBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  stageDesc: { color: '#AAA', fontSize: 12, marginBottom: 10, lineHeight: 18 },
  enemyRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  enemyLabel: { color: '#888', fontSize: 12 },
  enemyBadge: {
    backgroundColor: '#0D0D1A', borderRadius: 6, padding: 4,
    alignItems: 'center', minWidth: 50,
  },
  enemyName: { color: '#CCC', fontSize: 9, textAlign: 'center' },
  enemyLevel: { color: '#FFD700', fontSize: 9 },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  rewardLabel: { color: '#888', fontSize: 11 },
  reward: { color: '#4CAF50', fontSize: 11, backgroundColor: '#0A1A0A', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
});
