import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
export default function SplashOverlay({ onDone }: { onDone: () => void }) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const out = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => {
      Animated.timing(out, { toValue: 0, duration: 450, easing: Easing.in(Easing.ease), useNativeDriver: true }).start(() => onDone());
    }, 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <Animated.View style={[styles.root, { opacity: out }]} pointerEvents="none">
      <Animated.View style={{ opacity: fade, transform: [{ scale }], alignItems: 'center' }}>
        <View style={styles.badge}><Text style={styles.badgeEmoji}>🏎️</Text></View>
        <Text style={styles.title}>Car Garage</Text>
        <View style={styles.rule} />
        <Text style={styles.tagline}>YOUR DIE-CAST COLLECTION</Text>
      </Animated.View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0E0E10', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  badge: { width: 110, height: 110, borderRadius: 28, backgroundColor: '#D85A30', alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: '#D85A30', shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
  badgeEmoji: { fontSize: 58 },
  title: { fontSize: 38, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  rule: { width: 50, height: 3, borderRadius: 2, backgroundColor: '#D85A30', marginVertical: 14 },
  tagline: { fontSize: 12, fontWeight: '700', color: '#8E8E93', letterSpacing: 3 },
});
