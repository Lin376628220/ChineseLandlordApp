import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoadingScreen from './src/screens/LoadingScreen';
import HomeScreen from './src/screens/HomeScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import StageScreen from './src/screens/StageScreen';
import BattleScreen from './src/screens/BattleScreen';
import TeamSetupScreen from './src/screens/TeamSetupScreen';
import ShopScreen from './src/screens/ShopScreen';
import EvolutionScreen from './src/screens/EvolutionScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0A1A',
          borderTopColor: '#1A1A2E',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tab.Screen
        name="Home" component={HomeScreen}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Stage" component={StageScreen}
        options={{
          tabBarLabel: '关卡',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚔️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Collection" component={CollectionScreen}
        options={{
          tabBarLabel: '图鉴',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📖" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="TeamSetup" component={TeamSetupScreen}
        options={{
          tabBarLabel: '队伍',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Shop" component={ShopScreen}
        options={{
          tabBarLabel: '商店',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🛒" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0A0A1A' },
          headerTintColor: '#FFD700',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#0A0A1A' },
        }}
      >
        <Stack.Screen
          name="Loading" component={LoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main" component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Battle" component={BattleScreen}
          options={{ title: '⚔️ 战斗中', headerBackTitle: '逃跑' }}
        />
        <Stack.Screen
          name="Evolution" component={EvolutionScreen}
          options={{ title: '⚗️ 进化中心' }}
        />
        <Stack.Screen
          name="Settings" component={SettingsScreen}
          options={{ title: '⚙️ 设置' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
