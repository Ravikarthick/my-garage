#!/usr/bin/env node
const fs = require('fs');

// ── 1. Update carDatabase with full HW series list ──────────────────────────
fs.writeFileSync('lib/seriesData.ts', `
// Complete Hot Wheels series list (all types ever made)
export const HW_SERIES = [
  // ── MAINLINE SEGMENTS ──────────────────────────────────────────────────
  { label: 'Mainline', group: 'Mainline' },
  { label: 'HW Exotics', group: 'Mainline' },
  { label: 'HW Race Day', group: 'Mainline' },
  { label: 'HW Daredevils', group: 'Mainline' },
  { label: 'HW City', group: 'Mainline' },
  { label: 'HW Screen Time', group: 'Mainline' },
  { label: 'HW Ride-Ons', group: 'Mainline' },
  { label: 'HW Drift', group: 'Mainline' },
  { label: 'HW Road Trippin', group: 'Mainline' },
  { label: 'HW Art Cars', group: 'Mainline' },
  { label: 'HW Speed Graphics', group: 'Mainline' },
  { label: 'HW Checkmate', group: 'Mainline' },
  { label: 'HW Rescue', group: 'Mainline' },
  { label: 'HW Turbo', group: 'Mainline' },
  { label: 'HW Drag Strip', group: 'Mainline' },
  { label: 'HW Fast Foodie', group: 'Mainline' },
  { label: 'HW Dream Garage', group: 'Mainline' },
  { label: 'HW Slammed', group: 'Mainline' },
  { label: 'HW Baja Blazers', group: 'Mainline' },
  { label: 'Tooned', group: 'Mainline' },
  { label: 'X-Raycers', group: 'Mainline' },
  { label: 'Neon Speeders', group: 'Mainline' },
  { label: 'Color Reveal', group: 'Mainline' },
  { label: 'Mystery Models', group: 'Mainline' },
  // ── GOLD LABEL PREMIUM ────────────────────────────────────────────────
  { label: 'Car Culture', group: 'Gold Label Premium' },
  { label: 'Car Culture - Exotic Envy', group: 'Gold Label Premium' },
  { label: 'Car Culture - Japan Historics', group: 'Gold Label Premium' },
  { label: 'Car Culture - Japan Historics 2', group: 'Gold Label Premium' },
  { label: 'Car Culture - Japan Historics 3', group: 'Gold Label Premium' },
  { label: 'Car Culture - Japan Historics 4', group: 'Gold Label Premium' },
  { label: 'Car Culture - Race Day', group: 'Gold Label Premium' },
  { label: 'Car Culture - Slide Street', group: 'Gold Label Premium' },
  { label: 'Car Culture - World Tour', group: 'Gold Label Premium' },
  { label: 'Car Culture - Terra Trek', group: 'Gold Label Premium' },
  { label: 'Car Culture - Modern Classics', group: 'Gold Label Premium' },
  { label: 'Car Culture - Drag Strip Demons', group: 'Gold Label Premium' },
  { label: 'Car Culture - Trucks', group: 'Gold Label Premium' },
  { label: 'Car Culture - American Scene', group: 'Gold Label Premium' },
  { label: 'Car Culture - Cargo Carriers', group: 'Gold Label Premium' },
  { label: 'Car Culture - Team Transport', group: 'Gold Label Premium' },
  { label: 'Car Culture - 2-Pack', group: 'Gold Label Premium' },
  { label: 'Boulevard', group: 'Gold Label Premium' },
  { label: 'Pop Culture', group: 'Gold Label Premium' },
  { label: 'Pop Culture - Entertainment', group: 'Gold Label Premium' },
  { label: 'Pop Culture - Fast & Furious', group: 'Gold Label Premium' },
  { label: 'Pop Culture - Mario Kart', group: 'Gold Label Premium' },
  { label: 'Pop Culture - Star Wars', group: 'Gold Label Premium' },
  { label: 'Pop Culture - DC Comics', group: 'Gold Label Premium' },
  { label: 'Pop Culture - Marvel', group: 'Gold Label Premium' },
  // ── SILVER LABEL PREMIUM ──────────────────────────────────────────────
  { label: 'Vintage Racing Club', group: 'Silver Label Premium' },
  { label: 'Automotive Celebrations', group: 'Silver Label Premium' },
  { label: 'Ultra Hots', group: 'Silver Label Premium' },
  { label: 'Batman', group: 'Silver Label Premium' },
  { label: 'Fast & Furious - Silver', group: 'Silver Label Premium' },
  // ── ULTRA PREMIUM / MATTEL CREATIONS ──────────────────────────────────
  { label: 'Red Line Club (RLC)', group: 'Ultra Premium' },
  { label: 'Elite 64', group: 'Ultra Premium' },
  { label: 'Collector Edition', group: 'Ultra Premium' },
  { label: 'Convention Exclusive', group: 'Ultra Premium' },
  // ── RETRO / VINTAGE ───────────────────────────────────────────────────
  { label: 'Retro Entertainment', group: 'Retro' },
  { label: 'Retro Series', group: 'Retro' },
  { label: 'Redline Era (1968-1977)', group: 'Retro' },
  { label: 'Flying Colors Era (1977-1981)', group: 'Retro' },
  { label: 'Blackwall Era (1979-1988)', group: 'Retro' },
  { label: 'Real Riders Era (1983-1989)', group: 'Retro' },
  { label: 'Color Racers', group: 'Retro' },
  // ── MATCHBOX ──────────────────────────────────────────────────────────
  { label: 'Matchbox Mainline', group: 'Matchbox' },
  { label: 'Matchbox Moving Parts', group: 'Matchbox' },
  { label: 'Matchbox Collector Series', group: 'Matchbox' },
  { label: 'Matchbox Superfast', group: 'Matchbox' },
  { label: 'Matchbox Sky Busters', group: 'Matchbox' },
  { label: 'Matchbox Working Rigs', group: 'Matchbox' },
  { label: 'Matchbox Premium', group: 'Matchbox' },
];

export const HW_SERIES_GROUPS = [...new Set(HW_SERIES.map(s => s.group))];

export function searchSeries(query: string): typeof HW_SERIES {
  if (!query) return HW_SERIES;
  const q = query.toLowerCase();
  return HW_SERIES.filter(s => s.label.toLowerCase().includes(q));
}
`);
console.log('✅ Created lib/seriesData.ts');

