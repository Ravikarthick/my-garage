#!/usr/bin/env node
const fs = require('fs');

// ── 1. Fix NAME_TO_MFG - inject missing entries ─────────────────────────────
let db = fs.readFileSync('lib/carDatabase.ts', 'utf8');

// Find line 33 area - right after NAME_TO_MFG opening brace
const insertAfter = 'const NAME_TO_MFG: Record<string, string> = {';
const insertPoint = db.indexOf(insertAfter) + insertAfter.length;

const newEntries = `
  // ── School Bus / HW Originals ─────────────────────────────────────────
  'surfin school bus': 'Hot Wheels Original',
  'school bus': 'Hot Wheels Original',
  'surfin school': 'Hot Wheels Original',
  'surfin': 'Hot Wheels Original',
  'bone shaker': 'Hot Wheels Original',
  'twin mill': 'Hot Wheels Original',
  'deora': 'Hot Wheels Original',
  'rip rod': 'Hot Wheels Original',
  'rodger dodger': 'Hot Wheels Original',
  'el segundo': 'Hot Wheels Original',
  'bread box': 'Hot Wheels Original',
  'fast fish': 'Hot Wheels Original',
  'ratbomb': 'Hot Wheels Original',
  'custom otto': 'Hot Wheels Original',
  'mod speeder': 'Hot Wheels Original',
  'punk rod': 'Hot Wheels Original',
  'lolux': 'Hot Wheels Original',
  // ── Datsun ───────────────────────────────────────────────────────────
  'datsun': 'Datsun',
  '240z': 'Datsun',
  '260z': 'Datsun',
  '280z': 'Datsun',
  'datsun 510': 'Datsun',
  'bluebird': 'Datsun',
  'fairlady': 'Datsun',
  // ── Barbie / Mattel ───────────────────────────────────────────────────
  'barbie': 'Mattel',
  // ── Batman / DC ───────────────────────────────────────────────────────
  'batmobile': 'DC Comics',
  'kitt': 'DC Comics',
  // ── Pontiac ───────────────────────────────────────────────────────────
  'pontiac': 'Pontiac',
  'firebird': 'Pontiac',
  'trans am': 'Pontiac',
  'gto': 'Pontiac',
  // ── AMC ───────────────────────────────────────────────────────────────
  'amc': 'AMC',
  'javelin': 'AMC',
  'amx': 'AMC',
  'gremlin': 'AMC',
`;

db = db.slice(0, insertPoint) + newEntries + db.slice(insertPoint);

// Also remove generic 'bus' mapping if it maps to VW
db = db.replace(/'bus':\s*'Volkswagen',?\s*\n/g, '');

fs.writeFileSync('lib/carDatabase.ts', db);
console.log('✅ NAME_TO_MFG fixed - added 30+ missing entries');

// ── 2. Add collector number dropdown to car form ────────────────────────────
let form = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Add colnum picker state
form = form.replace(
  "  const [history, setHistory] = useState([]);",
  `  const [history, setHistory] = useState([]);
  const [showColPicker, setShowColPicker] = useState(false);`
);

// Replace Collector # TextInput with picker button + modal
const oldColInput = `            <View style={{flex:1}}>
              <Text style={s.lbl}>Collector # (e.g. 4/5)</Text>
              <TextInput style={s.input} value={colnum} onChangeText={setColnum} placeholder="4/5 or 042/250" placeholderTextColor="#A0A09C"/>
            </View>`;

const newColInput = `            <View style={{flex:1}}>
              <Text style={s.lbl}>Collector #</Text>
              <TouchableOpacity
                style={[s.input,{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11}]}
                onPress={()=>setShowColPicker(true)}
              >
                <Text style={{fontSize:15,color:colnum?'#1A1A18':'#A0A09C',flex:1}}>
                  {colnum||'e.g. 4/5'}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C"/>
              </TouchableOpacity>
            </View>`;

form = form.replace(oldColInput, newColInput);

