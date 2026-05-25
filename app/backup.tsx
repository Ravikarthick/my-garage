import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
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
      // Clipboard imported at top
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
