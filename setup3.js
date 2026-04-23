#!/usr/bin/env node
const fs = require('fs');

// Just overwrite the car form with fixed search
fs.writeFileSync('app/car/[id].tsx', `import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Image, Alert,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { loadCars, addCar, updateCar, deleteCar, uid } from '../../lib/storage';

// Search wiki with timeout using Promise.race
async function searchWiki(query, brand) {
  if (!query || query.length < 2) return [];
  const wiki = brand === 'mb'
    ? 'https://matchbox.fandom.com'
    : 'https://hotwheels.fandom.com';
  const url = wiki + '/api/v1/Search/List?query=' +
    encodeURIComponent(query) + '&limit=10&namespaces=0';
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 6000)
    );
    const request = fetch(url).then(r => r.json());
    const data = await Promise.race([request, timeout]);
    return (data?.items || []).map(item => ({
      title: item.title,
      url: item.url,
    }));
  } catch(e) {
    // Fallback to mediawiki search
    try {
      const fallback = wiki + '/api.php?action=query&list=search&srsearch=' +
        encodeURIComponent(query) + '&srlimit=10&format=json';
      const timeout2 = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 6000)
      );
      const req2 = fetch(fallback).then(r => r.json());
      const data2 = await Promise.race([req2, timeout2]);
      return (data2?.query?.search || []).map(r => ({ title: r.title }));
    } catch(e2) {
      return [];
    }
  }
}

// Compress photo manually without expo-image-manipulator
async function compressPhoto(uri) {
  try {
    const ImageManipulator = require('expo-image-manipulator');
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 300 } }],
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
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const timer = useRef(null);

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

  function onNameChange(text) {
    setName(text);
    if (timer.current) clearTimeout(timer.current);
    if (text.length < 2) {
      setResults([]);
      setShowDrop(false);
      return;
    }
    setShowDrop(true);
    setSearching(true);
    timer.current = setTimeout(async () => {
      const found = await searchWiki(text, brand);
      setResults(found);
      setSearching(false);
    }, 500);
  }

  function selectResult(item) {
    setName(item.title);
    setResults([]);
    setShowDrop(false);
  }

  async function pickPhoto() {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8
    });
    if (!r.canceled) {
      const uri = await compressPhoto(r.assets[0].uri);
      setPhoto(uri);
    }
  }

  async function takePhoto() {
    const { status: cs } = await ImagePicker.requestCameraPermissionsAsync();
    if (cs !== 'granted') { Alert.alert('Permission needed', 'Allow camera in Settings.'); return; }
    const r = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.8
    });
    if (!r.canceled) {
      const uri = await compressPhoto(r.assets[0].uri);
      setPhoto(uri);
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
    <TouchableOpacity
      style={[s.tog, active && { backgroundColor: ac, borderColor: tc }]}
      onPress={onPress}>
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

          <Text style={s.lbl}>Brand</Text>
          <View style={s.row}>
            <T label="Hot Wheels" active={brand === 'hw'} onPress={() => { setBrand('hw'); setResults([]); setShowDrop(false); }} ac="#FAECE7" tc="#993C1D" />
            <T label="Matchbox" active={brand === 'mb'} onPress={() => { setBrand('mb'); setResults([]); setShowDrop(false); }} ac="#E6F1FB" tc="#0C447C" />
          </View>

          <Text style={s.lbl}>Car name *</Text>
          <View style={s.nameWrap}>
            <View style={s.nameBox}>
              <TextInput
                style={s.nameInput}
                value={name}
                onChangeText={onNameChange}
                placeholder={brand === 'hw' ? 'Type to search Hot Wheels...' : 'Type to search Matchbox...'}
                placeholderTextColor="#A0A09C"
                autoCorrect={false}
                autoCapitalize="words"
                onFocus={() => { if (name.length >= 2) setShowDrop(true); }}
                onBlur={() => setTimeout(() => setShowDrop(false), 200)}
              />
              {searching
                ? <ActivityIndicator size="small" color="#D85A30" style={{ marginRight: 12 }} />
                : name.length > 0
                  ? <TouchableOpacity onPress={() => { setName(''); setResults([]); setShowDrop(false); }} style={{ padding: 10 }}>
                      <Ionicons name="close-circle" size={18} color="#A0A09C" />
                    </TouchableOpacity>
                  : <Ionicons name="search" size={16} color="#A0A09C" style={{ marginRight: 12 }} />
              }
            </View>

            {/* Dropdown */}
            {showDrop && (
              <View style={s.drop}>
                {results.length > 0 ? (
                  results.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[s.dropRow, i < results.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: '#E0DEDA' }]}
                      onPress={() => selectResult(item)}
                    >
                      <Text style={s.dropName}>{item.title}</Text>
                    </TouchableOpacity>
                  ))
                ) : !searching ? (
                  <View style={s.dropRow}>
                    <Text style={{ fontSize: 13, color: '#A0A09C' }}>No results — you can still type manually</Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>

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

          <Text style={s.lbl}>Tampo</Text>
          <TextInput style={s.input} value={tampo} onChangeText={setTampo} placeholder="flames on hood..." placeholderTextColor="#A0A09C" />

          <Text style={s.lbl}>Treasure Hunt?</Text>
          <View style={s.row}>
            <T label="None" active={th === 'none'} onPress={() => setTh('none')} ac="#EAF3DE" tc="#3B6D11" />
            <T label="TH" active={th === 'th'} onPress={() => setTh('th')} ac="#EAF3DE" tc="#3B6D11" />
            <T label="Super TH" active={th === 'sth'} onPress={() => setTh('sth')} ac="#FAEEDA" tc="#BA7517" />
          </View>

          <Text style={s.lbl}>Photo <Text style={{ fontSize: 11, color: '#A0A09C', fontWeight: '400' }}>(auto compressed)</Text></Text>
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
                <Ionicons name="trash-outline" size={20} color="#A32D2D" />
                <Text style={[s.photoT, { color: '#A32D2D' }]}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={s.lbl}>Status</Text>
          <View style={s.row}>
            <T label="I own it" active={status === 'owned'} onPress={() => setStatus('owned')} ac="#EAF3DE" tc="#3B6D11" />
            <T label="Wishlist" active={status === 'wish'} onPress={() => setStatus('wish')} ac="#E6F1FB" tc="#0C447C" />
            <T label="Duplicate" active={status === 'dup'} onPress={() => setStatus('dup')} ac="#FCEBEB" tc="#A32D2D" />
          </View>

          <Text style={s.lbl}>Notes</Text>
          <TextInput
            style={[s.input, { height: 80, textAlignVertical: 'top' }]}
            value={notes} onChangeText={setNotes}
            placeholder="Where you got it, price paid..."
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
  nameWrap: { marginBottom: 2, zIndex: 999 },
  nameBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F4F1', borderWidth: 0.5, borderColor: '#D85A30', borderRadius: 10 },
  nameInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, color: '#1A1A18' },
  drop: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#E0DEDA', borderRadius: 12, marginTop: 4, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8, marginBottom: 8 },
  dropRow: { paddingHorizontal: 14, paddingVertical: 13 },
  dropName: { fontSize: 15, fontWeight: '600', color: '#1A1A18' },
  photoBox: { height: 100, borderRadius: 10, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CCCBC6', backgroundColor: '#F5F4F1', alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
  photoT: { fontSize: 12, color: '#6B6B67' },
  delBtn: { marginTop: 20, padding: 14, borderRadius: 10, backgroundColor: '#FCEBEB', borderWidth: 0.5, borderColor: '#F7C1C1', alignItems: 'center' },
  delT: { color: '#A32D2D', fontWeight: '700', fontSize: 16 },
});
`);

console.log('✅ Fixed! Now run: npx expo start --clear');
