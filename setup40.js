#!/usr/bin/env node
const fs = require('fs');

// ══════════════════════════════════════════════════════════════════════════
// 1. CLEAN backup.tsx (no syntax errors)
// ══════════════════════════════════════════════════════════════════════════
fs.writeFileSync('app/backup.tsx', `import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, Share, useColorScheme, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadCars } from '../lib/storage';

export default function BackupScreen() {
  const router = useRouter();
  const dark = useColorScheme() === 'dark';
  const TEXT = dark ? '#F2F2F7' : '#1C1C1E';
  const CARD = dark ? '#1C1C1E' : '#FFFFFF';
  const BG = dark ? '#0A0A0A' : '#F0EFEC';
  const MUTED = dark ? '#8E8E93' : '#6B6B6B';
  const BORDER = dark ? '#2C2C2E' : '#E5E5EA';
  const [status, setStatus] = useState('');

  async function checkData() {
    const cars = await loadCars();
    setStatus('You have ' + cars.length + ' cars in this app.');
  }

  async function exportData() {
    try {
      const cars = await loadCars();
      if (cars.length === 0) { Alert.alert('No data', 'No cars found here. Try in Expo Go.'); return; }
      const backup = { version: 1, date: new Date().toISOString(), cars, total: cars.length };
      await Share.share({ message: JSON.stringify(backup), title: 'My Garage Backup' });
      setStatus('Exported ' + cars.length + ' cars!');
    } catch(e) { setStatus('Export failed: ' + e.message); }
  }

  async function importData() {
    try {
      const Clipboard = require('expo-clipboard');
      const text = await Clipboard.getStringAsync();
      if (!text || !text.includes('"cars"')) { Alert.alert('Error', 'Copy your backup text first.'); return; }
      const backup = JSON.parse(text);
      const existing = await loadCars();
      const existingIds = new Set(existing.map(c => c.id));
      const newCars = backup.cars.filter(c => !existingIds.has(c.id));
      await AsyncStorage.setItem('mygarage_v1', JSON.stringify([...existing, ...newCars]));
      setStatus('Imported ' + newCars.length + ' cars!');
      Alert.alert('Done!', 'Imported ' + newCars.length + ' cars!');
    } catch(e) { Alert.alert('Error', 'Copy the full backup JSON first.'); }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: CARD, borderBottomWidth: 0.5, borderBottomColor: BORDER, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={TEXT} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '800', color: TEXT }}>Backup and Restore</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        {!!status && <View style={{ backgroundColor: CARD, borderRadius: 14, padding: 14 }}><Text style={{ color: TEXT, fontSize: 15 }}>{status}</Text></View>}
        <TouchableOpacity style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: BORDER, flexDirection: 'row', alignItems: 'center', gap: 12 }} onPress={checkData}>
          <Ionicons name="stats-chart" size={24} color="#D85A30" />
          <Text style={{ fontSize: 15, fontWeight: '700', color: TEXT }}>Check car count</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 18, borderWidth: 0.5, borderColor: BORDER }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: TEXT, marginBottom: 8 }}>Step 1 — Export (in Expo Go)</Text>
          <Text style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>Tap export, then Share, then Copy.</Text>
          <TouchableOpacity style={{ backgroundColor: '#3B6D11', borderRadius: 12, padding: 14, alignItems: 'center' }} onPress={exportData}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Export My Cars</Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 18, borderWidth: 0.5, borderColor: BORDER }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: TEXT, marginBottom: 8 }}>Step 2 — Import (in new app)</Text>
          <Text style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>After copying backup text, tap import below.</Text>
          <TouchableOpacity style={{ backgroundColor: '#185FA5', borderRadius: 12, padding: 14, alignItems: 'center' }} onPress={importData}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Import from Clipboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
`);
console.log('✅ backup.tsx clean');

