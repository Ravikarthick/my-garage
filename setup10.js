#!/usr/bin/env node
const fs = require('fs');

// ─── GALLERY with working swipe ─────────────────────────────────────────────
fs.writeFileSync('app/(tabs)/gallery.tsx', `import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, Image, Dimensions, Modal, ScrollView,
  useColorScheme, StatusBar
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars, Car } from '../../lib/storage';

const { width: SW } = Dimensions.get('window');
const CARD_W = (SW - 48) / 2;
const CARD_H = CARD_W * 1.45;

export default function GalleryScreen() {
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState('all');
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [showSwipe, setShowSwipe] = useState(false);
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const swipeRef = useRef(null);

  const bg      = dark ? '#0F0F0F' : '#F2F1EE';
  const card    = dark ? '#1C1C1E' : '#FFFFFF';
  const text    = dark ? '#F2F2F7' : '#1C1C1E';
  const muted   = dark ? '#8E8E93' : '#6B6B6B';
  const hint    = dark ? '#48484A' : '#C7C7CC';
  const border  = dark ? '#2C2C2E' : '#E5E5EA';

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));

  const filtered = cars.filter(c => {
    if (filter === 'hw') return c.brand === 'hw';
    if (filter === 'mb') return c.brand === 'mb';
    if (filter === 'th') return c.th !== 'none';
    return true;
  });

  function openSwipe(idx) {
    setSwipeIndex(idx);
    setShowSwipe(true);
  }

  function renderCard({ item: c, index }) {
    return (
      <TouchableOpacity
        style={[s.card, { backgroundColor: card, width: CARD_W, height: CARD_H }]}
        onPress={() => openSwipe(index)}
        activeOpacity={0.9}
      >
        {c.photo
          ? <Image source={{ uri: c.photo }} style={s.cardImg} resizeMode="cover"/>
          : <View style={[s.cardImgEmpty, { backgroundColor: dark ? '#2C2C2E' : '#F2F1EE' }]}>
              <Text style={{ fontSize: 52 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
            </View>
        }
        <View style={[s.cardOverlay]}>
          <View style={[s.brandDot, { backgroundColor: c.brand === 'hw' ? '#D85A30' : '#185FA5' }]}>
            <Text style={s.brandDotTxt}>{c.brand === 'hw' ? 'HW' : 'MB'}</Text>
          </View>
          {c.th !== 'none' && (
            <View style={[s.thDot, { backgroundColor: c.th === 'sth' ? '#BA7517' : '#3B6D11' }]}>
              <Text style={{ fontSize: 10 }}>{c.th === 'sth' ? '🌟' : '⭐'}</Text>
            </View>
          )}
        </View>
        <View style={[s.cardInfo, { backgroundColor: card }]}>
          <Text style={[s.cardName, { color: text }]} numberOfLines={1}>{c.name}</Text>
          {c.manufacturer
            ? <Text style={[s.cardMfg, { color: '#D85A30' }]} numberOfLines={1}>{c.manufacturer}</Text>
            : <Text style={[s.cardMfg, { color: muted }]} numberOfLines={1}>{c.series || (c.brand === 'hw' ? 'Hot Wheels' : 'Matchbox')}</Text>
          }
          <View style={s.cardMeta}>
            {!!c.year && <Text style={[s.metaTxt, { color: muted }]}>{c.year}</Text>}
            {!!c.color && <><Text style={[s.metaDot, { color: hint }]}>·</Text><Text style={[s.metaTxt, { color: muted }]} numberOfLines={1}>{c.color}</Text></>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const SwipeScreen = () => {
    const [idx, setIdx] = useState(swipeIndex);
    const car = filtered[idx] || filtered[0];
    if (!car) return null;

    return (
      <View style={[s.swipeContainer, { backgroundColor: dark ? '#000' : '#F2F1EE' }]}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        {/* Header */}
        <SafeAreaView>
          <View style={s.swipeTopBar}>
            <TouchableOpacity onPress={() => setShowSwipe(false)} style={[s.swipeCloseBtn, { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
              <Ionicons name="close" size={20} color={text} />
            </TouchableOpacity>
            <Text style={[s.swipeCounter, { color: muted }]}>{idx + 1} of {filtered.length}</Text>
            <TouchableOpacity
              onPress={() => { setShowSwipe(false); router.push({ pathname: '/car/[id]', params: { id: car.id } }); }}
              style={[s.swipeEditBtn2, { backgroundColor: '#D85A30' }]}
            >
              <Ionicons name="pencil" size={14} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Swipeable cars */}
        <FlatList
          ref={swipeRef}
          data={filtered}
          keyExtractor={c => c.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={swipeIndex}
          getItemLayout={(_, i) => ({ length: SW, offset: SW * i, index: i })}
          onMomentumScrollEnd={e => {
            const i = Math.round(e.nativeEvent.contentOffset.x / SW);
            setIdx(i);
          }}
          renderItem={({ item: c }) => (
            <ScrollView style={{ width: SW }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
              {/* Photo */}
              {c.photo
                ? <Image source={{ uri: c.photo }} style={[s.swipeImg, { backgroundColor: dark ? '#1C1C1E' : '#E5E5EA' }]} resizeMode="contain"/>
                : <View style={[s.swipeImgEmpty, { backgroundColor: dark ? '#1C1C1E' : '#E5E5EA' }]}>
                    <Text style={{ fontSize: 100 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
                  </View>
              }

              <View style={{ padding: 20 }}>
                {/* Brand + TH badges */}
                <View style={s.swipeBadges}>
                  <View style={[s.swipeBadge, { backgroundColor: c.brand === 'hw' ? '#D85A30' : '#185FA5' }]}>
                    <Text style={s.swipeBadgeTxt}>{c.brand === 'hw' ? 'Hot Wheels' : 'Matchbox'}</Text>
                  </View>
                  {c.th === 'th' && <View style={[s.swipeBadge, { backgroundColor: '#3B6D11' }]}><Text style={s.swipeBadgeTxt}>⭐ Treasure Hunt</Text></View>}
                  {c.th === 'sth' && <View style={[s.swipeBadge, { backgroundColor: '#BA7517' }]}><Text style={s.swipeBadgeTxt}>🌟 Super TH</Text></View>}
                  {c.status === 'dup' && <View style={[s.swipeBadge, { backgroundColor: '#A32D2D' }]}><Text style={s.swipeBadgeTxt}>Duplicate</Text></View>}
                  {c.status === 'wish' && <View style={[s.swipeBadge, { backgroundColor: '#185FA5' }]}><Text style={s.swipeBadgeTxt}>♡ Wishlist</Text></View>}
                </View>

                {/* Name */}
                <Text style={[s.swipeName, { color: text }]}>{c.name}</Text>
                {!!c.manufacturer && <Text style={{ color: '#D85A30', fontSize: 16, fontWeight: '600', marginBottom: 16 }}>{c.manufacturer}</Text>}

                {/* Details grid */}
                <View style={s.swipeGrid}>
                  {[
                    c.series && { l: 'Series', v: c.series },
                    c.year && { l: 'Year', v: c.year },
                    c.color && { l: 'Color', v: c.color },
                    c.colnum && { l: 'Collector #', v: c.colnum },
                    c.tampo && { l: 'Tampo', v: c.tampo },
                  ].filter(Boolean).map(f => (
                    <View key={f.l} style={[s.swipeFieldBox, { backgroundColor: dark ? '#1C1C1E' : '#fff' }]}>
                      <Text style={[s.swipeFieldL, { color: muted }]}>{f.l}</Text>
                      <Text style={[s.swipeFieldV, { color: text }]}>{f.v}</Text>
                    </View>
                  ))}
                </View>

                {!!c.notes && (
                  <View style={[s.swipeNotesBox, { backgroundColor: dark ? '#1C1C1E' : '#fff' }]}>
                    <Text style={[{ fontSize: 11, color: muted, marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }]}>Notes</Text>
                    <Text style={[{ fontSize: 14, color: text, lineHeight: 20 }]}>{c.notes}</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        />

        {/* Swipe hint */}
        {filtered.length > 1 && (
          <View style={[s.swipeHint, { backgroundColor: dark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)' }]}>
            <Ionicons name="chevron-back" size={14} color={muted} />
            <Text style={[{ fontSize: 11, color: muted }]}>Swipe to browse</Text>
            <Ionicons name="chevron-forward" size={14} color={muted} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[s.header, { backgroundColor: dark ? '#1C1C1E' : '#fff', borderBottomColor: border }]}>
        <View>
          <Text style={[s.headerTitle, { color: text }]}>PHOTO <Text style={{ color: '#D85A30' }}>GALLERY</Text></Text>
          <Text style={[s.headerSub, { color: muted }]}>{filtered.length} cars</Text>
        </View>
        <TouchableOpacity
          style={[s.headerAddBtn, { backgroundColor: '#D85A30' }]}
          onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
        >
          <Ionicons name="add" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={[s.filterRow, { backgroundColor: dark ? '#1C1C1E' : '#fff', borderBottomColor: border }]}>
        {[
          { k: 'all', l: 'All' },
          { k: 'hw', l: '🔥 Hot Wheels' },
          { k: 'mb', l: '🚙 Matchbox' },
          { k: 'th', l: '⭐ TH' },
        ].map(f => (
          <TouchableOpacity
            key={f.k}
            style={[s.filterChip,
              { backgroundColor: dark ? '#2C2C2E' : '#F2F1EE', borderColor: border },
              filter === f.k && { backgroundColor: '#D85A30', borderColor: '#D85A30' }
            ]}
            onPress={() => setFilter(f.k)}
          >
            <Text style={[s.filterChipTxt, { color: muted }, filter === f.k && { color: '#fff' }]}>{f.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: 100 }}
        columnWrapperStyle={{ gap: 12 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>📸</Text>
            <Text style={[s.emptyTitle, { color: text }]}>No cars yet</Text>
            <Text style={[s.emptyMsg, { color: muted }]}>Add cars with photos to see them here</Text>
            <TouchableOpacity
              style={s.emptyBtn}
              onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Add First Car</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={renderCard}
      />

      {/* Full screen swipe modal */}
      <Modal visible={showSwipe} animationType="slide" statusBarTranslucent>
        <SwipeScreen />
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: 0.3 },
  headerSub: { fontSize: 12, marginTop: 1 },
  headerAddBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 0.5 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5 },
  filterChipTxt: { fontSize: 12, fontWeight: '500' },
  card: { borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  cardImg: { width: '100%', height: CARD_W, },
  cardImgEmpty: { width: '100%', height: CARD_W, alignItems: 'center', justifyContent: 'center' },
  cardOverlay: { position: 'absolute', top: 8, right: 8, gap: 4 },
  brandDot: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-end' },
  brandDotTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  thDot: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-end' },
  cardInfo: { padding: 10 },
  cardName: { fontSize: 14, fontWeight: '700', lineHeight: 18, marginBottom: 2 },
  cardMfg: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTxt: { fontSize: 11 },
  metaDot: { fontSize: 11 },
  empty: { paddingTop: 80, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 24, fontWeight: '700' },
  emptyMsg: { fontSize: 14, textAlign: 'center' },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D85A30', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
  // Swipe
  swipeContainer: { flex: 1 },
  swipeTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  swipeCloseBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  swipeCounter: { fontSize: 14, fontWeight: '500' },
  swipeEditBtn2: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  swipeImg: { width: SW, height: SW * 0.75 },
  swipeImgEmpty: { width: SW, height: SW * 0.75, alignItems: 'center', justifyContent: 'center' },
  swipeBadges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 10 },
  swipeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  swipeBadgeTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  swipeName: { fontSize: 28, fontWeight: '800', lineHeight: 32, marginBottom: 4 },
  swipeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  swipeFieldBox: { borderRadius: 12, padding: 12, minWidth: '47%', flex: 1 },
  swipeFieldL: { fontSize: 11, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '500' },
  swipeFieldV: { fontSize: 15, fontWeight: '600' },
  swipeNotesBox: { borderRadius: 12, padding: 14, marginBottom: 12 },
  swipeHint: { position: 'absolute', bottom: 30, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
});
`);
console.log('✅ gallery.tsx - beautiful swipeable gallery');

