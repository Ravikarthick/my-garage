#!/usr/bin/env node
const fs = require('fs');

let content = fs.readFileSync('app/(tabs)/gallery.tsx', 'utf8');

// Replace the entire ReelItem function
const oldStart = content.indexOf('  function ReelItem(');
const oldEnd   = content.indexOf('\n  // ── REEL MODE', oldStart);

if (oldStart === -1 || oldEnd === -1) {
  console.log('❌ Could not find ReelItem — check file');
  process.exit(1);
}

const newReelItem = `  function ReelItem({ item: c, index }) {
    const brandCol = c.brand === 'hw' ? '#D85A30' : '#185FA5';
    const TOPBAR_H = Platform.OS === 'ios' ? 96 : 56;   // top bar (grid btn + title + +)
    const PHOTO_H  = SW * 1.0;                           // photo square-ish
    const INFO_H   = SH - TOPBAR_H - PHOTO_H;           // everything else

    return (
      <View style={{ width: SW, height: SH, backgroundColor: '#0D0D0D' }}>

        {/* ── ZONE 1: TOP BAR — sits at top, no overlap ─────────────── */}
        {/* (rendered in REEL MODE as absolute overlay — handled outside) */}

        {/* ── ZONE 2: CAR NAME STRIP — just below top bar ───────────── */}
        <View style={{
          position: 'absolute',
          top: TOPBAR_H,
          left: 0, right: 0,
          paddingHorizontal: 18,
          paddingTop: 10,
          paddingBottom: 8,
          backgroundColor: '#0D0D0D',
          zIndex: 1,
        }}>
          {/* Brand / TH badges */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
            <View style={[st.badge, { backgroundColor: brandCol }]}>
              <Text style={st.badgeTxt}>{c.brand === 'hw' ? '🔥 Hot Wheels' : '🚙 Matchbox'}</Text>
            </View>
            {c.th === 'sth' && <View style={[st.badge, { backgroundColor: '#BA7517' }]}><Text style={st.badgeTxt}>🌟 Super TH</Text></View>}
            {c.th === 'th'  && <View style={[st.badge, { backgroundColor: '#3B6D11' }]}><Text style={st.badgeTxt}>⭐ TH</Text></View>}
            {c.status === 'wish' && <View style={[st.badge, { backgroundColor: 'rgba(24,95,165,0.8)' }]}><Text style={st.badgeTxt}>♡ Wishlist</Text></View>}
            {c.status === 'dup'  && <View style={[st.badge, { backgroundColor: '#8B1A1A' }]}><Text style={st.badgeTxt}>2× Dupe</Text></View>}
          </View>
          <Text style={st.carName} numberOfLines={2}>{c.name}</Text>
          {!!c.manufacturer && (
            <Text style={[st.makerName, { color: c.brand === 'hw' ? '#FF9060' : '#78B4FF' }]} numberOfLines={1}>{c.manufacturer}</Text>
          )}
        </View>

        {/* ── ZONE 3: PHOTO ──────────────────────────────────────────── */}
        <View style={{
          position: 'absolute',
          top: TOPBAR_H + 88,   // below name strip
          left: 0, right: 0,
          height: PHOTO_H,
          backgroundColor: '#161616',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {c.photo ? (
            <>
              <Image source={{ uri: c.photo }} style={StyleSheet.absoluteFill} resizeMode="cover" blurRadius={20} />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.38)' }]} />
              <Image source={{ uri: c.photo }} style={{ width: SW - 16, height: PHOTO_H - 16 }} resizeMode="contain" />
            </>
          ) : (
            <Text style={{ fontSize: 90 }}>{c.brand === 'hw' ? '🔥' : '🚙'}</Text>
          )}
          {/* counter */}
          <View style={st.counter}>
            <Text style={st.counterTxt}>{index + 1} / {reelList.length}</Text>
          </View>
        </View>

        {/* ── ZONE 4: INFO PANEL — fills the rest at bottom ─────────── */}
        <View style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          top: TOPBAR_H + 88 + PHOTO_H,
          backgroundColor: '#0D0D0D',
          paddingHorizontal: 14,
          paddingTop: 14,
          paddingBottom: Platform.OS === 'ios' ? 30 : 16,
        }}>
          {/* Info grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {c.series && (
              <View style={[st.infoBox, { flex: 2, minWidth: '45%' }]}>
                <Text style={st.infoLbl}>SERIES</Text>
                <Text style={st.infoVal} numberOfLines={2}>{c.series}</Text>
              </View>
            )}
            {c.year && (
              <View style={[st.infoBox, { flex: 1, minWidth: '28%' }]}>
                <Text style={st.infoLbl}>YEAR</Text>
                <Text style={st.infoVal}>{c.year}</Text>
              </View>
            )}
            {c.color && (
              <View style={[st.infoBox, { flex: 1, minWidth: '28%' }]}>
                <Text style={st.infoLbl}>COLOR</Text>
                <Text style={st.infoVal} numberOfLines={1}>{c.color}</Text>
              </View>
            )}
            {c.colnum && (
              <View style={[st.infoBox, { flex: 1, minWidth: '28%', backgroundColor: 'rgba(24,95,165,0.25)', borderColor: 'rgba(78,140,220,0.35)' }]}>
                <Text style={[st.infoLbl, { color: '#5090CC' }]}>COL #</Text>
                <Text style={[st.infoVal, { color: '#78B4FF' }]}>{c.colnum}</Text>
              </View>
            )}
            {c.tampo && (
              <View style={[st.infoBox, { flex: 2, minWidth: '45%' }]}>
                <Text style={st.infoLbl}>TAMPO</Text>
                <Text style={st.infoVal} numberOfLines={1}>{c.tampo}</Text>
              </View>
            )}
          </View>

          {/* Notes */}
          {!!c.notes && (
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 17, marginBottom: 8 }} numberOfLines={2}>{c.notes}</Text>
          )}

          {/* Status + Edit row */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 'auto' }}>
            <View style={[st.statusBox, {
              backgroundColor: c.status === 'owned' ? 'rgba(59,109,17,0.2)' : c.status === 'wish' ? 'rgba(24,95,165,0.2)' : 'rgba(139,26,26,0.2)',
              borderColor:     c.status === 'owned' ? 'rgba(59,109,17,0.4)' : c.status === 'wish' ? 'rgba(24,95,165,0.4)' : 'rgba(139,26,26,0.4)',
            }]}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.status === 'owned' ? '#5DB82A' : c.status === 'wish' ? '#5090D0' : '#D04040', marginRight: 7 }} />
              <Text style={{ color: c.status === 'owned' ? '#90E050' : c.status === 'wish' ? '#78B4FF' : '#FF8080', fontSize: 13, fontWeight: '700' }}>
                {c.status === 'owned' ? 'In Collection' : c.status === 'wish' ? 'On Wishlist' : 'Duplicate'}
              </Text>
            </View>
            <TouchableOpacity
              style={st.editBtn}
              onPress={() => { setMode('grid'); router.push({ pathname: '/car/[id]', params: { id: c.id } }); }}
            >
              <Ionicons name="pencil" size={14} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
`;