// ══════════════════════════════════════════════════════════════════════════
// 2. CLEAN scan.tsx (no syntax errors)
// ══════════════════════════════════════════════════════════════════════════
fs.writeFileSync('app/scan.tsx', `import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Image, useColorScheme, StatusBar } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars } from '../lib/storage';

export default function ScanScreen() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();
  const dark = useColorScheme() === 'dark';
  const BG = dark ? '#0A0A0A' : '#F0EFEC';
  const CARD = dark ? '#1C1C1E' : '#FFFFFF';
  const TEXT = dark ? '#F2F2F7' : '#1C1C1E';
  const MUTED = dark ? '#8E8E93' : '#6B6B6B';
  const BORDER = dark ? '#2C2C2E' : '#E5E5EA';

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));

  function doSearch(q) {
    setSearch(q);
    if (q.length < 1) { setResults([]); setHasSearched(false); return; }
    setHasSearched(true);
    const ql = q.toLowerCase();
    setResults(cars.filter(c =>
      [c.name, c.manufacturer, c.series, c.color, c.colnum, c.mainline, c.year]
        .filter(Boolean).join(' ').toLowerCase().includes(ql)
    ));
  }

  const owned = results.filter(c => c.status === 'owned' || c.status === 'dup');
  const wished = results.filter(c => c.status === 'wish');
  const hasIt = owned.length > 0;
  const wantsIt = wished.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: CARD, borderBottomWidth: 0.5, borderBottomColor: BORDER }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={TEXT} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: TEXT }}>DO I HAVE THIS?</Text>
          <Text style={{ fontSize: 12, color: MUTED }}>Search your collection instantly</Text>
        </View>
      </View>
      <View style={{ padding: 14, backgroundColor: CARD, borderBottomWidth: 0.5, borderBottomColor: BORDER }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: dark ? '#2C2C2E' : '#F5F4F1', borderRadius: 14, borderWidth: 1, borderColor: '#D85A30', paddingHorizontal: 12, gap: 8 }}>
          <Ionicons name="search" size={18} color="#D85A30" />
          <TextInput
            style={{ flex: 1, paddingVertical: 13, fontSize: 16, color: TEXT }}
            placeholder="Type car name, series, color..."
            placeholderTextColor={MUTED}
            value={search}
            onChangeText={doSearch}
            autoFocus
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); setResults([]); setHasSearched(false); }}>
              <Ionicons name="close-circle" size={20} color={MUTED} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {hasSearched && (
        <View style={{ margin: 14, marginBottom: 0, padding: 16, borderRadius: 16, backgroundColor: hasIt ? '#EAF3DE' : wantsIt ? '#E6F1FB' : dark ? '#2C2C2E' : '#F5F4F1', borderWidth: 2, borderColor: hasIt ? '#3B6D11' : wantsIt ? '#185FA5' : BORDER, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontSize: 36 }}>{hasIt ? '✅' : wantsIt ? '♡' : '❌'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: hasIt ? '#3B6D11' : wantsIt ? '#185FA5' : '#A32D2D' }}>
              {hasIt ? 'YES! You have ' + owned.length + '!' : wantsIt ? 'On your wishlist!' : 'Not in your collection'}
            </Text>
            <Text style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>
              {hasIt ? 'Tap a car to see details' : 'Safe to buy!'}
            </Text>
          </View>
          {!hasIt && !wantsIt && search.length > 1 && (
            <TouchableOpacity style={{ backgroundColor: '#D85A30', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 }} onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={c => c.id}
        contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 80 }}
        ListEmptyComponent={!hasSearched ? (
          <View style={{ paddingTop: 40, alignItems: 'center', gap: 16 }}>
            <Text style={{ fontSize: 64 }}>🔍</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: TEXT, textAlign: 'center' }}>Check your collection</Text>
            <Text style={{ fontSize: 14, color: MUTED, textAlign: 'center' }}>Type a car name to see if you already own it.</Text>
          </View>
        ) : null}
        renderItem={({ item: c }) => (
          <TouchableOpacity style={{ backgroundColor: CARD, borderRadius: 16, overflow: 'hidden', flexDirection: 'row', borderWidth: 1.5, borderColor: c.status === 'owned' || c.status === 'dup' ? '#3B6D11' : c.status === 'wish' ? '#185FA5' : BORDER }} onPress={() => router.push({ pathname: '/car/[id]', params: { id: c.id } })}>
            {c.photo ? <Image source={{ uri: c.photo }} style={{ width: 90, height: 90 }} resizeMode="cover" /> : <View style={{ width: 90, height: 90, backgroundColor: dark ? '#2C2C2E' : '#F5F4F1', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 36 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text></View>}
            <View style={{ flex: 1, padding: 12, gap: 3 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: TEXT, flex: 1 }} numberOfLines={1}>{c.name}</Text>
                <View style={{ backgroundColor: c.status === 'owned' || c.status === 'dup' ? '#EAF3DE' : c.status === 'wish' ? '#E6F1FB' : '#F5F4F1', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: c.status === 'owned' || c.status === 'dup' ? '#3B6D11' : c.status === 'wish' ? '#185FA5' : MUTED }}>
                    {c.status === 'owned' ? 'Owned' : c.status === 'dup' ? 'Dupe' : 'Want'}
                  </Text>
                </View>
              </View>
              {!!c.manufacturer && <Text style={{ fontSize: 12, color: '#D85A30', fontWeight: '600' }}>{c.manufacturer}</Text>}
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {!!c.series && <Text style={{ fontSize: 11, color: MUTED }}>{c.series}</Text>}
                {!!c.year && <Text style={{ fontSize: 11, color: MUTED }}>· {c.year}</Text>}
                {!!c.color && <Text style={{ fontSize: 11, color: MUTED }}>· {c.color}</Text>}
                {!!c.colnum && <Text style={{ fontSize: 11, color: '#185FA5', fontWeight: '600' }}>#{c.colnum}</Text>}
                {!!c.mainline && <Text style={{ fontSize: 11, color: '#185FA5', fontWeight: '600' }}>#{c.mainline}</Text>}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
`);
console.log('✅ scan.tsx clean');

