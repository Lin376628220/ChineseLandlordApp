import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { STAGES } from '../data/stages';
import { getSpiritById } from '../data/spirits';

interface Props {
  stageId: number;
  visible: boolean;
  onClose: () => void;
}

export default function VictoryModal({ stageId, visible, onClose }: Props) {
  const stage = STAGES.find(s => s.id === stageId);
  if (!stage) return null;

  const dropSpirit = stage.rewards.spiritDrop ? getSpiritById(stage.rewards.spiritDrop) : null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>🎉 战斗胜利！</Text>
          <Text style={styles.stageName}>{stage.nameZh}</Text>

          <View style={styles.rewardsBox}>
            <Text style={styles.rewardsTitle}>获得奖励</Text>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardItem}>⚔️ 经验 +{stage.rewards.exp}</Text>
              <Text style={styles.rewardItem}>💰 金币 +{stage.rewards.gold}</Text>
              {stage.rewards.gems ? (
                <Text style={styles.rewardItem}>💎 宝石 +{stage.rewards.gems}</Text>
              ) : null}
            </View>
            {dropSpirit && (
              <View style={styles.dropRow}>
                <Text style={styles.dropLabel}>30% 概率掉落：</Text>
                <Text style={styles.dropSpirit}>{dropSpirit.emoji} {dropSpirit.nameZh}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>领取并继续 →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.88)',
    alignItems: 'center', justifyContent: 'center',
  },
  card: {
    backgroundColor: '#0F1A0F', borderRadius: 20, padding: 28,
    alignItems: 'center', minWidth: 300,
    borderWidth: 1, borderColor: '#4CAF50',
  },
  title: { color: '#FFD700', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  stageName: { color: '#888', fontSize: 14, marginBottom: 20 },
  rewardsBox: {
    backgroundColor: '#0A0A1A', borderRadius: 12, padding: 16,
    width: '100%', marginBottom: 20,
  },
  rewardsTitle: { color: '#4CAF50', fontSize: 14, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  rewardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  rewardItem: {
    color: '#FFF', fontSize: 14, backgroundColor: '#16213E',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  dropRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, gap: 6 },
  dropLabel: { color: '#888', fontSize: 12 },
  dropSpirit: { color: '#CE93D8', fontSize: 14, fontWeight: 'bold' },
  btn: {
    backgroundColor: '#4CAF50', borderRadius: 14,
    paddingHorizontal: 32, paddingVertical: 12,
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
