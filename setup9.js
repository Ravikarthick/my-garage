#!/usr/bin/env node
const fs = require('fs');

// ─── 1. THEME with proper dark mode ────────────────────────────────────────
fs.writeFileSync('lib/theme.ts', `
import { useColorScheme } from 'react-native';

export function useTheme() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  return {
    dark,
    bg:      dark ? '#141414' : '#FFFFFF',
    bg2:     dark ? '#1E1E1E' : '#F5F4F1',
    bg3:     dark ? '#2A2A2A' : '#EEEDEA',
    card:    dark ? '#1E1E1E' : '#FFFFFF',
    text:    dark ? '#F0EFE8' : '#1A1A18',
    muted:   dark ? '#A0A09A' : '#6B6B67',
    hint:    dark ? '#6A6A64' : '#A0A09C',
    border:  dark ? '#2E2E2E' : '#E0DEDA',
    border2: dark ? '#3E3E3E' : '#CCCBC6',
    red:     '#D85A30',
    redL:    dark ? '#3A1A0E' : '#FAECE7',
    redD:    dark ? '#F08060' : '#993C1D',
    blue:    '#185FA5',
    blueL:   dark ? '#0A1E35' : '#E6F1FB',
    blueD:   dark ? '#5090D0' : '#0C447C',
    green:   '#3B6D11',
    greenL:  dark ? '#142008' : '#EAF3DE',
    amber:   '#BA7517',
    amberL:  dark ? '#2A1C04' : '#FAEEDA',
  };
}

// Static colors (for StyleSheet.create which runs outside components)
export const C = {
  red: '#D85A30', redL: '#FAECE7', redD: '#993C1D',
  blue: '#185FA5', blueL: '#E6F1FB', blueD: '#0C447C',
  green: '#3B6D11', greenL: '#EAF3DE',
  amber: '#BA7517', amberL: '#FAEEDA',
};
`);
console.log('✅ lib/theme.ts');

