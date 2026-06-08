import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { OwnedSpirit, SpiritBase } from '../types';
import { rarityColor, rarityLabel, elementLabel, elementColor } from '../utils/spiritUtils';

interface Props {
  spirit: OwnedSpirit | SpiritBase;
  onPress?: () => void;
  compact?: boolean;
  selected?: boolean;
}

export default function SpiritCard({ spirit, onPress, compact, selected }: Props) {
  const rColor = rarityColor(spirit.rarity);
  const elColor = elementColor(spirit.element);
  const owned = 'level' in spirit;

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: selected ? '#FFD700' : rColor }, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.rarityBadge, { backgroundColor: rColor }]}>
        <Text style={styles.rarityText}>{rarityLabel(spirit.rarity)}</Text>
      </View>
      <View style={[styles.elementBadge, { backgroundColor: elColor }]}>
        <Text style={styles.elementText}>{elementLabel(spirit.element)}</Text>
      </View>
      <Text style={styles.emoji}>{spirit.emoji}</Text>
      <Text style={styles.name}>{spirit.nameZh}</Text>
      {!compact && <Text style={styles.subname}>{spirit.name}</Text>}
      {owned && (
        <View style={styles.statsRow}>
          <Text style={styles.level}>Lv.{(spirit as OwnedSpirit).level}</Text>
          <View style={styles.hpBar}>
            <View style={[styles.hpFill, {
              width: `${((spirit as OwnedSpirit).currentHp / (spirit as OwnedSpirit).stats.hp) * 100}%`
            }]} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    borderWidth: 2,
    padding: 10,
    alignItems: 'center',
    minWidth: 90,
    margin: 4,
  },
  selected: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  rarityBadge: {
    position: 'absolute',
    top: 4, left: 4,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  rarityText: { color: '#000', fontSize: 8, fontWeight: 'bold' },
  elementBadge: {
    position: 'absolute',
    top: 4, right: 4,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  elementText: { color: '#000', fontSize: 9, fontWeight: 'bold' },
  emoji: { fontSize: 36, marginTop: 14 },
  name: { color: '#FFF', fontSize: 13, fontWeight: 'bold', marginTop: 4, textAlign: 'center' },
  subname: { color: '#AAA', fontSize: 10, textAlign: 'center' },
  statsRow: { width: '100%', marginTop: 6, alignItems: 'center' },
  level: { color: '#FFD700', fontSize: 11, fontWeight: 'bold', marginBottom: 2 },
  hpBar: { width: '90%', height: 4, backgroundColor: '#333', borderRadius: 2 },
  hpFill: { height: 4, backgroundColor: '#4CAF50', borderRadius: 2 },
});
