#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Created:', filePath);
}

// Install ImageManipulator for photo compression
const { execSync } = require('child_process');
console.log('📦 Installing expo-image-manipulator for photo compression...');
try {
  execSync('npx expo install expo-image-manipulator', { stdio: 'inherit' });
} catch(e) {
  console.log('Note: expo-image-manipulator install - continue anyway');
}

// Updated car form with Wiki search + photo compression
write('app/car/[id].tsx', `import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Image, Alert,
  KeyboardAvoidingView, Platform, FlatList, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { loadCars, addCar, updateCar, deleteCar, uid, Car } from '../../lib/storage';

// Search Hot Wheels + Matchbox Fandom Wiki
async function searchWiki(query, brand) {
  if (!query || query.length < 2) return [];
  try {
    const wiki = brand === 'mb'
      ? 'https://matchbox.fandom.com'
      : 'https://hotwheels.fandom.com';
    const url = wiki + '/api.php?action=query&list=search&srsearch=' +
      encodeURIComponent(query) + '&srlimit=12&format=json&origin=*';
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    return (data?.query?.search || []).map(r => ({
      title: r.title,
      snippet: r.snippet.replace(/<[^>]+>/g, '').slice(0, 80),
    }));
  } catch(e) {
    return [];
  }
}

// Fetch car details from wiki page
async function fetchCarDetails(title, brand) {
  try {
    const wiki = brand === 'mb'
      ? 'https://matchbox.fandom.com'
      : 'https://hotwheels.fandom.com';
    const url = wiki + '/api.php?action=query&prop=revisions&rvprop=content&titles=' +
      encodeURIComponent(title) + '&format=json&origin=*';
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const page = Object.values(pages)[0];
    const content = page?.revisions?.[0]?.['*'] || '';

    // Parse wiki template fields
    const get = (key) => {
      const match = content.match(new RegExp('\\|\\s*' + key + '\\s*=\\s*([^\\|\\}\\n]+)'));
      return match ? match[1].replace(/<[^>]+>/g, '').trim() : '';
    };

    const series = get('series') || get('Series') || get('segment') || '';
    const year = get('year') || get('Year') || get('debut') || '';
    const colnum = get('number') || get('Number') || get('col') || '';
    const designer = get('designer') || get('Designer') || '';

    return { series, year, colnum, designer };
  } catch(e) {
    return {};
  }
}

// Compress photo to max 300x300, ~50KB
async function compressPhoto(uri) {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 300, height: 300 } }],
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch(e) {
    return uri;
  }
}

export default function CarForm() {
  const { id, prefill } = useLocalSearchParams();
  const router = useRouter();
  const isEdit = !!id && id !== 'add';

  const [brand, setBrand] = useState('hw');
  const [name, setName] = useState('');
  const [series, setSeries] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [color, setColor] = useState('');
  const [colnum, setColnum] = useState('');
  const [tampo, setTampo] = useState('');
  const [notes, setNotes] = useState('');
  const [th, setTh] = useState('none');
  const [status, setStatus] = useState('owned');
  const [photo, setPhoto] = useState(null);

  // Search state
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimer = useRef(null);

  useEffect(() => {
    if (prefill) {
      try {
        const p = JSON.parse(prefill);
        if (p.colnum) setColnum(p.colnum);
        if (p.brand) setBrand(p.brand);
      } catch {}
    }
    if (isEdit) {
      loadCars().then(cars => {
        const c = cars.find(x => x.id === id);
        if (c) {
          setBrand(c.brand); setName(c.name); setSeries(c.series);
          setYear(c.year); setColor(c.color); setColnum(c.colnum);
          setTampo(c.tampo); setNotes(c.notes); setTh(c.th);
          setStatus(c.status); setPhoto(c.photo);
        }
      });
    }
  }, [id, prefill]);

  // Live search as user types
  function onNameChange(text) {
    setName(text);
    setShowResults(true);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (text.length < 2) { setSearchResults([]); setShowResults(false); return; }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      const results = await searchWiki(text, brand);
      setSearchResults(results);
      setSearching(false);
    }, 400);
  }

  // When user taps a result
  async function selectCar(item) {
    setName(item.title);
    setShowResults(false);
    setSearchResults([]);
    setSearching(true);
    // Fetch more details from wiki
    const details = await fetchCarDetails(item.title, brand);
    if (details.series) setSeries(details.series);
    if (details.year) setYear(details.year);
    if (details.colnum) setColnum(details.colnum);
    setSearching(false);
  }

  async function pickPhoto() {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1,1], quality: 1
    });
    if (!r.canceled) {
      const compressed = await compressPhoto(r.assets[0].uri);
      setPhoto(compressed);
    }
  }

  async function takePhoto() {
    const { status: cs } = await ImagePicker.requestCameraPermissionsAsync();
    if (cs !== 'granted') { Alert.alert('Permission needed', 'Allow camera in Settings.'); return; }
    const r = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1,1], quality: 1
    });
    if (!r.canceled) {
      const compressed = await compressPhoto(r.assets[0].uri);
      setPhoto(compressed);
    }
  }

  async function save() {
    if (!name.trim()) { Alert.alert('Name required', 'Please enter the car name.'); return; }
    const cars = await loadCars();
    const car = {
      id: isEdit ? id : uid(),
      brand, name: name.trim(), series: series.trim(), year: year.trim(),
      color: color.trim(), colnum: colnum.trim(), tampo: tampo.trim(),
      notes: notes.trim(), th, status, photo,
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

  const T = ({ label, active, onPress, ac, tc }) => (
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
            <T label="Hot Wheels" active={brand === 'hw'} onPress={() => { setBrand('hw'); setSearchResults([]); }} ac="#FAECE7" tc="#993C1D" />
            <T label="Matchbox" active={brand === 'mb'} onPress={() => { setBrand('mb'); setSearchResults([]); }} ac="#E6F1FB" tc="#0C447C" />
          </View>

          {/* Car name with live search */}
          <Text style={s.lbl}>Car name *</Text>
          <View style={s.searchBox}>
            <TextInput
              style={s.searchInput}
              value={name}
              onChangeText={onNameChange}
              placeholder={brand === 'hw' ? 'Search Hot Wheels (e.g. Bone Shaker)' : 'Search Matchbox (e.g. Ambulance)'}
              placeholderTextColor="#A0A09C"
              autoCorrect={false}
            />
            {searching && <ActivityIndicator size="small" color="#D85A30" style={{ marginRight: 10 }} />}
            {name.length > 0 && !searching && (
              <TouchableOpacity onPress={() => { setName(''); setSearchResults([]); setShowResults(false); }} style={{ padding: 8 }}>
                <Ionicons name="close-circle" size={18} color="#A0A09C" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search results dropdown */}
          {showResults && searchResults.length > 0 && (
            <View style={s.dropdown}>
              {searchResults.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[s.dropItem, i < searchResults.length - 1 && s.dropItemBorder]}
                  onPress={() => selectCar(item)}
                >
                  <Text style={s.dropTitle}>{item.title}</Text>
                  {!!item.snippet && <Text style={s.dropSnippet} numberOfLines={1}>{item.snippet}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          )}
          {showResults && searchResults.length === 0 && !searching && name.length >= 2 && (
            <View style={s.noResults}>
              <Text style={s.noResultsTxt}>No results — type the name manually</Text>
            </View>
          )}

          {/* Series + Year */}
          <View style={s.grid}>
            <View style={{ flex: 1 }}>
              <Text style={s.lbl}>Series</Text>
              <TextInput style={s.input} value={series} onChangeText={setSeries} placeholder="Mainline" placeholderTextColor="#A0A09C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.lbl}>Year</Text>
              <TextInput style={s.input} value={year} onChangeText={setYear} placeholder="2024" placeholderTextColor="#A0A09C" keyboardType="numeric" />
            </View>
          </View>

          {/* Color + Collector # */}
          <View style={s.grid}>
            <View style={{ flex: 1 }}>
              <Text style={s.lbl}>Color</Text>
              <TextInput style={s.input} value={color} onChangeText={setColor} placeholder="Flame Red" placeholderTextColor="#A0A09C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.lbl}>Collector #</Text>
              <TextInput style={s.input} value={colnum} onChangeText={setColnum} placeholder="042/250" placeholderTextColor="#A0A09C" />
            </View>
          </View>

          {/* Tampo */}
          <Text style={s.lbl}>Tampo / decoration</Text>
          <TextInput style={s.input} value={tampo} onChangeText={setTampo} placeholder="flames on hood, stripe..." placeholderTextColor="#A0A09C" />

          {/* Treasure Hunt */}
          <Text style={s.lbl}>Treasure Hunt?</Text>
          <View style={s.row}>
            <T label="None" active={th === 'none'} onPress={() => setTh('none')} ac="#EAF3DE" tc="#3B6D11" />
            <T label="TH" active={th === 'th'} onPress={() => setTh('th')} ac="#EAF3DE" tc="#3B6D11" />
            <T label="Super TH" active={th === 'sth'} onPress={() => setTh('sth')} ac="#FAEEDA" tc="#BA7517" />
          </View>

          {/* Photo */}
          <Text style={s.lbl}>Photo <Text style={s.photoNote}>(auto compressed to small size)</Text></Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <TouchableOpacity style={[s.photoBox, { flex: 2 }]} onPress={takePhoto}>
              {photo
                ? <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} />
                : <><Ionicons name="camera" size={22} color="#6B6B67" /><Text style={s.photoT}>Camera</Text></>
              }
            </TouchableOpacity>
            <TouchableOpacity style={[s.photoBox, { flex: 1 }]} onPress={pickPhoto}>
              <Ionicons name="images" size={22} color="#6B6B67" />
              <Text style={s.photoT}>Library</Text>
            </TouchableOpacity>
            {photo && (
              <TouchableOpacity style={[s.photoBox, { flex: 1 }]} onPress={() => setPhoto(null)}>
                <Ionicons name="trash-outline" size={22} color="#A32D2D" />
                <Text style={[s.photoT, { color: '#A32D2D' }]}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Status */}
          <Text style={s.lbl}>Status</Text>
          <View style={s.row}>
            <T label="I own it" active={status === 'owned'} onPress={() => setStatus('owned')} ac="#EAF3DE" tc="#3B6D11" />
            <T label="Wishlist" active={status === 'wish'} onPress={() => setStatus('wish')} ac="#E6F1FB" tc="#0C447C" />
            <T label="Duplicate" active={status === 'dup'} onPress={() => setStatus('dup')} ac="#FCEBEB" tc="#A32D2D" />
          </View>

          {/* Notes */}
          <Text style={s.lbl}>Notes</Text>
          <TextInput
            style={[s.input, { height: 80, textAlignVertical: 'top' }]}
            value={notes} onChangeText={setNotes}
            placeholder="Where you got it, price paid, condition..."
            placeholderTextColor="#A0A09C" multiline
          />

          {isEdit && (
            <TouchableOpacity style={s.delBtn} onPress={handleDelete}>
              <Text style={s.delT}>Delete Car</Text>
            </TouchableOpacity>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#E0DEDA' },
  topT: { fontSize: 18, fontWeight: '700', color: '#1A1A18' },
  saveBtn: { backgroundColor: '#D85A30', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  saveBtnT: { color: '#fff', fontWeight: '700', fontSize: 15 },
  scroll: { padding: 16 },
  lbl: { fontSize: 12, fontWeight: '500', color: '#6B6B67', marginBottom: 5, marginTop: 4 },
  input: { backgroundColor: '#F5F4F1', borderWidth: 0.5, borderColor: '#E0DEDA', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: '#1A1A18', marginBottom: 2 },
  grid: { flexDirection: 'row', gap: 10, marginBottom: 2 },
  row: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 14 },
  tog: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 0.5, borderColor: '#E0DEDA', backgroundColor: '#F5F4F1' },
  togT: { fontSize: 13, fontWeight: '500', color: '#6B6B67' },
  // Search box
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F4F1', borderWidth: 0.5, borderColor: '#E0DEDA', borderRadius: 10, marginBottom: 2 },
  searchInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: '#1A1A18' },
  // Dropdown
  dropdown: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#E0DEDA', borderRadius: 12, marginBottom: 8, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  dropItem: { paddingHorizontal: 14, paddingVertical: 12 },
  dropItemBorder: { borderBottomWidth: 0.5, borderBottomColor: '#E0DEDA' },
  dropTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A18' },
  dropSnippet: { fontSize: 12, color: '#6B6B67', marginTop: 2 },
  noResults: { backgroundColor: '#F5F4F1', borderRadius: 10, padding: 12, marginBottom: 8 },
  noResultsTxt: { fontSize: 13, color: '#A0A09C', textAlign: 'center' },
  // Photo
  photoNote: { fontSize: 11, color: '#A0A09C', fontWeight: '400' },
  photoBox: { height: 100, borderRadius: 10, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CCCBC6', backgroundColor: '#F5F4F1', alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
  photoT: { fontSize: 12, color: '#6B6B67' },
  delBtn: { marginTop: 20, padding: 14, borderRadius: 10, backgroundColor: '#FCEBEB', borderWidth: 0.5, borderColor: '#F7C1C1', alignItems: 'center' },
  delT: { color: '#A32D2D', fontWeight: '700', fontSize: 16 },
});
`);

console.log('\n🚗 DONE! Now run: npx expo start --clear');
console.log('\nHow the search works:');
console.log('- Type 2+ letters in car name field');
console.log('- Results from Hot Wheels or Matchbox wiki appear instantly');
console.log('- Tap a result to auto-fill name, series, year');
console.log('- Photos auto-compressed to ~50KB when saved');
