#!/usr/bin/env node
const fs = require('fs');

fs.writeFileSync('lib/seriesData.ts', `
export interface SeriesItem { label: string; group: string; }

export const HW_SERIES: SeriesItem[] = [

  // ── 2026 MAINLINE ─────────────────────────────────────────────────────────
  { label: 'HW Exotics',                            group: '2026 Mainline' },
  { label: 'Exoticcars',                            group: '2026 Mainline' },
  { label: 'HW EV',                                 group: '2026 Mainline' },
  { label: 'HW Starting Grid',                      group: '2026 Mainline' },
  { label: 'Drag Racers',                           group: '2026 Mainline' },
  { label: 'Nightspeed',                            group: '2026 Mainline' },
  { label: 'Night Speed',                           group: '2026 Mainline' },
  { label: 'Drop Tops',                             group: '2026 Mainline' },
  { label: 'Layin\' Low',                           group: '2026 Mainline' },
  { label: 'Wagons',                                group: '2026 Mainline' },
  { label: 'Compact Kings',                         group: '2026 Mainline' },
  { label: 'Factory Fresh',                         group: '2026 Mainline' },
  { label: 'HW Dream Garage',                       group: '2026 Mainline' },
  { label: 'HW Mods',                               group: '2026 Mainline' },
  { label: 'HW Euro',                               group: '2026 Mainline' },
  { label: 'HW J-Imports',                          group: '2026 Mainline' },
  { label: 'Then and Now',                          group: '2026 Mainline' },
  { label: 'HW Fan Driven',                         group: '2026 Mainline' },
  { label: 'Batman',                                group: '2026 Mainline' },
  { label: 'Tooned',                                group: '2026 Mainline' },
  { label: 'Experimotors',                          group: '2026 Mainline' },
  { label: 'HW Celebration Racers',                 group: '2026 Mainline' },
  { label: 'HW Hot Rods',                           group: '2026 Mainline' },
  { label: 'HW Baja Blazers',                       group: '2026 Mainline' },
  { label: 'HW Screen Time',                        group: '2026 Mainline' },

  // ── 2025 MAINLINE ─────────────────────────────────────────────────────────
  { label: 'HW EV Exotics',                         group: '2025 Mainline' },
  { label: 'HW EV Exotics Exotiques',               group: '2025 Mainline' },
  { label: 'Race Day',                              group: '2025 Mainline' },
  { label: 'Race Day Jour De Course',               group: '2025 Mainline' },
  { label: 'HW Wide Rides',                         group: '2025 Mainline' },
  { label: 'HW Wagons',                             group: '2025 Mainline' },
  { label: 'HW Speed Machines',                     group: '2025 Mainline' },
  { label: 'HW Bikes',                              group: '2025 Mainline' },
  { label: 'HW Slammed',                            group: '2025 Mainline' },
  { label: 'HW Art Cars',                           group: '2025 Mainline' },
  { label: 'HW Modified',                           group: '2025 Mainline' },
  { label: 'HW City',                               group: '2025 Mainline' },
  { label: 'HW First Response',                     group: '2025 Mainline' },
  { label: 'HW Fast Foodie',                        group: '2025 Mainline' },
  { label: 'X-Raycers',                             group: '2025 Mainline' },
  { label: 'Hot Rod Garage',                        group: '2025 Mainline' },
  { label: 'Mustang 60th Anniversary',              group: '2025 Mainline' },
  { label: 'HW Dirt Roads',                         group: '2025 Mainline' },
  { label: 'Target Exclusive',                      group: '2025 Mainline' },

  // ── 2024 MAINLINE ─────────────────────────────────────────────────────────
  { label: 'HW Green Speed',                        group: '2024 Mainline' },
  { label: 'HW Xtreme Sports',                      group: '2024 Mainline' },
  { label: 'HW Mega Bite',                          group: '2024 Mainline' },
  { label: 'HW Roadsters',                          group: '2024 Mainline' },
  { label: 'HW Fast Transit',                       group: '2024 Mainline' },
  { label: 'HW Reverse Rake',                       group: '2024 Mainline' },
  { label: 'HW Hot Trucks',                         group: '2024 Mainline' },
  { label: 'HW J-Imports',                          group: '2024 Mainline' },
  { label: 'HW Turbo',                              group: '2024 Mainline' },
  { label: 'Rod Squad',                             group: '2024 Mainline' },
  { label: 'Sweet Rides',                           group: '2024 Mainline' },
  { label: 'Sky Show',                              group: '2024 Mainline' },
  { label: 'Mud Studs',                             group: '2024 Mainline' },
  { label: 'Muscle Mania',                          group: '2024 Mainline' },
  { label: 'Brick Rides',                           group: '2024 Mainline' },
  { label: 'HW Haulers',                            group: '2024 Mainline' },
  { label: 'HW Drag Strip',                         group: '2024 Mainline' },
  { label: 'HW Speed Graphics',                     group: '2024 Mainline' },
  { label: 'HW 55 Race Team',                       group: '2024 Mainline' },
  { label: 'HW Gassers',                            group: '2024 Mainline' },
  { label: 'HW Metro',                              group: '2024 Mainline' },
  { label: 'HW Track Champs',                       group: '2024 Mainline' },
  { label: 'HW Road Trippin',                       group: '2024 Mainline' },

  // ── MAINLINE ALWAYS-ON ────────────────────────────────────────────────────
  { label: 'Mainline',                              group: '📦 Mainline (General)' },
  { label: 'New Models',                            group: '📦 Mainline (General)' },
  { label: 'HW Exotics',                            group: '📦 Mainline (General)' },
  { label: 'HW Screen Time',                        group: '📦 Mainline (General)' },
  { label: 'HW Dream Garage',                       group: '📦 Mainline (General)' },
  { label: 'Factory Fresh',                         group: '📦 Mainline (General)' },
  { label: 'HW Daredevils',                         group: '📦 Mainline (General)' },
  { label: 'HW Checkmate',                          group: '📦 Mainline (General)' },
  { label: 'HW Flames',                             group: '📦 Mainline (General)' },
  { label: 'HW Rescue',                             group: '📦 Mainline (General)' },
  { label: 'HW Snow Stormers',                      group: '📦 Mainline (General)' },
  { label: 'HW The 80s',                            group: '📦 Mainline (General)' },
  { label: 'HW The 70s',                            group: '📦 Mainline (General)' },
  { label: 'Color Reveal',                          group: '📦 Mainline (General)' },
  { label: 'Mystery Models',                        group: '📦 Mainline (General)' },
  { label: 'Neon Speeders',                         group: '📦 Mainline (General)' },
  { label: 'Ultra Hots',                            group: '📦 Mainline (General)' },
  { label: 'Fan Driven',                            group: '📦 Mainline (General)' },

  // ── 2010-2019 LEGACY SEGMENTS ─────────────────────────────────────────────
  { label: 'HW City Works',                         group: '📦 Mainline 2010-2019' },
  { label: 'HW Showroom',                           group: '📦 Mainline 2010-2019' },
  { label: 'HW Workshop',                           group: '📦 Mainline 2010-2019' },
  { label: 'HW Imagination',                        group: '📦 Mainline 2010-2019' },
  { label: 'HW Stunt',                              group: '📦 Mainline 2010-2019' },
  { label: 'HW Racing',                             group: '📦 Mainline 2010-2019' },
  { label: 'HW Performance',                        group: '📦 Mainline 2010-2019' },
  { label: 'HW Off-Road',                           group: '📦 Mainline 2010-2019' },
  { label: 'HW Mild to Wild',                       group: '📦 Mainline 2010-2019' },
  { label: 'HW Motorcycles',                        group: '📦 Mainline 2010-2019' },
  { label: 'HW Space',                              group: '📦 Mainline 2010-2019' },
  { label: 'HW Video Game Heroes',                  group: '📦 Mainline 2010-2019' },
  { label: 'HW Rescue Squad',                       group: '📦 Mainline 2010-2019' },
  { label: 'HW Fire',                               group: '📦 Mainline 2010-2019' },
  { label: 'Track Stars',                           group: '📦 Mainline 2010-2019' },
  { label: 'Thrill Racers',                         group: '📦 Mainline 2010-2019' },
  { label: 'Heat Fleet',                            group: '📦 Mainline 2010-2019' },
  { label: 'Rapid Transit',                         group: '📦 Mainline 2010-2019' },
  { label: 'Retro Racers',                          group: '📦 Mainline 2010-2019' },
  { label: 'HW Moto',                               group: '📦 Mainline 2010-2019' },

  // ── GOLD LABEL PREMIUM ────────────────────────────────────────────────────
  { label: 'Car Culture',                           group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Exotic Envy',             group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Japan Historics',         group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Japan Historics 2',       group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Japan Historics 3',       group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Japan Historics 4',       group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Race Day',                group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Slide Street',            group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Slide Street 2',          group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - World Tour',              group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Terra Trek',              group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Modern Classics',         group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Drag Strip Demons',       group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - American Scene',          group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Cargo Carriers',          group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Team Transport',          group: '🥇 Gold Label Premium' },
  { label: "Car Culture - Jay Leno's Garage",       group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Eurospeed',               group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Aerostyles',              group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - Vintage Racing',          group: '🥇 Gold Label Premium' },
  { label: 'Car Culture - 2-Pack',                  group: '🥇 Gold Label Premium' },
  { label: 'Boulevard',                             group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture',                           group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - Fast and Furious',        group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - Mario Kart',              group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - Star Wars',               group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - DC Comics',               group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - Marvel',                  group: '🥇 Gold Label Premium' },
  { label: 'Pop Culture - Retro Entertainment',     group: '🥇 Gold Label Premium' },
  { label: 'Premium Display Set',                   group: '🥇 Gold Label Premium' },

  // ── SILVER LABEL PREMIUM ──────────────────────────────────────────────────
  { label: 'Vintage Racing Club',                   group: '🥈 Silver Label Premium' },
  { label: 'Automotive Celebrations',               group: '🥈 Silver Label Premium' },
  { label: 'Neon Speeders Premium',                 group: '🥈 Silver Label Premium' },
  { label: 'Fast and Furious - Silver',             group: '🥈 Silver Label Premium' },
  { label: 'Hot Ones',                              group: '🥈 Silver Label Premium' },
  { label: 'Pantone',                               group: '🥈 Silver Label Premium' },

  // ── ULTRA PREMIUM ─────────────────────────────────────────────────────────
  { label: 'Red Line Club (RLC)',                   group: '💎 Ultra Premium' },
  { label: 'Elite 64',                              group: '💎 Ultra Premium' },
  { label: 'Collector Edition',                     group: '💎 Ultra Premium' },
  { label: 'Convention Exclusive',                  group: '💎 Ultra Premium' },
  { label: 'Mattel Creations Exclusive',            group: '💎 Ultra Premium' },

  // ── RETRO / VINTAGE ───────────────────────────────────────────────────────
  { label: 'Retro Entertainment',                   group: '📼 Retro / Vintage' },
  { label: 'First Editions',                        group: '📼 Retro / Vintage' },
  { label: 'Treasure Hunt Series',                  group: '📼 Retro / Vintage' },
  { label: 'Redline Era 1968-1977',                 group: '📼 Retro / Vintage' },
  { label: 'Flying Colors Era 1977-1981',           group: '📼 Retro / Vintage' },
  { label: 'Blackwall Era 1979-1988',               group: '📼 Retro / Vintage' },
  { label: 'Real Riders Era 1983-1989',             group: '📼 Retro / Vintage' },
  { label: 'Blue Card',                             group: '📼 Retro / Vintage' },

  // ── MATCHBOX ──────────────────────────────────────────────────────────────
  { label: 'Matchbox Mainline',                     group: '🚙 Matchbox' },
  { label: 'Matchbox Moving Parts',                 group: '🚙 Matchbox' },
  { label: 'Matchbox Collector Series',             group: '🚙 Matchbox' },
  { label: 'Matchbox Superfast',                    group: '🚙 Matchbox' },
  { label: 'Matchbox Sky Busters',                  group: '🚙 Matchbox' },
  { label: 'Matchbox Working Rigs',                 group: '🚙 Matchbox' },
  { label: 'Matchbox Premium',                      group: '🚙 Matchbox' },
  { label: 'Matchbox Globe Travelers',              group: '🚙 Matchbox' },
  { label: 'Matchbox Power Grabs',                  group: '🚙 Matchbox' },
];

export const HW_SERIES_GROUPS = [...new Set(HW_SERIES.map(s => s.group))];

export function searchSeries(query: string): SeriesItem[] {
  if (!query) return HW_SERIES;
  const q = query.toLowerCase();
  return HW_SERIES.filter(s =>
    s.label.toLowerCase().includes(q) || s.group.toLowerCase().includes(q)
  );
}
`);
console.log('✅ lib/seriesData.ts updated with 150+ series');