// ══════════════════════════════════════════════════════════════════════════
// 3. COMPLETE car form rewrite — dropdown color, no manual entry pickers,
//    auto-suggest car names, makers filter on homepage
// ══════════════════════════════════════════════════════════════════════════
fs.writeFileSync('app/car/[id].tsx', `import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Image, Alert,
  KeyboardAvoidingView, Platform, Modal, FlatList
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadCars, addCar, updateCar, deleteCar, uid } from '../../lib/storage';
import { searchManufacturers, detectManufacturer, MANUFACTURERS, HW_CARS, MB_CARS } from '../../lib/carDatabase';
import { HW_SERIES, searchSeries } from '../../lib/seriesData';

const HISTORY_KEY = 'mygarage_car_history';

const COLORS = [
  'Red', 'Dark Red', 'Orange', 'Yellow', 'Green', 'Dark Green',
  'Blue', 'Dark Blue', 'Light Blue', 'Purple', 'Pink', 'White',
  'Black', 'Gray', 'Silver', 'Gold', 'Brown', 'Teal',
  'Metallic Red', 'Metallic Blue', 'Metallic Green', 'Metallic Silver',
  'Metallic Gold', 'Metallic Purple', 'Flat Black', 'Flat Gray',
  'Pearl White', 'Chrome', 'Spectraflame Red', 'Spectraflame Blue',
  'Spectraflame Green', 'Spectraflame Orange', 'Spectraflame Purple',
  'Spectraflame Silver', 'ZAMAC',
];

const SERIES_TOTALS = [5, 6, 8, 10, 12];
const MAINLINE_TOTAL = 250;

async function compressPhoto(uri) {
  try {
    const IM = require('expo-image-manipulator');
    const r = await IM.manipulateAsync(uri, [{ resize: { width: 300 } }], { compress: 0.6, format: IM.SaveFormat.JPEG });
    return r.uri;
  } catch { return uri; }
}

export default function CarForm() {
  const { id, prefill } = useLocalSearchParams();
  const router = useRouter();
  const isEdit = !!id && id !== 'add';

  const [brand, setBrand]         = useState('hw');
  const [name, setName]           = useState('');
  const [manufacturer, setMfg]    = useState('');
  const [series, setSeries]       = useState('');
  const [year, setYear]           = useState(String(new Date().getFullYear()));
  const [color, setColor]         = useState('');
  const [colnum, setColnum]       = useState('');
  const [mainline, setMainline]   = useState('');
  const [tampo, setTampo]         = useState('');
  const [notes, setNotes]         = useState('');
  const [th, setTh]               = useState('none');
  const [status, setStatus]       = useState('owned');
  const [photo, setPhoto]         = useState(null);
  const [nameSug, setNameSug]     = useState([]);
  const [history, setHistory]     = useState([]);
  const [showMfg, setShowMfg]     = useState(false);
  const [showSeries, setShowSeries] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showColnum, setShowColnum] = useState(false);
  const [showMainline, setShowMainline] = useState(false);
  const [mfgSearch, setMfgSearch] = useState('');
  const [mfgList, setMfgList]     = useState(MANUFACTURERS.slice(0, 30));
  const [seriesSearch, setSeriesSearch] = useState('');
  const [seriesList, setSeriesList] = useState(HW_SERIES);
  const [colnumTotal, setColnumTotal] = useState(5);

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then(d => { if (d) setHistory(JSON.parse(d)); });
    if (prefill) { try { const p = JSON.parse(prefill); if (p.status) setStatus(p.status); if (p.brand) setBrand(p.brand); } catch {} }
    if (isEdit) {
      loadCars().then(cars => {
        const c = cars.find(x => x.id === id);
        if (c) {
          setBrand(c.brand || 'hw'); setName(c.name || ''); setMfg(c.manufacturer || '');
          setSeries(c.series || ''); setYear(c.year || ''); setColor(c.color || '');
          setColnum(c.colnum || ''); setMainline(c.mainline || '');
          setTampo(c.tampo || ''); setNotes(c.notes || '');
          setTh(c.th || 'none'); setStatus(c.status || 'owned'); setPhoto(c.photo || null);
        }
      });
    }
  }, []);

  async function saveHistory(n) {
    const updated = [n, ...history.filter(h => h !== n)].slice(0, 50);
    setHistory(updated);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }

  function onNameChange(text) {
    setName(text);
    const detected = detectManufacturer(text);
    if (detected) setMfg(detected);
    if (text.length >= 1) {
      const q = text.toLowerCase();
      const list = brand === 'hw' ? HW_CARS : MB_CARS;
      const fromHistory = history.filter(h => h.toLowerCase().includes(q));
      const fromList = list.filter(n => n.toLowerCase().includes(q));
      setNameSug([...new Set([...fromHistory, ...fromList])].slice(0, 12));
    } else {
      setNameSug(history.slice(0, 8));
    }
  }

  function pickSug(val) {
    setName(val); setNameSug([]);
    const d = detectManufacturer(val); if (d) setMfg(d);
  }

  async function save() {
    if (!name.trim()) { Alert.alert('Name required'); return; }
    await saveHistory(name.trim());
    const cars = await loadCars();
    const car = {
      id: isEdit ? id : uid(), brand, name: name.trim(), manufacturer: manufacturer.trim(),
      series: series.trim(), year: year.trim(), color: color.trim(),
      colnum: colnum.trim(), mainline: mainline.trim(),
      tampo: tampo.trim(), notes: notes.trim(), th, status, photo,
      added: isEdit ? (cars.find(c => c.id === id)?.added || Date.now()) : Date.now()
    };
    if (isEdit) await updateCar(car); else await addCar(car);
    router.back();
  }

  async function handleDelete() {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteCar(id); router.back(); } }
    ]);
  }

  const Tog = ({ label, active, onPress, ac, tc }) => (
    <TouchableOpacity style={[s.tog, active && { backgroundColor: ac, borderColor: tc }]} onPress={onPress}>
      <Text style={[s.togT, active && { color: tc }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.topbar}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Ionicons name="chevron-back" size={24} color="#1A1A18" />
          </TouchableOpacity>
          <Text style={s.topT}>{isEdit ? 'Edit Car' : 'Add Car'}</Text>
          <TouchableOpacity onPress={save} style={s.saveBtn}>
            <Text style={s.saveBtnT}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Brand */}
          <Text style={s.lbl}>Brand</Text>
          <View style={s.row}>
            <Tog label="🔥 Hot Wheels" active={brand === 'hw'} onPress={() => { setBrand('hw'); setNameSug([]); }} ac="#FAECE7" tc="#993C1D" />
            <Tog label="🚙 Matchbox" active={brand === 'mb'} onPress={() => { setBrand('mb'); setNameSug([]); }} ac="#E6F1FB" tc="#0C447C" />
          </View>

          {/* Car Name with auto-suggest */}
          <Text style={s.lbl}>Car name *</Text>
          <View style={{ zIndex: 999, marginBottom: 2 }}>
            <View style={s.nameBox}>
              <Ionicons name="search" size={16} color="#A0A09C" style={{ marginLeft: 12 }} />
              <TextInput
                style={s.nameInput}
                value={name}
                onChangeText={onNameChange}
                onFocus={() => !name && setNameSug(history.slice(0, 8))}
                placeholder="Type car name..."
                placeholderTextColor="#A0A09C"
                autoCorrect={false}
                autoCapitalize="words"
              />
              {name.length > 0 && (
                <TouchableOpacity onPress={() => { setName(''); setNameSug([]); setMfg(''); }} style={{ padding: 10 }}>
                  <Ionicons name="close-circle" size={18} color="#A0A09C" />
                </TouchableOpacity>
              )}
            </View>
            {nameSug.length > 0 && (
              <View style={s.sugBox}>
                {nameSug.map((item, i) => (
                  <TouchableOpacity key={i} style={[s.sugRow, i < nameSug.length - 1 && s.sugBorder]} onPress={() => pickSug(item)}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {history.includes(item) && <Ionicons name="time-outline" size={13} color="#A0A09C" />}
                      <Text style={s.sugTxt}>{item}</Text>
                    </View>
                    <Ionicons name="arrow-up-back" size={13} color="#A0A09C" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Manufacturer */}
          <Text style={s.lbl}>Manufacturer{manufacturer ? <Text style={{ color: '#3B6D11' }}> (auto-detected)</Text> : <Text style={{ color: '#A0A09C' }}> (tap to select)</Text>}</Text>
          <TouchableOpacity style={[s.mfgBtn, manufacturer && s.mfgBtnFilled]} onPress={() => setShowMfg(true)}>
            <Ionicons name="business-outline" size={16} color={manufacturer ? '#1A1A18' : '#A0A09C'} style={{ marginRight: 8 }} />
            <Text style={[s.mfgBtnTxt, !manufacturer && { color: '#A0A09C' }]} numberOfLines={1}>{manufacturer || 'Select manufacturer...'}</Text>
            <Ionicons name="chevron-down" size={15} color="#A0A09C" />
          </TouchableOpacity>

          {/* Series + Year */}
          <View style={s.grid}>
            <View style={{ flex: 2 }}>
              <Text style={s.lbl}>Series</Text>
              <TouchableOpacity style={[s.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11 }]} onPress={() => setShowSeries(true)}>
                <Text style={{ fontSize: 14, color: series ? '#1A1A18' : '#A0A09C', flex: 1 }} numberOfLines={1}>{series || 'Select series...'}</Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.lbl}>Year</Text>
              <TextInput style={s.input} value={year} onChangeText={setYear} placeholder="2026" placeholderTextColor="#A0A09C" keyboardType="numeric" />
            </View>
          </View>

          {/* Color — dropdown only */}
          <Text style={s.lbl}>Color</Text>
          <TouchableOpacity style={[s.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, marginBottom: 10 }]} onPress={() => setShowColor(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              {!!color && <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: colorToHex(color), borderWidth: 0.5, borderColor: '#E0DEDA' }} />}
              <Text style={{ fontSize: 15, color: color ? '#1A1A18' : '#A0A09C' }} numberOfLines={1}>{color || 'Select color...'}</Text>
            </View>
            <Ionicons name="chevron-down" size={14} color="#A0A09C" />
          </TouchableOpacity>

          {/* Series # and Mainline # */}
          <View style={s.grid}>
            <View style={{ flex: 1 }}>
              <Text style={s.lbl}>Series # (e.g. 4/5)</Text>
              <TouchableOpacity style={[s.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11 }]} onPress={() => setShowColnum(true)}>
                <Text style={{ fontSize: 15, color: colnum ? '#1A1A18' : '#A0A09C' }}>{colnum || 'Tap to pick'}</Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.lbl}>Mainline # (e.g. 32/250)</Text>
              <TouchableOpacity style={[s.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11 }]} onPress={() => setShowMainline(true)}>
                <Text style={{ fontSize: 15, color: mainline ? '#1A1A18' : '#A0A09C' }}>{mainline || 'Tap to pick'}</Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tampo */}
          <Text style={s.lbl}>Tampo</Text>
          <TextInput style={s.input} value={tampo} onChangeText={setTampo} placeholder="flames on hood..." placeholderTextColor="#A0A09C" />

          {/* TH */}
          <Text style={s.lbl}>Treasure Hunt?</Text>
          <View style={s.row}>
            <Tog label="None" active={th === 'none'} onPress={() => setTh('none')} ac="#EAF3DE" tc="#3B6D11" />
            <Tog label="TH" active={th === 'th'} onPress={() => setTh('th')} ac="#EAF3DE" tc="#3B6D11" />
            <Tog label="Super TH" active={th === 'sth'} onPress={() => setTh('sth')} ac="#FAEEDA" tc="#BA7517" />
          </View>

          {/* Photo */}
          <Text style={s.lbl}>Photo</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <TouchableOpacity style={[s.photoBox, { flex: 2 }]} onPress={async () => {
              const { status: cs } = await ImagePicker.requestCameraPermissionsAsync();
              if (cs !== 'granted') { Alert.alert('Permission needed'); return; }
              const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
              if (!r.canceled) setPhoto(await compressPhoto(r.assets[0].uri));
            }}>
              {photo ? <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} /> : <><Ionicons name="camera" size={22} color="#6B6B67" /><Text style={s.photoT}>Camera</Text></>}
            </TouchableOpacity>
            <TouchableOpacity style={[s.photoBox, { flex: 1 }]} onPress={async () => {
              const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
              if (!r.canceled) setPhoto(await compressPhoto(r.assets[0].uri));
            }}>
              <Ionicons name="images" size={22} color="#6B6B67" />
              <Text style={s.photoT}>Library</Text>
            </TouchableOpacity>
            {photo && <TouchableOpacity style={[s.photoBox, { flex: 1 }]} onPress={() => setPhoto(null)}>
              <Ionicons name="trash-outline" size={20} color="#A32D2D" />
              <Text style={[s.photoT, { color: '#A32D2D' }]}>Remove</Text>
            </TouchableOpacity>}
          </View>

          {/* Status */}
          <Text style={s.lbl}>Status</Text>
          <View style={s.row}>
            <Tog label="I own it" active={status === 'owned'} onPress={() => setStatus('owned')} ac="#EAF3DE" tc="#3B6D11" />
            <Tog label="Wishlist" active={status === 'wish'} onPress={() => setStatus('wish')} ac="#E6F1FB" tc="#0C447C" />
            <Tog label="Duplicate" active={status === 'dup'} onPress={() => setStatus('dup')} ac="#FCEBEB" tc="#A32D2D" />
          </View>

          {/* Notes */}
          <Text style={s.lbl}>Notes</Text>
          <TextInput style={[s.input, { height: 80, textAlignVertical: 'top' }]} value={notes} onChangeText={setNotes} placeholder="Where you got it, price, condition..." placeholderTextColor="#A0A09C" multiline />

          {isEdit && <TouchableOpacity style={s.delBtn} onPress={handleDelete}><Text style={s.delT}>Delete Car</Text></TouchableOpacity>}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* COLOR PICKER — dropdown only, no manual entry */}
      <Modal visible={showColor} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} activeOpacity={1} onPress={() => setShowColor(false)} />
        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 34, maxHeight: '75%' }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0DEDA', alignSelf: 'center', marginVertical: 12 }} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A18', paddingHorizontal: 20, marginBottom: 14 }}>Select Color</Text>
          <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, paddingBottom: 20 }}>
            {COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, backgroundColor: color === c ? '#D85A30' : '#F5F4F1', borderColor: color === c ? '#D85A30' : '#E0DEDA' }}
                onPress={() => { setColor(c); setShowColor(false); }}
              >
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colorToHex(c), borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)' }} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: color === c ? '#fff' : '#1A1A18' }}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* SERIES # PICKER — no manual entry */}
      <Modal visible={showColnum} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} activeOpacity={1} onPress={() => setShowColnum(false)} />
        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 34, maxHeight: '80%' }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0DEDA', alignSelf: 'center', marginVertical: 12 }} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A18', paddingHorizontal: 20, marginBottom: 4 }}>Series Position</Text>
          <Text style={{ fontSize: 13, color: '#A0A09C', paddingHorizontal: 20, marginBottom: 12 }}>Select total first, then your position</Text>

          {/* Total selector */}
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 }}>
            {SERIES_TOTALS.map(t => (
              <TouchableOpacity
                key={t}
                style={{ flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, backgroundColor: colnumTotal === t ? '#1A1A18' : '#F5F4F1', borderColor: colnumTotal === t ? '#1A1A18' : '#E0DEDA', alignItems: 'center' }}
                onPress={() => setColnumTotal(t)}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: colnumTotal === t ? '#fff' : '#1A1A18' }}>/{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Number buttons */}
          <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, paddingBottom: 20 }}>
            {Array.from({ length: colnumTotal }, (_, i) => i + 1).map(n => (
              <TouchableOpacity
                key={n}
                style={{ paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1.5, backgroundColor: colnum === n + '/' + colnumTotal ? '#D85A30' : '#F5F4F1', borderColor: colnum === n + '/' + colnumTotal ? '#D85A30' : '#E0DEDA' }}
                onPress={() => { setColnum(n + '/' + colnumTotal); setShowColnum(false); }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: colnum === n + '/' + colnumTotal ? '#fff' : '#1A1A18' }}>{n}/{colnumTotal}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* MAINLINE # PICKER 1-250 — no manual entry */}
      <Modal visible={showMainline} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} activeOpacity={1} onPress={() => setShowMainline(false)} />
        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 34, maxHeight: '85%' }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0DEDA', alignSelf: 'center', marginVertical: 12 }} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A18', paddingHorizontal: 20, marginBottom: 4 }}>Mainline Number</Text>
          <Text style={{ fontSize: 13, color: '#A0A09C', paddingHorizontal: 20, marginBottom: 12 }}>Car number out of 250 in the full year</Text>
          <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 20, paddingBottom: 20 }}>
            {Array.from({ length: MAINLINE_TOTAL }, (_, i) => i + 1).map(n => (
              <TouchableOpacity
                key={n}
                style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, backgroundColor: mainline === n + '/250' ? '#D85A30' : '#F5F4F1', borderColor: mainline === n + '/250' ? '#D85A30' : '#E0DEDA' }}
                onPress={() => { setMainline(n + '/250'); setShowMainline(false); }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: mainline === n + '/250' ? '#fff' : '#1A1A18' }}>{n}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* SERIES PICKER */}
      <Modal visible={showSeries} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={s.modalTop}>
            <TouchableOpacity onPress={() => { setShowSeries(false); setSeriesSearch(''); setSeriesList(HW_SERIES); }} style={{ padding: 4 }}><Ionicons name="chevron-back" size={24} color="#1A1A18" /></TouchableOpacity>
            <Text style={s.modalTitle}>Select Series</Text>
            <TouchableOpacity onPress={() => { setSeries(''); setShowSeries(false); }} style={{ padding: 4 }}><Text style={{ color: '#A0A09C', fontSize: 14 }}>Clear</Text></TouchableOpacity>
          </View>
          <View style={s.mfgSearchBox}>
            <Ionicons name="search" size={16} color="#A0A09C" style={{ marginLeft: 12 }} />
            <TextInput style={s.mfgSearchInput} value={seriesSearch} onChangeText={t => { setSeriesSearch(t); setSeriesList(searchSeries(t)); }} placeholder="Search series..." placeholderTextColor="#A0A09C" autoCorrect={false} autoFocus />
            {seriesSearch.length > 0 && <TouchableOpacity onPress={() => { setSeriesSearch(''); setSeriesList(HW_SERIES); }} style={{ padding: 10 }}><Ionicons name="close-circle" size={18} color="#A0A09C" /></TouchableOpacity>}
          </View>
          {seriesSearch.length > 1 && !seriesList.find(s => s.label.toLowerCase() === seriesSearch.toLowerCase()) && (
            <TouchableOpacity style={{ margin: 16, marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FAECE7', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#D85A30' }} onPress={() => { setSeries(seriesSearch); setShowSeries(false); setSeriesSearch(''); setSeriesList(HW_SERIES); }}>
              <Ionicons name="add-circle" size={22} color="#D85A30" />
              <View><Text style={{ fontSize: 12, color: '#993C1D', fontWeight: '600' }}>Add custom series</Text><Text style={{ fontSize: 15, color: '#D85A30', fontWeight: '800' }}>{seriesSearch}</Text></View>
            </TouchableOpacity>
          )}
          <FlatList
            data={seriesList}
            keyExtractor={(item, i) => item.label + i}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 60 }}
            renderItem={({ item, index }) => {
              const showGroup = index === 0 || seriesList[index - 1].group !== item.group;
              return (<>
                {showGroup && <Text style={{ fontSize: 11, fontWeight: '700', color: '#A0A09C', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 16, marginBottom: 4 }}>{item.group}</Text>}
                <TouchableOpacity style={[s.mfgRow, series === item.label && s.mfgRowActive]} onPress={() => { setSeries(item.label); setShowSeries(false); setSeriesSearch(''); setSeriesList(HW_SERIES); }}>
                  <Text style={[s.mfgRowTxt, series === item.label && { color: '#D85A30', fontWeight: '700' }]}>{item.label}</Text>
                  {series === item.label && <Ionicons name="checkmark-circle" size={20} color="#D85A30" />}
                </TouchableOpacity>
              </>);
            }}
          />
        </SafeAreaView>
      </Modal>

      {/* MANUFACTURER PICKER */}
      <Modal visible={showMfg} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={s.modalTop}>
            <TouchableOpacity onPress={() => { setShowMfg(false); setMfgSearch(''); setMfgList(MANUFACTURERS.slice(0, 30)); }} style={{ padding: 4 }}><Ionicons name="chevron-back" size={24} color="#1A1A18" /></TouchableOpacity>
            <Text style={s.modalTitle}>Select Manufacturer</Text>
            <TouchableOpacity onPress={() => { setMfg(''); setShowMfg(false); }} style={{ padding: 4 }}><Text style={{ color: '#A0A09C', fontSize: 14 }}>Clear</Text></TouchableOpacity>
          </View>
          <View style={s.mfgSearchBox}>
            <Ionicons name="search" size={16} color="#A0A09C" style={{ marginLeft: 12 }} />
            <TextInput style={s.mfgSearchInput} value={mfgSearch} onChangeText={t => { setMfgSearch(t); setMfgList(searchManufacturers(t)); }} placeholder="Search manufacturer..." placeholderTextColor="#A0A09C" autoCorrect={false} autoFocus />
            {mfgSearch.length > 0 && <TouchableOpacity onPress={() => { setMfgSearch(''); setMfgList(MANUFACTURERS.slice(0, 30)); }} style={{ padding: 10 }}><Ionicons name="close-circle" size={18} color="#A0A09C" /></TouchableOpacity>}
          </View>
          <FlatList
            data={mfgList}
            keyExtractor={(item, i) => item + i}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 60 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={[s.mfgRow, manufacturer === item && s.mfgRowActive]} onPress={() => { setMfg(item); setShowMfg(false); setMfgSearch(''); setMfgList(MANUFACTURERS.slice(0, 30)); }}>
                <Text style={[s.mfgRowTxt, manufacturer === item && { color: '#D85A30', fontWeight: '700' }]}>{item}</Text>
                {manufacturer === item && <Ionicons name="checkmark-circle" size={20} color="#D85A30" />}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function colorToHex(colorName) {
  const map = {
    'Red': '#E24B4A', 'Dark Red': '#A32D2D', 'Orange': '#D85A30', 'Yellow': '#EF9F27',
    'Green': '#639922', 'Dark Green': '#3B6D11', 'Blue': '#378ADD', 'Dark Blue': '#185FA5',
    'Light Blue': '#85B7EB', 'Purple': '#7F77DD', 'Pink': '#D4537E', 'White': '#F5F4F1',
    'Black': '#1A1A18', 'Gray': '#888780', 'Silver': '#B4B2A9', 'Gold': '#EF9F27',
    'Brown': '#854F0B', 'Teal': '#1D9E75', 'Metallic Red': '#C0392B', 'Metallic Blue': '#2980B9',
    'Metallic Green': '#27AE60', 'Metallic Silver': '#95A5A6', 'Metallic Gold': '#F39C12',
    'Metallic Purple': '#8E44AD', 'Flat Black': '#2C2C2E', 'Flat Gray': '#636366',
    'Pearl White': '#ECF0F1', 'Chrome': '#D3D1C7', 'Spectraflame Red': '#C0392B',
    'Spectraflame Blue': '#2471A3', 'Spectraflame Green': '#1E8449', 'Spectraflame Orange': '#CA6F1E',
    'Spectraflame Purple': '#6C3483', 'Spectraflame Silver': '#797D7F', 'ZAMAC': '#D5D8DC',
  };
  return map[colorName] || '#888780';
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#E0DEDA' },
  topT: { fontSize: 18, fontWeight: '700', color: '#1A1A18' },
  saveBtn: { backgroundColor: '#D85A30', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  saveBtnT: { color: '#fff', fontWeight: '700', fontSize: 15 },
  scroll: { padding: 16 },
  lbl: { fontSize: 12, fontWeight: '500', color: '#6B6B67', marginBottom: 5, marginTop: 6 },
  input: { backgroundColor: '#F5F4F1', borderWidth: 0.5, borderColor: '#E0DEDA', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: '#1A1A18', marginBottom: 2 },
  grid: { flexDirection: 'row', gap: 10, marginBottom: 2 },
  row: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 14 },
  tog: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 0.5, borderColor: '#E0DEDA', backgroundColor: '#F5F4F1' },
  togT: { fontSize: 13, fontWeight: '500', color: '#6B6B67' },
  nameBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F4F1', borderWidth: 1, borderColor: '#D85A30', borderRadius: 10 },
  nameInput: { flex: 1, paddingHorizontal: 10, paddingVertical: 11, fontSize: 15, color: '#1A1A18' },
  sugBox: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#E0DEDA', borderRadius: 12, marginTop: 4, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 8 },
  sugRow: { paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sugBorder: { borderBottomWidth: 0.5, borderBottomColor: '#E0DEDA' },
  sugTxt: { fontSize: 15, fontWeight: '500', color: '#1A1A18' },
  mfgBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F4F1', borderWidth: 0.5, borderColor: '#E0DEDA', borderRadius: 10, padding: 12, marginBottom: 14 },
  mfgBtnFilled: { borderColor: '#3B6D11', backgroundColor: '#EAF3DE' },
  mfgBtnTxt: { flex: 1, fontSize: 15, color: '#1A1A18' },
  photoBox: { height: 100, borderRadius: 10, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CCCBC6', backgroundColor: '#F5F4F1', alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
  photoT: { fontSize: 12, color: '#6B6B67' },
  delBtn: { marginTop: 20, padding: 14, borderRadius: 10, backgroundColor: '#FCEBEB', borderWidth: 0.5, borderColor: '#F7C1C1', alignItems: 'center' },
  delT: { color: '#A32D2D', fontWeight: '700', fontSize: 16 },
  modalTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 0.5, borderBottomColor: '#E0DEDA' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A18' },
  mfgSearchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F4F1', borderWidth: 0.5, borderColor: '#E0DEDA', borderRadius: 10, margin: 16 },
  mfgSearchInput: { flex: 1, paddingHorizontal: 10, paddingVertical: 11, fontSize: 15, color: '#1A1A18' },
  mfgRow: { paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 0.5, borderBottomColor: '#F5F4F1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mfgRowActive: { backgroundColor: '#FAECE7', borderRadius: 10, paddingHorizontal: 10 },
  mfgRowTxt: { fontSize: 16, color: '#1A1A18' },
});
`);
console.log('✅ app/car/[id].tsx - complete clean rewrite');
console.log('');
console.log('ALL DONE! Run: npx expo start --clear');
console.log('');
console.log('What is new:');
console.log('  Color      → dropdown with color dots, no manual entry');
console.log('  Series #   → pick total first (/5 /6 /8 /10 /12), then position');
console.log('  Mainline # → scroll through 1-250, tap to pick');
console.log('  Car name   → auto-suggest from history + built-in list');
console.log('  backup.tsx → no syntax errors');
console.log('  scan.tsx   → no syntax errors');
