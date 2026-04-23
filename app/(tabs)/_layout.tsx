import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, useColorScheme } from 'react-native';

function ScanButton() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#D85A30', alignItems: 'center', justifyContent: 'center', shadowColor: '#D85A30', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8, marginBottom: 10 }}
        onPress={() => router.push('/scan')}
      >
        <Ionicons name="scan" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? '#1C1C1E' : '#FFFFFF';
  const border = dark ? '#2C2C2E' : '#E5E5EA';

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#D85A30',
      tabBarInactiveTintColor: dark ? '#48484A' : '#8E8E93',
      tabBarStyle: { borderTopColor: border, borderTopWidth: 0.5, backgroundColor: bg, height: 84, paddingBottom: 18, paddingTop: 6 },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      headerShown: false,
    }}>
      <Tabs.Screen name="index" options={{ title: 'Garage', tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} /> }} />
      <Tabs.Screen name="gallery" options={{ title: 'Gallery', tabBarIcon: ({ color, size }) => <Ionicons name="images" size={size} color={color} /> }} />
      <Tabs.Screen name="scan-tab" options={{ title: '', tabBarButton: () => <ScanButton /> }} />
      <Tabs.Screen name="wishlist" options={{ title: 'Wishlist', tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats', tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
