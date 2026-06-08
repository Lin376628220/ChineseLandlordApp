import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import { useGameStore } from '../store/gameStore';

interface Props {
  navigation: any;
}

export default function HomeScreen({ navigation }: Props) {
  const { player, claimDailyReward } = useGameStore();

  const todayClaimed = player.lastDailyReward === new Date().toDateString();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>灵界传说</Text>
          <Text style={styles.subTitle}>Spirit Realm</Text>
        </View>
        <View style={styles.resources}>
          <View style={styles.resourceItem}>
            <Text style={styles.resourceIcon}>💰</Text>
            <Text style={styles.resourceVal}>{player.gold}</Text>
          </View>
          <View style={styles.resourceItem}>
            <Text style={styles.resourceIcon}>💎</Text>
            <Text style={styles.resourceVal}>{player.gems}</Text>
          </View>
        </View>
      </View>

      {/* Player Info */}
      <View style={styles.playerCard}>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.playerLevel}>等级 {player.level}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(100, player.exp % 100)}%` }]} />
        </View>
        <Text style={styles.spiritCount}>收集灵兽: {player.spirits.length} 只</Text>
      </View>

      {/* Daily Reward */}
      {!todayClaimed && (
        <TouchableOpacity style={styles.dailyCard} onPress={claimDailyReward}>
          <Text style={styles.dailyIcon}>🎁</Text>
          <View>
            <Text style={styles.dailyTitle}>每日奖励</Text>
            <Text style={styles.dailyDesc}>领取 200金币 + 5宝石</Text>
          </View>
          <Text style={styles.dailyCta}>领取</Text>
        </TouchableOpacity>
      )}

      {/* Quick Team Preview */}
      <View style={styles.teamSection}>
        <Text style={styles.sectionTitle}>我的队伍</Text>
        <View style={styles.teamRow}>
          {player.team.slice(0, 5).map(uid => {
            const s = player.spirits.find(sp => sp.uid === uid);
            if (!s) return null;
            return (
              <View key={uid} style={styles.teamMember}>
                <Text style={styles.teamEmoji}>{s.emoji}</Text>
                <Text style={styles.teamName}>{s.nameZh}</Text>
                <Text style={styles.teamLevel}>Lv.{s.level}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Menu Grid */}
      <View style={styles.menuGrid}>
        <MenuButton
          emoji="⚔️" label="闯关战斗" color="#F44336"
          onPress={() => navigation.navigate('Stage')}
        />
        <MenuButton
          emoji="📖" label="灵兽图鉴" color="#2196F3"
          onPress={() => navigation.navigate('Collection')}
        />
        <MenuButton
          emoji="🏆" label="组建队伍" color="#FF9800"
          onPress={() => navigation.navigate('TeamSetup')}
        />
        <MenuButton
          emoji="🛒" label="召唤商店" color="#9C27B0"
          onPress={() => navigation.navigate('Shop')}
        />
      </View>
    </ScrollView>
  );
}

function MenuButton({ emoji, label, color, onPress }: {
  emoji: string; label: string; color: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.menuBtn, { borderColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.menuEmoji}>{emoji}</Text>
      <Text style={[styles.menuLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  welcomeText: { color: '#FFD700', fontSize: 28, fontWeight: 'bold' },
  subTitle: { color: '#888', fontSize: 14 },
  resources: { flexDirection: 'row', gap: 12 },
  resourceItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resourceIcon: { fontSize: 18 },
  resourceVal: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  playerCard: {
    backgroundColor: '#16213E', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#2A2A4A',
  },
  playerName: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  playerLevel: { color: '#FFD700', fontSize: 14, marginTop: 2 },
  progressBar: {
    height: 6, backgroundColor: '#333', borderRadius: 3,
    marginTop: 8, marginBottom: 4,
  },
  progressFill: { height: 6, backgroundColor: '#4CAF50', borderRadius: 3 },
  spiritCount: { color: '#888', fontSize: 12 },

  dailyCard: {
    backgroundColor: '#1A2A1A', borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 12, borderWidth: 1, borderColor: '#4CAF50',
  },
  dailyIcon: { fontSize: 32 },
  dailyTitle: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold' },
  dailyDesc: { color: '#888', fontSize: 12 },
  dailyCta: {
    marginLeft: 'auto', color: '#FFF', backgroundColor: '#4CAF50',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, fontWeight: 'bold',
  },

  teamSection: { marginBottom: 16 },
  sectionTitle: { color: '#FFD700', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  teamRow: { flexDirection: 'row', gap: 8 },
  teamMember: {
    backgroundColor: '#16213E', borderRadius: 10, padding: 8,
    alignItems: 'center', flex: 1,
  },
  teamEmoji: { fontSize: 28 },
  teamName: { color: '#FFF', fontSize: 10, textAlign: 'center', marginTop: 2 },
  teamLevel: { color: '#FFD700', fontSize: 10 },

  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  menuBtn: {
    flex: 1, minWidth: '45%', backgroundColor: '#16213E',
    borderRadius: 14, padding: 20, alignItems: 'center',
    borderWidth: 1,
  },
  menuEmoji: { fontSize: 36, marginBottom: 8 },
  menuLabel: { fontSize: 15, fontWeight: 'bold' },
});
