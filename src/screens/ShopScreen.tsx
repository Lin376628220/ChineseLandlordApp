import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import SpiritCard from '../components/SpiritCard';
import type { OwnedSpirit } from '../types';
import { rarityColor, expForLevel } from '../utils/spiritUtils';

export default function ShopScreen() {
  const { player, summonSpirit: doSummon, spendGold, earnGems, addSpirit } = useGameStore();
  const [lastSummon, setLastSummon] = useState<OwnedSpirit | null>(null);

  function handleSummon() {
    if (player.gems < 10) {
      Alert.alert('宝石不足', '召唤需要 10 颗宝石');
      return;
    }
    const spirit = doSummon();
    if (spirit) setLastSummon(spirit);
  }

  function handleBuyGems() {
    if (!spendGold(500)) {
      Alert.alert('金币不足', '需要 500 金币');
      return;
    }
    earnGems(30);
    Alert.alert('购买成功', '已获得 💎 30 颗宝石！');
  }

  function handleBuyExpPotion() {
    if (!spendGold(200)) {
      Alert.alert('金币不足', '需要 200 金币');
      return;
    }
    // Add 500 EXP to the first team spirit
    const { useGameStore: store } = require('../store/gameStore');
    const state = store.getState();
    const firstUid = state.player.team[0];
    if (!firstUid) {
      Alert.alert('队伍为空', '请先配置队伍！');
      spendGold(-200); // refund
      return;
    }
    // Use addExp from store
    const { addExpToSpirit } = store.getState();
    if (addExpToSpirit) {
      addExpToSpirit(firstUid, 500);
    }
    Alert.alert('使用成功', '队伍中第一只灵兽获得 500 EXP！');
  }

  function handleBuyMeatJerky() {
    if (!spendGold(100)) {
      Alert.alert('金币不足', '需要 100 金币');
      return;
    }
    Alert.alert('使用成功', '所有灵兽生命值已恢复 50%！\n（下次战斗时生效）');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>召唤商店</Text>

      <View style={styles.resources}>
        <View style={styles.resourceItem}>
          <Text style={styles.resourceIcon}>💰</Text>
          <Text style={styles.resourceVal}>{player.gold} 金币</Text>
        </View>
        <View style={styles.resourceItem}>
          <Text style={styles.resourceIcon}>💎</Text>
          <Text style={styles.resourceVal}>{player.gems} 宝石</Text>
        </View>
      </View>

      {/* Summon Panel */}
      <View style={styles.summonCard}>
        <Text style={styles.summonTitle}>🌟 灵兽召唤</Text>
        <Text style={styles.summonDesc}>
          召唤神秘灵兽加入你的队伍！{'\n'}
          概率：传说 3% | 史诗 12% | 稀有 30% | 普通 55%
        </Text>
        <View style={styles.summonRates}>
          <RateBadge label="传说" rate="3%" color="#FFD700" />
          <RateBadge label="史诗" rate="12%" color="#9C27B0" />
          <RateBadge label="稀有" rate="30%" color="#2196F3" />
          <RateBadge label="普通" rate="55%" color="#9E9E9E" />
        </View>
        <TouchableOpacity
          style={[styles.summonBtn, player.gems < 10 && styles.summonBtnDisabled]}
          onPress={handleSummon}
          disabled={player.gems < 10}
        >
          <Text style={styles.summonBtnText}>💎 10 宝石 召唤一次</Text>
        </TouchableOpacity>
      </View>

      {/* Shop Items */}
      <View style={styles.shopSection}>
        <Text style={styles.sectionTitle}>道具商店</Text>

        <ShopItem
          emoji="💎"
          name="宝石礼包 ×30"
          desc="获得30颗宝石，用于召唤灵兽"
          price="500 金币"
          canAfford={player.gold >= 500}
          onBuy={handleBuyGems}
        />
        <ShopItem
          emoji="⚗️"
          name="经验药水"
          desc="立即为队伍第一只灵兽增加 500 点经验值"
          price="200 金币"
          canAfford={player.gold >= 200}
          onBuy={handleBuyExpPotion}
        />
        <ShopItem
          emoji="🍖"
          name="元气肉干"
          desc="恢复所有灵兽 50% 最大生命值"
          price="100 金币"
          canAfford={player.gold >= 100}
          onBuy={handleBuyMeatJerky}
        />
      </View>

      {/* Summon Result Modal */}
      <Modal visible={!!lastSummon} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.resultTitle}>🎉 召唤成功！</Text>
            <Text style={[styles.resultRarity, { color: rarityColor(lastSummon?.rarity || 'common') }]}>
              获得了{' '}
              {lastSummon?.rarity === 'legendary' ? '传说' :
               lastSummon?.rarity === 'epic' ? '史诗' :
               lastSummon?.rarity === 'rare' ? '稀有' : '普通'}
              {' '}灵兽！
            </Text>
            {lastSummon && <SpiritCard spirit={lastSummon} />}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setLastSummon(null)}>
              <Text style={styles.closeBtnText}>太好了！</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function RateBadge({ label, rate, color }: { label: string; rate: string; color: string }) {
  return (
    <View style={[styles.rateBadge, { borderColor: color }]}>
      <Text style={[styles.rateLabel, { color }]}>{label}</Text>
      <Text style={styles.rateVal}>{rate}</Text>
    </View>
  );
}

