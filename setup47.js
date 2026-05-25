#!/usr/bin/env node
const fs = require('fs');

// ══════════════════════════════════════════════════════════════════════════
// 1. FIX SCAN CARD - better prompt, more reliable parsing
// ══════════════════════════════════════════════════════════════════════════
let form = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Better OCR prompt and more robust JSON parsing
form = form.replace(
  `{ type: 'text', text: 'Hot Wheels/Matchbox card. JSON only: {"name":"car name","series":"or empty","year":"4 digits or empty","colnum":"like 4/5 or empty"}' }`,
  `{ type: 'text', text: 'Look at this Hot Wheels or Matchbox diecast toy car packaging. Find the LARGEST text which is usually the car model name. Also find any series name, year (4 digit number), and collector position like 4/5 or 042/250. Respond with ONLY this JSON, no other text: {"name":"the car name here","series":"series name or empty string","year":"4 digit year or empty string","colnum":"position like 4/5 or empty string"}' }`
);

// More robust JSON extraction
form = form.replace(
  `const clean = txt.replace(/[^{]*({.*})[^}]*/s, '$1');
      const parsed = JSON.parse(clean);`,
  `let parsed = { name: '', series: '', year: '', colnum: '' };
      try {
        const match = txt.match(/\\{[^{}]*\\}/);
        if (match) parsed = JSON.parse(match[0]);
      } catch(e) {
        // Try to extract just the name
        const nameMatch = txt.match(/"name"\\s*:\\s*"([^"]+)"/);
        if (nameMatch) parsed.name = nameMatch[1];
      }`
);

fs.writeFileSync('app/car/[id].tsx', form);
console.log('✅ Scan Card OCR improved');

// ══════════════════════════════════════════════════════════════════════════
// 2. FIX SERIES CUSTOM SAVE - ensure custom series persists in suggestions
// ══════════════════════════════════════════════════════════════════════════
let seriesData = fs.readFileSync('lib/seriesData.ts', 'utf8');

// Add custom series storage function
if (!seriesData.includes('CUSTOM_SERIES_KEY')) {
  seriesData += `
import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOM_SERIES_KEY = 'mygarage_custom_series';

export async function saveCustomSeries(label: string): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(CUSTOM_SERIES_KEY);
    const list: string[] = existing ? JSON.parse(existing) : [];
    if (!list.includes(label)) {
      list.unshift(label);
      await AsyncStorage.setItem(CUSTOM_SERIES_KEY, JSON.stringify(list.slice(0, 100)));
    }
  } catch(e) {}
}

export async function getCustomSeries(): Promise<{label:string,group:string}[]> {
  try {
    const existing = await AsyncStorage.getItem(CUSTOM_SERIES_KEY);
    const list: string[] = existing ? JSON.parse(existing) : [];
    return list.map(label => ({ label, group: 'My Custom Series' }));
  } catch(e) { return []; }
}
`;
  fs.writeFileSync('lib/seriesData.ts', seriesData);
  console.log('✅ Custom series persistence added');
}

// Update car form to save custom series and load them
form = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Add saveCustomSeries import
if (!form.includes('saveCustomSeries')) {
  form = form.replace(
    "import { HW_SERIES, searchSeries } from '../../lib/seriesData';",
    "import { HW_SERIES, searchSeries, saveCustomSeries, getCustomSeries } from '../../lib/seriesData';"
  );

  // Load custom series on mount
  form = form.replace(
    'AsyncStorage.getItem(HISTORY_KEY).then(d => { if (d) setHistory(JSON.parse(d)); });',
    `AsyncStorage.getItem(HISTORY_KEY).then(d => { if (d) setHistory(JSON.parse(d)); });
    getCustomSeries().then(custom => {
      if (custom.length > 0) {
        setSeriesList([...custom, ...HW_SERIES]);
      }
    });`
  );

  // Save custom series when user adds one
  form = form.replace(
    `onPress={() => { setSeries(seriesQ); setModal(null); setSeriesQ(''); setSeriesList(HW_SERIES); }}`,
    `onPress={async () => { await saveCustomSeries(seriesQ); setSeries(seriesQ); setModal(null); setSeriesQ(''); const custom = await getCustomSeries(); setSeriesList([...custom, ...HW_SERIES]); }}`
  );

  fs.writeFileSync('app/car/[id].tsx', form);
  console.log('✅ Custom series now saves and shows next time');
}

// ══════════════════════════════════════════════════════════════════════════
// 3. ADD MANUFACTURER + SERIES FILTER TO GARAGE SCREEN
// ══════════════════════════════════════════════════════════════════════════
let garage = fs.readFileSync('app/(tabs)/index.tsx', 'utf8');

