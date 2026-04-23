import React, { useState, useCallback } from 'react';
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