// ─── 2. COMPREHENSIVE SERIES DATA 2010-2026 ─────────────────────────────────
fs.writeFileSync('lib/seriesData.ts', `
export interface SeriesItem { label: string; group: string; }

export const HW_SERIES: SeriesItem[] = [
  // ── MAINLINE CURRENT (2020-2026) ──────────────────────────────────────
  { label: 'Mainline', group: '📦 Mainline' },
  { label: 'New Models', group: '📦 Mainline' },
  { label: 'Factory Fresh', group: '📦 Mainline' },
  { label: 'HW Exotics', group: '📦 Mainline' },
  { label: 'HW Race Day', group: '📦 Mainline' },
  { label: 'HW Daredevils', group: '📦 Mainline' },
  { label: 'HW City', group: '📦 Mainline' },
  { label: 'HW Screen Time', group: '📦 Mainline' },
  { label: 'HW Dream Garage', group: '📦 Mainline' },
  { label: 'HW Modified', group: '📦 Mainline' },
  { label: 'HW Green Speed', group: '📦 Mainline' },
  { label: 'HW First Response', group: '📦 Mainline' },
  { label: 'HW Fast Transit', group: '📦 Mainline' },
  { label: 'HW Roadsters', group: '📦 Mainline' },
  { label: 'HW Turbo', group: '📦 Mainline' },
  { label: 'HW Xtreme Sports', group: '📦 Mainline' },
  { label: 'HW Mega Bite', group: '📦 Mainline' },
  { label: 'HW Art Cars', group: '📦 Mainline' },
  { label: 'HW Hot Trucks', group: '📦 Mainline' },
  { label: 'HW J-Imports', group: '📦 Mainline' },
  { label: 'HW Reverse Rake', group: '📦 Mainline' },
  { label: 'HW Haulers', group: '📦 Mainline' },
  { label: 'HW Drift', group: '📦 Mainline' },
  { label: 'HW Flames', group: '📦 Mainline' },
  { label: 'HW Slammed', group: '📦 Mainline' },
  { label: 'HW Baja Blazers', group: '📦 Mainline' },
  { label: 'HW Moto', group: '📦 Mainline' },
  { label: 'HW Metro', group: '📦 Mainline' },
  { label: 'HW Gassers', group: '📦 Mainline' },
  { label: 'HW Track Champs', group: '📦 Mainline' },
  { label: 'HW 55 Race Team', group: '📦 Mainline' },
  { label: 'HW Drag Strip', group: '📦 Mainline' },
  { label: 'HW Speed Graphics', group: '📦 Mainline' },
  { label: 'HW Celebration Racers', group: '📦 Mainline' },
  { label: 'HW Road Trippin', group: '📦 Mainline' },
  { label: 'HW Ride-Ons', group: '📦 Mainline' },
  { label: 'HW Fast Foodie', group: '📦 Mainline' },
  { label: 'HW Checkmate', group: '📦 Mainline' },
  { label: 'HW Rescue', group: '📦 Mainline' },
  { label: 'HW Snow Stormers', group: '📦 Mainline' },
  { label: 'HW The 80s', group: '📦 Mainline' },
  { label: 'HW The 70s', group: '📦 Mainline' },
  { label: 'Compact Kings', group: '📦 Mainline' },
  { label: 'Rod Squad', group: '📦 Mainline' },
  { label: 'Experimotors', group: '📦 Mainline' },
  { label: 'Sweet Rides', group: '📦 Mainline' },
  { label: 'Sky Show', group: '📦 Mainline' },
  { label: 'Mud Studs', group: '📦 Mainline' },
  { label: 'Muscle Mania', group: '📦 Mainline' },
  { label: 'Batman', group: '📦 Mainline' },
  { label: 'Brick Rides', group: '📦 Mainline' },
  { label: 'X-Raycers', group: '📦 Mainline' },
  { label: 'Neon Speeders', group: '📦 Mainline' },
  { label: 'Ultra Hots', group: '📦 Mainline' },
  { label: 'Color Reveal', group: '📦 Mainline' },
  { label: 'Mystery Models', group: '📦 Mainline' },
  // ── MAINLINE OLDER (2010-2019) ────────────────────────────────────────
  { label: 'HW City Works', group: '📦 Mainline 2010-2019' },
  { label: 'HW Showroom', group: '📦 Mainline 2010-2019' },
  { label: 'HW Workshop', group: '📦 Mainline 2010-2019' },
  { label: 'HW Imagination', group: '📦 Mainline 2010-2019' },
  { label: 'HW Stunt', group: '📦 Mainline 2010-2019' },
  { label: 'HW Racing', group: '📦 Mainline 2010-2019' },
  { label: 'HW Performance', group: '📦 Mainline 2010-2019' },
  { label: 'HW Mild to Wild', group: '📦 Mainline 2010-2019' },
  { label: 'HW Off-Road', group: '📦 Mainline 2010-2019' },
  { label: 'HW Trucks', group: '📦 Mainline 2010-2019' },
  { label: 'HW Motorcycles', group: '📦 Mainline 2010-2019' },
  { label: 'HW Space', group: '📦 Mainline 2010-2019' },
  { label: 'HW Formula Solar', group: '📦 Mainline 2010-2019' },
  { label: 'HW Surf Patrol', group: '📦 Mainline 2010-2019' },
  { label: 'HW Video Game Heroes', group: '📦 Mainline 2010-2019' },
  { label: 'HW Rescue Squad', group: '📦 Mainline 2010-2019' },
  { label: 'HW Fire', group: '📦 Mainline 2010-2019' },
  { label: 'HW Street', group: '📦 Mainline 2010-2019' },
  { label: 'HW Muscle Mania', group: '📦 Mainline 2010-2019' },
  { label: 'Then and Now', group: '📦 Mainline 2010-2019' },
  { label: 'Track Stars', group: '📦 Mainline 2010-2019' },
  { label: 'Thrill Racers', group: '📦 Mainline 2010-2019' },
  { label: 'Team Hot Wheels', group: '📦 Mainline 2010-2019' },
  { label: 'Tooned', group: '📦 Mainline 2010-2019' },
  { label: 'Heat Fleet', group: '📦 Mainline 2010-2019' },
  { label: 'Sport Track', group: '📦 Mainline 2010-2019' },
  { label: 'Custom Classics', group: '📦 Mainline 2010-2019' },
  { label: 'Muscle Spectraflame', group: '📦 Mainline 2010-2019' },
  { label: 'Rapid Transit', group: '📦 Mainline 2010-2019' },
  // ── FAN DRIVEN ────────────────────────────────────────────────────────
  { label: 'HW Fan Driven', group: '⭐ Fan Driven' },
  { label: 'Fan Driven', group: '⭐ Fan Driven' },
  // ── GOLD LABEL PREMIUM ────────────────────────────────────────────────
  { label: 'Car Culture', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Exotic Envy', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Japan Historics', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Japan Historics 2', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Japan Historics 3', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Japan Historics 4', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Race Day', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Slide Street', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Slide Street 2', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - World Tour', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Terra Trek', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Modern Classics', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Drag Strip Demons', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Trucks', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - American Scene', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Cargo Carriers', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Team Transport', group: '🥇 Gold Label Premium' },
  { label: "Car Culture - Jay Leno's Garage", group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Eurospeed', group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - 2-Pack', group: '🥇 Gold Label Premium' },
  { label: 'Boulevard', group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture', group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - Fast and Furious', group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - Mario Kart', group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - Star Wars', group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - DC Comics', group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - Marvel', group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - Entertainment', group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - Retro Entertainment', group: '🥇 Gold Label Premium' },
  { label: 'Premium Display Set', group: '🥇 Gold Label Premium' },
  // ── SILVER LABEL PREMIUM ──────────────────────────────────────────────
  { label: 'Vintage Racing Club', group: '🥈 Silver Label Premium' },
  { label: 'Automotive Celebrations', group: '🥈 Silver Label Premium' },
  { label: 'Neon Speeders Premium', group: '🥈 Silver Label Premium' },
  { label: 'Fast and Furious - Silver', group: '🥈 Silver Label Premium' },
  { label: 'Themed 6-Pack', group: '🥈 Silver Label Premium' },
  // ── ULTRA PREMIUM ─────────────────────────────────────────────────────
  { label: 'Red Line Club (RLC)', group: '💎 Ultra Premium' },
  { label: 'Elite 64', group: '💎 Ultra Premium' },
  { label: 'Collector Edition', group: '💎 Ultra Premium' },
  { label: 'Convention Exclusive', group: '💎 Ultra Premium' },
  { label: 'Mattel Creations Exclusive', group: '💎 Ultra Premium' },
  // ── PREMIUM 2010-2016 ─────────────────────────────────────────────────
  { label: 'Hot Wheels Garage', group: '🏆 Premium 2010-2016' },
  { label: 'Vintage Racing', group: '🏆 Premium 2010-2016' },
  { label: 'Heritage Real Riders', group: '🏆 Premium 2010-2016' },
  { label: 'Heritage Redline', group: '🏆 Premium 2010-2016' },
  { label: 'Boulevard 2012', group: '🏆 Premium 2010-2016' },
  { label: 'Boulevard 2013', group: '🏆 Premium 2010-2016' },
  { label: 'Porsche Series 2015', group: '🏆 Premium 2010-2016' },
  { label: 'BMW Series 2016', group: '🏆 Premium 2010-2016' },
  { label: 'Fast and Furious 2013', group: '🏆 Premium 2010-2016' },
  { label: 'Fast and Furious 2014', group: '🏆 Premium 2010-2016' },
  // ── RETRO / VINTAGE ───────────────────────────────────────────────────
  { label: 'Retro Entertainment', group: '📼 Retro / Vintage' },
  { label: 'First Editions', group: '📼 Retro / Vintage' },
  { label: 'Treasure Hunt Series', group: '📼 Retro / Vintage' },
  { label: 'Redline Era 1968-1977', group: '📼 Retro / Vintage' },
  { label: 'Flying Colors Era 1977-1981', group: '📼 Retro / Vintage' },
  { label: 'Blackwall Era 1979-1988', group: '📼 Retro / Vintage' },
  { label: 'Real Riders Era 1983-1989', group: '📼 Retro / Vintage' },
  { label: 'Color Racers', group: '📼 Retro / Vintage' },
  { label: 'Blue Card', group: '📼 Retro / Vintage' },
  // ── MATCHBOX ──────────────────────────────────────────────────────────
  { label: 'Matchbox Mainline', group: '🚙 Matchbox' },
  { label: 'Matchbox Moving Parts', group: '🚙 Matchbox' },
  { label: 'Matchbox Collector Series', group: '🚙 Matchbox' },
  { label: 'Matchbox Superfast', group: '🚙 Matchbox' },
  { label: 'Matchbox Sky Busters', group: '🚙 Matchbox' },
  { label: 'Matchbox Working Rigs', group: '🚙 Matchbox' },
  { label: 'Matchbox Premium', group: '🚙 Matchbox' },
  { label: 'Matchbox Globe Travelers', group: '🚙 Matchbox' },
  { label: 'Matchbox Power Grabs', group: '🚙 Matchbox' },
  { label: 'Matchbox Hitch and Haul', group: '🚙 Matchbox' },
  { label: 'Matchbox Convoys', group: '🚙 Matchbox' },
];

export const HW_SERIES_GROUPS = [...new Set(HW_SERIES.map(s => s.group))];

export function searchSeries(query: string): SeriesItem[] {
  if (!query) return HW_SERIES;
  const q = query.toLowerCase();
  return HW_SERIES.filter(s =>
    s.label.toLowerCase().includes(q) || s.group.toLowerCase().includes(q)
  );
}
`);
console.log('✅ lib/seriesData.ts - 150+ series');

