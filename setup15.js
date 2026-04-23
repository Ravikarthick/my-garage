#!/usr/bin/env node
const fs = require('fs');

// Read the file
let content = fs.readFileSync('app/(tabs)/gallery.tsx', 'utf8');

// Replace the entire ReelItem function
const oldStart = content.indexOf('  // ── REEL ITEM');
const oldEnd = content.indexOf('\n  // ── REEL MODE', oldStart);

const newReelItem = `  // ── REEL ITEM ─────────────────────────────────────────────────────────────
  function ReelItem({ item: c, index }) {
    const PHOTO_H = SH * 0.56;
    const INFO_H  = SH * 0.44;
    return (
      <View style={{ width:SW, height:SH, backgroundColor:'#0A0A0A' }}>

        {/* ── TOP: PHOTO SECTION ── */}
        <View style={{ width:SW, height:PHOTO_H, backgroundColor:'#111', overflow:'hidden' }}>
          {c.photo
            ? <>
                {/* Blurred BG */}
                <Image source={{ uri:c.photo }} style={{ position:'absolute', width:SW, height:PHOTO_H }} resizeMode="cover" blurRadius={18} />
                <View style={{ position:'absolute', width:SW, height:PHOTO_H, backgroundColor:'rgba(0,0,0,0.25)' }} />
                {/* Main photo — full, contained, no crop */}
                <Image source={{ uri:c.photo }} style={{ width:SW, height:PHOTO_H }} resizeMode="contain" />
              </>
            : <View style={{ width:SW, height:PHOTO_H, alignItems:'center', justifyContent:'center', backgroundColor: c.brand==='hw' ? '#1a0800' : '#000d1a' }}>
                <Text style={{ fontSize:120 }}>{c.brand==='hw' ? '🔥' : '🚙'}</Text>
              </View>
          }

          {/* Brand badge top-left */}
          <View style={{ position:'absolute', top:14, left:14 }}>
            <View style={[s.pill, { backgroundColor: c.brand==='hw' ? '#D85A30' : '#185FA5' }]}>
              <Text style={s.pillTxt}>{c.brand==='hw' ? '🔥 Hot Wheels' : '🚙 Matchbox'}</Text>
            </View>
          </View>

          {/* TH badge top-right */}
          {c.th !== 'none' && (
            <View style={{ position:'absolute', top:14, right:14 }}>
              <View style={[s.pill, { backgroundColor: c.th==='sth' ? '#BA7517' : '#3B6D11' }]}>
                <Text style={s.pillTxt}>{c.th==='sth' ? '🌟 Super TH' : '⭐ Treasure Hunt'}</Text>
              </View>
            </View>
          )}
        </View>

        {/* ── BOTTOM: INFO SECTION ── */}
        <View style={{ width:SW, height:INFO_H, backgroundColor:'#0A0A0A', paddingHorizontal:20, paddingTop:18, paddingBottom:16 }}>

          {/* Car name */}
          <Text style={{ fontSize:26, fontWeight:'900', color:'#FFFFFF', lineHeight:30, marginBottom:4, letterSpacing:-0.3 }} numberOfLines={2}>{c.name}</Text>

          {/* Manufacturer */}
          {!!c.manufacturer && (
            <Text style={{ fontSize:15, fontWeight:'700', color:'#FF8A50', marginBottom:14 }}>{c.manufacturer}</Text>
          )}

          {/* Detail grid — 2 columns */}
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:12 }}>
            {!!c.series && (
              <View style={s.detailCard}>
                <Text style={s.detailLabel}>SERIES</Text>
                <Text style={s.detailValue} numberOfLines={2}>{c.series}</Text>
              </View>
            )}
            {!!c.year && (
              <View style={s.detailCard}>
                <Text style={s.detailLabel}>YEAR</Text>
                <Text style={s.detailValue}>{c.year}</Text>
              </View>
            )}
            {!!c.color && (
              <View style={s.detailCard}>
                <Text style={s.detailLabel}>COLOR</Text>
                <Text style={s.detailValue} numberOfLines={1}>{c.color}</Text>
              </View>
            )}
            {!!c.colnum && (
              <View style={[s.detailCard, { backgroundColor:'rgba(24,95,165,0.35)', borderColor:'rgba(24,95,165,0.5)' }]}>
                <Text style={[s.detailLabel, { color:'rgba(100,160,255,0.8)' }]}>COL #</Text>
                <Text style={[s.detailValue, { color:'#78B4FF' }]}>{c.colnum}</Text>
              </View>
            )}
            {!!c.tampo && (
              <View style={[s.detailCard, { flex:1, minWidth:140 }]}>
                <Text style={s.detailLabel}>TAMPO</Text>
                <Text style={s.detailValue} numberOfLines={1}>{c.tampo}</Text>
              </View>
            )}
          </View>

          {/* Status + Edit row */}
          <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
            <View style={{ flexDirection:'row', gap:8 }}>
              {c.status==='wish' && (
                <View style={[s.statusPill, { backgroundColor:'rgba(24,95,165,0.3)', borderColor:'rgba(24,95,165,0.5)' }]}>
                  <Text style={{ color:'#78B4FF', fontSize:12, fontWeight:'700' }}>♡ Wishlist</Text>
                </View>
              )}
              {c.status==='dup' && (
                <View style={[s.statusPill, { backgroundColor:'rgba(163,45,45,0.35)', borderColor:'rgba(163,45,45,0.5)' }]}>
                  <Text style={{ color:'#FF8080', fontSize:12, fontWeight:'700' }}>2× Duplicate</Text>
                </View>
              )}
              {c.status==='owned' && (
                <View style={[s.statusPill, { backgroundColor:'rgba(59,109,17,0.3)', borderColor:'rgba(59,109,17,0.5)' }]}>
                  <Text style={{ color:'#90D050', fontSize:12, fontWeight:'700' }}>✓ Owned</Text>
                </View>
              )}
              {!!c.notes && (
                <Text style={{ color:'rgba(255,255,255,0.4)', fontSize:12, alignSelf:'center' }} numberOfLines={1}>{c.notes}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => { setMode('grid'); router.push({ pathname:'/car/[id]', params:{ id:c.id } }); }}
              style={{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(255,255,255,0.12)', paddingHorizontal:14, paddingVertical:8, borderRadius:20 }}
            >
              <Ionicons name="pencil" size={14} color="#fff" />
              <Text style={{ color:'#fff', fontSize:13, fontWeight:'700' }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Swipe cue */}
        {index < reelCars.length - 1 && (
          <View style={{ position:'absolute', bottom: Platform.OS==='ios' ? 110 : 90, alignSelf:'center', alignItems:'center', gap:1 }}>
            <Ionicons name="chevron-up" size={16} color="rgba(255,255,255,0.3)" />
            <Text style={{ color:'rgba(255,255,255,0.25)', fontSize:9 }}>swipe up</Text>
          </View>
        )}

        {/* Counter */}
        <View style={{ position:'absolute', top: Platform.OS==='ios' ? 56 : 16, right:16, backgroundColor:'rgba(0,0,0,0.6)', paddingHorizontal:10, paddingVertical:4, borderRadius:12 }}>
          <Text style={{ color:'#fff', fontSize:11, fontWeight:'700' }}>{index+1} / {reelCars.length}</Text>
        </View>
      </View>
    );
  }`;