// Add collector picker modal before the Series Picker modal
const colPickerModal = `
      {/* Collector # Picker */}
      <Modal visible={showColPicker} transparent animationType="slide">
        <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)'}} activeOpacity={1} onPress={()=>setShowColPicker(false)}/>
        <View style={{backgroundColor:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,paddingBottom:40}}>
          <View style={{width:40,height:4,borderRadius:2,backgroundColor:'#E0DEDA',alignSelf:'center',marginVertical:12}}/>
          <Text style={{fontSize:18,fontWeight:'700',color:'#1A1A18',paddingHorizontal:20,marginBottom:4}}>Collector Number</Text>
          <Text style={{fontSize:13,color:'#A0A09C',paddingHorizontal:20,marginBottom:14}}>Tap a number or type custom below</Text>

          {/* Out of 5 */}
          <Text style={{fontSize:11,fontWeight:'700',color:'#A0A09C',paddingHorizontal:20,marginBottom:8,textTransform:'uppercase',letterSpacing:0.8}}>Out of 5</Text>
          <View style={{flexDirection:'row',gap:8,paddingHorizontal:20,marginBottom:16,flexWrap:'wrap'}}>
            {[1,2,3,4,5].map(n=>(
              <TouchableOpacity
                key={'5-'+n}
                style={{paddingHorizontal:16,paddingVertical:10,borderRadius:20,borderWidth:1.5,backgroundColor:colnum===n+'/5'?'#D85A30':'#F5F4F1',borderColor:colnum===n+'/5'?'#D85A30':'#E0DEDA'}}
                onPress={()=>{setColnum(n+'/5');setShowColPicker(false);}}
              >
                <Text style={{fontSize:16,fontWeight:'700',color:colnum===n+'/5'?'#fff':'#1A1A18'}}>{n}/5</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Out of 6 */}
          <Text style={{fontSize:11,fontWeight:'700',color:'#A0A09C',paddingHorizontal:20,marginBottom:8,textTransform:'uppercase',letterSpacing:0.8}}>Out of 6 (Car Culture)</Text>
          <View style={{flexDirection:'row',gap:8,paddingHorizontal:20,marginBottom:16,flexWrap:'wrap'}}>
            {[1,2,3,4,5,6].map(n=>(
              <TouchableOpacity
                key={'6-'+n}
                style={{paddingHorizontal:16,paddingVertical:10,borderRadius:20,borderWidth:1.5,backgroundColor:colnum===n+'/6'?'#D85A30':'#F5F4F1',borderColor:colnum===n+'/6'?'#D85A30':'#E0DEDA'}}
                onPress={()=>{setColnum(n+'/6');setShowColPicker(false);}}
              >
                <Text style={{fontSize:16,fontWeight:'700',color:colnum===n+'/6'?'#fff':'#1A1A18'}}>{n}/6</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Out of 10 */}
          <Text style={{fontSize:11,fontWeight:'700',color:'#A0A09C',paddingHorizontal:20,marginBottom:8,textTransform:'uppercase',letterSpacing:0.8}}>Out of 10</Text>
          <View style={{flexDirection:'row',gap:8,paddingHorizontal:20,marginBottom:16,flexWrap:'wrap'}}>
            {[1,2,3,4,5,6,7,8,9,10].map(n=>(
              <TouchableOpacity
                key={'10-'+n}
                style={{paddingHorizontal:12,paddingVertical:10,borderRadius:20,borderWidth:1.5,backgroundColor:colnum===n+'/10'?'#D85A30':'#F5F4F1',borderColor:colnum===n+'/10'?'#D85A30':'#E0DEDA'}}
                onPress={()=>{setColnum(n+'/10');setShowColPicker(false);}}
              >
                <Text style={{fontSize:15,fontWeight:'700',color:colnum===n+'/10'?'#fff':'#1A1A18'}}>{n}/10</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom input */}
          <View style={{paddingHorizontal:20,flexDirection:'row',gap:10}}>
            <TextInput
              style={{flex:1,backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:10,paddingHorizontal:12,paddingVertical:10,fontSize:15,color:'#1A1A18'}}
              value={colnum}
              onChangeText={setColnum}
              placeholder="Custom e.g. 042/250"
              placeholderTextColor="#A0A09C"
              keyboardType="default"
            />
            <TouchableOpacity
              style={{backgroundColor:'#D85A30',borderRadius:10,paddingHorizontal:18,justifyContent:'center'}}
              onPress={()=>setShowColPicker(false)}
            >
              <Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
`;

// Insert before Series Picker modal
form = form.replace(
  "      {/* Series Picker */}",
  colPickerModal + "\n      {/* Series Picker */}"
);

fs.writeFileSync('app/car/[id].tsx', form);
console.log('✅ Collector # picker added - 1/5, 1/6, 1/10 buttons');

console.log('\n✅ ALL DONE! Run: npx expo start --clear');
console.log('\nFixed:');
console.log('  Surfin School Bus → Hot Wheels Original ✅');
console.log('  Datsun 510        → Datsun ✅');
console.log('  Javelin AMX       → AMC ✅');
console.log('  Barbie            → Mattel ✅');
console.log('  Collector # field → tap to pick 1/5, 2/5... 1/10... 10/10 ✅');
