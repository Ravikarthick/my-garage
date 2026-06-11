import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, useColorScheme, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars, deleteCar, Car } from '../../lib/storage';
import PhotoFrame from '../../components/PhotoFrame';

export default function CarViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dark = useColorScheme() === 'dark';
  const BG = dark ? '#0F0F0F' : '#F2F1EE';
  const CARD = dark ? '#1C1C1E' : '#FFFFFF';
  const TEXT = dark ? '#F2F2F7' : '#1C1C1E';
  const MUTED = dark ? '#8E8E93' : '#6B6B6B';
  const BORDER = dark ? '#2C2C2E' : '#E5E5EA';
  const [car, setCar] = useState<Car | null>(null);

  useFocusEffect(useCallback(() => {
    let alive = true;
    (async () => {
      const all = await loadCars();
      if (alive) setCar(all.find(c => c.id === id) || null);
    })();
    return () => { alive = false; };
  }, [id]));

  if (!car) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: CARD, borderBottomWidth: 0.5, borderBottomColor: BORDER }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Ionicons name="chevron-back" size={26} color={TEXT} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: MUTED }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isHW = car.brand === 'hw';
  const brandColor = isHW ? '#D85A30' : '#185FA5';
  const brandBg = isHW ? '#FAECE7' : '#E6F1FB';
  const brandLabel = isHW ? '🔥 Hot Wheels' : '🚙 Matchbox';

  function handleDelete() {
    if (!car) return;
    Alert.alert('Delete this car?', car.name + '\n\nThis cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteCar(car.id); router.back(); } },
    ]);
  }

  const rows = [
    { lbl: 'Manufacturer', val: car.manufacturer },
    { lbl: isHW ? 'Series' : 'MBX #', val: car.series },
    { lbl: 'Year', val: car.year },
    { lbl: 'Color', val: car.color },
    { lbl: 'Col #', val: car.colnum },
    { lbl: 'Mainline', val: car.mainline },
    { lbl: 'Tampo', val: car.tampo },
  ];
  const filledRows = rows.filter(r => !!r.val);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: CARD, borderBottomWidth: 0.5, borderBottomColor: BORDER }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={26} color={TEXT} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: TEXT, marginLeft: 6 }} numberOfLines={1}>{car.name}</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: '/car/[id]', params: { id: car.id } })} style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#D85A30', borderRadius: 18 }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        <View style={{ backgroundColor: CARD, borderRadius: 18, overflow: 'hidden', marginBottom: 14, borderWidth: 0.5, borderColor: BORDER }}>
          {car.photo ? (
            <PhotoFrame uri={car.photo} brand={car.brand} />
          ) : (
            <View style={{ width: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: dark ? '#0A0A0A' : '#F0EFEC' }}>
              <Text style={{ fontSize: 90 }}>{isHW ? '🔥' : '🚙'}</Text>
              <Text style={{ color: MUTED, marginTop: 8 }}>No photo</Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: brandBg }}><Text style={{ fontSize: 12, fontWeight: '700', color: brandColor }}>{brandLabel}</Text></View>
          {car.th === 'sth' && <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: '#BA7517' }}><Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>🌟 Super TH</Text></View>}
          {car.th === 'th'  && <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: '#3B6D11' }}><Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>⭐ TH</Text></View>}
          {car.status === 'wish' && <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: '#185FA5' }}><Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>♡ Wishlist</Text></View>}
          {car.status === 'dup'  && <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: '#8B1A1A' }}><Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>{car.dupCount||2}× Dupe</Text></View>}
        </View>

        {filledRows.length > 0 && (
          <View style={{ backgroundColor: CARD, borderRadius: 16, paddingHorizontal: 16, borderWidth: 0.5, borderColor: BORDER }}>
            {filledRows.map((r, i) => (
              <View key={r.lbl} style={{ flexDirection: 'row', paddingVertical: 11, borderBottomWidth: i === filledRows.length - 1 ? 0 : 0.5, borderBottomColor: BORDER }}>
                <Text style={{ flex: 1, color: MUTED, fontSize: 13, fontWeight: '600' }}>{r.lbl}</Text>
                <Text style={{ flex: 2, color: TEXT, fontSize: 14, textAlign: 'right' }} numberOfLines={2}>{r.val}</Text>
              </View>
            ))}
          </View>
        )}

        {!!car.notes && (
          <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: BORDER, marginTop: 12 }}>
            <Text style={{ color: MUTED, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>Notes</Text>
            <Text style={{ color: TEXT, fontSize: 14, lineHeight: 20 }}>{car.notes}</Text>
          </View>
        )}

        <TouchableOpacity onPress={handleDelete} style={{ marginTop: 24, padding: 14, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#8B1A1A' }}>
          <Text style={{ color: '#8B1A1A', fontWeight: '700' }}>Delete car</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