// ─── 3. REDESIGNED GALLERY with swipe ──────────────────────────────────────
fs.writeFileSync('app/(tabs)/gallery.tsx', `import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, Image, Dimensions, Modal, ScrollView,
  useColorScheme
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars, Car } from '../../lib/storage';
import { useTheme } from '../../lib/theme';

const { width: SW, height: SH } = Dimensions.get('window');
const CARD_W = (SW - 48) / 2;

export default function GalleryScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filter, setFilter] = useState<'all'|'hw'|'mb'|'th'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSwipe, setShowSwipe] = useState(false);
  const router = useRouter();
  const T = useTheme();
  const swipeRef = useRef<FlatList>(null);

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));

  const filtered = cars.filter(c => {
    if (filter === 'hw') return c.brand === 'hw';
    if (filter === 'mb') return c.brand === 'mb';
    if (filter === 'th') return c.th !== 'none';
    return true;
  });

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'hw', label: '🔥 Hot Wheels' },
    { key: 'mb', label: '🚙 Matchbox' },
    { key: 'th', label: '⭐ TH Only' },
  ] as const;

  function openSwipe(index: number) {
    setSelectedIndex(index);
    setShowSwipe(true);
    setTimeout(() => {
      swipeRef.current?.scrollToIndex({ index, animated: false });
    }, 100);
  }

  function renderCard({ item: c, index }: { item: Car; index: number }) {
    return (
      <TouchableOpacity
        style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}
        onPress={() => openSwipe(index)}
        activeOpacity={0.88}
      >
        <View style={s.photoWrap}>
          {c.photo
            ? <Image source={{ uri: c.photo }} style={s.photo} resizeMode="cover"/>
            : <View style={[s.placeholder, { backgroundColor: T.bg3 }]}>
                <Text style={s.placeholderEmoji}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
              </View>
          }
          {c.status === 'wish' && (
            <View style={s.wishBadge}><Text style={{ color: '#fff', fontSize: 12 }}>♡</Text></View>
          )}
          {c.th !== 'none' && (
            <View style={[s.thBadge, c.th === 'sth' && { backgroundColor: '#FAEEDA' }]}>
              <Text style={{ fontSize: 11 }}>{c.th === 'sth' ? '🌟' : '⭐'}</Text>
            </View>
          )}
          <View style={[s.brandBadge, { backgroundColor: c.brand === 'hw' ? '#D85A30' : '#185FA5' }]}>
            <Text style={s.brandBadgeTxt}>{c.brand === 'hw' ? 'HW' : 'MB'}</Text>
          </View>
        </View>
        <View style={s.cardBody}>
          <Text style={[s.cardName, { color: T.text }]} numberOfLines={2}>{c.name}</Text>
          {!!c.manufacturer && <Text style={[s.cardMfg, { color: T.dark ? '#F08060' : '#D85A30' }]} numberOfLines={1}>{c.manufacturer}</Text>}
          <View style={s.cardRow}>
            {!!c.year && <View style={[s.chip, { backgroundColor: T.bg3 }]}><Text style={[s.chipTxt, { color: T.muted }]}>{c.year}</Text></View>}
            {!!c.color && <View style={[s.chip, { backgroundColor: T.bg3 }]}><Text style={[s.chipTxt, { color: T.muted }]}>{c.color}</Text></View>}
          </View>
          {!!c.series && <Text style={[s.cardSeries, { color: T.hint }]} numberOfLines={1}>{c.series}</Text>}
          {!!c.colnum && <Text style={[s.cardColnum, { color: T.blue }]}>#{c.colnum}</Text>}
        </View>
      </TouchableOpacity>
    );
  }

  function renderSwipeItem({ item: c }: { item: Car }) {
    const fields = [
      c.manufacturer && ['Manufacturer', c.manufacturer],
      c.series && ['Series', c.series],
      c.year && ['Year', c.year],
      c.color && ['Color', c.color],
      c.colnum && ['Collector #', c.colnum],
      c.tampo && ['Tampo', c.tampo],
      c.status === 'dup' && ['Status', 'Duplicate'],
    ].filter(Boolean) as [string, string][];

    return (
      <View style={{ width: SW }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {c.photo
            ? <Image source={{ uri: c.photo }} style={[s.swipePhoto, { backgroundColor: T.bg3 }]} resizeMode="contain"/>
            : <View style={[s.swipePlaceholder, { backgroundColor: T.bg3 }]}>
                <Text style={{ fontSize: 80 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
              </View>
          }
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <View style={[s.swipeBrandBadge, { backgroundColor: c.brand === 'hw' ? '#D85A30' : '#185FA5' }]}>
                <Text style={s.swipeBrandTxt}>{c.brand === 'hw' ? 'Hot Wheels' : 'Matchbox'}</Text>
              </View>
              {c.th === 'sth' && <View style={[s.swipeBrandBadge, { backgroundColor: '#BA7517' }]}><Text style={s.swipeBrandTxt}>🌟 Super TH</Text></View>}
              {c.th === 'th' && <View style={[s.swipeBrandBadge, { backgroundColor: '#3B6D11' }]}><Text style={s.swipeBrandTxt}>⭐ Treasure Hunt</Text></View>}
            </View>
            <Text style={[s.swipeName, { color: T.text }]}>{c.name}</Text>
            {!!c.manufacturer && <Text style={{ color: T.dark ? '#F08060' : '#D85A30', fontSize: 15, fontWeight: '600', marginBottom: 12 }}>{c.manufacturer}</Text>}
            <View style={[s.swipeGrid]}>
              {fields.map(([l, v]) => (
                <View key={l} style={[s.swipeField, { backgroundColor: T.bg2 }]}>
                  <Text style={[s.swipeFL, { color: T.hint }]}>{l}</Text>
                  <Text style={[s.swipeFV, { color: T.text }]}>{v}</Text>
                </View>
              ))}
            </View>
            {!!c.notes && (
              <View style={[s.swipeNotes, { backgroundColor: T.bg2 }]}>
                <Text style={[{ fontSize: 13, color: T.muted, lineHeight: 20 }]}>{c.notes}</Text>
              </View>
            )}
            <TouchableOpacity
              style={[s.swipeEditBtn, { backgroundColor: T.dark ? '#D85A30' : '#D85A30' }]}
              onPress={() => { setShowSwipe(false); router.push({ pathname: '/car/[id]', params: { id: c.id } }); }}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Edit Car</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg2 }]}>
      <View style={[s.header, { backgroundColor: T.bg, borderBottomColor: T.border }]}>
        <Text style={[s.title, { color: T.text }]}>PHOTO <Text style={{ color: '#D85A30' }}>GALLERY</Text></Text>
        <Text style={[s.count, { color: T.muted }]}>{filtered.length} cars</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[s.filterBar, { backgroundColor: T.bg, borderBottomColor: T.border }]} contentContainerStyle={{ padding: 10, gap: 8, flexDirection: 'row' }}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[s.filterPill, { backgroundColor: T.bg2, borderColor: T.border }, filter === f.key && { backgroundColor: '#D85A30', borderColor: '#D85A30' }]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[s.filterTxt, { color: T.muted }, filter === f.key && { color: '#fff' }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12, paddingBottom: 100, gap: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 56, marginBottom: 12 }}>📸</Text>
            <Text style={[s.emptyTitle, { color: T.text }]}>No cars yet</Text>
            <Text style={[s.emptyMsg, { color: T.muted }]}>Add cars to see them here!</Text>
            <TouchableOpacity
              style={[s.emptyBtn, { backgroundColor: '#D85A30' }]}
              onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Add First Car</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={renderCard}
      />

      {/* Swipe Modal */}
      <Modal visible={showSwipe} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={[s.swipeModal, { backgroundColor: T.bg }]}>
          <View style={[s.swipeHeader, { backgroundColor: T.bg, borderBottomColor: T.border }]}>
            <TouchableOpacity onPress={() => setShowSwipe(false)} style={{ padding: 8 }}>
              <Ionicons name="chevron-down" size={24} color={T.text} />
            </TouchableOpacity>
            <Text style={[s.swipeHeaderTitle, { color: T.text }]}>{selectedIndex + 1} / {filtered.length}</Text>
            <View style={{ width: 40 }} />
          </View>
          <FlatList
            ref={swipeRef}
            data={filtered}
            keyExtractor={c => c.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const i = Math.round(e.nativeEvent.contentOffset.x / SW);
              setSelectedIndex(i);
            }}
            renderItem={renderSwipeItem}
            getItemLayout={(_, index) => ({ length: SW, offset: SW * index, index })}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5 },
  title: { fontSize: 24, fontWeight: '700' },
  count: { fontSize: 13 },
  filterBar: { borderBottomWidth: 0.5, maxHeight: 52 },
  filterPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5 },
  filterTxt: { fontSize: 13, fontWeight: '500' },
  card: { width: CARD_W, borderRadius: 16, overflow: 'hidden', borderWidth: 0.5 },
  photoWrap: { width: '100%', height: CARD_W, position: 'relative' },
  photo: { width: '100%', height: '100%' },
  placeholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  placeholderEmoji: { fontSize: 44 },
  wishBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 10, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  thBadge: { position: 'absolute', top: 8, right: 34, backgroundColor: '#EAF3DE', borderRadius: 10, paddingHorizontal: 5, paddingVertical: 1 },
  brandBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  brandBadgeTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },
  cardBody: { padding: 10 },
  cardName: { fontSize: 14, fontWeight: '700', lineHeight: 18, marginBottom: 3 },
  cardMfg: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  cardRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', marginBottom: 3 },
  chip: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  chipTxt: { fontSize: 10 },
  cardSeries: { fontSize: 10, marginBottom: 2 },
  cardColnum: { fontSize: 11, fontWeight: '600' },
  empty: { paddingTop: 80, alignItems: 'center', gap: 10 },
  emptyTitle: { fontSize: 22, fontWeight: '700' },
  emptyMsg: { fontSize: 14, textAlign: 'center' },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
  // Swipe Modal
  swipeModal: { flex: 1 },
  swipeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 0.5 },
  swipeHeaderTitle: { fontSize: 15, fontWeight: '600' },
  swipePhoto: { width: SW, height: SW * 0.75 },
  swipePlaceholder: { width: SW, height: SW * 0.75, alignItems: 'center', justifyContent: 'center' },
  swipeName: { fontSize: 26, fontWeight: '700', lineHeight: 30, marginBottom: 4, marginTop: 8 },
  swipeBrandBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  swipeBrandTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  swipeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  swipeField: { borderRadius: 10, padding: 10, minWidth: '45%', flex: 1 },
  swipeFL: { fontSize: 11, marginBottom: 2 },
  swipeFV: { fontSize: 15, fontWeight: '600' },
  swipeNotes: { borderRadius: 10, padding: 12, marginBottom: 14 },
  swipeEditBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12 },
});
`);
console.log('✅ app/(tabs)/gallery.tsx - swipeable gallery');