// ─── REDESIGNED MAIN GARAGE ─────────────────────────────────────────────────
fs.writeFileSync('app/(tabs)/index.tsx', `import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, useColorScheme, StatusBar } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars, Car } from '../../lib/storage';
import CarCard from '../../components/CarCard';

export default function GarageScreen() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('all');
  const [thOnly, setThOnly] = useState(false);
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const bg    = dark ? '#0F0F0F' : '#F2F1EE';
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
      <View style={[s.header, { backgroundColor: card, borderBottomColor: border }]}>
        <View style={s.titleRow}>
          <Text style={[s.title, { color: text }]}>MY <Text style={{ color: '#D85A30' }}>GARAGE</Text></Text>
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
            : <CarCard car={item} onPress={() => router.push({ pathname: '/car/[id]', params: { id: item.id } })} />
        }
      />
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
`);
console.log('✅ index.tsx - redesigned garage');

// ─── REDESIGNED WISHLIST ─────────────────────────────────────────────────────
fs.writeFileSync('app/(tabs)/wishlist.tsx', `import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, useColorScheme, StatusBar } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { loadCars, Car } from '../../lib/storage';
import { Ionicons } from '@expo/vector-icons';
import CarCard from '../../components/CarCard';

export default function WishlistScreen() {
  const [cars, setCars] = useState([]);
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const bg    = dark ? '#0F0F0F' : '#F2F1EE';
  const card  = dark ? '#1C1C1E' : '#FFFFFF';
  const text  = dark ? '#F2F2F7' : '#1C1C1E';
  const muted = dark ? '#8E8E93' : '#6B6B6B';
  const border= dark ? '#2C2C2E' : '#E5E5EA';

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));
  const wishlist = cars.filter(c => c.status === 'wish');

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={[s.header, { backgroundColor: card, borderBottomColor: border }]}>
        <View>
          <Text style={[s.title, { color: text }]}>WISH <Text style={{ color: '#D85A30' }}>LIST</Text></Text>
          <Text style={[s.sub, { color: muted }]}>{wishlist.length} cars you want to find</Text>
        </View>
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={s.addBtnTxt}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={wishlist}
        keyExtractor={c => c.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>♡</Text>
            <Text style={[s.emptyTitle, { color: text }]}>Wishlist is empty</Text>
            <Text style={[s.emptyMsg, { color: muted }]}>Cars you are hunting for show here.</Text>
            <TouchableOpacity
              style={s.emptyBtn}
              onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Add to Wishlist</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <CarCard car={item} onPress={() => router.push({ pathname: '/car/[id]', params: { id: item.id } })} />
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: 0.3 },
  sub: { fontSize: 12, marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#D85A30', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20 },
  addBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  empty: { paddingTop: 80, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 24, fontWeight: '700' },
  emptyMsg: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D85A30', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
});
`);
console.log('✅ wishlist.tsx - fixed with add button');

