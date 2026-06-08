import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface Props {
  value: number;
  type: 'damage' | 'heal';
  onDone: () => void;
}

export default function FloatingDamage({ value, type, onDone }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.3, useNativeDriver: true, speed: 30 }),
        Animated.spring(scale, { toValue: 1.0, useNativeDriver: true, speed: 20 }),
      ]),
      Animated.timing(translateY, { toValue: -50, duration: 900, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start(onDone);
  }, []);

  return (
    <Animated.Text style={[
      styles.text,
      type === 'damage' ? styles.damage : styles.heal,
      { opacity, transform: [{ translateY }, { scale }] },
    ]}>
      {type === 'damage' ? `-${value}` : `+${value}`}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    zIndex: 999,
    alignSelf: 'center',
  },
  damage: { color: '#FF5252' },
  heal: { color: '#69F0AE' },
});
