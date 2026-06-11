import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, useColorScheme, StatusBar, Modal, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars, Car } from '../../lib/storage';
import CarCard from '../../components/CarCard';

export default function GarageScreen() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('all');
  const [thOnly, setThOnly] = useState(false);
  const [filterMfg, setFilterMfg] = useState('');
  const [filterSeries, setFilterSeries] = useState('');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const allMfgs = Array.from(new Set(cars.map(c => c.manufacturer).filter(Boolean))).sort();
  const allSeries = Array.from(new Set(cars.map(c => c.series).filter(Boolean))).sort();
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const bg    = dark ? '#0F0F0F' : '#D9D3C5';
  const card  = dark ? '#1C1C1E' : '#FFFFFF';
  const text  = dark ? '#F2F2F7' : '#1C1C1E';
  const muted = dark ? '#8E8E93' : '#6B6B6B';
  const hint  = dark ? '#48484A' : '#C7C7CC';
  const border= dark ? '#2C2C2E' : '#E5E5EA';
  const bg2   = dark ? '#2C2C2E' : '#F2F1EE';

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));

  function filtered(list) {
    const q = search.toLowerCase();
    return list.filter(c => {
      if (brand !== 'all' && c.brand !== brand) return false;
      if (thOnly && c.th === 'none') return false;
    if (filterMfg && c.manufacturer !== filterMfg) return false;
    if (filterSeries && c.series !== filterSeries) return false;
      if (q && ![c.name, c.series, c.color, c.colnum, c.manufacturer].filter(Boolean).join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
  }

  const owned = filtered(cars.filter(c => c.status !== 'wish'));
  const wished = filtered(cars.filter(c => c.status === 'wish'));
  const items = [...owned, ...(wished.length ? [{ type: 'header' }, ...wished] : [])];
  const ownedCount = cars.filter(c => c.status !== 'wish').length;
  const wishCount = cars.filter(c => c.status === 'wish').length;
  const thCount = cars.filter(c => c.th !== 'none').length;

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 40 }).map((_, i) => {
          const EMOJIS = ['🚗','🚙','🏎️','🛻','🚕','🚌','🚓'];
          const col = i % 5;
          const row = Math.floor(i / 5);
          return (
            <Text key={'w' + i} style={{ position: 'absolute', fontSize: 24, opacity: dark ? 0.14 : 0.08, left: col * 82 + (row % 2 === 0 ? 6 : 40), top: row * 110 + 10, transform: [{ rotate: (((i * 53) % 50) - 25) + 'deg' }] }}>{EMOJIS[i % 7]}</Text>
          );
        })}
      </View>
      <View style={[s.header, { backgroundColor: card, borderBottomColor: border }]}>
        <View style={s.titleRow}>
          <Text style={[s.title, { color: text }]}>MY <Text style={{ color: '#D85A30' }}>GARAGE</Text></Text>
          <TouchableOpacity style={[s.addBtn, { backgroundColor: dark ? "#2C2C2E" : "#F0EFEC", marginRight: 6 }]} onPress={() => router.push("/backup")}><Ionicons name="cloud-upload-outline" size={18} color={text} /></TouchableOpacity>
          <TouchableOpacity
          style={[s.addBtn, { backgroundColor: (filterMfg || filterSeries) ? '#D85A30' : (dark ? '#2C2C2E' : '#F0EFEC'), marginRight: 6 }]}
          onPress={() => setShowFilterSheet(true)}
        >
          <Ionicons name="options-outline" size={18} color={(filterMfg || filterSeries) ? '#fff' : text} />
          {(filterMfg || filterSeries) && <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>ON</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={s.addBtn} onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={s.addBtnTxt}>Add Car</Text>
          </TouchableOpacity>
        </View>
        <View style={s.stats}>
          {[
            { n: ownedCount, l: 'Owned', col: '#D85A30' },
            { n: wishCount,  l: 'Wishlist', col: '#185FA5' },
            { n: thCount,    l: 'TH / STH', col: '#3B6D11' },
          ].map(st => (
            <View key={st.l} style={[s.statBox, { backgroundColor: bg2 }]}>
              <Text style={[s.statN, { color: st.col }]}>{st.n}</Text>
              <Text style={[s.statL, { color: muted }]}>{st.l}</Text>
            </View>
          ))}
        </View>
        <View style={s.searchRow}>
          <View style={[s.searchBox, { backgroundColor: bg2, borderColor: border }]}>
            <Ionicons name="search" size={15} color={muted} style={{ marginRight: 6 }} />
            <TextInput
              style={[s.searchIn, { color: text }]}
              placeholder="Search name, series, manufacturer..."
              placeholderTextColor={hint}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={hint} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[s.thBtn, { backgroundColor: thOnly ? '#3B6D11' : bg2, borderColor: thOnly ? '#3B6D11' : border }]}
            onPress={() => setThOnly(!thOnly)}
          >
            <Text style={{ fontSize: 14 }}>⭐</Text>
          </TouchableOpacity>
        </View>
        <View style={s.brandRow}>
          {[
            { k: 'all', l: 'All' },
            { k: 'hw',  l: '🔥 Hot Wheels' },
            { k: 'mb',  l: '🚙 Matchbox' },
          ].map(b => (
            <TouchableOpacity
              key={b.k}
              style={[s.brandChip,
                { backgroundColor: bg2, borderColor: border },
                brand === b.k && b.k === 'hw' && { backgroundColor: '#FAECE7', borderColor: '#D85A30' },
                brand === b.k && b.k === 'mb' && { backgroundColor: '#E6F1FB', borderColor: '#185FA5' },
                brand === b.k && b.k === 'all' && { backgroundColor: dark ? '#3C3C3E' : '#E5E5EA', borderColor: dark ? '#3C3C3E' : '#C7C7CC' },
              ]}
              onPress={() => setBrand(b.k)}
            >
              <Text style={[s.brandChipTxt, { color: muted },
                brand === b.k && b.k === 'hw' && { color: '#993C1D' },
                brand === b.k && b.k === 'mb' && { color: '#0C447C' },
                brand === b.k && b.k === 'all' && { color: text },
              ]}>{b.l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, i) => item.id || 'h' + i}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>🚗</Text>
            <Text style={[s.emptyTitle, { color: text }]}>{cars.length === 0 ? 'Garage is empty!' : 'No results'}</Text>
            <Text style={[s.emptyMsg, { color: muted }]}>{cars.length === 0 ? 'Tap Add Car to get started.' : 'Try a different search.'}</Text>
            {cars.length === 0 && (
              <TouchableOpacity style={s.emptyAddBtn} onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Add First Car</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) =>
          item.type === 'header'
            ? <Text style={[s.sec, { color: hint }]}>WISHLIST</Text>
            : <CarCard car={item} onPress={() => router.push({ pathname: '/view/[id]', params: { id: item.id } })} />
        }
      />

      {/* FILTER SHEET */}
      <Modal visible={showFilterSheet} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} activeOpacity={1} onPress={() => setShowFilterSheet(false)} />
        <View style={{ backgroundColor: card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, maxHeight: '80%' }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0DEDA', alignSelf: 'center', marginVertical: 12 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: text }}>Filter Collection</Text>
            <TouchableOpacity onPress={() => { setFilterMfg(''); setFilterSeries(''); setShowFilterSheet(false); }}>
              <Text style={{ color: '#D85A30', fontWeight: '600' }}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            {/* Manufacturer filter */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Manufacturer</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {allMfgs.map(m => (
                <TouchableOpacity
                  key={m}
                  style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, backgroundColor: filterMfg === m ? '#D85A30' : (dark ? '#2C2C2E' : '#F5F4F1'), borderColor: filterMfg === m ? '#D85A30' : '#E0DEDA' }}
                  onPress={() => setFilterMfg(filterMfg === m ? '' : m)}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: filterMfg === m ? '#fff' : text }}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Series filter */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Series</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {allSeries.map(s => (
                <TouchableOpacity
                  key={s}
                  style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, backgroundColor: filterSeries === s ? '#185FA5' : (dark ? '#2C2C2E' : '#F5F4F1'), borderColor: filterSeries === s ? '#185FA5' : '#E0DEDA' }}
                  onPress={() => setFilterSeries(filterSeries === s ? '' : s)}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: filterSeries === s ? '#fff' : text }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#D85A30', borderRadius: 12, padding: 14, alignItems: 'center' }}
              onPress={() => setShowFilterSheet(false)}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
                Show {filtered.length} Cars
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, borderBottomWidth: 0.5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: 0.3 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#D85A30', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  addBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  stats: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statBox: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center' },
  statN: { fontSize: 26, fontWeight: '800', lineHeight: 30 },
  statL: { fontSize: 11, marginTop: 2, fontWeight: '500' },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 0.5, paddingHorizontal: 12 },
  searchIn: { flex: 1, paddingVertical: 10, fontSize: 14 },
  thBtn: { width: 42, height: 42, borderRadius: 12, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center' },
  brandRow: { flexDirection: 'row', gap: 6 },
  brandChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5 },
  brandChipTxt: { fontSize: 12, fontWeight: '500' },
  sec: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 8, marginBottom: 6 },
  empty: { paddingTop: 80, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 24, fontWeight: '700' },
  emptyMsg: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  emptyAddBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D85A30', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
});
