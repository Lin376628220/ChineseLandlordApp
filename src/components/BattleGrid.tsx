import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { BattleSpirit } from '../types';
import { elementColor } from '../utils/spiritUtils';

interface Props {
  team: (BattleSpirit | null)[];
  isPlayer: boolean;
  selectedPos?: number | null;
  onSelectPos?: (pos: number) => void;
  targetable?: boolean;
}

export default function BattleGrid({ team, isPlayer, selectedPos, onSelectPos, targetable }: Props) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 9 }).map((_, i) => {
        const spirit = team[i];
        const isSelected = selectedPos === i;
        const isDead = spirit && !spirit.isAlive;
        const hpPct = spirit ? spirit.currentHp / spirit.stats.hp : 0;

        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.cell,
              spirit && !isDead && { borderColor: elementColor(spirit.element) },
              isSelected && styles.selectedCell,
              targetable && spirit && !isDead && styles.targetableCell,
            ]}
            onPress={() => onSelectPos?.(i)}
            activeOpacity={spirit ? 0.7 : 1}
          >
            {spirit && (
              <>
                <Text style={[styles.emoji, isDead && styles.dead]}>{spirit.emoji}</Text>
                {!isDead && (
                  <>
                    <View style={styles.hpBar}>
                      <View style={[styles.hpFill, {
                        width: `${hpPct * 100}%`,
                        backgroundColor: hpPct > 0.5 ? '#4CAF50' : hpPct > 0.25 ? '#FFC107' : '#F44336',
                      }]} />
                    </View>
                    <Text style={styles.name}>{spirit.nameZh}</Text>
                    <Text style={styles.hp}>{spirit.currentHp}</Text>
                  </>
                )}
                {isDead && <Text style={styles.deadLabel}>✕</Text>}
              </>
            )}
            {!spirit && <Text style={styles.emptyCell}>─</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 270,
    gap: 3,
  },
  cell: {
    width: 84,
    height: 84,
    backgroundColor: '#0D0D1A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  selectedCell: {
    borderColor: '#FFD700',
    borderWidth: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 6,
  },
  targetableCell: {
    borderColor: '#F44336',
    borderWidth: 2,
  },
  emoji: { fontSize: 26 },
  dead: { opacity: 0.3 },
  deadLabel: { fontSize: 20, color: '#F44336' },
  hpBar: { width: '85%', height: 3, backgroundColor: '#333', borderRadius: 2, marginTop: 1 },
  hpFill: { height: 3, borderRadius: 2 },
  name: { color: '#CCC', fontSize: 8, textAlign: 'center', marginTop: 1 },
  hp: { color: '#FFF', fontSize: 8, fontWeight: 'bold' },
  emptyCell: { color: '#333', fontSize: 16 },
});