// ── 2. Update car form to include series picker ─────────────────────────────
// Read current car form and add series picker
const currentForm = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Add seriesData import after storage import
const updatedForm = currentForm
  .replace(
    "import { searchCars, searchManufacturers, detectManufacturer, MANUFACTURERS } from '../../lib/carDatabase';",
    `import { searchCars, searchManufacturers, detectManufacturer, MANUFACTURERS } from '../../lib/carDatabase';
import { HW_SERIES, HW_SERIES_GROUPS, searchSeries } from '../../lib/seriesData';`
  )
  // Add series picker modal state after showMfgPicker state
  .replace(
    "  const [mfgList, setMfgList] = useState(MANUFACTURERS.slice(0,30));",
    `  const [mfgList, setMfgList] = useState(MANUFACTURERS.slice(0,30));
  const [showSeriesPicker, setShowSeriesPicker] = useState(false);
  const [seriesSearch, setSeriesSearch] = useState('');
  const [seriesList, setSeriesList] = useState(HW_SERIES);`
  )
  // Replace series TextInput with a picker button
  .replace(
    `            <View style={{flex:1}}>
              <Text style={s.lbl}>Series</Text>
              <TextInput style={s.input} value={series} onChangeText={setSeries} placeholder="Mainline" placeholderTextColor="#A0A09C"/>
            </View>`,
    `            <View style={{flex:1}}>
              <Text style={s.lbl}>Series</Text>
              <TouchableOpacity
                style={[s.input,{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11}]}
                onPress={()=>setShowSeriesPicker(true)}
              >
                <Text style={{fontSize:15,color:series?'#1A1A18':'#A0A09C',flex:1}} numberOfLines={1}>
                  {series||'Select series...'}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C"/>
              </TouchableOpacity>
            </View>`
  );

fs.writeFileSync('app/car/[id].tsx', updatedForm);
console.log('✅ Updated app/car/[id].tsx with series picker');

