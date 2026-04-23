#!/usr/bin/env node
const fs = require('fs');

// ── Update storage to add mainline number field ─────────────────────────────
let storage = fs.readFileSync('lib/storage.ts', 'utf8');
if (!storage.includes('mainline')) {
  storage = storage.replace(
    'colnum:string;',
    'colnum:string; mainline:string;'
  );
  fs.writeFileSync('lib/storage.ts', storage);
  console.log('✅ storage.ts - added mainline field');
}

// ── Update car form ─────────────────────────────────────────────────────────
let form = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Add mainline state
if (!form.includes("useState('') // mainline")) {
  form = form.replace(
    "  const [colnum, setColnum] = useState('');",
    `  const [colnum, setColnum] = useState('');
  const [mainline, setMainline] = useState(''); // mainline number e.g. 32/250
  const [showMainlinePicker, setShowMainlinePicker] = useState(false);`
  );
}

// Load mainline in edit mode
form = form.replace(
  'setColnum(c.colnum||);',
  `setColnum(c.colnum||''); setMainline(c.mainline||'');`
);
form = form.replace(
  "setColnum(c.colnum||'');",
  `setColnum(c.colnum||''); setMainline(c.mainline||'');`
);

// Save mainline
form = form.replace(
  'colnum:colnum.trim(),',
  'colnum:colnum.trim(), mainline:mainline.trim(),'
);

// Replace the single collector # field with TWO fields
const oldFields = `            <View style={{flex:1}}>
              <Text style={s.lbl}>Collector #</Text>
              <TouchableOpacity
                style={[s.input,{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11}]}
                onPress={()=>setShowColPicker(true)}
              >
                <Text style={{fontSize:15,color:colnum?'#1A1A18':'#A0A09C',flex:1}} numberOfLines={1}>
                  {colnum||'e.g. 4/5'}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C"/>
              </TouchableOpacity>
            </View>`;

const newFields = `            <View style={{flex:1}}>
              <Text style={s.lbl}>Series # (e.g. 4/5)</Text>
              <TouchableOpacity
                style={[s.input,{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11}]}
                onPress={()=>setShowColPicker(true)}
              >
                <Text style={{fontSize:15,color:colnum?'#1A1A18':'#A0A09C',flex:1}} numberOfLines={1}>
                  {colnum||'4/5'}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C"/>
              </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Mainline # (e.g. 32/250)</Text>
              <TouchableOpacity
                style={[s.input,{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11}]}
                onPress={()=>setShowMainlinePicker(true)}
              >
                <Text style={{fontSize:15,color:mainline?'#1A1A18':'#A0A09C',flex:1}} numberOfLines={1}>
                  {mainline||'32/250'}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C"/>
              </TouchableOpacity>
            </View>`;

if (form.includes(oldFields)) {
  form = form.replace(oldFields, newFields);
  console.log('✅ Split into two fields');
} else {
  console.log('⚠️  Could not find collector field - trying alternate search');
  // Try simpler replacement
  form = form.replace(
    `<Text style={s.lbl}>Collector #</Text>`,
    `<Text style={s.lbl}>Series # (e.g. 4/5)</Text>`
  );
}

// Add mainline picker modal - insert before color picker modal
const mainlineModal = `      {/* Mainline # Picker 1-250 */}
      <Modal visible={showMainlinePicker} transparent animationType="slide">
        <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)'}} activeOpacity={1} onPress={()=>setShowMainlinePicker(false)}/>
        <View style={{backgroundColor:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,paddingBottom:40}}>
          <View style={{width:40,height:4,borderRadius:2,backgroundColor:'#E0DEDA',alignSelf:'center',marginVertical:12}}/>
          <Text style={{fontSize:18,fontWeight:'700',color:'#1A1A18',paddingHorizontal:20,marginBottom:4}}>Mainline Number</Text>
          <Text style={{fontSize:13,color:'#A0A09C',paddingHorizontal:20,marginBottom:14}}>Car number out of 250 in the full year</Text>
          <View style={{paddingHorizontal:20,marginBottom:16}}>
            <Text style={{fontSize:13,color:'#6B6B67',marginBottom:10}}>Type the number from the card (e.g. 32 → 32/250):</Text>
            <View style={{flexDirection:'row',gap:10}}>
              <TextInput
                style={{flex:1,backgroundColor:'#F5F4F1',borderWidth:1,borderColor:'#D85A30',borderRadius:12,paddingHorizontal:16,paddingVertical:12,fontSize:20,fontWeight:'700',color:'#1A1A18',textAlign:'center'}}
                value={mainline.replace('/250','')}
                onChangeText={v=>{
                  const num = v.replace(/[^0-9]/g,'');
                  if(num&&Number(num)>=1&&Number(num)<=250) setMainline(num+'/250');
                  else if(!num) setMainline('');
                }}
                placeholder="e.g. 32"
                placeholderTextColor="#A0A09C"
                keyboardType="numeric"
                maxLength={3}
              />
              <TouchableOpacity
                style={{backgroundColor:'#D85A30',borderRadius:12,paddingHorizontal:20,justifyContent:'center'}}
                onPress={()=>setShowMainlinePicker(false)}
              >
                <Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>Done</Text>
              </TouchableOpacity>
            </View>
            {mainline&&<Text style={{fontSize:16,color:'#3B6D11',fontWeight:'700',marginTop:10,textAlign:'center'}}>Will save as: {mainline}</Text>}
          </View>
          {/* Quick picks for common numbers */}
          <Text style={{fontSize:11,fontWeight:'700',color:'#A0A09C',paddingHorizontal:20,marginBottom:8,textTransform:'uppercase',letterSpacing:0.8}}>Quick picks</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:20,gap:8}}>
            {[1,10,25,50,75,100,125,150,175,200,225,250].map(n=>(
              <TouchableOpacity
                key={n}
                style={{paddingHorizontal:14,paddingVertical:8,borderRadius:20,borderWidth:1.5,
                  backgroundColor:mainline===n+'/250'?'#D85A30':'#F5F4F1',
                  borderColor:mainline===n+'/250'?'#D85A30':'#E0DEDA'}}
                onPress={()=>{setMainline(n+'/250');setShowMainlinePicker(false);}}
              >
                <Text style={{fontSize:14,fontWeight:'700',color:mainline===n+'/250'?'#fff':'#1A1A18'}}>{n}/250</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

`;

form = form.replace(
  '      {/* Color Picker */}',
  mainlineModal + '      {/* Color Picker */}'
);

fs.writeFileSync('app/car/[id].tsx', form);
console.log('✅ Mainline picker added');

// ── Update CarCard to show both numbers ─────────────────────────────────────
try {
  let card = fs.readFileSync('components/CarCard.tsx', 'utf8');
  if (card.includes('c.colnum') && !card.includes('c.mainline')) {
    card = card.replace(
      '{!!c.colnum &&',
      `{!!c.mainline && <Text style={[styles.colnum,{color:'#888'}]}>#{c.mainline}</Text>}
          {!!c.colnum &&`
    );
    fs.writeFileSync('components/CarCard.tsx', card);
    console.log('✅ CarCard shows both numbers');
  }
} catch(e) { console.log('ℹ️  CarCard skip:', e.message); }

console.log(`
✅ DONE! Run: npx expo start --clear

Now each car has TWO collector number fields:
  Series #:   4/5   (position in HW Exotics set)
  Mainline #: 32/250 (position in full year)

Just like the actual card shows both!
`);
