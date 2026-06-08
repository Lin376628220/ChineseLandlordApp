import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { clearPlayer } from '../utils/storage';

interface Props { navigation: any }

export default function SettingsScreen({ navigation }: Props) {
  const { player, initPlayer } = useGameStore();

  function handleResetData() {
    Alert.alert(
      '⚠️ 重置存档',
      '确定要清除所有游戏数据吗？此操作无法撤销！',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认重置', style: 'destructive',
          onPress: async () => {
            await clearPlayer();
            initPlayer();
            Alert.alert('已重置', '游戏数据已清除，重新开始！');
          }
        }
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚙️ 设置</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>账号信息</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>玩家名</Text>
          <Text style={styles.infoVal}>{player.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>等级</Text>
          <Text style={styles.infoVal}>Lv.{player.level}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>灵兽数量</Text>
          <Text style={styles.infoVal}>{player.spirits.length} 只</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>通关关卡</Text>
          <Text style={styles.infoVal}>{player.stageProgress} / 10</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>金币</Text>
          <Text style={styles.infoVal}>💰 {player.gold}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>宝石</Text>
          <Text style={styles.infoVal}>💎 {player.gems}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>游戏信息</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>游戏名称</Text>
          <Text style={styles.infoVal}>灵界传说</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>版本</Text>
          <Text style={styles.infoVal}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>灵兽总数</Text>
          <Text style={styles.infoVal}>30 种</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>关卡总数</Text>
          <Text style={styles.infoVal}>10 关</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>危险操作</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={handleResetData}>
          <Text style={styles.resetBtnText}>🗑️ 重置所有存档数据</Text>
        </TouchableOpacity>
        <Text style={styles.resetHint}>清除后将重新获得初始三只灵兽，数据无法恢复</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>灵界传说 © 2024</Text>
        <Text style={styles.footerText}>All characters and content are original creations.</Text>
        <Text style={styles.footerText}>No copyright infringement intended.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  content: { padding: 16, paddingBottom: 40 },
  title: { color: '#FFD700', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

  section: {
    backgroundColor: '#16213E', borderRadius: 14, padding: 14,
    marginBottom: 16, borderWidth: 1, borderColor: '#2A2A4A',
  },
  sectionTitle: { color: '#FFD700', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderColor: '#1A1A2E',
  },
  infoLabel: { color: '#888', fontSize: 14 },
  infoVal: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

  resetBtn: {
    backgroundColor: '#1A0A0A', borderRadius: 10, borderWidth: 1,
    borderColor: '#F44336', padding: 14, alignItems: 'center',
  },
  resetBtnText: { color: '#F44336', fontSize: 15, fontWeight: 'bold' },
  resetHint: { color: '#555', fontSize: 11, marginTop: 8, textAlign: 'center' },

  footer: { alignItems: 'center', paddingTop: 20, gap: 4 },
  footerText: { color: '#333', fontSize: 11 },
});