// ── 3. Now append the series picker modal before the closing of the component
const formContent = fs.readFileSync('app/car/[id].tsx', 'utf8');
const updatedWithModal = formContent.replace(
  `      {/* Manufacturer Picker */}
      <Modal visible={showMfgPicker}`,
  `      {/* Series Picker */}
      <Modal visible={showSeriesPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <View style={s.modalTop}>
            <TouchableOpacity onPress={()=>{setShowSeriesPicker(false);setSeriesSearch('');setSeriesList(HW_SERIES);}} style={{padding:4}}>
              <Ionicons name="chevron-back" size={24} color="#1A1A18"/>
            </TouchableOpacity>
            <Text style={s.modalTitle}>Select Series</Text>
            <TouchableOpacity onPress={()=>{setSeries('');setShowSeriesPicker(false);}} style={{padding:4}}>
              <Text style={{color:'#A0A09C',fontSize:14}}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={s.mfgSearchBox}>
            <Ionicons name="search" size={16} color="#A0A09C" style={{marginLeft:12}}/>
            <TextInput
              style={s.mfgSearchInput}
              value={seriesSearch}
              onChangeText={t=>{setSeriesSearch(t);setSeriesList(searchSeries(t));}}
              placeholder="Search series e.g. Car Culture, Exotics..."
              placeholderTextColor="#A0A09C"
              autoCorrect={false}
              autoFocus
            />
            {seriesSearch.length>0&&(
              <TouchableOpacity onPress={()=>{setSeriesSearch('');setSeriesList(HW_SERIES);}} style={{padding:10}}>
                <Ionicons name="close-circle" size={18} color="#A0A09C"/>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={seriesList}
            keyExtractor={(item,i)=>item.label+i}
            contentContainerStyle={{paddingHorizontal:16,paddingBottom:60}}
            renderItem={({item,index})=>{
              const showGroup = index===0 || seriesList[index-1].group!==item.group;
              return (
                <>
                  {showGroup&&<Text style={{fontSize:11,fontWeight:'700',color:'#A0A09C',textTransform:'uppercase',letterSpacing:0.8,marginTop:16,marginBottom:4}}>{item.group}</Text>}
                  <TouchableOpacity
                    style={[s.mfgRow,series===item.label&&s.mfgRowActive]}
                    onPress={()=>{setSeries(item.label);setShowSeriesPicker(false);setSeriesSearch('');setSeriesList(HW_SERIES);}}
                  >
                    <Text style={[s.mfgRowTxt,series===item.label&&{color:'#D85A30',fontWeight:'700'}]}>{item.label}</Text>
                    {series===item.label&&<Ionicons name="checkmark-circle" size={20} color="#D85A30"/>}
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </SafeAreaView>
      </Modal>

      {/* Manufacturer Picker */}
      <Modal visible={showMfgPicker}`
);
fs.writeFileSync('app/car/[id].tsx', updatedWithModal);
console.log('✅ Added series picker modal');

// ── 4. Create the Gallery View (Photo Cards) ────────────────────────────────
fs.writeFileSync('app/(tabs)/gallery.tsx', `import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, Image, Dimensions
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars, Car } from '../../lib/storage';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

export default function GalleryScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filter, setFilter] = useState<'all'|'hw'|'mb'|'th'>('all');
  const router = useRouter();

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));

  const filtered = cars.filter(c => {
    if (filter === 'hw') return c.brand === 'hw';
    if (filter === 'mb') return c.brand === 'mb';
    if (filter === 'th') return c.th !== 'none';
    return true;
  });

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'hw', label: '🔥 HW' },
    { key: 'mb', label: '🚙 MB' },
    { key: 'th', label: '⭐ TH' },
  ] as const;

  function renderCard({ item: c }: { item: Car }) {
    const isOwned = c.status === 'owned' || c.status === 'dup';
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push({ pathname: '/car/[id]', params: { id: c.id } })}
        activeOpacity={0.85}
      >
        {/* Photo or emoji placeholder */}
        <View style={styles.photoWrap}>
          {c.photo
            ? <Image source={{ uri: c.photo }} style={styles.photo} resizeMode="cover"/>
            : <View style={styles.photoPlaceholder}>
                <Text style={styles.placeholderEmoji}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
              </View>
          }
          {/* Status badge */}
          {!isOwned && (
            <View style={styles.wishBadge}>
              <Text style={styles.wishBadgeTxt}>♡</Text>
            </View>
          )}
          {/* TH badge */}
          {c.th !== 'none' && (
            <View style={[styles.thBadge, c.th === 'sth' && styles.sthBadge]}>
              <Text style={styles.thBadgeTxt}>{c.th === 'sth' ? '🌟' : '⭐'}</Text>
            </View>
          )}
        </View>
        {/* Details */}
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={2}>{c.name}</Text>
          {!!c.manufacturer && <Text style={styles.cardMfg} numberOfLines={1}>{c.manufacturer}</Text>}
          <View style={styles.cardMeta}>
            {!!c.year && <Text style={styles.metaChip}>{c.year}</Text>}
            {!!c.color && <Text style={styles.metaChip}>{c.color}</Text>}
          </View>
          {!!c.series && <Text style={styles.cardSeries} numberOfLines={1}>{c.series}</Text>}
          {!!c.colnum && <Text style={styles.cardColnum}>#{c.colnum}</Text>}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>PHOTO <Text style={styles.accent}>GALLERY</Text></Text>
        <Text style={styles.count}>{filtered.length} cars</Text>
      </View>

      {/* Filter pills */}
      <View style={styles.filters}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterPill, filter === f.key && styles.filterPillActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterTxt, filter === f.key && styles.filterTxtActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 52, marginBottom: 12 }}>📸</Text>
            <Text style={styles.emptyTitle}>No cars yet</Text>
            <Text style={styles.emptyMsg}>Add cars with photos to see them here!</Text>
          </View>
        }
        renderItem={renderCard}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F4F1' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 8, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#E0DEDA' },
  title: { fontSize: 26, fontWeight: '700', color: '#1A1A18' },
  accent: { color: '#D85A30' },
  count: { fontSize: 13, color: '#6B6B67', fontWeight: '500' },
  filters: { flexDirection: 'row', gap: 8, padding: 12, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#E0DEDA' },
  filterPill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F5F4F1', borderWidth: 0.5, borderColor: '#E0DEDA' },
  filterPillActive: { backgroundColor: '#D85A30', borderColor: '#D85A30' },
  filterTxt: { fontSize: 13, fontWeight: '500', color: '#6B6B67' },
  filterTxtActive: { color: '#fff' },
  grid: { padding: 12, paddingBottom: 100 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: { width: CARD_W, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 0.5, borderColor: '#E0DEDA' },
  photoWrap: { width: '100%', height: CARD_W, position: 'relative' },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { width: '100%', height: '100%', backgroundColor: '#EEEDEA', alignItems: 'center', justifyContent: 'center' },
  placeholderEmoji: { fontSize: 48 },
  wishBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  wishBadgeTxt: { color: '#fff', fontSize: 12 },
  thBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#EAF3DE', borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2 },
  sthBadge: { backgroundColor: '#FAEEDA' },
  thBadgeTxt: { fontSize: 12 },
  cardBody: { padding: 10 },
  cardName: { fontSize: 14, fontWeight: '700', color: '#1A1A18', lineHeight: 18, marginBottom: 3 },
  cardMfg: { fontSize: 11, color: '#D85A30', fontWeight: '600', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', marginBottom: 4 },
  metaChip: { fontSize: 10, color: '#6B6B67', backgroundColor: '#F5F4F1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  cardSeries: { fontSize: 10, color: '#A0A09C', marginBottom: 2 },
  cardColnum: { fontSize: 11, fontWeight: '600', color: '#185FA5' },
  empty: { paddingTop: 80, alignItems: 'center' },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A18', marginBottom: 6 },
  emptyMsg: { fontSize: 14, color: '#6B6B67', textAlign: 'center' },
});
`);
console.log('✅ Created app/(tabs)/gallery.tsx');