// ─── REDESIGNED STATS ────────────────────────────────────────────────────────
fs.writeFileSync('app/(tabs)/stats.tsx', `import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, useColorScheme, StatusBar, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { loadCars } from '../../lib/storage';

export default function StatsScreen() {
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
`);
console.log('✅ stats.tsx - redesigned');

// ─── TAB LAYOUT with dark mode ───────────────────────────────────────────────
fs.writeFileSync('app/(tabs)/_layout.tsx', `import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, useColorScheme } from 'react-native';

function ScanButton() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#D85A30', alignItems: 'center', justifyContent: 'center', shadowColor: '#D85A30', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8, marginBottom: 10 }}
        onPress={() => router.push('/scan')}
      >
        <Ionicons name="scan" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? '#1C1C1E' : '#FFFFFF';
  const border = dark ? '#2C2C2E' : '#E5E5EA';

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#D85A30',
      tabBarInactiveTintColor: dark ? '#48484A' : '#8E8E93',
      tabBarStyle: { borderTopColor: border, borderTopWidth: 0.5, backgroundColor: bg, height: 84, paddingBottom: 18, paddingTop: 6 },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      headerShown: false,
    }}>
      <Tabs.Screen name="index" options={{ title: 'Garage', tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} /> }} />
      <Tabs.Screen name="gallery" options={{ title: 'Gallery', tabBarIcon: ({ color, size }) => <Ionicons name="images" size={size} color={color} /> }} />
      <Tabs.Screen name="scan-tab" options={{ title: '', tabBarButton: () => <ScanButton /> }} />
      <Tabs.Screen name="wishlist" options={{ title: 'Wishlist', tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats', tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
`);
console.log('✅ _layout.tsx');

console.log(`
🚗 DONE! Run: npx expo start --clear

WHAT IS FIXED & NEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌙 DARK MODE — works properly now
   Turn on iPhone dark mode → whole app goes dark

📸 GALLERY SWIPE — working!
   Tap any photo card → full screen opens
   Swipe LEFT or RIGHT to browse all cars
   Shows photo, all details, edit button

♡ WISHLIST — fixed!
   Add button in top right corner
   Big Add button when empty

📊 STATS — improved
   Cars by Year chart
   Top Manufacturers chart  
   Top Series chart

🎨 UI — cleaner, more modern
   Proper dark backgrounds
   Better typography
   Stats cards on garage home
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