if (oldStart !== -1 && oldEnd !== -1) {
  content = content.slice(0, oldStart) + newReelItem + '\n' + content.slice(oldEnd);
  fs.writeFileSync('app/(tabs)/gallery.tsx', content);
  console.log('✅ ReelItem fixed!');
} else {
  console.log('❌ Could not find ReelItem position in file');
  process.exit(1);
}

// Fix the StyleSheet to add new styles
const oldStyles = `  pill: { paddingHorizontal:10, paddingVertical:5, borderRadius:20 },
  pillTxt: { color:'#fff', fontSize:12, fontWeight:'600' },
  reelName: { fontSize:30, fontWeight:'900', color:'#fff', lineHeight:34, marginBottom:3, letterSpacing:-0.3 },
  reelMaker: { fontSize:16, fontWeight:'600', color:'#FF9060', marginBottom:10 },
  chip: { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'rgba(255,255,255,0.15)', paddingHorizontal:10, paddingVertical:5, borderRadius:20 },
  chipTxt: { color:'#fff', fontSize:12, fontWeight:'500' },
  reelNotes: { color:'rgba(255,255,255,0.5)', fontSize:13, lineHeight:18, marginTop:2 },
  actionCircle: { width:44, height:44, borderRadius:22, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  actionTxt: { color:'#fff', fontSize:11, fontWeight:'600' },`;

