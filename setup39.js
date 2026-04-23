#!/usr/bin/env node
const fs = require('fs');

// Add backup screen accessible from Stats tab top right
let stats = fs.readFileSync('app/(tabs)/stats.tsx', 'utf8');

// Add router import if missing
if (!stats.includes('useRouter')) {
  stats = stats.replace(
    "import { useFocusEffect } from 'expo-router';",
    "import { useFocusEffect, useRouter } from 'expo-router';"
  );
}

// Add useRouter hook if missing
if (!stats.includes('const router')) {
  stats = stats.replace(
    'const [cars, setCars]',
    'const router = useRouter();\n  const [cars, setCars]'
  );
}

// Add backup button to stats header
stats = stats.replace(
  `<Text style={[s.title, { color:TEXT }]}>MY <Text style={{ color:'#D85A30' }}>STATS</Text></Text>`,
  `<Text style={[s.title, { color:TEXT }]}>MY <Text style={{ color:'#D85A30' }}>STATS</Text></Text>
        <TouchableOpacity
          style={{ backgroundColor:'#185FA5', paddingHorizontal:14, paddingVertical:8, borderRadius:20, flexDirection:'row', alignItems:'center', gap:4 }}
          onPress={() => router.push('/backup')}
        >
          <Ionicons name="cloud-outline" size={16} color="#fff" />
          <Text style={{ color:'#fff', fontWeight:'700', fontSize:13 }}>Backup</Text>
        </TouchableOpacity>`
);

// Add Ionicons import if missing
if (!stats.includes("Ionicons")) {
  stats = stats.replace(
    "import {",
    "import { Ionicons } from '@expo/vector-icons';\nimport {"
  );
}

fs.writeFileSync('app/(tabs)/stats.tsx', stats);
console.log('✅ Backup button added to Stats tab');

