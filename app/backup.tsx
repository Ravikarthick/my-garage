import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, useColorScheme, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadCars } from '../lib/storage';

const KEY = 'mygarage_v1';

export default function BackupScreen() {
  const router = useRouter();
  const dark = useColorScheme() === 'dark';
  const TEXT = dark ? '#F2F2F7' : '#1C1C1E';
  const CARD = dark ? '#1C1C1E' : '#FFFFFF';
  const BG = dark ? '#0A0A0A' : '#F0EFEC';
  const MUTED = dark ? '#8E8E93' : '#6B6B6B';
  const BORDER = dark ? '#2C2C2E' : '#E5E5EA';
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function checkData() {
    const cars = await loadCars();
    const withPhotos = cars.filter(c => c.photo).length;
    setStatus('This app has ' + cars.length + ' cars (' + withPhotos + ' with photos).');
  }

  async function exportData() {
    try {
      const cars = await loadCars();
      if (cars.length === 0) { Alert.alert('No data', 'No cars found in this app. Run Export from Expo Go, where your cars are.'); return; }
      setBusy(true);
      setStatus('Packing ' + cars.length + ' cars and converting photos...');
      const out = [];
      let converted = 0, missing = 0;
      for (const c of cars) {
        let photo = c.photo;
        if (photo && !String(photo).startsWith('data:')) {
          try {
            const m = await ImageManipulator.manipulateAsync(photo, [{ resize: { width: 600 } }], { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true });
            photo = 'data:image/jpeg;base64,' + m.base64;
            converted++;
          } catch (e) { photo = null; missing++; }
        }
        out.push({ ...c, photo });
      }
      const backup = { version: 2, date: new Date().toISOString(), total: out.length, cars: out };
      const json = JSON.stringify(backup);
      await Clipboard.setStringAsync(json);
      setBusy(false);
      const kb = Math.round(json.length / 1024);
      setStatus('Copied ' + out.length + ' cars to clipboard (' + kb + ' KB). Photos embedded: ' + converted + (missing ? ', missing files skipped: ' + missing : '') + '. Now open the other app and tap Import.');
      Alert.alert('Exported', out.length + ' cars copied to clipboard. Now open the new (TestFlight) app, go to this same Backup screen, and tap "Import from clipboard".');
    } catch (e) { setBusy(false); setStatus('Export failed: ' + (e && e.message ? e.message : String(e))); }
  }

  async function exportToFile() {
    try {
      const cars = await loadCars();
      if (cars.length === 0) { Alert.alert('No data', 'No cars found in this app.'); return; }
      setBusy(true);
      setStatus('Packing ' + cars.length + ' cars into a file...');
      const out = [];
      let converted = 0, missing = 0;
      for (const c of cars) {
        let photo = c.photo;
        if (photo && !String(photo).startsWith('data:')) {
          try {
            const m = await ImageManipulator.manipulateAsync(photo, [{ resize: { width: 600 } }], { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true });
            photo = 'data:image/jpeg;base64,' + m.base64;
            converted++;
          } catch (e) { photo = null; missing++; }
        }
        out.push({ ...c, photo });
      }
      const backup = { version: 2, date: new Date().toISOString(), total: out.length, cars: out };
      const path = FileSystem.documentDirectory + 'mygarage-backup.json';
      await FileSystem.writeAsStringAsync(path, JSON.stringify(backup));
      setBusy(false);
      setStatus('File ready with ' + out.length + ' cars (photos embedded: ' + converted + (missing ? ', missing: ' + missing : '') + '). In the share sheet choose "Save to Files".');
      await Sharing.shareAsync(path, { mimeType: 'application/json' });
    } catch (e) { setBusy(false); setStatus('File export failed: ' + (e && e.message ? e.message : String(e))); }
  }

  async function deleteAll() {
    const cars = await loadCars();
    Alert.alert('Delete ALL cars?', 'This will permanently remove ' + cars.length + ' cars from this app. Did you save a backup file first?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', style: 'destructive', onPress: () => {
        Alert.alert('Are you absolutely sure?', 'There is NO undo.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'DELETE EVERYTHING', style: 'destructive', onPress: async () => {
            await AsyncStorage.removeItem(KEY);
            setStatus('All cars deleted. Fresh start!');
          } },
        ]);
      } },
    ]);
  }

  async function importData() {
    try {
      const text = await Clipboard.getStringAsync();
      if (!text || text.indexOf('"cars"') === -1) { Alert.alert('Nothing to import', 'First tap Export in the other app to copy your cars, then come here and tap Import.'); return; }
      const backup = JSON.parse(text);
      if (!backup || !Array.isArray(backup.cars)) { Alert.alert('Error', 'Clipboard does not contain a valid backup.'); return; }
      const existing = await loadCars();
      const existingIds = new Set(existing.map(c => c.id));
      const newCars = backup.cars.filter(c => c && !existingIds.has(c.id));
      const merged = [...newCars, ...existing];
      await AsyncStorage.setItem(KEY, JSON.stringify(merged));
      setStatus('Imported ' + newCars.length + ' new cars. Total now ' + merged.length + '.');
      Alert.alert('Done', 'Imported ' + newCars.length + ' cars! Go back to your Garage to see them.');
    } catch (e) { Alert.alert('Error', 'Could not read the backup. Make sure you tapped Export first. (' + (e && e.message ? e.message : String(e)) + ')'); }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: CARD, borderBottomWidth: 0.5, borderBottomColor: BORDER, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={TEXT} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '800', color: TEXT }}>Backup & Restore</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        {busy && <View style={{ backgroundColor: CARD, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}><ActivityIndicator color="#D85A30" /><Text style={{ color: TEXT, fontSize: 15, flex: 1 }}>Working...</Text></View>}
        {!!status && <View style={{ backgroundColor: CARD, borderRadius: 14, padding: 14 }}><Text style={{ color: TEXT, fontSize: 14, lineHeight: 20 }}>{status}</Text></View>}
        <TouchableOpacity style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: BORDER, flexDirection: 'row', alignItems: 'center', gap: 12 }} onPress={checkData}>
          <Ionicons name="stats-chart" size={22} color="#D85A30" />
          <Text style={{ fontSize: 15, fontWeight: '700', color: TEXT }}>Check what is in this app</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 18, borderWidth: 0.5, borderColor: BORDER }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: TEXT, marginBottom: 6 }}>Step 1 - Export (do this in Expo Go)</Text>
          <Text style={{ fontSize: 13, color: MUTED, marginBottom: 14, lineHeight: 19 }}>Copies all your cars and photos to the clipboard.</Text>
          <TouchableOpacity disabled={busy} style={{ backgroundColor: busy ? '#9E9E9E' : '#3B6D11', borderRadius: 12, padding: 14, alignItems: 'center' }} onPress={exportData}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Export my cars</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={busy} style={{ backgroundColor: busy ? '#9E9E9E' : '#185FA5', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 10 }} onPress={exportToFile}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Export to FILE (best for big collections)</Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 18, borderWidth: 0.5, borderColor: BORDER }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: TEXT, marginBottom: 6 }}>Step 2 - Import (do this in the new app)</Text>
          <Text style={{ fontSize: 13, color: MUTED, marginBottom: 14, lineHeight: 19 }}>Reads the cars you just exported and adds them here.</Text>
          <TouchableOpacity disabled={busy} style={{ backgroundColor: busy ? '#9E9E9E' : '#185FA5', borderRadius: 12, padding: 14, alignItems: 'center' }} onPress={importData}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Import from clipboard</Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#8B1A1A', marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#FF6B6B', marginBottom: 6 }}>Danger zone</Text>
          <Text style={{ fontSize: 13, color: MUTED, marginBottom: 14, lineHeight: 19 }}>Deletes every car in this app. Make sure you exported a backup FILE first.</Text>
          <TouchableOpacity disabled={busy} style={{ borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1.5, borderColor: '#C0392B' }} onPress={deleteAll}>
            <Text style={{ color: '#FF6B6B', fontWeight: '800', fontSize: 15 }}>Delete ALL cars</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
