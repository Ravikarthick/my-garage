import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Image, Alert, Modal, FlatList,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadCars, addCar, updateCar, deleteCar, uid } from '../../lib/storage';
import { searchManufacturers, detectManufacturer, MANUFACTURERS, HW_CARS, MB_CARS } from '../../lib/carDatabase';
import { HW_SERIES, searchSeries } from '../../lib/seriesData';

const HISTORY_KEY = 'mygarage_car_history';
const CUSTOM_SERIES_KEY = 'mygarage_custom_series';

const COLORS = [
  'Red','Dark Red','Orange','Yellow','Green','Dark Green',
  'Blue','Dark Blue','Light Blue','Purple','Pink','White',
  'Black','Gray','Silver','Gold','Brown','Teal',
  'Metallic Red','Metallic Blue','Metallic Green','Metallic Silver',
  'Metallic Gold','Metallic Purple','Flat Black','Flat Gray',
  'Pearl White','Chrome','Spectraflame Red','Spectraflame Blue',
  'Spectraflame Green','Spectraflame Orange','Spectraflame Purple',
  'Spectraflame Silver','ZAMAC',
];

const SERIES_TOTALS = [5, 6, 8, 10, 12];

export default function CarForm() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isEdit = !!id && id !== 'add';

  const [brand, setBrand]       = useState('hw');
  const [name, setName]         = useState('');
  const [mfg, setMfg]           = useState('');
  const [series, setSeries]     = useState('');
  const [year, setYear]         = useState(String(new Date().getFullYear()));
  const [color, setColor]       = useState('');
  const [colnum, setColnum]     = useState('');
  const [mainline, setMainline] = useState('');
  const [tampo, setTampo]       = useState('');
  const [notes, setNotes]       = useState('');
  const [th, setTh]             = useState('none');
  const [status, setStatus]     = useState('owned');
  const [photo, setPhoto]       = useState(null);
  const [saving, setSaving]     = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [nameSug, setNameSug]   = useState([]);
  const [history, setHistory]   = useState([]);
  const [modal, setModal]       = useState(null);
  const [colnumTotal, setColnumTotal] = useState(5);
  const [mfgQ, setMfgQ]         = useState('');
  const [mfgList, setMfgList]   = useState(MANUFACTURERS.slice(0, 40));
  const [seriesQ, setSeriesQ]   = useState('');
  const [seriesList, setSeriesList] = useState(HW_SERIES);
  const [customSeriesList, setCustomSeriesList] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then(d => { if (d) setHistory(JSON.parse(d)); });
    AsyncStorage.getItem(CUSTOM_SERIES_KEY).then(d => {
      if (d) setCustomSeriesList(JSON.parse(d).map(label => ({ label, group: 'My Custom Series' })));
    });
    if (isEdit) {
      loadCars().then(cars => {
        const c = cars.find(x => x.id === id);
        if (!c) return;
        setBrand(c.brand || 'hw');
        setName(c.name || '');
        setMfg(c.manufacturer || '');
        setSeries(c.series || '');
        setYear(c.year || '');
        setColor(c.color || '');
        setColnum(c.colnum || '');
        setMainline(c.mainline || '');
        setTampo(c.tampo || '');
        setNotes(c.notes || '');
        setTh(c.th || 'none');
        setStatus(c.status || 'owned');
        setPhoto(c.photo || null);
      });
    }
  }, []);

  function onNameChange(text) {
    setName(text);
    const d = detectManufacturer(text);
    if (d && !mfg) setMfg(d);
    if (text.length >= 1) {
      const q = text.toLowerCase();
      const list = brand === 'hw' ? HW_CARS : MB_CARS;
      const h = history.filter(x => x.toLowerCase().includes(q));
      const l = list.filter(x => x.toLowerCase().includes(q));
      setNameSug([...new Set([...h, ...l])].slice(0, 10));
    } else {
      setNameSug(history.slice(0, 8));
    }
  }

  async function save() {
    if (!name.trim()) { Alert.alert('Car name required'); return; }
    setSaving(true);
    try {
      const updated = [name.trim(), ...history.filter(h => h !== name.trim())].slice(0, 50);
      setHistory(updated);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      const cars = await loadCars();
      const car = {
        id: isEdit ? id : uid(),
        brand, name: name.trim(), manufacturer: mfg.trim(),
        series: series.trim(), year: year.trim(), color: color.trim(),
        colnum: colnum.trim(), mainline: mainline.trim(),
        tampo: tampo.trim(), notes: notes.trim(),
        th, status, photo,
        added: isEdit ? (cars.find(c => c.id === id)?.added || Date.now()) : Date.now()
      };
      if (isEdit) await updateCar(car); else await addCar(car);
      router.back();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    Alert.alert('Delete Car', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteCar(id); router.back(); } }
    ]);
  }

  async function takePhoto() {
    const { status: s } = await ImagePicker.requestCameraPermissionsAsync();
    if (s !== 'granted') { Alert.alert('Camera permission needed'); return; }
    const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1,1], quality: 0.8 });
    if (!r.canceled) {
      try {
        const compressed = await ImageManipulator.manipulateAsync(r.assets[0].uri, [{ resize: { width: 600 } }], { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true });
        setPhoto('data:image/jpeg;base64,' + compressed.base64);
      } catch(e) { setPhoto(r.assets[0].uri); }
    }
  }

  async function pickPhoto() {
    const r = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1,1], quality: 0.8 });
    if (!r.canceled) {
      try {
        const compressed = await ImageManipulator.manipulateAsync(r.assets[0].uri, [{ resize: { width: 600 } }], { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true });
        setPhoto('data:image/jpeg;base64,' + compressed.base64);
      } catch(e) { setPhoto(r.assets[0].uri); }
    }
  }

  async function scanCard() {
    try {
      const { status: s } = await ImagePicker.requestCameraPermissionsAsync();
      if (s !== 'granted') { Alert.alert('Camera permission needed'); return; }
      const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.6, base64: true });
      if (r.canceled || !r.assets[0].base64) return;
      setOcrLoading(true);
      let base64 = r.assets[0].base64;
      try {
        const c = await ImageManipulator.manipulateAsync(r.assets[0].uri, [{ resize: { width: 800 } }], { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true });
        base64 = c.base64;
      } catch(e) {}
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 150,
          messages: [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
            { type: 'text', text: 'Hot Wheels or Matchbox card. Find the car name. Reply ONLY with JSON: {"name":"car name","series":"or empty","year":"4 digits or empty","colnum":"like 4/5 or empty"}' }
          ]}]
        })
      });
      const data = await resp.json();
      const txt = (data && data.content && data.content[0] && data.content[0].text) || '';
      const match = txt.match(/\{[^{}]*\}/);
      if (match) {
        const p = JSON.parse(match[0]);
        if (p.name) { setName(p.name); const d = detectManufacturer(p.name); if (d) setMfg(d); }
        if (p.series) setSeries(p.series);
        if (p.year) setYear(p.year);
        if (p.colnum) setColnum(p.colnum);
        Alert.alert('Done!', 'Check fields and adjust if needed.');
      } else {
        Alert.alert('Could not read card', 'Try better lighting.');
      }
    } catch(e) {
      Alert.alert('Could not read card', 'Try better lighting.');
    } finally {
      setOcrLoading(false);
    }
  }

  async function addCustomSeries(label) {
    const existing = customSeriesList.map(s => s.label);
    if (!existing.includes(label)) {
      const updated = [{ label, group: 'My Custom Series' }, ...customSeriesList];
      setCustomSeriesList(updated);
      await AsyncStorage.setItem(CUSTOM_SERIES_KEY, JSON.stringify(updated.map(s => s.label)));
    }
    setSeries(label);
    setModal(null);
    setSeriesQ('');
    setSeriesList(HW_SERIES);
  }

  const Chip = ({ label, active, onPress, ac, tc }) => (
    <TouchableOpacity onPress={onPress} style={[s.chip, active && { backgroundColor: ac, borderColor: tc }]}>
      <Text style={[s.chipT, active && { color: tc }]}>{label}</Text>
    </TouchableOpacity>
  );

  const allSeries = [...customSeriesList, ...HW_SERIES];

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color="#1A1A18" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{isEdit ? 'Edit Car' : 'Add Car'}</Text>
        <TouchableOpacity onPress={save} style={s.saveBtn} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.saveBtnT}>Save</Text>}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <Text style={s.lbl}>Brand</Text>
          <View style={s.row}>
            <Chip label="🔥 Hot Wheels" active={brand==='hw'} onPress={() => { setBrand('hw'); setNameSug([]); }} ac="#FAECE7" tc="#993C1D" />
            <Chip label="🚙 Matchbox" active={brand==='mb'} onPress={() => { setBrand('mb'); setNameSug([]); }} ac="#E6F1FB" tc="#0C447C" />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, marginTop: 8 }}>
            <Text style={[s.lbl, { marginBottom: 0, marginTop: 0 }]}>Car name *</Text>
            <TouchableOpacity onPress={scanCard} disabled={ocrLoading} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: ocrLoading ? '#ccc' : '#185FA5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 }}>
              {ocrLoading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="camera-outline" size={14} color="#fff" />}
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{ocrLoading ? 'Reading...' : 'Scan Card'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ zIndex: 100, marginBottom: 4 }}>
            <View style={s.nameBox}>
              <Ionicons name="search" size={16} color="#A0A09C" style={{ marginLeft: 12 }} />
              <TextInput
                style={s.nameInput}
                value={name}
                onChangeText={onNameChange}
                onFocus={() => !name && setNameSug(history.slice(0, 8))}
                onBlur={() => setTimeout(() => setNameSug([]), 200)}
                placeholder="Type car name..."
                placeholderTextColor="#A0A09C"
                autoCorrect={false}
                autoCapitalize="words"
                returnKeyType="done"
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
                  <TouchableOpacity
                    key={i}
                    style={[s.sugRow, i < nameSug.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: '#F0EFEC' }]}
                    onPress={() => { setName(item); setNameSug([]); const d = detectManufacturer(item); if (d) setMfg(d); }}
                  >
                    {history.includes(item) && <Ionicons name="time-outline" size={13} color="#A0A09C" />}
                    <Text style={s.sugTxt}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text style={s.lbl}>Manufacturer{mfg ? <Text style={{ color: '#3B6D11' }}> (auto-detected)</Text> : ''}</Text>
          <TouchableOpacity style={[s.fieldBtn, mfg && { borderColor: '#3B6D11', backgroundColor: '#EAF3DE' }, { marginBottom: 14 }]} onPress={() => setModal('mfg')}>
            <Ionicons name="business-outline" size={16} color={mfg ? '#1A1A18' : '#A0A09C'} style={{ marginRight: 8 }} />
            <Text style={[s.fieldVal, !mfg && { color: '#A0A09C' }, { flex: 1 }]} numberOfLines={1}>{mfg || 'Select manufacturer...'}</Text>
            <Ionicons name="chevron-down" size={14} color="#A0A09C" />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
            <View style={{ flex: 2 }}>
              <Text style={s.lbl}>{brand === 'mb' ? 'MBX # (1-125)' : 'Series'}</Text>
              {brand === 'mb' ? (
                <TextInput style={[s.fieldBtn, { paddingVertical: 11 }]} value={series} onChangeText={t => setSeries(t.replace(/[^0-9/]/g, ''))} placeholder="47/125" placeholderTextColor="#A0A09C" keyboardType="numeric" maxLength={7} />
              ) : (
                <TouchableOpacity style={s.fieldBtn} onPress={() => setModal('series')}>
                  <Text style={[s.fieldVal, !series && { color: '#A0A09C' }, { flex: 1 }]} numberOfLines={1}>{series || 'Select...'}</Text>
                  <Ionicons name="chevron-down" size={14} color="#A0A09C" />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.lbl}>Year</Text>
              <TextInput style={[s.fieldBtn, { paddingVertical: 11 }]} value={year} onChangeText={setYear} placeholder="2026" placeholderTextColor="#A0A09C" keyboardType="numeric" maxLength={4} />
            </View>
          </View>

          <Text style={s.lbl}>Color</Text>
          <TouchableOpacity style={[s.fieldBtn, { marginBottom: 10 }]} onPress={() => setModal('color')}>
            <Text style={[s.fieldVal, !color && { color: '#A0A09C' }, { flex: 1 }]}>{color || 'Select color...'}</Text>
            <Ionicons name="chevron-down" size={14} color="#A0A09C" />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.lbl}>Series #</Text>
              <TouchableOpacity style={s.fieldBtn} onPress={() => setModal('colnum')}>
                <Text style={[s.fieldVal, !colnum && { color: '#A0A09C' }, { flex: 1 }]}>{colnum || '4/5'}</Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.lbl}>Mainline #</Text>
              <TouchableOpacity style={s.fieldBtn} onPress={() => setModal('mainline')}>
                <Text style={[s.fieldVal, !mainline && { color: '#A0A09C' }, { flex: 1 }]}>{mainline || '32/250'}</Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={s.lbl}>Tampo</Text>
          <TextInput style={[s.fieldBtn, { paddingVertical: 11, marginBottom: 10 }]} value={tampo} onChangeText={setTampo} placeholder="flames on hood..." placeholderTextColor="#A0A09C" />

          <Text style={s.lbl}>Treasure Hunt?</Text>
          <View style={[s.row, { marginBottom: 14 }]}>
            <Chip label="None" active={th==='none'} onPress={() => setTh('none')} ac="#EAF3DE" tc="#3B6D11" />
            <Chip label="⭐ TH" active={th==='th'} onPress={() => setTh('th')} ac="#EAF3DE" tc="#3B6D11" />
            <Chip label="🌟 Super TH" active={th==='sth'} onPress={() => setTh('sth')} ac="#FAEEDA" tc="#BA7517" />
          </View>

          <Text style={s.lbl}>Photo</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <TouchableOpacity style={[s.photoBox, { flex: 2 }]} onPress={takePhoto}>
              {photo ? <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : <><Ionicons name="camera" size={24} color="#6B6B67" /><Text style={s.photoT}>Camera</Text></>}
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
          <View style={[s.row, { marginBottom: 14 }]}>
            <Chip label="✓ I own it" active={status==='owned'} onPress={() => setStatus('owned')} ac="#EAF3DE" tc="#3B6D11" />
            <Chip label="♡ Wishlist" active={status==='wish'} onPress={() => setStatus('wish')} ac="#E6F1FB" tc="#0C447C" />
            <Chip label="2× Duplicate" active={status==='dup'} onPress={() => setStatus('dup')} ac="#FCEBEB" tc="#A32D2D" />
          </View>

          <Text style={s.lbl}>Notes</Text>
          <TextInput style={[s.fieldBtn, { height: 80, textAlignVertical: 'top', paddingTop: 11, marginBottom: 10 }]} value={notes} onChangeText={setNotes} placeholder="Where you got it, price, condition..." placeholderTextColor="#A0A09C" multiline />

          {isEdit && (
            <TouchableOpacity style={s.delBtn} onPress={handleDelete}>
              <Text style={s.delT}>Delete Car</Text>
            </TouchableOpacity>
          )}
          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={modal === 'mfg'} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => { setModal(null); setMfgQ(''); setMfgList(MANUFACTURERS.slice(0,40)); }}>
              <Ionicons name="chevron-back" size={24} color="#1A1A18" />
            </TouchableOpacity>
            <Text style={s.modalTitle}>Manufacturer</Text>
            <TouchableOpacity onPress={() => { setMfg(''); setModal(null); }}>
              <Text style={{ color: '#A0A09C', fontSize: 14 }}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={s.searchBox}>
            <Ionicons name="search" size={16} color="#A0A09C" style={{ marginLeft: 12 }} />
            <TextInput style={s.searchInput} value={mfgQ} onChangeText={t => { setMfgQ(t); setMfgList(searchManufacturers(t)); }} placeholder="Search..." placeholderTextColor="#A0A09C" autoFocus autoCorrect={false} />
          </View>
          <FlatList
            data={mfgList}
            keyExtractor={(item, i) => item + i}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={[s.listRow, mfg === item && s.listRowActive]} onPress={() => { setMfg(item); setModal(null); setMfgQ(''); setMfgList(MANUFACTURERS.slice(0,40)); }}>
                <Text style={[s.listRowTxt, mfg === item && { color: '#D85A30', fontWeight: '700' }]}>{item}</Text>
                {mfg === item && <Ionicons name="checkmark-circle" size={20} color="#D85A30" />}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      <Modal visible={modal === 'series'} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => { setModal(null); setSeriesQ(''); setSeriesList(HW_SERIES); }}>
              <Ionicons name="chevron-back" size={24} color="#1A1A18" />
            </TouchableOpacity>
            <Text style={s.modalTitle}>Series</Text>
            <TouchableOpacity onPress={() => { setSeries(''); setModal(null); }}>
              <Text style={{ color: '#A0A09C', fontSize: 14 }}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={s.searchBox}>
            <Ionicons name="search" size={16} color="#A0A09C" style={{ marginLeft: 12 }} />
            <TextInput style={s.searchInput} value={seriesQ} onChangeText={t => { setSeriesQ(t); setSeriesList(searchSeries(t)); }} placeholder="Search series..." placeholderTextColor="#A0A09C" autoFocus autoCorrect={false} />
          </View>
          {seriesQ.length > 1 && !allSeries.find(x => x.label.toLowerCase() === seriesQ.toLowerCase()) && (
            <TouchableOpacity
              style={{ margin: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FAECE7', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#D85A30' }}
              onPress={() => addCustomSeries(seriesQ)}
            >
              <Ionicons name="add-circle" size={22} color="#D85A30" />
              <View>
                <Text style={{ fontSize: 11, color: '#993C1D', fontWeight: '600' }}>Add custom series</Text>
                <Text style={{ fontSize: 15, color: '#D85A30', fontWeight: '800' }}>{seriesQ}</Text>
              </View>
            </TouchableOpacity>
          )}
          <FlatList
            data={[...customSeriesList, ...(seriesQ ? seriesList : HW_SERIES)]}
            keyExtractor={(item, i) => item.label + i}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            renderItem={({ item, index }) => {
              const data = [...customSeriesList, ...(seriesQ ? seriesList : HW_SERIES)];
              const showGroup = index === 0 || data[index-1].group !== item.group;
              return (
                <View>
                  {showGroup && <Text style={{ fontSize: 11, fontWeight: '700', color: '#A0A09C', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 14, marginBottom: 4 }}>{item.group}</Text>}
                  <TouchableOpacity style={[s.listRow, series === item.label && s.listRowActive]} onPress={() => { setSeries(item.label); setModal(null); setSeriesQ(''); setSeriesList(HW_SERIES); }}>
                    <Text style={[s.listRowTxt, series === item.label && { color: '#D85A30', fontWeight: '700' }]}>{item.label}</Text>
                    {series === item.label && <Ionicons name="checkmark-circle" size={20} color="#D85A30" />}
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </SafeAreaView>
      </Modal>

      <Modal visible={modal === 'color'} animationType="slide" transparent>
        <View style={s.sheetOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setModal(null)} />
          <View style={s.sheet}>
            <View style={s.sheetHandle} />
            <Text style={s.sheetTitle}>Select Color</Text>
            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, paddingBottom: 30 }}>
              {COLORS.map(c => (
                <TouchableOpacity key={c} style={[s.colorChip, color === c && { backgroundColor: '#D85A30', borderColor: '#D85A30' }]} onPress={() => { setColor(c); setModal(null); }}>
                  <Text style={[s.colorChipT, color === c && { color: '#fff' }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={modal === 'colnum'} animationType="slide" transparent>
        <View style={s.sheetOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setModal(null)} />
          <View style={s.sheet}>
            <View style={s.sheetHandle} />
            <Text style={s.sheetTitle}>Series Position</Text>
            <Text style={{ fontSize: 13, color: '#A0A09C', paddingHorizontal: 20, marginBottom: 12 }}>Pick total first, then your position</Text>
            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 }}>
              {SERIES_TOTALS.map(t => (
                <TouchableOpacity key={t} style={{ flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', backgroundColor: colnumTotal === t ? '#1A1A18' : '#F5F4F1', borderColor: colnumTotal === t ? '#1A1A18' : '#E0DEDA' }} onPress={() => setColnumTotal(t)}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colnumTotal === t ? '#fff' : '#1A1A18' }}>/{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, paddingBottom: 30 }}>
              {Array.from({ length: colnumTotal }, (_, i) => i + 1).map(n => (
                <TouchableOpacity key={n} style={[s.numChip, colnum === n + '/' + colnumTotal && { backgroundColor: '#D85A30', borderColor: '#D85A30' }]} onPress={() => { setColnum(n + '/' + colnumTotal); setModal(null); }}>
                  <Text style={[s.numChipT, colnum === n + '/' + colnumTotal && { color: '#fff' }]}>{n}/{colnumTotal}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={modal === 'mainline'} animationType="slide" transparent>
        <View style={s.sheetOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setModal(null)} />
          <View style={[s.sheet, { maxHeight: '80%' }]}>
            <View style={s.sheetHandle} />
            <Text style={s.sheetTitle}>Mainline Number</Text>
            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 20, paddingBottom: 30 }}>
              {Array.from({ length: 250 }, (_, i) => i + 1).map(n => (
                <TouchableOpacity key={n} style={[s.numChip, mainline === n + '/250' && { backgroundColor: '#D85A30', borderColor: '#D85A30' }]} onPress={() => { setMainline(n + '/250'); setModal(null); }}>
                  <Text style={[s.numChipT, mainline === n + '/250' && { color: '#fff' }]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#E0DEDA' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A18' },
  saveBtn: { backgroundColor: '#D85A30', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, minWidth: 60, alignItems: 'center' },
  saveBtnT: { color: '#fff', fontWeight: '700', fontSize: 15 },
  scroll: { padding: 16 },
  lbl: { fontSize: 12, fontWeight: '500', color: '#6B6B67', marginBottom: 5, marginTop: 8 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E0DEDA', backgroundColor: '#F5F4F1' },
  chipT: { fontSize: 13, fontWeight: '500', color: '#6B6B67' },
  fieldBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F4F1', borderWidth: 0.5, borderColor: '#E0DEDA', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, marginBottom: 2 },
  fieldVal: { fontSize: 15, color: '#1A1A18', flex: 1 },
  nameBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F4F1', borderWidth: 1, borderColor: '#D85A30', borderRadius: 10 },
  nameInput: { flex: 1, paddingHorizontal: 10, paddingVertical: 11, fontSize: 15, color: '#1A1A18' },
  sugBox: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#E0DEDA', borderRadius: 10, marginTop: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  sugRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12 },
  sugTxt: { fontSize: 14, color: '#1A1A18', fontWeight: '500' },
  photoBox: { height: 100, borderRadius: 10, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CCCBC6', backgroundColor: '#F5F4F1', alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
  photoT: { fontSize: 12, color: '#6B6B67' },
  delBtn: { marginTop: 16, padding: 14, borderRadius: 10, backgroundColor: '#FCEBEB', alignItems: 'center' },
  delT: { color: '#A32D2D', fontWeight: '700', fontSize: 16 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 0.5, borderBottomColor: '#E0DEDA' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A18' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F4F1', borderRadius: 10, margin: 16 },
  searchInput: { flex: 1, paddingHorizontal: 10, paddingVertical: 11, fontSize: 15, color: '#1A1A18' },
  listRow: { paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 0.5, borderBottomColor: '#F5F4F1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  listRowActive: { backgroundColor: '#FAECE7', borderRadius: 10, paddingHorizontal: 10 },
  listRowTxt: { fontSize: 16, color: '#1A1A18' },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, maxHeight: '75%' },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0DEDA', alignSelf: 'center', marginBottom: 12 },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A18', paddingHorizontal: 20, marginBottom: 14 },
  colorChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, backgroundColor: '#F5F4F1', borderColor: '#E0DEDA' },
  colorChipT: { fontSize: 13, fontWeight: '600', color: '#1A1A18' },
  numChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, backgroundColor: '#F5F4F1', borderColor: '#E0DEDA' },
  numChipT: { fontSize: 13, fontWeight: '600', color: '#1A1A18' },
});