// ── 5. Update tab layout to add Gallery tab ─────────────────────────────────
fs.writeFileSync('app/(tabs)/_layout.tsx', `import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';

function ScanButton() {
  const router = useRouter();
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <TouchableOpacity
        style={{ width:56, height:56, borderRadius:28, backgroundColor:'#D85A30', alignItems:'center', justifyContent:'center', shadowColor:'#D85A30', shadowOffset:{width:0,height:4}, shadowOpacity:0.4, shadowRadius:8, elevation:6 }}
        onPress={() => router.push('/scan')}>
        <Ionicons name="scan" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#D85A30',
      tabBarInactiveTintColor: '#6B6B67',
      tabBarStyle: { borderTopColor: '#E0DEDA', borderTopWidth: 0.5, backgroundColor: '#fff', height: 80, paddingBottom: 16 },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      headerShown: false,
    }}>
      <Tabs.Screen name="index" options={{ title:'Garage', tabBarIcon:({color,size})=><Ionicons name="grid" size={size} color={color}/> }} />
      <Tabs.Screen name="gallery" options={{ title:'Gallery', tabBarIcon:({color,size})=><Ionicons name="images" size={size} color={color}/> }} />
      <Tabs.Screen name="scan-tab" options={{ title:'', tabBarButton:()=><ScanButton/> }} />
      <Tabs.Screen name="wishlist" options={{ title:'Wishlist', tabBarIcon:({color,size})=><Ionicons name="heart-outline" size={size} color={color}/> }} />
      <Tabs.Screen name="stats" options={{ title:'Stats', tabBarIcon:({color,size})=><Ionicons name="bar-chart-outline" size={size} color={color}/> }} />
    </Tabs>
  );
}
`);
console.log('✅ Updated tab layout with Gallery tab');

console.log(`
🚗 ALL DONE! Run:
  npx expo start --clear

NEW FEATURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 PHOTO GALLERY TAB
  - New "Gallery" tab in bottom nav
  - 2-column photo card grid
  - Shows car photo, name, manufacturer, year, color, series, collector #
  - TH/Super TH badges on cards
  - Filter by All / Hot Wheels / Matchbox / TH only

🏷️ SERIES PICKER
  - Series field is now a tap-to-pick selector
  - 70+ series options organized by group:
    • Mainline (HW Exotics, Race Day, City, Screen Time...)
    • Gold Label Premium (Car Culture, Boulevard, Pop Culture...)
    • Silver Label Premium (Vintage Racing Club, Ultra Hots...)
    • Ultra Premium (Red Line Club, Elite 64...)
    • Retro (Redline Era, Flying Colors...)
    • Matchbox series
  - Search within series list
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
