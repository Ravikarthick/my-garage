#!/usr/bin/env node
const fs = require('fs');

let stats = fs.readFileSync('app/(tabs)/stats.tsx', 'utf8');

// Replace the edit modal with a tap-to-select picker
const oldModal = `      {/* Edit total modal */}
      <Modal visible={!!editSeries} transparent animationType="fade">
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', alignItems:'center', justifyContent:'center', padding:30 }}>
          <View style={[s.editModal, { backgroundColor:CARD }]}>
            <Text style={[s.editTitle, { color:TEXT }]}>Set series total</Text>
            <Text style={[{ fontSize:14, color:MUTED, marginBottom:12 }]} numberOfLines={2}>{editSeries}</Text>
            <TextInput
              style={[s.editInput, { backgroundColor:BG2, color:TEXT, borderColor:BORDER }]}
              value={editValue}
              onChangeText={setEditValue}
              keyboardType="numeric"
              placeholder="e.g. 10"
              placeholderTextColor={MUTED}
              autoFocus
            />
            <Text style={{ fontSize:12, color:MUTED, marginBottom:16 }}>
              How many cars are in this series total? (e.g. 5, 6, 10)
            </Text>
            <View style={{ flexDirection:'row', gap:10 }}>
              <TouchableOpacity
                style={[s.editBtn, { backgroundColor:BG2, flex:1 }]}
                onPress={() => setEditSeries(null)}
              >
                <Text style={{ color:TEXT, fontWeight:'600', textAlign:'center' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.editBtn, { backgroundColor:'#D85A30', flex:1 }]}
                onPress={() => {
                  if (editSeries && editValue) {
                    saveCustomTotal(editSeries, Number(editValue));
                  }
                  setEditSeries(null);
                }}
              >
                <Text style={{ color:'#fff', fontWeight:'700', textAlign:'center' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>`;

const newModal = `      {/* Series total picker modal */}
      <Modal visible={!!editSeries} transparent animationType="slide">
        <TouchableOpacity style={{ flex:1, backgroundColor:'rgba(0,0,0,0.5)' }} activeOpacity={1} onPress={() => setEditSeries(null)} />
        <View style={[s.editModal, { backgroundColor:CARD }]}>
          <View style={[s.sheetHandle, { backgroundColor:BORDER }]} />
          <Text style={[s.editTitle, { color:TEXT }]}>How many in this set?</Text>
          <Text style={{ fontSize:13, color:MUTED, marginBottom:16, paddingHorizontal:20 }} numberOfLines={2}>{editSeries}</Text>
          
          {/* Quick tap options */}
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:10, paddingHorizontal:20, marginBottom:16 }}>
            {[3,4,5,6,7,8,10,12,15,20,25,30,50,100].map(n => (
              <TouchableOpacity
                key={n}
                style={{
                  paddingHorizontal:18, paddingVertical:10,
                  borderRadius:20, borderWidth:1.5,
                  backgroundColor: Number(editValue)===n ? '#D85A30' : BG2,
                  borderColor: Number(editValue)===n ? '#D85A30' : BORDER,
                }}
                onPress={() => {
                  if (editSeries) saveCustomTotal(editSeries, n);
                  setEditSeries(null);
                }}
              >
                <Text style={{
                  fontSize:16, fontWeight:'700',
                  color: Number(editValue)===n ? '#fff' : TEXT
                }}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom number input as fallback */}
          <View style={{ paddingHorizontal:20, marginBottom:20 }}>
            <Text style={{ fontSize:12, color:MUTED, marginBottom:8 }}>Or type a custom number:</Text>
            <View style={{ flexDirection:'row', gap:10 }}>
              <TextInput
                style={[s.editInput, { backgroundColor:BG2, color:TEXT, borderColor:BORDER, flex:1 }]}
                value={editValue}
                onChangeText={setEditValue}
                keyboardType="numeric"
                placeholder="Custom..."
                placeholderTextColor={MUTED}
              />
              <TouchableOpacity
                style={{ backgroundColor:'#D85A30', borderRadius:12, paddingHorizontal:18, justifyContent:'center' }}
                onPress={() => {
                  if (editSeries && editValue) saveCustomTotal(editSeries, Number(editValue));
                  setEditSeries(null);
                }}
              >
                <Text style={{ color:'#fff', fontWeight:'700', fontSize:14 }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={{ marginHorizontal:20, marginBottom:30, padding:14, borderRadius:12, backgroundColor:BG2, alignItems:'center' }}
            onPress={() => setEditSeries(null)}
          >
            <Text style={{ color:MUTED, fontWeight:'600' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>`;

if (stats.includes(oldModal)) {
  stats = stats.replace(oldModal, newModal);
  console.log('✅ Replaced edit modal with tap picker');
} else {
  console.log('⚠️  Could not find old modal - trying alternative patch...');
  // Try to find just the modal
  const modalStart = stats.indexOf('{/* Edit total modal */}');
  if (modalStart !== -1) {
    // Find the closing </Modal>
    const modalEnd = stats.indexOf('</Modal>', modalStart) + '</Modal>'.length;
    stats = stats.slice(0, modalStart) + newModal + stats.slice(modalEnd);
    console.log('✅ Patched modal via position');
  }
}

// Add sheetHandle style if missing
if (!stats.includes('sheetHandle:')) {
  stats = stats.replace(
    '  editModal:',
    `  sheetHandle: { width:40, height:4, borderRadius:2, alignSelf:'center', marginBottom:14 },
  editModal:`
  );
  console.log('✅ Added sheetHandle style');
}

// Update editModal style to be a bottom sheet
stats = stats.replace(
  "  editModal: { borderRadius:20, padding:22, width:'100%' },",
  "  editModal: { borderTopLeftRadius:24, borderTopRightRadius:24, paddingTop:12, width:'100%' },"
);

fs.writeFileSync('app/(tabs)/stats.tsx', stats);
console.log('✅ Done!');
console.log('\nNow in Series Tracker:');
console.log('  Tap the ? or number next to any series');
console.log('  → Bottom sheet slides up');
console.log('  → Tap 5, 6, 10 etc directly');
console.log('  → No typing needed!');
