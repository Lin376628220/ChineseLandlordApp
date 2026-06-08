import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import SpiritCard from '../components/SpiritCard';
import { SPIRITS } from '../data/spirits';
import type { OwnedSpirit, ElementType } from '../types';
import { elementLabel, elementColor, rarityColor, rarityLabel, expForLevel } from '../utils/spiritUtils';

const ELEMENTS: (ElementType | 'all')[] = ['all', 'fire', 'water', 'wood', 'metal', 'earth', 'thunder', 'wind', 'dark', 'light', 'time'];

export default function CollectionScreen() {
  const { player } = useGameStore();
  const [filterEl, setFilterEl] = useState<ElementType | 'all'>('all');
  const [selected, setSelected] = useState<OwnedSpirit | null>(null);
  const [tab, setTab] = useState<'owned' | 'all'>('owned');

  const displayList = tab === 'owned'
    ? player.spirits.filter(s => filterEl === 'all' || s.element === filterEl)
    : SPIRITS.filter(s => filterEl === 'all' || s.element === filterEl);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'owned' && styles.activeTab]}
          onPress={() => setTab('owned')}
        >
          <Text style={[styles.tabText, tab === 'owned' && styles.activeTabText]}>
            我的灵兽 ({player.spirits.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'all' && styles.activeTab]}
          onPress={() => setTab('all')}
        >
          <Text style={[styles.tabText, tab === 'all' && styles.activeTabText]}>
            图鉴 ({SPIRITS.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {ELEMENTS.map(el => (
          <TouchableOpacity
            key={el}
            style={[styles.filterBtn, filterEl === el && styles.activeFilter,
              el !== 'all' && { borderColor: elementColor(el as ElementType) }]}
            onPress={() => setFilterEl(el)}
          >
            <Text style={[styles.filterText, filterEl === el && styles.activeFilterText]}>
              {el === 'all' ? '全部' : elementLabel(el as ElementType)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {displayList.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>还没有灵兽，快去召唤吧！</Text>
        </View>
      ) : (
        <FlatList
          data={displayList}
          keyExtractor={(item) => String('uid' in item ? item.uid : item.id)}
          numColumns={3}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <SpiritCard
              spirit={item}
              onPress={() => tab === 'owned' ? setSelected(item as OwnedSpirit) : null}
            />
          )}
        />
      )}

      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selected && <SpiritDetail spirit={selected} onClose={() => setSelected(null)} />}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SpiritDetail({ spirit, onClose }: { spirit: OwnedSpirit; onClose: () => void }) {
  const expNeeded = expForLevel(spirit.level);
  const rColor = rarityColor(spirit.rarity);
  const elColor = elementColor(spirit.element);

  return (
    <ScrollView>
      <View style={styles.detailHeader}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.detailEmoji}>{spirit.emoji}</Text>
        <Text style={[styles.detailName, { color: rColor }]}>{spirit.nameZh}</Text>
        <Text style={styles.detailSubname}>{spirit.name}</Text>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: rColor }]}>
            <Text style={styles.badgeText}>{rarityLabel(spirit.rarity)}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: elColor }]}>
            <Text style={styles.badgeText}>{elementLabel(spirit.element)}属性</Text>
          </View>
        </View>
        <Text style={styles.detailDesc}>{spirit.description}</Text>
      </View>

      <View style={styles.levelSection}>
        <Text style={styles.sectionLabel}>等级 {spirit.level}</Text>
        <View style={styles.expBar}>
          <View style={[styles.expFill, { width: `${(spirit.exp / expNeeded) * 100}%` }]} />
        </View>
        <Text style={styles.expText}>{spirit.exp} / {expNeeded} EXP</Text>
      </View>

      <View style={styles.statsGrid}>
        {Object.entries(spirit.stats).map(([k, v]) => (
          <View key={k} style={styles.statItem}>
            <Text style={styles.statLabel}>{STAT_LABELS[k] || k}</Text>
            <Text style={styles.statVal}>{v}</Text>
          </View>
        ))}
      </View>

      <View style={styles.skillsSection}>
        <Text style={styles.sectionLabel}>技能列表</Text>
        {spirit.skills.map(skill => (
          <View key={skill.id} style={styles.skillRow}>
            <View style={[styles.skillEl, { backgroundColor: elementColor(skill.element) }]}>
              <Text style={styles.skillElText}>{elementLabel(skill.element)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.skillName}>{skill.nameZh} <Text style={styles.skillNameEn}>{skill.name}</Text></Text>
              <Text style={styles.skillDesc}>{skill.description}</Text>
            </View>
            <View style={styles.skillMeta}>
              <Text style={styles.skillMana}>💧{skill.manaCost}</Text>
              {skill.damage && <Text style={styles.skillDmg}>⚔️{skill.damage}</Text>}
              {skill.heal && <Text style={styles.skillHeal}>💚{skill.heal}</Text>}
            </View>
          </View>
        ))}
      </View>

      {spirit.evolutionId && (
        <View style={styles.evoSection}>
          <Text style={styles.sectionLabel}>进化信息</Text>
          <Text style={styles.evoText}>
            达到 Lv.{spirit.evolutionLevel} 可进化为更强大的形态
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const STAT_LABELS: Record<string, string> = {
  hp: '生命值', attack: '攻击', defense: '防御', speed: '速度', mana: '法力'
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#222' },
  tab: { flex: 1, padding: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#FFD700' },
  tabText: { color: '#888', fontSize: 14 },
  activeTabText: { color: '#FFD700', fontWeight: 'bold' },
  filterRow: { maxHeight: 48, paddingHorizontal: 12, paddingVertical: 8 },
  filterBtn: {
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16,
    marginRight: 6, borderWidth: 1, borderColor: '#444',
    backgroundColor: '#111',
  },
  activeFilter: { backgroundColor: '#222' },
  filterText: { color: '#888', fontSize: 12 },
  activeFilterText: { color: '#FFF', fontWeight: 'bold' },
  list: { padding: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { color: '#555', fontSize: 16 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0F0F1E', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, maxHeight: '90%', padding: 16,
  },
  detailHeader: { alignItems: 'center', paddingBottom: 16 },
  closeBtn: { alignSelf: 'flex-end', padding: 4 },
  closeBtnText: { color: '#888', fontSize: 18 },
  detailEmoji: { fontSize: 64, marginVertical: 8 },
  detailName: { fontSize: 24, fontWeight: 'bold' },
  detailSubname: { color: '#888', fontSize: 14, marginBottom: 8 },
  badges: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  badgeText: { color: '#000', fontSize: 12, fontWeight: 'bold' },
  detailDesc: { color: '#AAA', fontSize: 13, textAlign: 'center', lineHeight: 18 },

  levelSection: { marginVertical: 12 },
  sectionLabel: { color: '#FFD700', fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  expBar: { height: 8, backgroundColor: '#222', borderRadius: 4 },
  expFill: { height: 8, backgroundColor: '#2196F3', borderRadius: 4 },
  expText: { color: '#888', fontSize: 11, marginTop: 4, textAlign: 'right' },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12
  },
  statItem: {
    flex: 1, minWidth: '28%', backgroundColor: '#16213E',
    borderRadius: 8, padding: 10, alignItems: 'center',
  },
  statLabel: { color: '#888', fontSize: 11 },
  statVal: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 2 },

  skillsSection: { marginVertical: 8 },
  skillRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#16213E', borderRadius: 10, padding: 10, marginBottom: 6,
  },
  skillEl: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  skillElText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  skillName: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  skillNameEn: { color: '#888', fontSize: 11, fontWeight: 'normal' },
  skillDesc: { color: '#AAA', fontSize: 11, marginTop: 2 },
  skillMeta: { alignItems: 'flex-end', gap: 2 },
  skillMana: { color: '#4FC3F7', fontSize: 11 },
  skillDmg: { color: '#F44336', fontSize: 11 },
  skillHeal: { color: '#4CAF50', fontSize: 11 },

  evoSection: { marginTop: 8, padding: 12, backgroundColor: '#1A1A2E', borderRadius: 10 },
  evoText: { color: '#CE93D8', fontSize: 13 },
});