// Now update the series picker in the car form to support CUSTOM entry
const form = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Find the series picker modal and add custom text input
const oldSeriesModal = `          <FlatList
            data={seriesList}
            keyExtractor={(item,i)=>item.label+i}
            contentContainerStyle={{paddingHorizontal:16,paddingBottom:60}}
            renderItem={({item,index})=>{
              const showGroup = index===0 || seriesList[index-1].group!==item.group;
              return (
                <>
                  {showGroup&&<Text style={{fontSize:11,fontWeight:'700',color:'#A0A09C',textTransform:'uppercase',letterSpacing:0.8,marginTop:16,marginBottom:4}}>{item.group}</Text>}
                  <TouchableOpacity
                    style={[s.mfgRow,series===item.label&&s.mfgRowActive]}
                    onPress={()=>{setSeries(item.label);setShowSeriesPicker(false);setSeriesSearch('');setSeriesList(HW_SERIES);}}
                  >
                    <Text style={[s.mfgRowTxt,series===item.label&&{color:'#D85A30',fontWeight:'700'}]}>{item.label}</Text>
                    {series===item.label&&<Ionicons name="checkmark-circle" size={20} color="#D85A30"/>}
                  </TouchableOpacity>
                </>
              );
            }}
          />`;

const newSeriesModal = `          {/* Custom entry row */}
          {seriesSearch.length > 1 && !seriesList.find(s => s.label.toLowerCase() === seriesSearch.toLowerCase()) && (
            <TouchableOpacity
              style={{ marginHorizontal:16, marginBottom:8, flexDirection:'row', alignItems:'center', gap:10, backgroundColor:'#FAECE7', borderRadius:12, padding:12, borderWidth:1, borderColor:'#D85A30' }}
              onPress={()=>{setSeries(seriesSearch);setShowSeriesPicker(false);setSeriesSearch('');setSeriesList(HW_SERIES);}}
            >
              <Ionicons name="add-circle" size={22} color="#D85A30" />
              <View>
                <Text style={{fontSize:13,color:'#993C1D',fontWeight:'700'}}>Add custom series</Text>
                <Text style={{fontSize:15,color:'#D85A30',fontWeight:'800'}}>{seriesSearch}</Text>
              </View>
            </TouchableOpacity>
          )}
          <FlatList
            data={seriesList}
            keyExtractor={(item,i)=>item.label+i}
            contentContainerStyle={{paddingHorizontal:16,paddingBottom:60}}
            renderItem={({item,index})=>{
              const showGroup = index===0 || seriesList[index-1].group!==item.group;
              return (
                <>
                  {showGroup&&<Text style={{fontSize:11,fontWeight:'700',color:'#A0A09C',textTransform:'uppercase',letterSpacing:0.8,marginTop:16,marginBottom:4}}>{item.group}</Text>}
                  <TouchableOpacity
                    style={[s.mfgRow,series===item.label&&s.mfgRowActive]}
                    onPress={()=>{setSeries(item.label);setShowSeriesPicker(false);setSeriesSearch('');setSeriesList(HW_SERIES);}}
                  >
                    <Text style={[s.mfgRowTxt,series===item.label&&{color:'#D85A30',fontWeight:'700'}]}>{item.label}</Text>
                    {series===item.label&&<Ionicons name="checkmark-circle" size={20} color="#D85A30"/>}
                  </TouchableOpacity>
                </>
              );
            }}
          />`;