// ─── 4. FIXED WISHLIST with add button ─────────────────────────────────────
fs.writeFileSync('app/(tabs)/wishlist.tsx', `import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { loadCars, Car } from '../../lib/storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import CarCard from '../../components/CarCard';

export default function WishlistScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const router = useRouter();
  const T = useTheme();

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));

  const wishlist = cars.filter(c => c.status === 'wish');

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]}>
      <View style={[s.header, { backgroundColor: T.bg, borderBottomColor: T.border }]}>
        <View>
          <Text style={[s.title, { color: T.text }]}>WISH <Text style={{ color: '#D85A30' }}>LIST</Text></Text>
          <Text style={[s.subtitle, { color: T.muted }]}>{wishlist.length} cars you want</Text>
        </View>
        <TouchableOpacity
          style={[s.addBtn, { backgroundColor: '#D85A30' }]}
          onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add', prefill: JSON.stringify({ status: 'wish' }) } })}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Add to List</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={wishlist}
        keyExtractor={c => c.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 56, marginBottom: 14 }}>♡</Text>
            <Text style={[s.emptyTitle, { color: T.text }]}>Wishlist is empty</Text>
            <Text style={[s.emptyMsg, { color: T.muted }]}>Cars you want to hunt for show here.</Text>
            <TouchableOpacity
              style={[s.emptyAddBtn, { backgroundColor: '#D85A30' }]}
              onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add', prefill: JSON.stringify({ status: 'wish' }) } })}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Add a car to wishlist</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <CarCard
            car={item}
            onPress={() => router.push({ pathname: '/car/[id]', params: { id: item.id } })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12, borderBottomWidth: 0.5 },
  title: { fontSize: 26, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 },
  empty: { paddingTop: 80, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 22, fontWeight: '700' },
  emptyMsg: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  emptyAddBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 12 },
});
`);
console.log('✅ app/(tabs)/wishlist.tsx - fixed with add button');