// Make sure backup.tsx exists and is simple
fs.writeFileSync('app/backup.tsx', `import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, Share, useColorScheme, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadCars } from '../lib/storage';

export default function BackupScreen() {
  const router = useRouter();
  const dark = useColorScheme() === 'dark';
  const TEXT   = dark ? '#F2F2F7' : '#1C1C1E';
  const CARD   = dark ? '#1C1C1E' : '#FFFFFF';
  const BG     = dark ? '#0A0A0A' : '#F0EFEC';
  const MUTED  = dark ? '#8E8E93' : '#6B6B6B';
  const BORDER = dark ? '#2C2C2E' : '#E5E5EA';
  const [status, setStatus] = useState('');
  const [carCount, setCarCount] = useState(0);

  async function checkData() {
    const cars = await loadCars();
    setCarCount(cars.length);
    setStatus('You have ' + cars.length + ' cars in this app.');
  }

  async function exportData() {
    try {
      const cars = await loadCars();
      if (cars.length === 0) {
        Alert.alert('No data', 'No cars found to export. Make sure you are in the correct app (Expo Go with your data).');
        return;
      }
      const backup = { version:1, date:new Date().toISOString(), cars, total:cars.length };
      const json = JSON.stringify(backup);
      await Share.share({ message: json, title: 'My Garage Backup - ' + cars.length + ' cars' });
      setStatus('✅ Exported ' + cars.length + ' cars! Paste this into the other app.');
    } catch(e) {
      setStatus('Export failed: ' + e.message);
    }
  }

  async function importData() {
    try {
      const { getStringAsync } = require('expo-clipboard');
      const text = await getStringAsync();
      if (!text || !text.includes('"cars"')) {
        Alert.alert('Error', 'Copy your backup text first, then tap Import.');
        return;
      }
      const backup = JSON.parse(text);
      if (!backup.cars || !Array.isArray(backup.cars)) {
        Alert.alert('Error', 'Invalid backup format.');
        return;
      }
      const existing = await loadCars();
      const existingIds = new Set(existing.map(c => c.id));
      const newCars = backup.cars.filter(c => !existingIds.has(c.id));
      const merged = [...existing, ...newCars];
      await AsyncStorage.setItem('mygarage_v1', JSON.stringify(merged));
      setStatus('✅ Imported ' + newCars.length + ' new cars! Go to Garage to see them.');
      Alert.alert('Done!', 'Imported ' + newCars.length + ' cars successfully!');
    } catch(e) {
      Alert.alert('Error', 'Make sure you copied the full backup JSON first, then try again.');
    }
  }

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:BG }}>
      <View style={{ flexDirection:'row', alignItems:'center', padding:16, backgroundColor:CARD, borderBottomWidth:0.5, borderBottomColor:BORDER, gap:12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={TEXT} />
        </TouchableOpacity>
        <Text style={{ fontSize:20, fontWeight:'800', color:TEXT }}>Backup & Restore</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding:20, gap:14 }}>
        {/* Status */}
        {!!status && (
          <View style={{ backgroundColor:CARD, borderRadius:14, padding:14, borderWidth:1, borderColor:BORDER }}>
            <Text style={{ color:TEXT, fontSize:15, lineHeight:22 }}>{status}</Text>
          </View>
        )}

        {/* Check count */}
        <TouchableOpacity
          style={{ backgroundColor:CARD, borderRadius:16, padding:16, borderWidth:0.5, borderColor:BORDER, flexDirection:'row', alignItems:'center', gap:12 }}
          onPress={checkData}
        >
          <Ionicons name="stats-chart" size={24} color="#D85A30" />
          <View style={{ flex:1 }}>
            <Text style={{ fontSize:15, fontWeight:'700', color:TEXT }}>Check car count</Text>
            <Text style={{ fontSize:13, color:MUTED }}>See how many cars are in THIS app</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={MUTED} />
        </TouchableOpacity>

        {/* Export */}
        <View style={{ backgroundColor:CARD, borderRadius:16, padding:18, borderWidth:0.5, borderColor:BORDER }}>
          <View style={{ flexDirection:'row', alignItems:'center', gap:12, marginBottom:12 }}>
            <View style={{ width:48, height:48, borderRadius:24, backgroundColor:'#EAF3DE', alignItems:'center', justifyContent:'center' }}>
              <Ionicons name="download-outline" size={24} color="#3B6D11" />
            </View>
            <View style={{ flex:1 }}>
              <Text style={{ fontSize:16, fontWeight:'700', color:TEXT }}>STEP 1 — Export</Text>
              <Text style={{ fontSize:13, color:MUTED }}>Do this in Expo Go (where your data is)</Text>
            </View>
          </View>
          <Text style={{ fontSize:13, color:MUTED, lineHeight:20, marginBottom:14 }}>
            Opens share sheet → tap Copy to copy all your car data as text.
          </Text>
          <TouchableOpacity style={{ backgroundColor:'#3B6D11', borderRadius:12, padding:14, alignItems:'center', flexDirection:'row', justifyContent:'center', gap:8 }} onPress={exportData}>
            <Ionicons name="download-outline" size={18} color="#fff" />
            <Text style={{ color:'#fff', fontWeight:'700', fontSize:15 }}>Export My Cars</Text>
          </TouchableOpacity>
        </View>

        {/* Import */}
        <View style={{ backgroundColor:CARD, borderRadius:16, padding:18, borderWidth:0.5, borderColor:BORDER }}>
          <View style={{ flexDirection:'row', alignItems:'center', gap:12, marginBottom:12 }}>
            <View style={{ width:48, height:48, borderRadius:24, backgroundColor:'#E6F1FB', alignItems:'center', justifyContent:'center' }}>
              <Ionicons name="upload-outline" size={24} color="#185FA5" />
            </View>
            <View style={{ flex:1 }}>
              <Text style={{ fontSize:16, fontWeight:'700', color:TEXT }}>STEP 2 — Import</Text>
              <Text style={{ fontSize:13, color:MUTED }}>Do this in the new installed app</Text>
            </View>
          </View>
          <Text style={{ fontSize:13, color:MUTED, lineHeight:20, marginBottom:14 }}>
            1. Export from Expo Go above{'\n'}
            2. Tap Share → Copy{'\n'}
            3. Come back here → tap Import
          </Text>
          <TouchableOpacity style={{ backgroundColor:'#185FA5', borderRadius:12, padding:14, alignItems:'center', flexDirection:'row', justifyContent:'center', gap:8 }} onPress={importData}>
            <Ionicons name="upload-outline" size={18} color="#fff" />
            <Text style={{ color:'#fff', fontWeight:'700', fontSize:15 }}>Import from Clipboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
`);
console.log('✅ app/backup.tsx — simple and clear');
console.log('\nRun: npx expo start --clear');
console.log('\nTo find it: Stats tab → blue BACKUP button top right');
