import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Animated
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { getSpiritById } from '../data/spirits';
import { rarityColor, rarityLabel, elementLabel, elementColor, createOwnedSpirit } from '../utils/spiritUtils';
import type { OwnedSpirit } from '../types';

interface Props { navigation: any }

export default function EvolutionScreen({ navigation }: Props) {
  const { player, evolveSpirit } = useGameStore();
  const [selected, setSelected] = useState<OwnedSpirit | null>(null);

  const evolvable = player.spirits.filter(s => {
    if (!s.evolutionId || !s.evolutionLevel) return false;
    return s.level >= s.evolutionLevel;
  });

  const notReady = player.spirits.filter(s => {
    if (!s.evolutionId || !s.evolutionLevel) return false;
    return s.level < s.evolutionLevel;
  });

  function handleEvolve(spirit: OwnedSpirit) {
    if (!spirit.evolutionId) return;
    Alert.alert(
      '确认进化',
      `将 ${spirit.nameZh}（Lv.${spirit.level}）进化为更强大的形态？\n\n进化后等级重置为1，但基础属性大幅提升！`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认进化', style: 'default',
          onPress: () => {
            evolveSpirit(spirit.uid);
            setSelected(null);
            Alert.alert('进化成功！', '恭喜你的灵兽获得了新的力量！');
          }
        }
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚗️ 进化中心</Text>
      <Text style={styles.subtitle}>灵兽达到指定等级后可以进化，获得更强大的形态</Text>

      {evolvable.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ 可以进化 ({evolvable.length})</Text>
          {evolvable.map(spirit => {
            const evoBase = getSpiritById(spirit.evolutionId!);
            if (!evoBase) return null;
            return (
              <TouchableOpacity
                key={spirit.uid}
                style={styles.card}
                onPress={() => handleEvolve(spirit)}
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.emoji}>{spirit.emoji}</Text>
                  <View>
                    <Text style={styles.spiritName}>{spirit.nameZh}</Text>
                    <Text style={styles.spiritLevel}>Lv.{spirit.level}</Text>
                    <View style={[styles.elBadge, { backgroundColor: elementColor(spirit.element) }]}>
                      <Text style={styles.elText}>{elementLabel(spirit.element)}属性</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.arrow}>→</Text>
                <View style={styles.cardRight}>
                  <Text style={styles.emoji}>{evoBase.emoji}</Text>
                  <View>
                    <Text style={[styles.spiritName, { color: rarityColor(evoBase.rarity) }]}>
                      {evoBase.nameZh}
                    </Text>
                    <Text style={[styles.rarityLabel, { color: rarityColor(evoBase.rarity) }]}>
                      {rarityLabel(evoBase.rarity)}
                    </Text>
                  </View>
                </View>
                <View style={styles.evolveBtn}>
                  <Text style={styles.evolveBtnText}>进化</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {notReady.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏳ 培养中 ({notReady.length})</Text>
          {notReady.map(spirit => {
            const evoBase = getSpiritById(spirit.evolutionId!);
            if (!evoBase) return null;
            const progress = spirit.level / spirit.evolutionLevel!;
            return (
              <View key={spirit.uid} style={[styles.card, styles.cardDim]}>
                <View style={styles.cardLeft}>
                  <Text style={styles.emoji}>{spirit.emoji}</Text>
                  <View>
                    <Text style={styles.spiritName}>{spirit.nameZh}</Text>
                    <Text style={styles.spiritLevel}>Lv.{spirit.level} / {spirit.evolutionLevel}</Text>
                  </View>
                </View>
                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                  </View>
                  <Text style={styles.progressText}>
                    还需 {spirit.evolutionLevel! - spirit.level} 级 → {evoBase.nameZh}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {evolvable.length === 0 && notReady.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyText}>你目前没有可进化的灵兽</Text>
          <Text style={styles.emptyHint}>努力培养灵兽，让它们变得更强大吧！</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  content: { padding: 16, paddingBottom: 40 },
  title: { color: '#FFD700', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#666', fontSize: 13, marginTop: 4, marginBottom: 20, lineHeight: 18 },

  section: { marginBottom: 24 },
  sectionTitle: { color: '#FFD700', fontSize: 15, fontWeight: 'bold', marginBottom: 10 },

  card: {
    backgroundColor: '#16213E', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 8,
    borderWidth: 1, borderColor: '#2A2A4A',
  },
  cardDim: { opacity: 0.7 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  emoji: { fontSize: 36 },
  spiritName: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  spiritLevel: { color: '#888', fontSize: 12, marginTop: 2 },
  rarityLabel: { fontSize: 12, marginTop: 2 },
  elBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1, marginTop: 3, alignSelf: 'flex-start' },
  elText: { color: '#000', fontSize: 9, fontWeight: 'bold' },
  arrow: { color: '#FFD700', fontSize: 22, marginHorizontal: 6 },
  evolveBtn: {
    backgroundColor: '#9C27B0', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  evolveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  progressSection: { flex: 1.5 },
  progressBar: { height: 6, backgroundColor: '#222', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: '#9C27B0', borderRadius: 3 },
  progressText: { color: '#888', fontSize: 11, marginTop: 4 },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#888', fontSize: 16, marginBottom: 6 },
  emptyHint: { color: '#555', fontSize: 13 },
});