// Check if filters already exist
if (!garage.includes('filterMfg') && !garage.includes('filterSeries')) {

  // Add filter states
  garage = garage.replace(
    "  const [thOnly, setThOnly] = useState(false);",
    `  const [thOnly, setThOnly] = useState(false);
  const [filterMfg, setFilterMfg] = useState('');
  const [filterSeries, setFilterSeries] = useState('');
  const [showFilterSheet, setShowFilterSheet] = useState(false);`
  );

  // Add Modal import if missing
  if (!garage.includes('Modal')) {
    garage = garage.replace(
      "import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, useColorScheme, StatusBar } from 'react-native';",
      "import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, useColorScheme, StatusBar, Modal, ScrollView } from 'react-native';"
    );
  }

  // Update filter logic to include mfg and series
  garage = garage.replace(
    `const filtered = cars.filter(c => {`,
    `// Get unique manufacturers and series from cars
  const allMfgs = [...new Set(cars.filter(c => c.manufacturer).map(c => c.manufacturer))].sort();
  const allSeries = [...new Set(cars.filter(c => c.series).map(c => c.series))].sort();

  const filtered = cars.filter(c => {`
  );

  // Add mfg and series to filter conditions
  garage = garage.replace(
    `    if (thOnly && c.th === 'none') return false;`,
    `    if (thOnly && c.th === 'none') return false;
    if (filterMfg && c.manufacturer !== filterMfg) return false;
    if (filterSeries && c.series !== filterSeries) return false;`
  );

  // Add filter button to header
  garage = garage.replace(
    `<TouchableOpacity style={s.addBtn} onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}>`,
    `<TouchableOpacity
          style={[s.addBtn, { backgroundColor: (filterMfg || filterSeries) ? '#D85A30' : (dark ? '#2C2C2E' : '#F0EFEC'), marginRight: 6 }]}
          onPress={() => setShowFilterSheet(true)}
        >
          <Ionicons name="options-outline" size={18} color={(filterMfg || filterSeries) ? '#fff' : text} />
          {(filterMfg || filterSeries) && <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>ON</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={s.addBtn} onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}>`
  );

  // Add filter sheet modal before closing return
  const filterModal = `
      {/* FILTER SHEET */}
      <Modal visible={showFilterSheet} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} activeOpacity={1} onPress={() => setShowFilterSheet(false)} />
        <View style={{ backgroundColor: card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, maxHeight: '80%' }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0DEDA', alignSelf: 'center', marginVertical: 12 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: text }}>Filter Collection</Text>
            <TouchableOpacity onPress={() => { setFilterMfg(''); setFilterSeries(''); setShowFilterSheet(false); }}>
              <Text style={{ color: '#D85A30', fontWeight: '600' }}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            {/* Manufacturer filter */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Manufacturer</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {allMfgs.map(m => (
                <TouchableOpacity
                  key={m}
                  style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, backgroundColor: filterMfg === m ? '#D85A30' : (dark ? '#2C2C2E' : '#F5F4F1'), borderColor: filterMfg === m ? '#D85A30' : '#E0DEDA' }}
                  onPress={() => setFilterMfg(filterMfg === m ? '' : m)}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: filterMfg === m ? '#fff' : text }}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Series filter */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Series</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {allSeries.map(s => (
                <TouchableOpacity
                  key={s}
                  style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, backgroundColor: filterSeries === s ? '#185FA5' : (dark ? '#2C2C2E' : '#F5F4F1'), borderColor: filterSeries === s ? '#185FA5' : '#E0DEDA' }}
                  onPress={() => setFilterSeries(filterSeries === s ? '' : s)}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: filterSeries === s ? '#fff' : text }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#D85A30', borderRadius: 12, padding: 14, alignItems: 'center' }}
              onPress={() => setShowFilterSheet(false)}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
                Show {filtered.length} Cars
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
`;

  // Insert modal before last </SafeAreaView>
  garage = garage.replace(
    '    </SafeAreaView>\n  );\n}',
    filterModal + '    </SafeAreaView>\n  );\n}'
  );

  fs.writeFileSync('app/(tabs)/index.tsx', garage);
  console.log('✅ Manufacturer + Series filter added to Garage');
} else {
  console.log('ℹ️  Filters already exist');
}

console.log(`
✅ ALL DONE! 

YOUR 75 CARS ARE SAFE — TestFlight updates never delete data!

Fixed:
1. Scan Card — better AI prompt, more reliable reading
2. Custom series — now saves and appears next time
3. Garage filter — tap the filter icon to filter by:
   • Manufacturer (Ford, Ferrari, Datsun...)  
   • Series (HW Exotics, Car Culture...)
   • Both at the same time!

Now rebuild in Xcode:
  Product → Archive → Distribute → TestFlight Internal Only
`);