// ─── 5. IMPROVED TAB LAYOUT ─────────────────────────────────────────────────
fs.writeFileSync('app/(tabs)/_layout.tsx', `import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, useColorScheme } from 'react-native';

function ScanButton() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: '#D85A30', alignItems: 'center', justifyContent: 'center', shadowColor: '#D85A30', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 10, elevation: 8, marginBottom: 8 }}
        onPress={() => router.push('/scan')}
      >
        <Ionicons name="scan" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const bg = dark ? '#141414' : '#FFFFFF';
  const border = dark ? '#2E2E2E' : '#E0DEDA';
  const active = '#D85A30';
  const inactive = dark ? '#6A6A64' : '#6B6B67';

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: active,
      tabBarInactiveTintColor: inactive,
      tabBarStyle: { borderTopColor: border, borderTopWidth: 0.5, backgroundColor: bg, height: 82, paddingBottom: 16, paddingTop: 4 },
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
console.log('✅ app/(tabs)/_layout.tsx');

// ─── 6. REDESIGNED MAIN GARAGE ──────────────────────────────────────────────
fs.writeFileSync('app/(tabs)/index.tsx', `import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, useColorScheme } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars, Car } from '../../lib/storage';
import { useTheme } from '../../lib/theme';
import CarCard from '../../components/CarCard';

