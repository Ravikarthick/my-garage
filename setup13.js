#!/usr/bin/env node
const fs = require('fs');

fs.writeFileSync('app/(tabs)/gallery.tsx', `import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, Image, Dimensions, useColorScheme,
  StatusBar, ScrollView, Platform
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars } from '../../lib/storage';

const { width: SW, height: SH } = Dimensions.get('window');
const CARD_W = (SW - 48) / 2;

export default function GalleryScreen() {
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState('all');
  const [mode, setMode] = useState('grid');
  const [reelCars, setReelCars] = useState([]);
  const [reelTitle, setReelTitle] = useState('ALL CARS');
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const reelRef = useRef(null);

  const bg     = dark ? '#111111' : '#F0EFEC';
  const card   = dark ? '#1C1C1E' : '#FFFFFF';
  const text   = dark ? '#F2F2F7' : '#1C1C1E';
  const muted  = dark ? '#8E8E93' : '#6B6B6B';
  const border = dark ? '#2C2C2E' : '#E5E5EA';
  const bg2    = dark ? '#2C2C2E' : '#EBEBEB';

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));

  const filtered = cars.filter(c => {
    if (filter === 'hw') return c.brand === 'hw';
    if (filter === 'mb') return c.brand === 'mb';
    if (filter === 'th') return c.th !== 'none';
    return true;
  });

  const byMaker = {};
  cars.forEach(c => {
    const m = c.manufacturer || (c.brand === 'hw' ? 'Hot Wheels Original' : 'Matchbox');
    if (!byMaker[m]) byMaker[m] = [];
    byMaker[m].push(c);
  });
  const makers = Object.entries(byMaker).sort((a, b) => b[1].length - a[1].length);

  function openReel(carList, title, startIndex = 0) {
    setReelCars(carList);
    setReelTitle(title);
    setMode('reel');
    setTimeout(() => {
      try { reelRef.current?.scrollToIndex({ index: startIndex, animated: false }); } catch {}
    }, 150);
  }

  // ── REEL ITEM ─────────────────────────────────────────────────────────────
  function ReelItem({ item: c, index }) {
    return (
      <View style={{ width: SW, height: SH, backgroundColor: '#000' }}>
        {/* FULL SCREEN PHOTO */}
        {c.photo
          ? <Image
              source={{ uri: c.photo }}
              style={{ position: 'absolute', width: SW, height: SH }}
              resizeMode="cover"
            />
          : <View style={{ position: 'absolute', width: SW, height: SH, backgroundColor: c.brand === 'hw' ? '#1a0a00' : '#000d1a', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 140 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
            </View>
        }

        {/* GRADIENT — transparent top → dark bottom */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: SH * 0.65 }}>
          {['rgba(0,0,0,0)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.68)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,0.93)', 'rgba(0,0,0,0.97)'].map((bg3, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: bg3 }} />
          ))}
        </View>

        {/* TOP overlay — subtle dark for readability */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, backgroundColor: 'rgba(0,0,0,0.25)' }} />

        {/* INFO — overlaid at bottom of photo */}
        <View style={{ position: 'absolute', bottom: 90, left: 20, right: 80 }}>
          {/* Brand + TH badges */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            <View style={[s.pill, { backgroundColor: c.brand === 'hw' ? '#D85A30' : '#185FA5' }]}>
              <Text style={s.pillTxt}>{c.brand === 'hw' ? '🔥 Hot Wheels' : '🚙 Matchbox'}</Text>
            </View>
            {c.th === 'sth' && <View style={[s.pill, { backgroundColor: '#BA7517' }]}><Text style={s.pillTxt}>🌟 Super TH</Text></View>}
            {c.th === 'th'  && <View style={[s.pill, { backgroundColor: '#3B6D11' }]}><Text style={s.pillTxt}>⭐ TH</Text></View>}
            {c.status === 'wish' && <View style={[s.pill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}><Text style={s.pillTxt}>♡ Wishlist</Text></View>}
            {c.status === 'dup'  && <View style={[s.pill, { backgroundColor: '#8B1A1A' }]}><Text style={s.pillTxt}>2× Dupe</Text></View>}
          </View>

          {/* Car name — BIG */}
          <Text style={s.reelName}>{c.name}</Text>

          {/* Manufacturer */}
          {!!c.manufacturer && <Text style={s.reelMaker}>{c.manufacturer}</Text>}

          {/* Detail chips — scrollable */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', gap: 8, paddingRight: 20 }}>
              {!!c.series && (
                <View style={s.chip}>
                  <Ionicons name="layers-outline" size={11} color="rgba(255,255,255,0.7)" />
                  <Text style={s.chipTxt}>{c.series}</Text>
                </View>
              )}
              {!!c.year && (
                <View style={s.chip}>
                  <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.7)" />
                  <Text style={s.chipTxt}>{c.year}</Text>
                </View>
              )}
              {!!c.color && (
                <View style={s.chip}>
                  <Ionicons name="color-palette-outline" size={11} color="rgba(255,255,255,0.7)" />
                  <Text style={s.chipTxt}>{c.color}</Text>
                </View>
              )}
              {!!c.colnum && (
                <View style={[s.chip, { backgroundColor: 'rgba(24,95,165,0.65)' }]}>
                  <Ionicons name="pricetag-outline" size={11} color="rgba(255,255,255,0.85)" />
                  <Text style={s.chipTxt}>#{c.colnum}</Text>
                </View>
              )}
              {!!c.tampo && (
                <View style={s.chip}>
                  <Ionicons name="brush-outline" size={11} color="rgba(255,255,255,0.7)" />
                  <Text style={s.chipTxt}>{c.tampo}</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {!!c.notes && <Text style={s.reelNotes} numberOfLines={2}>{c.notes}</Text>}
        </View>

        {/* RIGHT SIDE ACTIONS */}
        <View style={{ position: 'absolute', right: 14, bottom: 160, gap: 20 }}>
          <TouchableOpacity
            onPress={() => { setMode('grid'); router.push({ pathname: '/car/[id]', params: { id: c.id } }); }}
            style={{ alignItems: 'center', gap: 4 }}
          >
            <View style={s.actionCircle}><Ionicons name="pencil" size={20} color="#fff" /></View>
            <Text style={s.actionTxt}>Edit</Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <View style={[s.actionCircle, { backgroundColor: c.brand === 'hw' ? 'rgba(216,90,48,0.7)' : 'rgba(24,95,165,0.7)' }]}>
              <Text style={{ fontSize: 20 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
            </View>
            <Text style={s.actionTxt}>{c.brand === 'hw' ? 'HW' : 'MB'}</Text>
          </View>
        </View>

        {/* Swipe up cue */}
        {index < reelCars.length - 1 && (
          <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center', alignItems: 'center', gap: 2 }}>
            <Ionicons name="chevron-up" size={18} color="rgba(255,255,255,0.4)" />
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>swipe up</Text>
          </View>
        )}

        {/* Position counter */}
        <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 56 : 16, right: 16, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{index + 1} / {reelCars.length}</Text>
        </View>
      </View>
    );
  }

  // ── REEL MODE ──────────────────────────────────────────────────────────────
  if (mode === 'reel') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar hidden={Platform.OS === 'ios'} barStyle="light-content" />
        {/* Top bar */}
        <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 50 : 10, left: 16, right: 16, zIndex: 99, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => setMode('grid')}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="grid-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 }}>{reelTitle}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#D85A30', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={reelRef}
          data={reelCars}
          keyExtractor={c => c.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          getItemLayout={(_, i) => ({ length: SH, offset: SH * i, index: i })}
          renderItem={({ item, index }) => <ReelItem item={item} index={index} />}
        />
      </View>
    );
  }

  // ── MAKERS MODE ────────────────────────────────────────────────────────────
  if (mode === 'makers') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        <View style={[s.header, { backgroundColor: card, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => setMode('grid')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="chevron-back" size={22} color={text} />
            <View>
              <Text style={[s.headerTitle, { color: text }]}>CAR <Text style={{ color: '#D85A30' }}>MAKERS</Text></Text>
              <Text style={[s.headerSub, { color: muted }]}>{makers.length} brands · {cars.length} total cars</Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={makers}
          keyExtractor={([m]) => m}
          contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 100 }}
          renderItem={({ item: [maker, mcars] }) => {
            const sample = mcars.find(c => c.photo);
            const hw = mcars.filter(c => c.brand === 'hw').length;
            const mb = mcars.filter(c => c.brand === 'mb').length;
            const th = mcars.filter(c => c.th !== 'none').length;
            return (
              <TouchableOpacity
                style={[s.makerRow, { backgroundColor: card, borderColor: border }]}
                onPress={() => openReel(mcars, maker.toUpperCase())}
                activeOpacity={0.82}
              >
                {/* Thumb */}
                <View style={s.makerThumbWrap}>
                  {sample?.photo
                    ? <Image source={{ uri: sample.photo }} style={s.makerThumb} resizeMode="cover" blurRadius={2} />
                    : <View style={[s.makerThumb, { backgroundColor: bg2, alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={{ fontSize: 32 }}>🚗</Text>
                      </View>
                  }
                  <View style={[s.makerCountBubble, { backgroundColor: '#D85A30' }]}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{mcars.length}</Text>
                  </View>
                </View>

                {/* Info */}
                <View style={{ flex: 1, paddingLeft: 14, gap: 6 }}>
                  <Text style={[{ fontSize: 17, fontWeight: '700', color: text, lineHeight: 20 }]}>{maker}</Text>
                  <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                    {hw > 0 && (
                      <View style={[s.makerBadge, { backgroundColor: '#FAECE7' }]}>
                        <Text style={{ fontSize: 11, color: '#993C1D', fontWeight: '700' }}>🔥 {hw} HW</Text>
                      </View>
                    )}
                    {mb > 0 && (
                      <View style={[s.makerBadge, { backgroundColor: '#E6F1FB' }]}>
                        <Text style={{ fontSize: 11, color: '#0C447C', fontWeight: '700' }}>🚙 {mb} MB</Text>
                      </View>
                    )}
                    {th > 0 && (
                      <View style={[s.makerBadge, { backgroundColor: '#EAF3DE' }]}>
                        <Text style={{ fontSize: 11, color: '#3B6D11', fontWeight: '700' }}>⭐ {th} TH</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Play */}
                <View style={{ paddingRight: 14, alignItems: 'center', gap: 4 }}>
                  <View style={[s.playBtn, { backgroundColor: '#D85A30' }]}>
                    <Ionicons name="play" size={16} color="#fff" />
                  </View>
                  <Text style={[{ fontSize: 10, color: muted, fontWeight: '500' }]}>Swipe</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }

  // ── GRID MODE ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[s.header, { backgroundColor: card, borderBottomColor: border }]}>
        <View>
          <Text style={[s.headerTitle, { color: text }]}>PHOTO <Text style={{ color: '#D85A30' }}>GALLERY</Text></Text>
          <Text style={[s.headerSub, { color: muted }]}>{filtered.length} cars</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={[s.headerBtn, { backgroundColor: bg2, borderColor: border }]}
            onPress={() => setMode('makers')}
          >
            <Ionicons name="business-outline" size={15} color={text} />
            <Text style={[{ fontSize: 12, fontWeight: '600', color: text }]}>Makers</Text>
          </TouchableOpacity>
          {filtered.length > 0 && (
            <TouchableOpacity
              style={[s.headerBtn, { backgroundColor: '#D85A30', borderColor: '#D85A30' }]}
              onPress={() => openReel(filtered, 'ALL CARS')}
            >
              <Ionicons name="play" size={13} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Swipe</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={[{ flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 0.5, backgroundColor: card, borderBottomColor: border }]}>
        {[{ k: 'all', l: 'All' }, { k: 'hw', l: '🔥 HW' }, { k: 'mb', l: '🚙 MB' }, { k: 'th', l: '⭐ TH' }].map(f => (
          <TouchableOpacity
            key={f.k}
            style={[s.filterChip, { backgroundColor: bg2, borderColor: border }, filter === f.k && { backgroundColor: '#D85A30', borderColor: '#D85A30' }]}
            onPress={() => setFilter(f.k)}
          >
            <Text style={[s.filterTxt, { color: muted }, filter === f.k && { color: '#fff' }]}>{f.l}</Text>
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
          <View style={{ paddingTop: 80, alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 64 }}>📸</Text>
            <Text style={[{ fontSize: 22, fontWeight: '700', color: text }]}>No cars yet</Text>
            <Text style={[{ fontSize: 14, color: muted }]}>Add cars to see them here</Text>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D85A30', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 6 }}
              onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Add First Car</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item: c, index }) => (
          <TouchableOpacity
            style={[{ width: CARD_W, borderRadius: 16, overflow: 'hidden', backgroundColor: card, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: dark ? 0.3 : 0.08, shadowRadius: 8, elevation: 3 }]}
            onPress={() => openReel(filtered, 'ALL CARS', index)}
            activeOpacity={0.88}
          >
            {c.photo
              ? <Image source={{ uri: c.photo }} style={{ width: '100%', height: CARD_W }} resizeMode="cover" />
              : <View style={{ width: '100%', height: CARD_W, backgroundColor: bg2, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 48 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
                </View>
            }
            <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: c.brand === 'hw' ? '#D85A30' : '#185FA5', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8 }}>
              <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>{c.brand === 'hw' ? 'HW' : 'MB'}</Text>
            </View>
            {c.th !== 'none' && (
              <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 8 }}>
                <Text style={{ fontSize: 11 }}>{c.th === 'sth' ? '🌟' : '⭐'}</Text>
              </View>
            )}
            <View style={{ padding: 10, gap: 2 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: text, lineHeight: 17 }} numberOfLines={1}>{c.name}</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#D85A30' }} numberOfLines={1}>
                {c.manufacturer || (c.brand === 'hw' ? 'Hot Wheels' : 'Matchbox')}
              </Text>
              {!!c.series && <Text style={{ fontSize: 10, color: muted }} numberOfLines={1}>{c.series}</Text>}
              <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginTop: 2 }}>
                {!!c.year && <Text style={{ fontSize: 10, color: muted }}>{c.year}</Text>}
                {!!c.color && <Text style={{ fontSize: 10, color: muted }}>· {c.color}</Text>}
                {!!c.colnum && <Text style={{ fontSize: 10, color: '#185FA5', fontWeight: '600' }}>#{c.colnum}</Text>}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: 0.3 },
  headerSub: { fontSize: 12, marginTop: 1 },
  headerBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 0.5 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5 },
  filterTxt: { fontSize: 12, fontWeight: '600' },
  // Reel info
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  pillTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  reelName: { fontSize: 30, fontWeight: '900', color: '#fff', lineHeight: 34, marginBottom: 3, letterSpacing: -0.3 },
  reelMaker: { fontSize: 16, fontWeight: '600', color: '#FF9060', marginBottom: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  chipTxt: { color: '#fff', fontSize: 12, fontWeight: '500' },
  reelNotes: { color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 18, marginTop: 2 },
  actionCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  actionTxt: { color: '#fff', fontSize: 11, fontWeight: '600' },
  // Makers
  makerRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 0.5, overflow: 'hidden' },
  makerThumbWrap: { position: 'relative' },
  makerThumb: { width: 88, height: 88 },
  makerCountBubble: { position: 'absolute', bottom: 5, right: 5, minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  makerBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  playBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});
`);

console.log('✅ gallery.tsx completely rewritten');
console.log('\nRun: npx expo start --clear');
console.log('\nFIXES:');
console.log('- Photo FILLS the full screen correctly');
console.log('- Info overlaid at BOTTOM of photo (like TikTok)');
console.log('- Gradient goes from transparent at top to dark at bottom');
console.log('- Dark mode works properly (uses useColorScheme)');
console.log('- Makers view is clean and attractive');
