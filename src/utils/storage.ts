import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PlayerData } from '../types';

const PLAYER_KEY = '@spirit_realm_player';

export async function savePlayer(player: PlayerData): Promise<void> {
  try {
    await AsyncStorage.setItem(PLAYER_KEY, JSON.stringify(player));
  } catch (e) {
    console.warn('Save failed', e);
  }
}

export async function loadPlayer(): Promise<PlayerData | null> {
  try {
    const raw = await AsyncStorage.getItem(PLAYER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export async function clearPlayer(): Promise<void> {
  await AsyncStorage.removeItem(PLAYER_KEY);
}