export default function GarageScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState<'all'|'hw'|'mb'>('all');
  const [thOnly, setThOnly] = useState(false);
  const router = useRouter();
  const T = useTheme();

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));

  function filtered(list: Car[]) {
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
  const items: any[] = [...owned, ...(wished.length ? [{ type: 'header' }, ...wished] : [])];

  const ownedCount = cars.filter(c => c.status !== 'wish').length;
  const wishCount = cars.filter(c => c.status === 'wish').length;
  const thCount = cars.filter(c => c.th !== 'none').length;

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]}>
      <View style={[s.header, { backgroundColor: T.bg, borderBottomColor: T.border }]}>
        <View style={s.titleRow}>
          <Text style={[s.title, { color: T.text }]}>MY <Text style={{ color: '#D85A30' }}>GARAGE</Text></Text>
          <TouchableOpacity
            style={[s.addFab, { backgroundColor: '#D85A30' }]}
            onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Add Car</Text>
          </TouchableOpacity>
        </View>

        <View style={s.statsRow}>
          <View style={[s.statCard, { backgroundColor: T.bg2 }]}>
            <Text style={[s.statNum, { color: '#D85A30' }]}>{ownedCount}</Text>
            <Text style={[s.statLbl, { color: T.muted }]}>Owned</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: T.bg2 }]}>
            <Text style={[s.statNum, { color: '#185FA5' }]}>{wishCount}</Text>
            <Text style={[s.statLbl, { color: T.muted }]}>Want</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: T.bg2 }]}>
            <Text style={[s.statNum, { color: '#3B6D11' }]}>{thCount}</Text>
            <Text style={[s.statLbl, { color: T.muted }]}>TH</Text>
          </View>
        </View>

        <View style={s.searchRow}>
          <View style={[s.searchWrap, { backgroundColor: T.bg2, borderColor: T.border }]}>
            <Ionicons name="search" size={16} color={T.muted} style={{ marginRight: 6 }} />
            <TextInput
              style={[s.searchIn, { color: T.text }]}
              placeholder="Search name, series, color, manufacturer…"
              placeholderTextColor={T.hint}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={T.hint} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[s.thBtn, { backgroundColor: T.bg2, borderColor: T.border }, thOnly && { backgroundColor: '#FAEEDA', borderColor: '#BA7517' }]}
            onPress={() => setThOnly(!thOnly)}
          >
            <Text style={[{ fontSize: 13, fontWeight: '500', color: T.muted }, thOnly && { color: '#BA7517' }]}>⭐</Text>
          </TouchableOpacity>
        </View>

        <View style={s.brandRow}>
          {(['all', 'hw', 'mb'] as const).map(b => (
            <TouchableOpacity
              key={b}
              style={[s.bp, { backgroundColor: T.bg2, borderColor: T.border },
                brand === b && b === 'hw' && { backgroundColor: '#FAECE7', borderColor: '#D85A30' },
                brand === b && b === 'mb' && { backgroundColor: '#E6F1FB', borderColor: '#185FA5' },
                brand === b && b === 'all' && { backgroundColor: T.bg3, borderColor: T.border2 },
              ]}
              onPress={() => setBrand(b)}
            >
              <Text style={[s.bpT, { color: T.muted },
                brand === b && b === 'hw' && { color: '#993C1D' },
                brand === b && b === 'mb' && { color: '#0C447C' },
                brand === b && b === 'all' && { color: T.text },
              ]}>
                {b === 'all' ? 'All' : b === 'hw' ? '🔥 Hot Wheels' : '🚙 Matchbox'}
              </Text>
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
            <Text style={{ fontSize: 56, marginBottom: 14 }}>🚗</Text>
            <Text style={[s.emptyT, { color: T.text }]}>{cars.length === 0 ? 'Garage is empty!' : 'No results'}</Text>
            <Text style={[s.emptyM, { color: T.muted }]}>{cars.length === 0 ? 'Tap Add Car or use the\nscan button below.' : 'Try a different search.'}</Text>
            {cars.length === 0 && (
              <TouchableOpacity
                style={[s.emptyAddBtn, { backgroundColor: '#D85A30' }]}
                onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Add First Car</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) =>
          item.type === 'header'
            ? <Text style={[s.sec, { color: T.hint }]}>On my wishlist</Text>
            : <CarCard car={item} onPress={() => router.push({ pathname: '/car/[id]', params: { id: item.id } })} />
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, borderBottomWidth: 0.5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  addFab: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statCard: { flex: 1, borderRadius: 12, padding: 10, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '700', lineHeight: 28 },
  statLbl: { fontSize: 11, marginTop: 2 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  searchWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 0.5, paddingHorizontal: 10 },
  searchIn: { flex: 1, paddingVertical: 10, fontSize: 14 },
  thBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 0.5 },
  brandRow: { flexDirection: 'row', gap: 6 },
  bp: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, borderWidth: 0.5 },
  bpT: { fontSize: 12, fontWeight: '500' },
  sec: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 8, marginBottom: 4 },
  empty: { paddingTop: 80, alignItems: 'center', gap: 8 },
  emptyT: { fontSize: 22, fontWeight: '700' },
  emptyM: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  emptyAddBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
});
`);
console.log('✅ app/(tabs)/index.tsx - redesigned garage');

console.log(`
🚗 ALL DONE! Run:
  npx expo start --clear

WHAT'S NEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌙 DARK MODE - fully automatic
   iPhone dark mode = app goes dark
   iPhone light mode = app stays light

📸 SWIPEABLE GALLERY
   Tap any car card → full screen view
   Swipe left/right to browse all cars
   Shows all details: manufacturer, series,
   year, color, collector #, notes
   Edit button right there

♡ WISHLIST FIXED
   "Add to List" button in top right
   Big empty state with add button
   Shows all your wanted cars

📋 SERIES PICKER - 150+ series
   HW Fan Driven ✅
   All 2010-2026 mainline segments
   All Car Culture sub-series
   Premium, Retro, Matchbox

🎨 BETTER UI
   Stats cards at top of garage
   Cleaner search with clear button
   Manufacturer shows in search
   Nicer tab bar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