const newStyles = `  pill: { paddingHorizontal:10, paddingVertical:5, borderRadius:20 },
  pillTxt: { color:'#fff', fontSize:12, fontWeight:'600' },
  reelName: { fontSize:30, fontWeight:'900', color:'#fff', lineHeight:34, marginBottom:3, letterSpacing:-0.3 },
  reelMaker: { fontSize:16, fontWeight:'600', color:'#FF9060', marginBottom:10 },
  chip: { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'rgba(255,255,255,0.15)', paddingHorizontal:10, paddingVertical:5, borderRadius:20 },
  chipTxt: { color:'#fff', fontSize:12, fontWeight:'500' },
  reelNotes: { color:'rgba(255,255,255,0.5)', fontSize:13, lineHeight:18, marginTop:2 },
  actionCircle: { width:44, height:44, borderRadius:22, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  actionTxt: { color:'#fff', fontSize:11, fontWeight:'600' },
  detailCard: { backgroundColor:'rgba(255,255,255,0.08)', borderWidth:0.5, borderColor:'rgba(255,255,255,0.12)', borderRadius:10, paddingHorizontal:12, paddingVertical:8, minWidth:80 },
  detailLabel: { fontSize:9, fontWeight:'700', color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:0.6, marginBottom:3 },
  detailValue: { fontSize:14, fontWeight:'700', color:'#FFFFFF' },
  statusPill: { paddingHorizontal:10, paddingVertical:5, borderRadius:20, borderWidth:0.5 },`;

if (content.includes(oldStyles)) {
  content = content.replace(oldStyles, newStyles);
  fs.writeFileSync('app/(tabs)/gallery.tsx', content);
  console.log('✅ Styles updated!');
} else {
  // Try to find and add styles differently
  content = fs.readFileSync('app/(tabs)/gallery.tsx', 'utf8');
  // Add new styles before the closing of StyleSheet
  const styleInsert = `  detailCard: { backgroundColor:'rgba(255,255,255,0.08)', borderWidth:0.5, borderColor:'rgba(255,255,255,0.12)', borderRadius:10, paddingHorizontal:12, paddingVertical:8, minWidth:80 },
  detailLabel: { fontSize:9, fontWeight:'700', color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:0.6, marginBottom:3 },
  detailValue: { fontSize:14, fontWeight:'700', color:'#FFFFFF' },
  statusPill: { paddingHorizontal:10, paddingVertical:5, borderRadius:20, borderWidth:0.5 },`;
  content = content.replace('  makerRow:', styleInsert + '\n  makerRow:');
  fs.writeFileSync('app/(tabs)/gallery.tsx', content);
  console.log('✅ Styles appended!');
}

console.log('\nRun: npx expo start --clear');
console.log('\nNew layout:');
console.log('┌────────────────────┐');
console.log('│  [HW badge] [TH]   │');
console.log('│                    │  ← Top 56% = FULL PHOTO');
console.log('│  WHOLE CAR CARD    │     (blurred bg + contain mode)');
console.log('│  NO ZOOM/CROP      │');
console.log('├────────────────────┤');
console.log('│ Car Name BIG       │');
console.log('│ Manufacturer       │  ← Bottom 44% = INFO PANEL');
console.log('│ [SERIES] [YEAR]    │     (dark background)');
console.log('│ [COLOR] [COL #]    │');
console.log('│ ✓ Owned    [Edit]  │');
console.log('└────────────────────┘');
