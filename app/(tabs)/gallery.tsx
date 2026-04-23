import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  SafeAreaView, Image, Dimensions, useColorScheme,
  StatusBar, Platform, StyleSheet
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars } from '../../lib/storage';

const { width: SW, height: SH } = Dimensions.get('window');
const CARD_W = (SW - 48) / 2;
const TABBAR_H = Platform.OS === 'ios' ? 84 : 60;

export default function GalleryScreen() {
  const [cars, setCars]         = useState([]);
  const [filter, setFilter]     = useState('all');
  const [mode, setMode]         = useState('grid');
  const [reelList, setReelList] = useState([]);
  const [reelTitle, setReelTitle] = useState('');
  const reelRef = useRef(null);
  const router  = useRouter();
  const dark    = useColorScheme() === 'dark';

  const BG     = dark ? '#0A0A0A' : '#F0EFEC';
  const CARD   = dark ? '#1C1C1E' : '#FFFFFF';
  const TEXT   = dark ? '#F2F2F7' : '#1C1C1E';
  const MUTED  = dark ? '#8E8E93' : '#6B6B6B';
  const BORDER = dark ? '#2C2C2E' : '#E5E5EA';
  const BG2    = dark ? '#2C2C2E' : '#EBEBEB';

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));

  const filtered = cars.filter(c => {
    if (filter === 'hw') return c.brand === 'hw';
    if (filter === 'mb') return c.brand === 'mb';
    if (filter === 'th') return c.th !== 'none';
    return true;
  });

  const makerMap = {};
  cars.forEach(c => {
    const m = c.manufacturer || (c.brand === 'hw' ? 'Hot Wheels Original' : 'Matchbox');
    if (!makerMap[m]) makerMap[m] = [];
    makerMap[m].push(c);
  });
  const makers = Object.entries(makerMap).sort((a, b) => b[1].length - a[1].length);

  function openReel(list, title, idx = 0) {
    setReelList(list);
    setReelTitle(title);
    setMode('reel');
    setTimeout(() => {
      try { reelRef.current?.scrollToIndex({ index: idx, animated: false }); } catch {}
    }, 80);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REEL ITEM — fixed height = SH, no ScrollView, everything fits inside
  // ─────────────────────────────────────────────────────────────────────────
  function ReelItem({ item: c, index }) {
    const brandCol = c.brand === 'hw' ? '#D85A30' : '#185FA5';
    const TOPBAR_H = Platform.OS === 'ios' ? 96 : 56;   // top bar (grid btn + title + +)
    const PHOTO_H  = SW * 1.0;                           // photo square-ish
    const INFO_H   = SH - TOPBAR_H - PHOTO_H;           // everything else

    return (
      <View style={{ width: SW, height: SH, backgroundColor: '#0D0D0D' }}>

        {/* ── ZONE 1: TOP BAR — sits at top, no overlap ─────────────── */}
        {/* (rendered in REEL MODE as absolute overlay — handled outside) */}

        {/* ── ZONE 2: CAR NAME STRIP — just below top bar ───────────── */}
        <View style={{
          position: 'absolute',
          top: TOPBAR_H,
          left: 0, right: 0,
          paddingHorizontal: 18,
          paddingTop: 10,
          paddingBottom: 8,
          backgroundColor: '#0D0D0D',
          zIndex: 1,
        }}>
          {/* Brand / TH badges */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
            <View style={[st.badge, { backgroundColor: brandCol }]}>
              <Text style={st.badgeTxt}>{c.brand === 'hw' ? '🔥 Hot Wheels' : '🚙 Matchbox'}</Text>
            </View>
            {c.th === 'sth' && <View style={[st.badge, { backgroundColor: '#BA7517' }]}><Text style={st.badgeTxt}>🌟 Super TH</Text></View>}
            {c.th === 'th'  && <View style={[st.badge, { backgroundColor: '#3B6D11' }]}><Text style={st.badgeTxt}>⭐ TH</Text></View>}
            {c.status === 'wish' && <View style={[st.badge, { backgroundColor: 'rgba(24,95,165,0.8)' }]}><Text style={st.badgeTxt}>♡ Wishlist</Text></View>}
            {c.status === 'dup'  && <View style={[st.badge, { backgroundColor: '#8B1A1A' }]}><Text style={st.badgeTxt}>2× Dupe</Text></View>}
          </View>
          <Text style={st.carName} numberOfLines={2}>{c.name}</Text>
          {!!c.manufacturer && (
            <Text style={[st.makerName, { color: c.brand === 'hw' ? '#FF9060' : '#78B4FF' }]} numberOfLines={1}>{c.manufacturer}</Text>
          )}
        </View>

        {/* ── ZONE 3: PHOTO ──────────────────────────────────────────── */}
        <View style={{
          position: 'absolute',
          top: TOPBAR_H + 88,   // below name strip
          left: 0, right: 0,
          height: PHOTO_H,
          backgroundColor: '#161616',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {c.photo ? (
            <>
              <Image source={{ uri: c.photo }} style={StyleSheet.absoluteFill} resizeMode="cover" blurRadius={20} />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.38)' }]} />
              <Image source={{ uri: c.photo }} style={{ width: SW - 16, height: PHOTO_H - 16 }} resizeMode="contain" />
            </>
          ) : (
            <Text style={{ fontSize: 90 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
          )}
          {/* counter */}
          <View style={st.counter}>
            <Text style={st.counterTxt}>{index + 1} / {reelList.length}</Text>
          </View>
        </View>

        {/* ── ZONE 4: INFO PANEL — fills the rest at bottom ─────────── */}
        <View style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          top: TOPBAR_H + 88 + PHOTO_H,
          backgroundColor: '#0D0D0D',
          paddingHorizontal: 14,
          paddingTop: 14,
          paddingBottom: Platform.OS === 'ios' ? 30 : 16,
        }}>
          {/* Info grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {c.series && (
              <View style={[st.infoBox, { flex: 2, minWidth: '45%' }]}>
                <Text style={st.infoLbl}>SERIES</Text>
                <Text style={st.infoVal} numberOfLines={2}>{c.series}</Text>
              </View>
            )}
            {c.year && (
              <View style={[st.infoBox, { flex: 1, minWidth: '28%' }]}>
                <Text style={st.infoLbl}>YEAR</Text>
                <Text style={st.infoVal}>{c.year}</Text>
              </View>
            )}
            {c.color && (
              <View style={[st.infoBox, { flex: 1, minWidth: '28%' }]}>
                <Text style={st.infoLbl}>COLOR</Text>
                <Text style={st.infoVal} numberOfLines={1}>{c.color}</Text>
              </View>
            )}
            {c.colnum && (
              <View style={[st.infoBox, { flex: 1, minWidth: '28%', backgroundColor: 'rgba(24,95,165,0.25)', borderColor: 'rgba(78,140,220,0.35)' }]}>
                <Text style={[st.infoLbl, { color: '#5090CC' }]}>COL #</Text>
                <Text style={[st.infoVal, { color: '#78B4FF' }]}>{c.colnum}</Text>
              </View>
            )}
            {c.tampo && (
              <View style={[st.infoBox, { flex: 2, minWidth: '45%' }]}>
                <Text style={st.infoLbl}>TAMPO</Text>
                <Text style={st.infoVal} numberOfLines={1}>{c.tampo}</Text>
              </View>
            )}
          </View>

          {/* Notes */}
          {!!c.notes && (
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 17, marginBottom: 8 }} numberOfLines={2}>{c.notes}</Text>
          )}

          {/* Status + Edit row */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 'auto' }}>
            <View style={[st.statusBox, {
              backgroundColor: c.status === 'owned' ? 'rgba(59,109,17,0.2)' : c.status === 'wish' ? 'rgba(24,95,165,0.2)' : 'rgba(139,26,26,0.2)',
              borderColor:     c.status === 'owned' ? 'rgba(59,109,17,0.4)' : c.status === 'wish' ? 'rgba(24,95,165,0.4)' : 'rgba(139,26,26,0.4)',
            }]}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.status === 'owned' ? '#5DB82A' : c.status === 'wish' ? '#5090D0' : '#D04040', marginRight: 7 }} />
              <Text style={{ color: c.status === 'owned' ? '#90E050' : c.status === 'wish' ? '#78B4FF' : '#FF8080', fontSize: 13, fontWeight: '700' }}>
                {c.status === 'owned' ? 'In Collection' : c.status === 'wish' ? 'On Wishlist' : 'Duplicate'}
              </Text>
            </View>
            <TouchableOpacity
              style={st.editBtn}
              onPress={() => { setMode('grid'); router.push({ pathname: '/car/[id]', params: { id: c.id } }); }}
            >
              <Ionicons name="pencil" size={14} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }


  // ── REEL MODE ──────────────────────────────────────────────────────────────
  if (mode === 'reel') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
        <StatusBar barStyle="light-content" />

        {/* Top bar — fixed above everything, dark background so name doesn't clash */}
        <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 99, backgroundColor: '#0D0D0D' }}>
          <View style={st.topBar}>
            <TouchableOpacity style={st.topBarBtn} onPress={() => setMode('grid')}>
              <Ionicons name="grid-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={st.topBarPill}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 }}>{reelTitle}</Text>
            </View>
            <TouchableOpacity
              style={[st.topBarBtn, { backgroundColor: '#D85A30' }]}
              onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <FlatList
          ref={reelRef}
          data={reelList}
          keyExtractor={c => c.id}
          pagingEnabled
          snapToInterval={SH}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, i) => ({ length: SH, offset: SH * i, index: i })}
          renderItem={({ item, index }) => <ReelItem item={item} index={index} />}
        />

        {/* Swipe hint */}
        {reelList.length > 1 && (
          <View style={st.swipeHint}>
            <Ionicons name="chevron-up" size={14} color="rgba(255,255,255,0.25)" />
            <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>swipe up for next</Text>
          </View>
        )}
      </View>
    );
  }

  // ── MAKERS MODE ────────────────────────────────────────────────────────────
  if (mode === 'makers') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        <View style={[st.hdr, { backgroundColor: CARD, borderBottomColor: BORDER }]}>
          <TouchableOpacity onPress={() => setMode('grid')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="chevron-back" size={22} color={TEXT} />
            <View>
              <Text style={[st.hdrTitle, { color: TEXT }]}>CAR <Text style={{ color: '#D85A30' }}>MAKERS</Text></Text>
              <Text style={[st.hdrSub, { color: MUTED }]}>{makers.length} brands · {cars.length} total</Text>
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={makers}
          keyExtractor={([m]) => m}
          contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 120 }}
          renderItem={({ item: [maker, mcars] }) => {
            const sample = mcars.find(c => c.photo);
            const hw = mcars.filter(c => c.brand === 'hw').length;
            const mb = mcars.filter(c => c.brand === 'mb').length;
            const th = mcars.filter(c => c.th !== 'none').length;
            return (
              <TouchableOpacity
                style={[st.makerRow, { backgroundColor: CARD, borderColor: BORDER }]}
                onPress={() => openReel(mcars, maker.toUpperCase())}
                activeOpacity={0.82}
              >
                <View style={{ position: 'relative' }}>
                  {sample?.photo
                    ? <Image source={{ uri: sample.photo }} style={st.makerImg} resizeMode="cover" />
                    : <View style={[st.makerImg, { backgroundColor: BG2, alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={{ fontSize: 28 }}>🚗</Text>
                      </View>
                  }
                  <View style={[st.makerBubble, { backgroundColor: '#D85A30' }]}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{mcars.length}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, paddingLeft: 14, gap: 5 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: TEXT }}>{maker}</Text>
                  <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                    {hw > 0 && <View style={[st.mkBadge, { backgroundColor: '#FAECE7' }]}><Text style={{ fontSize: 11, color: '#993C1D', fontWeight: '700' }}>🔥 {hw} HW</Text></View>}
                    {mb > 0 && <View style={[st.mkBadge, { backgroundColor: '#E6F1FB' }]}><Text style={{ fontSize: 11, color: '#0C447C', fontWeight: '700' }}>🚙 {mb} MB</Text></View>}
                    {th > 0 && <View style={[st.mkBadge, { backgroundColor: '#EAF3DE' }]}><Text style={{ fontSize: 11, color: '#3B6D11', fontWeight: '700' }}>⭐ {th} TH</Text></View>}
                  </View>
                </View>
                <View style={{ paddingRight: 14, alignItems: 'center', gap: 3 }}>
                  <View style={[st.playBtn, { backgroundColor: '#D85A30' }]}>
                    <Ionicons name="play" size={14} color="#fff" />
                  </View>
                  <Text style={{ fontSize: 10, color: MUTED }}>Swipe</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={[st.hdr, { backgroundColor: CARD, borderBottomColor: BORDER }]}>
        <View>
          <Text style={[st.hdrTitle, { color: TEXT }]}>PHOTO <Text style={{ color: '#D85A30' }}>GALLERY</Text></Text>
          <Text style={[st.hdrSub, { color: MUTED }]}>{filtered.length} cars</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[st.hdrBtn, { backgroundColor: BG2, borderColor: BORDER }]} onPress={() => setMode('makers')}>
            <Ionicons name="business-outline" size={15} color={TEXT} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: TEXT }}>Makers</Text>
          </TouchableOpacity>
          {filtered.length > 0 && (
            <TouchableOpacity style={[st.hdrBtn, { backgroundColor: '#D85A30', borderColor: '#D85A30' }]} onPress={() => openReel(filtered, 'ALL CARS')}>
              <Ionicons name="play" size={13} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Swipe</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 0.5, backgroundColor: CARD, borderBottomColor: BORDER }}>
        {[{ k: 'all', l: 'All' }, { k: 'hw', l: '🔥 HW' }, { k: 'mb', l: '🚙 MB' }, { k: 'th', l: '⭐ TH' }].map(f => (
          <TouchableOpacity
            key={f.k}
            style={[st.filterChip, { backgroundColor: BG2, borderColor: BORDER }, filter === f.k && { backgroundColor: '#D85A30', borderColor: '#D85A30' }]}
            onPress={() => setFilter(f.k)}
          >
            <Text style={[{ fontSize: 12, fontWeight: '600', color: MUTED }, filter === f.k && { color: '#fff' }]}>{f.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: 120 }}
        columnWrapperStyle={{ gap: 12 }}
        ListEmptyComponent={
          <View style={{ paddingTop: 80, alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 64 }}>📸</Text>
            <Text style={{ fontSize: 22, fontWeight: '700', color: TEXT }}>No cars yet</Text>
            <Text style={{ fontSize: 14, color: MUTED }}>Add cars to see them here</Text>
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
            style={{ width: CARD_W, borderRadius: 16, overflow: 'hidden', backgroundColor: CARD, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: dark ? 0.3 : 0.08, shadowRadius: 8, elevation: 3 }}
            onPress={() => openReel(filtered, 'ALL CARS', index)}
            activeOpacity={0.88}
          >
            {c.photo
              ? <Image source={{ uri: c.photo }} style={{ width: '100%', height: CARD_W }} resizeMode="cover" />
              : <View style={{ width: '100%', height: CARD_W, backgroundColor: BG2, alignItems: 'center', justifyContent: 'center' }}>
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
              <Text style={{ fontSize: 13, fontWeight: '700', color: TEXT }} numberOfLines={1}>{c.name}</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#D85A30' }} numberOfLines={1}>
                {c.manufacturer || (c.brand === 'hw' ? 'Hot Wheels' : 'Matchbox')}
              </Text>
              {!!c.series && <Text style={{ fontSize: 10, color: MUTED }} numberOfLines={1}>{c.series}</Text>}
              <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginTop: 2 }}>
                {!!c.year && <Text style={{ fontSize: 10, color: MUTED }}>{c.year}</Text>}
                {!!c.color && <Text style={{ fontSize: 10, color: MUTED }}>· {c.color}</Text>}
                {!!c.colnum && <Text style={{ fontSize: 10, color: '#185FA5', fontWeight: '600' }}>#{c.colnum}</Text>}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  // reel
  badge:       { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeTxt:    { color: '#fff', fontSize: 12, fontWeight: '700' },
  carName:     { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5, lineHeight: 32 },
  makerName:   { fontSize: 14, fontWeight: '600', marginTop: 2 },
  counter:     { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  counterTxt:  { color: '#fff', fontSize: 11, fontWeight: '700' },
  infoGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoBox:     { flex: 1, minWidth: '44%', backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12 },
  infoLbl:     { fontSize: 9, fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  infoVal:     { fontSize: 15, fontWeight: '700', color: '#fff' },
  statusBox:   { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 10, borderWidth: 0.5 },
  editBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D85A30', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10 },
  topBar:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  topBarBtn:   { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  topBarPill:  { backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  swipeHint:   { position: 'absolute', bottom: 95, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 4 },
  // shared
  hdr:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5 },
  hdrTitle:    { fontSize: 22, fontWeight: '800', letterSpacing: 0.3 },
  hdrSub:      { fontSize: 12, marginTop: 1 },
  hdrBtn:      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 0.5 },
  filterChip:  { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5 },
  makerRow:    { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 0.5, overflow: 'hidden' },
  makerImg:    { width: 88, height: 88 },
  makerBubble: { position: 'absolute', bottom: 5, right: 5, minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  mkBadge:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  playBtn:     { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