if (form.includes(oldSeriesModal)) {
  fs.writeFileSync('app/car/[id].tsx', form.replace(oldSeriesModal, newSeriesModal));
  console.log('✅ app/car/[id].tsx - custom series entry added');
} else {
  console.log('⚠️  Could not patch series modal - please run npx expo start --clear anyway');
}

console.log(`
✅ DONE! Run: npx expo start --clear

WHAT'S NEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
150+ SERIES now organized by year:

2026 ──────────────────────────
  Nightspeed / Night Speed ✅
  HW EV ✅
  Drag Racers ✅
  Wagons ✅
  Drop Tops ✅
  HW Starting Grid ✅
  Layin' Low ✅
  HW Euro ✅

2025 ──────────────────────────
  HW EV Exotics ✅
  HW EV Exotics Exotiques ✅  (Canadian bilingual)
  Race Day ✅
  Race Day Jour De Course ✅  (Canadian bilingual)
  HW Wide Rides ✅
  HW Wagons ✅
  HW Speed Machines ✅
  HW Bikes ✅
  Hot Rod Garage ✅

2024 ──────────────────────────
  HW Green Speed, HW Turbo,
  HW Reverse Rake, Mud Studs...

CUSTOM ENTRY ─────────────────
  Type any name not in the list
  → Orange "Add custom series" 
    button appears
  → Tap it to save your custom name!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
