import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import SpiritCard from '../components/SpiritCard';

export default function TeamSetupScreen() {
  const { player, setTeam } = useGameStore();
  const [selected, setSelected] = useState<string[]>(player.team);

  function toggleSpirit(uid: string) {
    setSelected(prev => {
      if (prev.includes(uid)) return prev.filter(u => u !== uid);
      if (prev.length >= 9) {
        Alert.alert('队伍已满', '最多只能有9只灵兽参战');
        return prev;
      }
      return [...prev, uid];
    });
  }

  function handleSave() {
    if (selected.length === 0) {
      Alert.alert('队伍不能为空', '请至少选择1只灵兽');
      return;
    }
    setTeam(selected);
    Alert.alert('保存成功', `已将 ${selected.length} 只灵兽加入队伍`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>组建队伍</Text>
        <Text style={styles.count}>{selected.length}/9</Text>
      </View>

      <View style={styles.teamPreview}>
        <Text style={styles.previewLabel}>当前队伍（点击灵兽取消选择）</Text>
        <View style={styles.teamRow}>
          {Array.from({ length: 9 }).map((_, i) => {
            const uid = selected[i];
            const spirit = uid ? player.spirits.find(s => s.uid === uid) : null;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.slot, spirit && styles.slotFilled]}
                onPress={() => uid && toggleSpirit(uid)}
              >
                {spirit ? (
                  <>
                    <Text style={styles.slotEmoji}>{spirit.emoji}</Text>
                    <Text style={styles.slotLv}>Lv.{spirit.level}</Text>
                  </>
                ) : (
                  <Text style={styles.slotEmpty}>{i + 1}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>我的灵兽 - 点击选择</Text>
      </View>

      <FlatList
        data={player.spirits}
        keyExtractor={s => s.uid}
        numColumns={3}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SpiritCard
            spirit={item}
            selected={selected.includes(item.uid)}
            onPress={() => toggleSpirit(item.uid)}
          />
        )}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>保存队伍配置</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16, paddingBottom: 8,
  },
  title: { color: '#FFD700', fontSize: 22, fontWeight: 'bold' },
  count: { color: '#888', fontSize: 16 },
  teamPreview: {
    backgroundColor: '#16213E', margin: 12, borderRadius: 14, padding: 12,
  },
  previewLabel: { color: '#888', fontSize: 11, marginBottom: 8 },
  teamRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  slot: {
    width: 50, height: 50, borderRadius: 8,
    backgroundColor: '#0D0D1A', borderWidth: 1, borderColor: '#333',
    alignItems: 'center', justifyContent: 'center',
  },
  slotFilled: { borderColor: '#FFD700' },
  slotEmoji: { fontSize: 22 },
  slotLv: { color: '#FFD700', fontSize: 8 },
  slotEmpty: { color: '#333', fontSize: 14 },
  listHeader: { paddingHorizontal: 16, paddingBottom: 4 },
  listTitle: { color: '#888', fontSize: 13 },
  list: { padding: 8 },
  saveBtn: {
    margin: 12, backgroundColor: '#FF5722', borderRadius: 14,
    padding: 14, alignItems: 'center',
  },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
