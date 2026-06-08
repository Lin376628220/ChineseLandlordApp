import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useGameStore } from '../store/gameStore';

interface Props { navigation: any }

export default function LoadingScreen({ navigation }: Props) {
  const { loadGame } = useGameStore();

  useEffect(() => {
    loadGame().then(() => {
      navigation.replace('Main');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>灵界传说</Text>
      <Text style={styles.subtitle}>Spirit Realm</Text>
      <ActivityIndicator size="large" color="#FFD700" style={styles.spinner} />
      <Text style={styles.loading}>载入中...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0A0A1A',
    alignItems: 'center', justifyContent: 'center',
  },
  title: {
    fontSize: 48, fontWeight: 'bold', color: '#FFD700',
    letterSpacing: 4,
  },
  subtitle: { color: '#888', fontSize: 18, marginTop: 4, letterSpacing: 2 },
  spinner: { marginTop: 60 },
  loading: { color: '#555', fontSize: 14, marginTop: 16 },
});