content = content.slice(0, oldStart) + newReelItem + '\n' + content.slice(oldEnd);
fs.writeFileSync('app/(tabs)/gallery.tsx', content);
console.log('✅ ReelItem fixed — top bar no longer overlaps name');

// Also fix the top bar in REEL MODE to be truly above content
const oldTopBar = `        {/* Floating top bar */}
        <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 99 }}>
          <View style={st.topBar}>
            <TouchableOpacity style={st.topBarBtn} onPress={() => setMode('grid')}>
              <Ionicons name="grid-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={st.topBarPill}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 }}>{reelTitle}</Text>
            </View>
            <TouchableOpacity
              style={[st.topBarBtn, { backgroundColor: '#D85A30' }]}
              onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>`;

const newTopBar = `        {/* Top bar — fixed above everything, dark background so name doesn't clash */}
        <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 99, backgroundColor: '#0D0D0D' }}>
          <View style={st.topBar}>
            <TouchableOpacity style={st.topBarBtn} onPress={() => setMode('grid')}>
              <Ionicons name="grid-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={st.topBarPill}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 }}>{reelTitle}</Text>
            </View>
            <TouchableOpacity
              style={[st.topBarBtn, { backgroundColor: '#D85A30' }]}
              onPress={() => router.push({ pathname: '/car/[id]', params: { id: 'add' } })}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>`;

if (content.includes(oldTopBar)) {
  content = content.replace(oldTopBar, newTopBar);
  fs.writeFileSync('app/(tabs)/gallery.tsx', content);
  console.log('✅ Top bar background fixed');
}

console.log('\nRun: npx expo start --clear');
console.log('\nLayout is now:');
console.log('┌──────────────────────────┐  ← solid dark top bar');
console.log('│  [⊞]  ALL CARS  [+]      │    no overlap');
console.log('├──────────────────────────┤');
console.log('│ 🔥 Hot Wheels  ⭐ TH     │  ← badges');
console.log('│ Ford Mustang Mach-E 1400 │  ← big name');
console.log('│ Ford (orange)            │  ← maker');
console.log('├──────────────────────────┤');
console.log('│                          │');
console.log('│      FULL PHOTO          │  ← photo zone');
console.log('│      contained           │');
console.log('│                5 / 7     │');
console.log('├──────────────────────────┤');
console.log('│ SERIES        │ YEAR     │  ← info grid');
console.log('│ HW EV         │ 2026     │');
console.log('│ COLOR         │ COL #    │');
console.log('│ Black         │ 027/134  │');
console.log('├──────────────────────────┤');
console.log('│ ● In Collection  [Edit]  │  ← uses ALL bottom space');
console.log('└──────────────────────────┘');
