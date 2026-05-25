const fs = require('fs');

const clean = `import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SeriesItem { label: string; group: string; }

export const HW_SERIES: SeriesItem[] = [
  { label: 'HW Exotics', group: '2026 Mainline' },
  { label: 'Exoticars', group: '2026 Mainline' },
  { label: 'HW EV', group: '2026 Mainline' },
  { label: 'HW Starting Grid', group: '2026 Mainline' },
  { label: 'HW Drag Racers', group: '2026 Mainline' },
  { label: 'Nightspeed', group: '2026 Mainline' },
  { label: 'Drop Tops', group: '2026 Mainline' },
  { label: 'Layin Low', group: '2026 Mainline' },
  { label: 'Wagons', group: '2026 Mainline' },
  { label: 'Compact Kings', group: '2026 Mainline' },
  { label: 'Factory Fresh', group: '2026 Mainline' },
  { label: 'HW Dream Garage', group: '2026 Mainline' },
  { label: 'HW Mods', group: '2026 Mainline' },
  { label: 'HW Euro', group: '2026 Mainline' },
  { label: 'HW J-Imports', group: '2026 Mainline' },
  { label: 'Then and Now', group: '2026 Mainline' },
  { label: 'HW Fan Driven', group: '2026 Mainline' },
  { label: 'Batman', group: '2026 Mainline' },
  { label: 'Experimotors', group: '2026 Mainline' },
  { label: 'HW Celebration Racers', group: '2026 Mainline' },
  { label: 'HW Hot Rods', group: '2026 Mainline' },
  { label: 'HW Baja Blazers', group: '2026 Mainline' },
  { label: 'HW Screen Time', group: '2026 Mainline' },
  { label: 'X-Raycers', group: '2026 Mainline' },
  { label: 'HW Heavyweights', group: '2026 Mainline' },
  { label: 'Truckin Along', group: '2026 Mainline' },
  { label: 'Ferrari Series', group: '2026 Mainline' },
  { label: 'Mattel Series', group: '2026 Mainline' },
  { label: 'Race Day', group: '2025 Mainline' },
  { label: 'HW Wide Rides', group: '2025 Mainline' },
  { label: 'HW Wagons', group: '2025 Mainline' },
  { label: 'HW Speed Machines', group: '2025 Mainline' },
  { label: 'HW Slammed', group: '2025 Mainline' },
  { label: 'HW Art Cars', group: '2025 Mainline' },
  { label: 'HW Modified', group: '2025 Mainline' },
  { label: 'HW First Response', group: '2025 Mainline' },
  { label: 'HW Fast Foodie', group: '2025 Mainline' },
  { label: 'Hot Rod Garage', group: '2025 Mainline' },
  { label: 'Mustang 60th Anniversary', group: '2025 Mainline' },
  { label: 'HW Dirt Roads', group: '2025 Mainline' },
  { label: 'Target Exclusive', group: '2025 Mainline' },
  { label: 'HW Designed By', group: '2025 Mainline' },
  { label: 'HW Ride-Ons', group: '2025 Mainline' },
  { label: 'Fast Foodie', group: '2025 Mainline' },
  { label: 'Track Aces', group: '2025 Mainline' },
  { label: 'Wild Widebody', group: '2025 Mainline' },
  { label: 'HW Dirt', group: '2025 Mainline' },
  { label: 'Mustang 60th', group: '2025 Mainline' },
  { label: 'HW Green Speed', group: '2024 Mainline' },
  { label: 'HW Xtreme Sports', group: '2024 Mainline' },
  { label: 'HW Mega Bite', group: '2024 Mainline' },
  { label: 'HW Roadsters', group: '2024 Mainline' },
  { label: 'HW Fast Transit', group: '2024 Mainline' },
  { label: 'HW Reverse Rake', group: '2024 Mainline' },
  { label: 'HW Hot Trucks', group: '2024 Mainline' },
  { label: 'HW Turbo', group: '2024 Mainline' },
  { label: 'Rod Squad', group: '2024 Mainline' },
  { label: 'Sweet Rides', group: '2024 Mainline' },
  { label: 'Muscle Mania', group: '2024 Mainline' },
  { label: 'Brick Rides', group: '2024 Mainline' },
  { label: 'HW Haulers', group: '2024 Mainline' },
  { label: 'HW Speed Graphics', group: '2024 Mainline' },
  { label: 'HW Gassers', group: '2024 Mainline' },
  { label: 'HW Metro', group: '2024 Mainline' },
  { label: 'HW Track Champs', group: '2024 Mainline' },
  { label: 'Mainline', group: 'Mainline General' },
  { label: 'New Models', group: 'Mainline General' },
  { label: 'HW Daredevils', group: 'Mainline General' },
  { label: 'HW The 80s', group: 'Mainline General' },
  { label: 'HW The 70s', group: 'Mainline General' },
  { label: 'Color Reveal', group: 'Mainline General' },
  { label: 'Mystery Models', group: 'Mainline General' },
  { label: 'Ultra Hots', group: 'Mainline General' },
  { label: 'Retro Racers', group: 'Mainline General' },
  { label: 'Car Culture', group: 'Premium' },
  { label: 'Car Culture - Japan Historics', group: 'Premium' },
  { label: 'Car Culture - Japan Historics 2', group: 'Premium' },
  { label: 'Car Culture - Japan Historics 3', group: 'Premium' },
  { label: 'Car Culture - Japan Historics 4', group: 'Premium' },
  { label: 'Car Culture - Race Day', group: 'Premium' },
  { label: 'Car Culture - Slide Street', group: 'Premium' },
  { label: 'Car Culture - Slide Street 2', group: 'Premium' },
  { label: 'Car Culture - Modern Classics', group: 'Premium' },
  { label: 'Car Culture - Drag Strip Demons', group: 'Premium' },
  { label: 'Car Culture - Wild Terrain', group: 'Premium' },
  { label: 'Car Culture - Ultra Hots', group: 'Premium' },
  { label: 'Car Culture - Aerostyles', group: 'Premium' },
  { label: 'Car Culture - American Scene', group: 'Premium' },
  { label: 'Car Culture - Cargo Carriers', group: 'Premium' },
  { label: 'Car Culture - Team Transport', group: 'Premium' },
  { label: 'Car Culture - Exotic Envy', group: 'Premium' },
  { label: 'Boulevard', group: 'Premium' },
  { label: 'Pop Culture', group: 'Premium' },
  { label: 'Pop Culture - Fast and Furious', group: 'Premium' },
  { label: 'Pop Culture - Mario Kart', group: 'Premium' },
  { label: 'Pop Culture - Star Wars', group: 'Premium' },
  { label: 'Pop Culture - Batman', group: 'Premium' },
  { label: 'Pop Culture - Barbie', group: 'Premium' },
  { label: 'Pop Culture - DC Comics', group: 'Premium' },
  { label: 'Pop Culture - Marvel', group: 'Premium' },
  { label: 'Pop Culture - Retro Entertainment', group: 'Premium' },
  { label: 'Vintage Racing Club', group: 'Premium' },
  { label: 'Hot Ones', group: 'Premium' },
  { label: 'Red Line Club (RLC)', group: 'Ultra Premium' },
  { label: 'Elite 64', group: 'Ultra Premium' },
  { label: 'Collector Edition', group: 'Ultra Premium' },
  { label: 'Convention Exclusive', group: 'Ultra Premium' },
  { label: 'Mattel Creations Exclusive', group: 'Ultra Premium' },
  { label: 'Retro Entertainment', group: 'Retro' },
  { label: 'First Editions', group: 'Retro' },
  { label: 'Treasure Hunt Series', group: 'Retro' },
  { label: 'Matchbox Mainline', group: 'Matchbox' },
  { label: 'Matchbox Moving Parts', group: 'Matchbox' },
  { label: 'Matchbox Collector Series', group: 'Matchbox' },
  { label: 'Matchbox Superfast', group: 'Matchbox' },
  { label: 'Matchbox Premium', group: 'Matchbox' },
];

export function searchSeries(query: string): SeriesItem[] {
  if (!query) return HW_SERIES;
  const q = query.toLowerCase();
  return HW_SERIES.filter(s =>
    s.label.toLowerCase().includes(q) || s.group.toLowerCase().includes(q)
  );
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
    return list.map((label: string) => ({ label, group: 'My Custom Series' }));
  } catch(e) { return []; }
}
`;

fs.writeFileSync('lib/seriesData.ts', clean);
console.log('✅ seriesData.ts completely rewritten - clean, no duplicates!');
