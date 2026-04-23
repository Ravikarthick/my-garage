#!/usr/bin/env node
const fs = require('fs');

fs.writeFileSync('app/(tabs)/gallery.tsx', `import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, Image, Dimensions, useColorScheme,
  StatusBar, Platform, ScrollView
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars } from '../../lib/storage';

const { width: SW, height: SH } = Dimensions.get('window');
const CARD_W = (SW - 48) / 2;

// Linear gradient fallback using View layers
function GradientOverlay() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={{ flex: 1 }} />
      <View style={{ height: SH * 0.55, background: 'transparent' }}>
        {[0.0, 0.08, 0.18, 0.30, 0.45, 0.62, 0.80, 1.0].map((op, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: \`rgba(0,0,0,\${op * 0.95})\` }} />
        ))}
      </View>
    </View>
  );
}

export default function GalleryScreen() {
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState('all');
  const [mode, setMode] = useState('grid');
  const [subMode, setSubMode] = useState('all'); // 'all' or maker name
  const [reelIndex, setReelIndex] = useState(0);
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const reelRef = useRef(null);

  const bg    = dark ? '#0A0A0A' : '#F2F1EE';
  const card  = dark ? '#1C1C1E' : '#FFFFFF';
  const text  = dark ? '#F2F2F7' : '#1C1C1E';
  const muted = dark ? '#8E8E93' : '#6B6B6B';
  const border= dark ? '#2C2C2E' : '#E5E5EA';
  const bg2   = dark ? '#2C2C2E' : '#F2F1EE';

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));

  const filtered = cars.filter(c => {
    if (filter === 'hw') return c.brand === 'hw';
    if (filter === 'mb') return c.brand === 'mb';
    if (filter === 'th') return c.th !== 'none';
    return true;
  });

  // Group cars by manufacturer
  const byMaker = {};
  cars.forEach(c => {
    const m = c.manufacturer || (c.brand === 'hw' ? 'Hot Wheels Original' : 'Matchbox');
    if (!byMaker[m]) byMaker[m] = [];
    byMaker[m].push(c);
  });
  const makers = Object.entries(byMaker).sort((a, b) => b[1].length - a[1].length);

  const reelCars = subMode === 'all' ? filtered : (byMaker[subMode] || []);

  // ── REEL ITEM ──────────────────────────────────────────────────────────────
  function ReelItem({ item: c, index }) {
    return (
      <View style={{ width: SW, height: SH }}>
        {/* Full screen blurred BG */}
        {c.photo
          ? <Image source={{ uri: c.photo }} style={StyleSheet.absoluteFill} resizeMode="cover" blurRadius={20} />
          : <View style={[StyleSheet.absoluteFill, { backgroundColor: c.brand === 'hw' ? '#1A0800' : '#001020' }]} />
        }
        {/* Gradient layers */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.2)' }]} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: SH * 0.65 }}>
          {['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.78)', 'rgba(0,0,0,0.92)', 'rgba(0,0,0,0.97)'].map((c2, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: c2 }} />
          ))}
        </View>

        {/* Main photo - centered and large */}
        <View style={s.reelPhotoArea}>
          {c.photo
            ? <Image source={{ uri: c.photo }} style={s.reelMainPhoto} resizeMode="contain" />
            : <Text style={{ fontSize: 110 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
          }
        </View>

        {/* Bottom info card */}
        <View style={s.reelBottom}>
          {/* Badges row */}
          <View style={s.reelBadgeRow}>
            <View style={[s.reelPill, { backgroundColor: c.brand === 'hw' ? '#D85A30' : '#185FA5' }]}>
              <Text style={s.reelPillTxt}>{c.brand === 'hw' ? '🔥 Hot Wheels' : '🚙 Matchbox'}</Text>
            </View>
            {c.th === 'sth' && <View style={[s.reelPill, { backgroundColor: '#BA7517' }]}><Text style={s.reelPillTxt}>🌟 Super TH</Text></View>}
            {c.th === 'th' && <View style={[s.reelPill, { backgroundColor: '#3B6D11' }]}><Text style={s.reelPillTxt}>⭐ TH</Text></View>}
            {c.status === 'wish' && <View style={[s.reelPill, { backgroundColor: 'rgba(255,255,255,0.18)' }]}><Text style={s.reelPillTxt}>♡ Want</Text></View>}
            {c.status === 'dup' && <View style={[s.reelPill, { backgroundColor: '#A32D2D' }]}><Text style={s.reelPillTxt}>2× Dupe</Text></View>}
          </View>

          {/* Car name */}
          <Text style={s.reelCarName}>{c.name}</Text>

          {/* Manufacturer */}
          {!!c.manufacturer && (
            <Text style={s.reelMakerName}>{c.manufacturer}</Text>
          )}

          {/* Detail pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {!!c.series && (
                <View style={s.detailPill}>
                  <Ionicons name="layers-outline" size={11} color="rgba(255,255,255,0.65)" />
                  <Text style={s.detailPillTxt}>{c.series}</Text>
                </View>
              )}
              {!!c.year && (
                <View style={s.detailPill}>
                  <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.65)" />
                  <Text style={s.detailPillTxt}>{c.year}</Text>
                </View>
              )}
              {!!c.color && (
                <View style={s.detailPill}>
                  <Ionicons name="color-palette-outline" size={11} color="rgba(255,255,255,0.65)" />
                  <Text style={s.detailPillTxt}>{c.color}</Text>
                </View>
              )}
              {!!c.colnum && (
                <View style={[s.detailPill, { backgroundColor: 'rgba(24,95,165,0.6)' }]}>
                  <Ionicons name="pricetag-outline" size={11} color="rgba(255,255,255,0.8)" />
                  <Text style={s.detailPillTxt}>#{c.colnum}</Text>
                </View>
              )}
              {!!c.tampo && (
                <View style={s.detailPill}>
                  <Ionicons name="brush-outline" size={11} color="rgba(255,255,255,0.65)" />
                  <Text style={s.detailPillTxt}>{c.tampo}</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {!!c.notes && (
            <Text style={s.reelNotes} numberOfLines={2}>{c.notes}</Text>
          )}
        </View>

        {/* Right side actions */}
        <View style={s.reelSideActions}>
          <TouchableOpacity
            onPress={() => { setMode('grid'); router.push({ pathname: '/car/[id]', params: { id: c.id } }); }}
            style={s.sideAction}
          >
            <View style={s.sideActionIcon}><Ionicons name="pencil" size={20} color="#fff" /></View>
            <Text style={s.sideActionTxt}>Edit</Text>
          </TouchableOpacity>
          <View style={s.sideAction}>
            <View style={[s.sideActionIcon, { backgroundColor: c.brand === 'hw' ? 'rgba(216,90,48,0.6)' : 'rgba(24,95,165,0.6)' }]}>
              <Text style={{ fontSize: 20 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
            </View>
            <Text style={s.sideActionTxt}>{c.brand === 'hw' ? 'HW' : 'MB'}</Text>
          </View>
        </View>

        {/* Swipe indicator */}
        {index < reelCars.length - 1 && (
          <View style={s.swipeIndicator}>
            <Ionicons name="chevron-up" size={16} color="rgba(255,255,255,0.5)" />
          </View>
        )}

        {/* Counter */}
        <View style={s.reelCount}>
          <Text style={s.reelCountTxt}>{index + 1} / {reelCars.length}</Text>
        </View>
      </View>
    );
  }

  // ── REEL VIEW ──────────────────────────────────────────────────────────────
  if (mode === 'reel') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar barStyle="light-content" hidden={Platform.OS === 'ios'} />
        <SafeAreaView style={s.reelTopBar}>
          <TouchableOpacity style={s.reelTopBtn} onPress={() => setMode('grid')}>
            <Ionicons name="grid-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={s.reelTopTitle}>{subMode === 'all' ? 'ALL CARS' : subMode.toUpperCase()}</Text>
          <TouchableOpacity style={[s.reelTopBtn, { backgroundColor: '#D85A30' }]}
            onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>

        <FlatList
          ref={reelRef}
          data={reelCars}
          keyExtractor={c => c.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          initialScrollIndex={reelIndex}
          getItemLayout={(_, i) => ({ length: SH, offset: SH * i, index: i })}
          onMomentumScrollEnd={e => setReelIndex(Math.round(e.nativeEvent.contentOffset.y / SH))}
          renderItem={({ item, index }) => <ReelItem item={item} index={index} />}
        />
      </View>
    );
  }

  // ── CAR MAKERS VIEW ────────────────────────────────────────────────────────
  if (mode === 'makers') {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        <View style={[s.header, { backgroundColor: card, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => setMode('grid')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="chevron-back" size={22} color={text} />
            <Text style={[s.headerTitle, { color: text }]}>CAR <Text style={{ color: '#D85A30' }}>MAKERS</Text></Text>
          </TouchableOpacity>
          <Text style={[s.headerSub, { color: muted }]}>{makers.length} brands</Text>
        </View>

        <FlatList
          data={makers}
          keyExtractor={([m]) => m}
          contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 10 }}
          renderItem={({ item: [maker, makerCars] }) => {
            const sample = makerCars.find(c => c.photo);
            const hwCount = makerCars.filter(c => c.brand === 'hw').length;
            const mbCount = makerCars.filter(c => c.brand === 'mb').length;
            return (
              <TouchableOpacity
                style={[s.makerCard, { backgroundColor: card, borderColor: border }]}
                onPress={() => { setSubMode(maker); setReelIndex(0); setMode('reel'); }}
                activeOpacity={0.85}
              >
                {sample?.photo
                  ? <Image source={{ uri: sample.photo }} style={s.makerThumb} resizeMode="cover" blurRadius={4} />
                  : <View style={[s.makerThumb, { backgroundColor: dark ? '#2C2C2E' : '#F2F1EE', alignItems: 'center', justifyContent: 'center' }]}>
                      <Text style={{ fontSize: 36 }}>🚗</Text>
                    </View>
                }
                <View style={s.makerInfo}>
                  <Text style={[s.makerName, { color: text }]}>{maker}</Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {hwCount > 0 && <View style={[s.makerPill, { backgroundColor: '#FAECE7' }]}><Text style={{ fontSize: 11, color: '#993C1D', fontWeight: '600' }}>🔥 {hwCount} HW</Text></View>}
                    {mbCount > 0 && <View style={[s.makerPill, { backgroundColor: '#E6F1FB' }]}><Text style={{ fontSize: 11, color: '#0C447C', fontWeight: '600' }}>🚙 {mbCount} MB</Text></View>}
                  </View>
                  <Text style={[s.makerTotal, { color: muted }]}>{makerCars.length} car{makerCars.length !== 1 ? 's' : ''}</Text>
                </View>
                <View style={s.makerArrow}>
                  <Ionicons name="play-circle" size={32} color="#D85A30" />
                  <Text style={{ fontSize: 10, color: muted, marginTop: 2 }}>Swipe</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }

  // ── GRID VIEW (default) ────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={[s.header, { backgroundColor: card, borderBottomColor: border }]}>
        <View>
          <Text style={[s.headerTitle, { color: text }]}>PHOTO <Text style={{ color: '#D85A30' }}>GALLERY</Text></Text>
          <Text style={[s.headerSub, { color: muted }]}>{filtered.length} cars</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TouchableOpacity
            style={[s.topBtn, { backgroundColor: dark ? '#2C2C2E' : '#F2F1EE', borderColor: border }]}
            onPress={() => setMode('makers')}
          >
            <Ionicons name="business-outline" size={16} color={text} />
            <Text style={[{ fontSize: 12, fontWeight: '600', color: text }]}>Makers</Text>
          </TouchableOpacity>
          {filtered.length > 0 && (
            <TouchableOpacity
              style={[s.topBtn, { backgroundColor: '#D85A30', borderColor: '#D85A30' }]}
              onPress={() => { setSubMode('all'); setReelIndex(0); setMode('reel'); }}
            >
              <Ionicons name="play" size={14} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Swipe</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[s.filterRow, { backgroundColor: card, borderBottomColor: border }]}>
        {[{ k: 'all', l: 'All' }, { k: 'hw', l: '🔥 HW' }, { k: 'mb', l: '🚙 MB' }, { k: 'th', l: '⭐ TH' }].map(f => (
          <TouchableOpacity
            key={f.k}
            style={[s.filterChip, { backgroundColor: bg2, borderColor: border }, filter === f.k && { backgroundColor: '#D85A30', borderColor: '#D85A30' }]}
            onPress={() => setFilter(f.k)}
          >
            <Text style={[s.filterChipTxt, { color: muted }, filter === f.k && { color: '#fff' }]}>{f.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: 100 }}
        columnWrapperStyle={{ gap: 12 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>📸</Text>
            <Text style={[{ fontSize: 24, fontWeight: '700', color: text }]}>No cars yet</Text>
            <Text style={[{ fontSize: 14, textAlign: 'center', color: muted }]}>Add cars to see them here</Text>
            <TouchableOpacity style={s.emptyBtn}
              onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Add First Car</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item: c, index }) => (
          <TouchableOpacity
            style={[s.gridCard, { backgroundColor: card, width: CARD_W }]}
            onPress={() => { setSubMode('all'); setReelIndex(index); setMode('reel'); }}
            activeOpacity={0.88}
          >
            {c.photo
              ? <Image source={{ uri: c.photo }} style={[s.gridImg, { height: CARD_W }]} resizeMode="cover" />
              : <View style={[{ height: CARD_W, backgroundColor: bg2, alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ fontSize: 44 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
                </View>
            }
            <View style={[s.gridBrandBadge, { backgroundColor: c.brand === 'hw' ? '#D85A30' : '#185FA5' }]}>
              <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>{c.brand === 'hw' ? 'HW' : 'MB'}</Text>
            </View>
            {c.th !== 'none' && (
              <View style={s.gridThBadge}>
                <Text style={{ fontSize: 10 }}>{c.th === 'sth' ? '🌟' : '⭐'}</Text>
              </View>
            )}
            <View style={{ padding: 10 }}>
              <Text style={[{ fontSize: 13, fontWeight: '700', color: text, lineHeight: 17, marginBottom: 2 }]} numberOfLines={1}>{c.name}</Text>
              <Text style={[{ fontSize: 10, fontWeight: '600', color: '#D85A30', marginBottom: 3 }]} numberOfLines={1}>
                {c.manufacturer || (c.brand === 'hw' ? 'Hot Wheels' : 'Matchbox')}
              </Text>
              {!!c.series && <Text style={[{ fontSize: 10, color: muted, marginBottom: 3 }]} numberOfLines={1}>{c.series}</Text>}
              <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
                {!!c.year && <Text style={[{ fontSize: 10, color: muted }]}>{c.year}</Text>}
                {!!c.color && <Text style={[{ fontSize: 10, color: muted }]}>· {c.color}</Text>}
                {!!c.colnum && <Text style={[{ fontSize: 10, color: '#185FA5', fontWeight: '600' }]}>#{c.colnum}</Text>}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: 0.3 },
  headerSub: { fontSize: 12, marginTop: 1 },
  topBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 0.5 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 0.5 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5 },
  filterChipTxt: { fontSize: 12, fontWeight: '500' },
  gridCard: { borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  gridImg: { width: '100%' },
  gridBrandBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8 },
  gridThBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 8 },
  empty: { paddingTop: 80, alignItems: 'center', gap: 8 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D85A30', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
  // Reel
  reelTopBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  reelTopBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  reelTopTitle: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  reelPhotoArea: { position: 'absolute', top: 80, left: 0, right: 72, bottom: SH * 0.42, alignItems: 'center', justifyContent: 'center' },
  reelMainPhoto: { width: SW - 80, height: (SH - 80 - SH * 0.42) * 0.95 },
  reelBottom: { position: 'absolute', bottom: 80, left: 20, right: 80 },
  reelBadgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 12 },
  reelPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  reelPillTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  reelCarName: { fontSize: 32, fontWeight: '900', color: '#fff', lineHeight: 36, marginBottom: 4, letterSpacing: -0.5 },
  reelMakerName: { fontSize: 17, fontWeight: '600', color: '#FF9060', marginBottom: 10 },
  detailPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  detailPillTxt: { color: '#fff', fontSize: 12, fontWeight: '500' },
  reelNotes: { color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 18, marginTop: 4 },
  reelSideActions: { position: 'absolute', right: 14, bottom: 160, gap: 22 },
  sideAction: { alignItems: 'center', gap: 4 },
  sideActionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  sideActionTxt: { color: '#fff', fontSize: 11, fontWeight: '600' },
  swipeIndicator: { position: 'absolute', bottom: 42, alignSelf: 'center' },
  reelCount: { position: 'absolute', top: 58, right: 16, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  reelCountTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  // Makers
  makerCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, overflow: 'hidden', borderWidth: 0.5, gap: 0 },
  makerThumb: { width: 90, height: 90 },
  makerInfo: { flex: 1, padding: 14, gap: 4 },
  makerName: { fontSize: 16, fontWeight: '700', lineHeight: 20 },
  makerPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start' },
  makerTotal: { fontSize: 12, marginTop: 2 },
  makerArrow: { paddingRight: 14, alignItems: 'center' },
});
`);

console.log('✅ gallery.tsx');
console.log('\nRun: npx expo start --clear');
console.log('\nNew features:');
console.log('GRID: Shows name + manufacturer + series + year + color + collector#');
console.log('SWIPE button -> Reels mode with beautiful full screen design');
console.log('MAKERS button -> Car Makers list grouped by brand');
console.log('  Each maker shows HW/MB count, tap "Play" -> swipe all cars from that maker');
