const fs = require('fs');

// Read current file to get the HW_SERIES data
const current = fs.readFileSync('lib/seriesData.ts', 'utf8');

// Extract just the HW_SERIES array content
const start = current.indexOf('export const HW_SERIES');
const end = current.indexOf('\nexport async function saveCustomSeries');
const hwSeriesBlock = end > start ? current.slice(start, end) : current.slice(start);

// Write clean file
const cleanFile = `import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SeriesItem { label: string; group: string; }

${hwSeriesBlock.trim()}

export function searchSeries(q: string): SeriesItem[] {
  if (!q) return HW_SERIES;
  const ql = q.toLowerCase();
  return HW_SERIES.filter(s => s.label.toLowerCase().includes(ql));
}

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

export async function getCustomSeries(): Promise<SeriesItem[]> {
  try {
    const existing = await AsyncStorage.getItem(CUSTOM_SERIES_KEY);
    const list: string[] = existing ? JSON.parse(existing) : [];
    return list.map(label => ({ label, group: 'My Custom Series' }));
  } catch(e) { return []; }
}
`;

fs.writeFileSync('lib/seriesData.ts', cleanFile);
console.log('✅ seriesData.ts completely rewritten - clean!');

// Verify no corruption
const verify = fs.readFileSync('lib/seriesData.ts', 'utf8');
if (verify.includes('[list.map]') || verify.includes('http://list')) {
  console.log('ERROR: Still corrupted!');
} else {
  console.log('✅ Verified clean - no corruption!');
}
