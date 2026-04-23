import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, useColorScheme, StatusBar } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { loadCars, Car } from '../../lib/storage';
import { Ionicons } from '@expo/vector-icons';
import CarCard from '../../components/CarCard';

export default function WishlistScreen() {
  const [cars, setCars] = useState([]);
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const bg    = dark ? '#0F0F0F' : '#F2F1EE';
  const card  = dark ? '#1C1C1E' : '#FFFFFF';
  const text  = dark ? '#F2F2F7' : '#1C1C1E';
  const muted = dark ? '#8E8E93' : '#6B6B6B';
  const border= dark ? '#2C2C2E' : '#E5E5EA';

  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));
  const wishlist = cars.filter(c => c.status === 'wish');

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={[s.header, { backgroundColor: card, borderBottomColor: border }]}>
        <View>
          <Text style={[s.title, { color: text }]}>WISH <Text style={{ color: '#D85A30' }}>LIST</Text></Text>
          <Text style={[s.sub, { color: muted }]}>{wishlist.length} cars you want to find</Text>
        </View>
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={s.addBtnTxt}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={wishlist}
        keyExtractor={c => c.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>♡</Text>
            <Text style={[s.emptyTitle, { color: text }]}>Wishlist is empty</Text>
            <Text style={[s.emptyMsg, { color: muted }]}>Cars you are hunting for show here.</Text>
            <TouchableOpacity
              style={s.emptyBtn}
              onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Add to Wishlist</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <CarCard car={item} onPress={() => router.push({ pathname: '/car/[id]', params: { id: item.id } })} />
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: 0.3 },
  sub: { fontSize: 12, marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#D85A30', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20 },
  addBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  empty: { paddingTop: 80, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 24, fontWeight: '700' },
  emptyMsg: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D85A30', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
});
