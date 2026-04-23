#!/usr/bin/env node
const fs = require('fs');

fs.writeFileSync('app/(tabs)/gallery.tsx', `import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, Image, Dimensions, useColorScheme,
  StatusBar, Platform
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars } from '../../lib/storage';

const { width: SW, height: SH } = Dimensions.get('window');
const CARD_W = (SW - 48) / 2;
const CARD_H = CARD_W * 1.5;

export default function GalleryScreen() {
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState('all');
  const [mode, setMode] = useState('grid'); // 'grid' or 'reel'
  const [reelIndex, setReelIndex] = useState(0);
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const reelRef = useRef(null);

  const bg    = dark ? '#0F0F0F' : '#F2F1EE';
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

  // ── REEL ITEM (full screen vertical) ──────────────────────────────────────
  function ReelItem({ item: c, index }) {
    const isActive = index === reelIndex;
    return (
      <View style={s.reelItem}>
        {/* Background photo or gradient */}
        {c.photo
          ? <Image source={{ uri: c.photo }} style={s.reelBg} resizeMode="cover" blurRadius={12} />
          : <View style={[s.reelBgEmpty, { backgroundColor: c.brand === 'hw' ? '#1a0a00' : '#00102a' }]} />
        }
        {/* Dark overlay */}
        <View style={s.reelOverlay} />

        {/* Main photo */}
        <View style={s.reelPhotoWrap}>
          {c.photo
            ? <Image source={{ uri: c.photo }} style={s.reelPhoto} resizeMode="contain" />
            : <Text style={{ fontSize: 120 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
          }
        </View>

        {/* Info panel at bottom */}
        <View style={s.reelInfo}>
          {/* Brand + TH badges */}
          <View style={s.reelBadges}>
            <View style={[s.reelBadge, { backgroundColor: c.brand === 'hw' ? '#D85A30' : '#185FA5' }]}>
              <Text style={s.reelBadgeTxt}>{c.brand === 'hw' ? '🔥 Hot Wheels' : '🚙 Matchbox'}</Text>
            </View>
            {c.th === 'sth' && <View style={[s.reelBadge, { backgroundColor: '#BA7517' }]}><Text style={s.reelBadgeTxt}>🌟 Super TH</Text></View>}
            {c.th === 'th' && <View style={[s.reelBadge, { backgroundColor: '#3B6D11' }]}><Text style={s.reelBadgeTxt}>⭐ TH</Text></View>}
            {c.status === 'wish' && <View style={[s.reelBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}><Text style={s.reelBadgeTxt}>♡ Wishlist</Text></View>}
          </View>

          {/* Car name */}
          <Text style={s.reelName}>{c.name}</Text>

          {/* Manufacturer */}
          {!!c.manufacturer && (
            <Text style={s.reelMfg}>{c.manufacturer}</Text>
          )}

          {/* Details row */}
          <View style={s.reelDetails}>
            {!!c.series && (
              <View style={s.reelDetailChip}>
                <Ionicons name="layers-outline" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={s.reelDetailTxt}>{c.series}</Text>
              </View>
            )}
            {!!c.year && (
              <View style={s.reelDetailChip}>
                <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={s.reelDetailTxt}>{c.year}</Text>
              </View>
            )}
            {!!c.color && (
              <View style={s.reelDetailChip}>
                <Ionicons name="color-palette-outline" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={s.reelDetailTxt}>{c.color}</Text>
              </View>
            )}
            {!!c.colnum && (
              <View style={s.reelDetailChip}>
                <Ionicons name="pricetag-outline" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={s.reelDetailTxt}>#{c.colnum}</Text>
              </View>
            )}
          </View>

          {!!c.notes && (
            <Text style={s.reelNotes} numberOfLines={2}>{c.notes}</Text>
          )}
        </View>

        {/* Right side actions */}
        <View style={s.reelActions}>
          <TouchableOpacity
            style={s.reelAction}
            onPress={() => router.push({ pathname: '/car/[id]', params: { id: c.id } })}
          >
            <Ionicons name="pencil" size={22} color="#fff" />
            <Text style={s.reelActionTxt}>Edit</Text>
          </TouchableOpacity>
          <View style={s.reelAction}>
            <Text style={{ fontSize: 22 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
            <Text style={s.reelActionTxt}>{c.brand === 'hw' ? 'HW' : 'MB'}</Text>
          </View>
          {c.th !== 'none' && (
            <View style={s.reelAction}>
              <Text style={{ fontSize: 22 }}>{c.th === 'sth' ? '🌟' : '⭐'}</Text>
              <Text style={s.reelActionTxt}>{c.th === 'sth' ? 'STH' : 'TH'}</Text>
            </View>
          )}
        </View>

        {/* Swipe hint (first card only) */}
        {index === 0 && filtered.length > 1 && (
          <View style={s.swipeHint}>
            <Ionicons name="chevron-up" size={16} color="rgba(255,255,255,0.6)" />
            <Text style={s.swipeHintTxt}>Swipe up for next car</Text>
            <Ionicons name="chevron-up" size={16} color="rgba(255,255,255,0.6)" />
          </View>
        )}

        {/* Counter top right */}
        <View style={s.reelCounter}>
          <Text style={s.reelCounterTxt}>{index + 1} / {filtered.length}</Text>
        </View>
      </View>
    );
  }

  // ── GRID ITEM ──────────────────────────────────────────────────────────────
  function GridItem({ item: c, index }) {
    return (
      <TouchableOpacity
        style={[s.gridCard, { backgroundColor: card, width: CARD_W }]}
        onPress={() => { setReelIndex(index); setMode('reel'); }}
        activeOpacity={0.9}
      >
        {c.photo
          ? <Image source={{ uri: c.photo }} style={[s.gridImg, { height: CARD_W }]} resizeMode="cover" />
          : <View style={[s.gridImgEmpty, { height: CARD_W, backgroundColor: bg2 }]}>
              <Text style={{ fontSize: 44 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
            </View>
        }
        <View style={[s.gridBadge, { backgroundColor: c.brand === 'hw' ? '#D85A30' : '#185FA5' }]}>
          <Text style={s.gridBadgeTxt}>{c.brand === 'hw' ? 'HW' : 'MB'}</Text>
        </View>
        {c.th !== 'none' && (
          <View style={s.gridThBadge}>
            <Text style={{ fontSize: 11 }}>{c.th === 'sth' ? '🌟' : '⭐'}</Text>
          </View>
        )}
        <View style={s.gridInfo}>
          <Text style={[s.gridName, { color: text }]} numberOfLines={1}>{c.name}</Text>
          <Text style={[s.gridMfg, { color: '#D85A30' }]} numberOfLines={1}>
            {c.manufacturer || (c.brand === 'hw' ? 'Hot Wheels' : 'Matchbox')}
          </Text>
          {!!c.series && <Text style={[s.gridSeries, { color: muted }]} numberOfLines={1}>{c.series}</Text>}
          <View style={s.gridMeta}>
            {!!c.year && <Text style={[s.gridMetaTxt, { color: muted }]}>{c.year}</Text>}
            {!!c.color && <Text style={[s.gridMetaTxt, { color: muted }]}>{c.color}</Text>}
            {!!c.colnum && <Text style={[s.gridMetaTxt, { color: '#185FA5' }]}>#{c.colnum}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // ── REEL MODE (full screen vertical swipe) ─────────────────────────────────
  if (mode === 'reel') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar barStyle="light-content" hidden={Platform.OS === 'ios'} />
        {/* Close button */}
        <SafeAreaView style={s.reelTopBar}>
          <TouchableOpacity
            style={s.reelCloseBtn}
            onPress={() => setMode('grid')}
          >
            <Ionicons name="grid-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={s.reelTopTitle}>GALLERY</Text>
          <TouchableOpacity
            style={s.reelAddBtn}
            onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>

        <FlatList
          ref={reelRef}
          data={filtered}
          keyExtractor={c => c.id}
          vertical
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={SH}
          snapToAlignment="start"
          decelerationRate="fast"
          initialScrollIndex={reelIndex}
          getItemLayout={(_, i) => ({ length: SH, offset: SH * i, index: i })}
          onMomentumScrollEnd={e => {
            const i = Math.round(e.nativeEvent.contentOffset.y / SH);
            setReelIndex(i);
          }}
          renderItem={({ item, index }) => <ReelItem item={item} index={index} />}
        />
      </View>
    );
  }

  // ── GRID MODE ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      <View style={[s.header, { backgroundColor: card, borderBottomColor: border }]}>
        <View>
          <Text style={[s.headerTitle, { color: text }]}>PHOTO <Text style={{ color: '#D85A30' }}>GALLERY</Text></Text>
          <Text style={[s.headerSub, { color: muted }]}>{filtered.length} cars · tap to swipe</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {filtered.length > 0 && (
            <TouchableOpacity
              style={[s.reelModeBtn, { backgroundColor: '#D85A30' }]}
              onPress={() => { setReelIndex(0); setMode('reel'); }}
            >
              <Ionicons name="play" size={14} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>View All</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[s.headerAddBtn, { backgroundColor: dark ? '#2C2C2E' : '#F2F1EE' }]}
            onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
          >
            <Ionicons name="add" size={20} color={text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[s.filterRow, { backgroundColor: card, borderBottomColor: border }]}>
        {[
          { k: 'all', l: 'All' },
          { k: 'hw', l: '🔥 HW' },
          { k: 'mb', l: '🚙 MB' },
          { k: 'th', l: '⭐ TH' },
        ].map(f => (
          <TouchableOpacity
            key={f.k}
            style={[s.filterChip,
              { backgroundColor: bg2, borderColor: border },
              filter === f.k && { backgroundColor: '#D85A30', borderColor: '#D85A30' }
            ]}
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
            <Text style={[s.emptyTitle, { color: text }]}>No cars yet</Text>
            <Text style={[s.emptyMsg, { color: muted }]}>Add cars to see them here</Text>
            <TouchableOpacity
              style={s.emptyBtn}
              onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Add First Car</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, index }) => <GridItem item={item} index={index} />}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: 0.3 },
  headerSub: { fontSize: 12, marginTop: 1 },
  headerAddBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  reelModeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 0.5 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5 },
  filterChipTxt: { fontSize: 12, fontWeight: '500' },
  // Grid cards
  gridCard: { borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  gridImg: { width: '100%' },
  gridImgEmpty: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  gridBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8 },
  gridBadgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  gridThBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 8 },
  gridInfo: { padding: 10 },
  gridName: { fontSize: 14, fontWeight: '700', lineHeight: 18, marginBottom: 2 },
  gridMfg: { fontSize: 11, fontWeight: '600', marginBottom: 3 },
  gridSeries: { fontSize: 10, marginBottom: 4 },
  gridMeta: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  gridMetaTxt: { fontSize: 10 },
  // Reel mode
  reelItem: { width: SW, height: SH, position: 'relative', backgroundColor: '#000' },
  reelBg: { ...StyleSheet.absoluteFillObject },
  reelBgEmpty: { ...StyleSheet.absoluteFillObject },
  reelOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  reelPhotoWrap: { position: 'absolute', top: 80, left: 0, right: 80, bottom: 240, alignItems: 'center', justifyContent: 'center' },
  reelPhoto: { width: '90%', height: '90%' },
  reelInfo: { position: 'absolute', bottom: 0, left: 0, right: 80, padding: 20, paddingBottom: 40 },
  reelBadges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 10 },
  reelBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  reelBadgeTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  reelName: { fontSize: 28, fontWeight: '800', color: '#fff', lineHeight: 32, marginBottom: 4 },
  reelMfg: { fontSize: 16, fontWeight: '600', color: '#FF8A60', marginBottom: 10 },
  reelDetails: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 8 },
  reelDetailChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  reelDetailTxt: { color: '#fff', fontSize: 12, fontWeight: '500' },
  reelNotes: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18 },
  reelActions: { position: 'absolute', right: 12, bottom: 200, alignItems: 'center', gap: 20 },
  reelAction: { alignItems: 'center', gap: 4 },
  reelActionTxt: { color: '#fff', fontSize: 11, fontWeight: '600' },
  reelCounter: { position: 'absolute', top: 60, right: 16, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  reelCounterTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  swipeHint: { position: 'absolute', bottom: 110, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6 },
  swipeHintTxt: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  reelTopBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  reelTopTitle: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  reelCloseBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  reelAddBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#D85A30', alignItems: 'center', justifyContent: 'center' },
  empty: { paddingTop: 80, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 24, fontWeight: '700' },
  emptyMsg: { fontSize: 14, textAlign: 'center' },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D85A30', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
});
`);

console.log('✅ gallery.tsx - Instagram Reels style done!');
console.log('\nRun: npx expo start --clear');
console.log('\nHow it works:');
console.log('- GRID view: 2-column cards showing photo, name, manufacturer, series');
console.log('- Tap any card OR tap "View All" button -> Reels mode opens');
console.log('- SWIPE UP for next car, SWIPE DOWN for previous');
console.log('- Full screen: blurred background, big photo, all details');
console.log('- Shows: brand badge, TH badge, name, manufacturer, series, year, color, collector #');
console.log('- Tap grid icon (top left) to go back to grid view');
