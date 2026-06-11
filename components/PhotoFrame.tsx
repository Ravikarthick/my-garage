import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
export default function PhotoFrame({ uri, brand }: { uri: string; brand?: 'hw' | 'mb' }) {
  const accent = brand === 'mb' ? '#185FA5' : '#D85A30';
  return (
    <View style={styles.outer}>
      <View style={[styles.frame, { borderColor: accent }]}>
        <View style={styles.inner}>
          <Image source={{ uri }} style={styles.photo} resizeMode="contain" />
        </View>
        <View style={[styles.corner, styles.tl, { borderColor: accent }]} />
        <View style={[styles.corner, styles.tr, { borderColor: accent }]} />
        <View style={[styles.corner, styles.bl, { borderColor: accent }]} />
        <View style={[styles.corner, styles.br, { borderColor: accent }]} />
        <View style={styles.stamp}>
          <Text style={[styles.stampText, { color: accent }]}>MY GARAGE</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  outer: { padding: 8 },
  frame: { borderWidth: 2, borderRadius: 16, padding: 10, backgroundColor: '#FFFFFF', position: 'relative' },
  inner: { borderRadius: 8, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  photo: { width: '100%', aspectRatio: 0.8 },
  corner: { position: 'absolute', width: 18, height: 18 },
  tl: { top: 4, left: 4, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  tr: { top: 4, right: 4, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bl: { bottom: 4, left: 4, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  br: { bottom: 4, right: 4, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  stamp: { position: 'absolute', bottom: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.85)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  stampText: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
});
