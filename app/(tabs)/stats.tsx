import React, { useCallback, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, ScrollView, SafeAreaView, useColorScheme, StatusBar, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { loadCars } from '../../lib/storage';

export default function StatsScreen() {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const bg    = dark ? '#0F0F0F' : '#F2F1EE';
  const card  = dark ? '#1C1C1E' : '#FFFFFF';
  const text  = dark ? '#F2F2F7' : '#1C1C1E';
  const muted = dark ? '#8E8E93' : '#6B6B6B';
  const hint  = dark ? '#48484A' : '#C7C7CC';
  const border= dark ? '#2C2C2E' : '#E5E5EA';
  const bg2   = dark ? '#2C2C2E' : '#F2F1EE';

  const owned = cars.filter(c => c.status !== 'wish');
  const byYear = {};
  owned.filter(c => c.year).forEach(c => { byYear[c.year] = (byYear[c.year] || 0) + 1; });
  const topY = Object.entries(byYear).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 6);
  const mx = topY.length ? Number(topY[0][1]) : 1;

  const bySeries = {};
  owned.filter(c => c.series).forEach(c => { bySeries[c.series] = (bySeries[c.series] || 0) + 1; });
  const topS = Object.entries(bySeries).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5);

  const byMfg = {};
  owned.filter(c => c.manufacturer).forEach(c => { byMfg[c.manufacturer] = (byMfg[c.manufacturer] || 0) + 1; });
  const topM = Object.entries(byMfg).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5);

  const statCards = [
    { l: 'Total Owned', v: owned.length, col: '#D85A30' },
    { l: 'Wishlist', v: cars.filter(c => c.status === 'wish').length, col: '#185FA5' },
    { l: 'Hot Wheels', v: owned.filter(c => c.brand === 'hw').length, col: '#D85A30' },
    { l: 'Matchbox', v: owned.filter(c => c.brand === 'mb').length, col: '#185FA5' },
    { l: 'Treasure Hunts', v: owned.filter(c => c.th === 'th').length, col: '#3B6D11' },
    { l: 'Super TH', v: owned.filter(c => c.th === 'sth').length, col: '#BA7517' },
    { l: 'Duplicates', v: cars.filter(c => c.status === 'dup').length, col: '#A32D2D' },
    { l: 'Total in App', v: cars.length, col: text },
  ];

  function BarChart({ data, mx, col }) {
    return data.map(([lbl, n]) => (
      <View key={lbl} style={s.barRow}>
        <Text style={[s.barLbl, { color: text }]} numberOfLines={1}>{lbl}</Text>
        <View style={[s.barTrack, { backgroundColor: bg2 }]}>
          <View style={[s.barFill, { width: (Math.round(Number(n)/mx*100)) + '%', backgroundColor: col }]} />
        </View>
        <Text style={[s.barN, { color: muted }]}>{n}</Text>
      </View>
    ));
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={[s.header, { backgroundColor: card, borderBottomColor: border }]}>
        <Text style={[s.title, { color: text }]}>MY <Text style={{ color: '#D85A30' }}>STATS</Text></Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={s.grid}>
          {statCards.map(st => (
            <View key={st.l} style={[s.statCard, { backgroundColor: card }]}>
              <Text style={[s.statN, { color: st.col === text ? text : st.col }]}>{st.v}</Text>
              <Text style={[s.statL, { color: muted }]}>{st.l}</Text>
            </View>
          ))}
        </View>

        {topY.length > 0 && (
          <>
            <Text style={[s.secLabel, { color: hint }]}>CARS BY YEAR</Text>
            <View style={[s.chartCard, { backgroundColor: card }]}>
              <BarChart data={topY} mx={mx} col="#D85A30" />
            </View>
          </>
        )}

        {topM.length > 0 && (
          <>
            <Text style={[s.secLabel, { color: hint }]}>TOP MANUFACTURERS</Text>
            <View style={[s.chartCard, { backgroundColor: card }]}>
              <BarChart data={topM} mx={Number(topM[0][1])} col="#185FA5" />
            </View>
          </>
        )}

        {topS.length > 0 && (
          <>
            <Text style={[s.secLabel, { color: hint }]}>TOP SERIES</Text>
            <View style={[s.chartCard, { backgroundColor: card }]}>
              <BarChart data={topS} mx={Number(topS[0][1])} col="#3B6D11" />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: 0.3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  statCard: { width: '47%', borderRadius: 16, padding: 16 },
  statN: { fontSize: 36, fontWeight: '800', lineHeight: 40 },
  statL: { fontSize: 12, marginTop: 3, fontWeight: '500' },
  secLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 20, marginBottom: 8 },
  chartCard: { borderRadius: 16, padding: 16, gap: 12, marginBottom: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLbl: { fontSize: 13, fontWeight: '500', width: 80 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barN: { fontSize: 12, minWidth: 20, textAlign: 'right' },
});