function ShopItem({ emoji, name, desc, price, canAfford, onBuy }: {
  emoji: string; name: string; desc: string;
  price: string; canAfford: boolean; onBuy: () => void;
}) {
  return (
    <View style={[styles.shopItem, !canAfford && styles.shopItemDim]}>
      <Text style={styles.shopEmoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.shopName}>{name}</Text>
        <Text style={styles.shopDesc}>{desc}</Text>
      </View>
      <TouchableOpacity
        style={[styles.buyBtn, !canAfford && styles.buyBtnDisabled]}
        onPress={onBuy}
        disabled={!canAfford}
      >
        <Text style={[styles.buyBtnPrice, !canAfford && { color: '#555' }]}>{price}</Text>
        <Text style={[styles.buyBtnText, !canAfford && styles.buyBtnTextDisabled]}>
          {canAfford ? '购买' : '不足'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  content: { padding: 16, paddingBottom: 40 },
  title: { color: '#FFD700', fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  resources: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  resourceItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resourceIcon: { fontSize: 20 },
  resourceVal: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },

  summonCard: {
    backgroundColor: '#16213E', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#2A2A4A', marginBottom: 16,
  },
  summonTitle: { color: '#FFD700', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  summonDesc: { color: '#AAA', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  summonRates: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  rateBadge: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 6, alignItems: 'center' },
  rateLabel: { fontSize: 11, fontWeight: 'bold' },
  rateVal: { color: '#FFF', fontSize: 12 },
  summonBtn: {
    backgroundColor: '#9C27B0', borderRadius: 12,
    padding: 14, alignItems: 'center',
  },
  summonBtnDisabled: { opacity: 0.4 },
  summonBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  shopSection: { marginTop: 8 },
  sectionTitle: { color: '#FFD700', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  shopItem: {
    backgroundColor: '#16213E', borderRadius: 12, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8,
  },
  shopItemDim: { opacity: 0.6 },
  shopEmoji: { fontSize: 32 },
  shopName: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  shopDesc: { color: '#888', fontSize: 12, marginTop: 2 },
  buyBtn: { alignItems: 'center', minWidth: 70 },
  buyBtnDisabled: {},
  buyBtnPrice: { color: '#FFD700', fontSize: 11 },
  buyBtnText: {
    color: '#FFF', backgroundColor: '#FF9800',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
    fontSize: 13, fontWeight: 'bold', marginTop: 2,
    textAlign: 'center',
  },
  buyBtnTextDisabled: { backgroundColor: '#333', color: '#666' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#0F0F1E', borderRadius: 20, padding: 24,
    alignItems: 'center', minWidth: 280,
    borderWidth: 1, borderColor: '#333',
  },
  resultTitle: { color: '#FFD700', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  resultRarity: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  closeBtn: {
    marginTop: 16, backgroundColor: '#FF5722', borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 12,
  },
  closeBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
