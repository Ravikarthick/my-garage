#!/usr/bin/env node
const fs = require('fs');

// ── 1. UPDATE COLLECTOR # PICKER - add 1/250 ───────────────────────────────
let form = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Replace the collector picker modal with extended version
const oldColModal = `      {/* Collector # Picker */}
      <Modal visible={showColPicker} transparent animationType="slide">`;

const newColModal = `      {/* Collector # Picker */}
      <Modal visible={showColPicker} transparent animationType="slide">
`;

// Find and replace the entire col picker modal
const colStart = form.indexOf('{/* Collector # Picker */}');
const colEnd = form.indexOf('{/* Series Picker */}');
if (colStart !== -1 && colEnd !== -1) {
  const newColPickerModal = `      {/* Collector # Picker */}
      <Modal visible={showColPicker} transparent animationType="slide">
        <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)'}} activeOpacity={1} onPress={()=>setShowColPicker(false)}/>
        <View style={{backgroundColor:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,paddingBottom:40,maxHeight:'85%'}}>
          <View style={{width:40,height:4,borderRadius:2,backgroundColor:'#E0DEDA',alignSelf:'center',marginVertical:12}}/>
          <Text style={{fontSize:18,fontWeight:'700',color:'#1A1A18',paddingHorizontal:20,marginBottom:4}}>Collector Number</Text>
          <Text style={{fontSize:13,color:'#A0A09C',paddingHorizontal:20,marginBottom:12}}>Select position in series</Text>
          <ScrollView style={{maxHeight:400}} contentContainerStyle={{paddingHorizontal:20,paddingBottom:20}}>
            {[
              {label:'Out of 5',total:5},
              {label:'Out of 6 (Car Culture)',total:6},
              {label:'Out of 8',total:8},
              {label:'Out of 10',total:10},
              {label:'Out of 12 (Target)',total:12},
              {label:'Out of 15',total:15},
              {label:'Out of 250 (Mainline)',total:250},
            ].map(({label,total})=>(
              <View key={total} style={{marginBottom:16}}>
                <Text style={{fontSize:11,fontWeight:'700',color:'#A0A09C',textTransform:'uppercase',letterSpacing:0.8,marginBottom:8}}>{label}</Text>
                <View style={{flexDirection:'row',flexWrap:'wrap',gap:6}}>
                  {Array.from({length:Math.min(total,50)},(_,i)=>i+1).map(n=>(
                    <TouchableOpacity
                      key={n}
                      style={{paddingHorizontal:10,paddingVertical:7,borderRadius:16,borderWidth:1.5,
                        backgroundColor:colnum===n+'/'+total?'#D85A30':'#F5F4F1',
                        borderColor:colnum===n+'/'+total?'#D85A30':'#E0DEDA'}}
                      onPress={()=>{setColnum(n+'/'+total);setShowColPicker(false);}}
                    >
                      <Text style={{fontSize:13,fontWeight:'700',color:colnum===n+'/'+total?'#fff':'#1A1A18'}}>{n}/{total}</Text>
                    </TouchableOpacity>
                  ))}
                  {total===250&&<Text style={{fontSize:12,color:'#A0A09C',alignSelf:'center',paddingLeft:4}}>51-250 →</Text>}
                </View>
                {total===250&&(
                  <View style={{flexDirection:'row',gap:8,marginTop:8}}>
                    <TextInput
                      style={{flex:1,backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:10,paddingHorizontal:12,paddingVertical:8,fontSize:14,color:'#1A1A18'}}
                      placeholder="51-250 type here e.g. 142/250"
                      placeholderTextColor="#A0A09C"
                      value={colnum.includes('/250')?colnum:''}
                      onChangeText={v=>setColnum(v)}
                      keyboardType="default"
                    />
                  </View>
                )}
              </View>
            ))}
            <View style={{marginBottom:8}}>
              <Text style={{fontSize:11,fontWeight:'700',color:'#A0A09C',textTransform:'uppercase',letterSpacing:0.8,marginBottom:8}}>Custom</Text>
              <View style={{flexDirection:'row',gap:10}}>
                <TextInput
                  style={{flex:1,backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:10,paddingHorizontal:12,paddingVertical:10,fontSize:15,color:'#1A1A18'}}
                  value={colnum}
                  onChangeText={setColnum}
                  placeholder="e.g. 042/250"
                  placeholderTextColor="#A0A09C"
                />
                <TouchableOpacity
                  style={{backgroundColor:'#D85A30',borderRadius:10,paddingHorizontal:18,justifyContent:'center'}}
                  onPress={()=>setShowColPicker(false)}
                >
                  <Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

`;
  form = form.slice(0, colStart) + newColPickerModal + form.slice(colEnd);
  fs.writeFileSync('app/car/[id].tsx', form);
  console.log('✅ Collector # picker updated with 1/250');
}

// ── 2. ADD COLOR PICKER ─────────────────────────────────────────────────────
form = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Add color picker state
if (!form.includes('showColorPicker')) {
  form = form.replace(
    '  const [showColPicker, setShowColPicker] = useState(false);',
    `  const [showColPicker, setShowColPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);`
  );
}

// Replace Color TextInput with picker
const oldColorInput = `            <View style={{flex:1}}>
              <Text style={s.lbl}>Color</Text>
              <TextInput style={s.input} value={color} onChangeText={setColor} placeholder="Flame Red" placeholderTextColor="#A0A09C"/>
            </View>`;

const newColorInput = `            <View style={{flex:1}}>
              <Text style={s.lbl}>Color</Text>
              <TouchableOpacity
                style={[s.input,{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11}]}
                onPress={()=>setShowColorPicker(true)}
              >
                <Text style={{fontSize:15,color:color?'#1A1A18':'#A0A09C',flex:1}} numberOfLines={1}>
                  {color||'Select color...'}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C"/>
              </TouchableOpacity>
            </View>`;

form = form.replace(oldColorInput, newColorInput);

// Add color picker modal before Collector # picker
const colorPickerModal = `      {/* Color Picker */}
      <Modal visible={showColorPicker} transparent animationType="slide">
        <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)'}} activeOpacity={1} onPress={()=>setShowColorPicker(false)}/>
        <View style={{backgroundColor:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,paddingBottom:40}}>
          <View style={{width:40,height:4,borderRadius:2,backgroundColor:'#E0DEDA',alignSelf:'center',marginVertical:12}}/>
          <Text style={{fontSize:18,fontWeight:'700',color:'#1A1A18',paddingHorizontal:20,marginBottom:14}}>Select Color</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,paddingHorizontal:20,marginBottom:16}}>
            {[
              'Red','Blue','Green','Yellow','Orange','Purple','Pink','White',
              'Black','Silver','Gold','Gray','Brown','Teal','Dark Blue',
              'Dark Red','Dark Green','Light Blue','Metallic Red','Metallic Blue',
              'Metallic Green','Metallic Silver','Metallic Gold','Metallic Purple',
              'Flat Black','Flat Gray','Pearl White','Chrome','Spectraflame Red',
              'Spectraflame Blue','Spectraflame Green','Spectraflame Orange',
              'Spectraflame Purple','Spectraflame Silver','ZAMAC',
            ].map(c=>(
              <TouchableOpacity
                key={c}
                style={{paddingHorizontal:12,paddingVertical:8,borderRadius:20,borderWidth:1.5,
                  backgroundColor:color===c?'#D85A30':'#F5F4F1',
                  borderColor:color===c?'#D85A30':'#E0DEDA'}}
                onPress={()=>{setColor(c);setShowColorPicker(false);}}
              >
                <Text style={{fontSize:13,fontWeight:'600',color:color===c?'#fff':'#1A1A18'}}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{flexDirection:'row',gap:10,paddingHorizontal:20}}>
            <TextInput
              style={{flex:1,backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:10,paddingHorizontal:12,paddingVertical:10,fontSize:15,color:'#1A1A18'}}
              value={color}
              onChangeText={setColor}
              placeholder="Custom color..."
              placeholderTextColor="#A0A09C"
            />
            <TouchableOpacity
              style={{backgroundColor:'#D85A30',borderRadius:10,paddingHorizontal:18,justifyContent:'center'}}
              onPress={()=>setShowColorPicker(false)}
            >
              <Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

`;

form = form.replace(
  '      {/* Collector # Picker */}',
  colorPickerModal + '      {/* Collector # Picker */}'
);
fs.writeFileSync('app/car/[id].tsx', form);
console.log('✅ Color picker added');

// ── 3. BUILD DUPLICATE CHECKER / SCAN SCREEN ───────────────────────────────
fs.writeFileSync('app/scan.tsx', `import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, Image, useColorScheme, StatusBar
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars } from '../lib/storage';
import { CameraView, Camera } from 'expo-camera';

export default function ScanScreen() {
  const [cars, setCars]       = useState([]);
  const [search, setSearch]   = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [hasCamPerm, setHasCamPerm] = useState(false);
  const router = useRouter();
  const dark = useColorScheme() === 'dark';

  const BG   = dark ? '#0A0A0A' : '#F0EFEC';
  const CARD = dark ? '#1C1C1E' : '#FFFFFF';
  const TEXT = dark ? '#F2F2F7' : '#1C1C1E';
  const MUTED= dark ? '#8E8E93' : '#6B6B6B';
  const BORDER=dark ? '#2C2C2E' : '#E5E5EA';

  useFocusEffect(useCallback(() => {
    loadCars().then(setCars);
    Camera.requestCameraPermissionsAsync().then(({status}) => setHasCamPerm(status==='granted'));
  }, []));

  function doSearch(q) {
    setSearch(q);
    if (q.length < 1) { setResults([]); setHasSearched(false); return; }
    setHasSearched(true);
    const ql = q.toLowerCase();
    const found = cars.filter(c =>
      [c.name, c.manufacturer, c.series, c.color, c.colnum].filter(Boolean)
        .join(' ').toLowerCase().includes(ql)
    );
    setResults(found);
  }

  function onBarcode({ data }) {
    setScanMode(false);
    setSearch(data);
    doSearch(data);
  }

  const owned    = results.filter(c => c.status === 'owned' || c.status === 'dup');
  const wishlisted = results.filter(c => c.status === 'wish');
  const hasIt    = owned.length > 0;
  const wantsIt  = wishlisted.length > 0;

  if (scanMode && hasCamPerm) {
    return (
      <View style={{flex:1,backgroundColor:'#000'}}>
        <CameraView
          style={StyleSheet.absoluteFill}
          onBarcodeScanned={onBarcode}
          barcodeScannerSettings={{ barcodeTypes: ['upc_a','upc_e','ean13','ean8','qr'] }}
        />
        <SafeAreaView style={{position:'absolute',top:0,left:0,right:0}}>
          <View style={{flexDirection:'row',alignItems:'center',padding:16,gap:12}}>
            <TouchableOpacity
              style={{width:40,height:40,borderRadius:20,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center'}}
              onPress={()=>setScanMode(false)}
            >
              <Ionicons name="close" size={22} color="#fff"/>
            </TouchableOpacity>
            <Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>Scan Barcode</Text>
          </View>
        </SafeAreaView>
        <View style={{position:'absolute',bottom:80,left:0,right:0,alignItems:'center'}}>
          <View style={{width:280,height:160,borderWidth:2,borderColor:'#D85A30',borderRadius:12}}/>
          <Text style={{color:'rgba(255,255,255,0.7)',fontSize:13,marginTop:12}}>Point at the barcode on the card</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:BG}}>
      <StatusBar barStyle={dark?'light-content':'dark-content'}/>

      {/* Header */}
      <View style={{flexDirection:'row',alignItems:'center',gap:12,padding:16,backgroundColor:CARD,borderBottomWidth:0.5,borderBottomColor:BORDER}}>
        <TouchableOpacity onPress={()=>router.back()}>
          <Ionicons name="chevron-back" size={24} color={TEXT}/>
        </TouchableOpacity>
        <View style={{flex:1}}>
          <Text style={{fontSize:22,fontWeight:'800',color:TEXT}}>DO I HAVE <Text style={{color:'#D85A30'}}>THIS?</Text></Text>
          <Text style={{fontSize:12,color:MUTED}}>Search your collection instantly</Text>
        </View>
        <TouchableOpacity
          style={{backgroundColor:'#D85A30',width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center'}}
          onPress={()=>setScanMode(true)}
        >
          <Ionicons name="barcode-outline" size={22} color="#fff"/>
        </TouchableOpacity>
      </View>

      {/* Search box */}
      <View style={{padding:14,backgroundColor:CARD,borderBottomWidth:0.5,borderBottomColor:BORDER}}>
        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:dark?'#2C2C2E':'#F5F4F1',borderRadius:14,borderWidth:1,borderColor:'#D85A30',paddingHorizontal:12,gap:8}}>
          <Ionicons name="search" size={18} color="#D85A30"/>
          <TextInput
            style={{flex:1,paddingVertical:13,fontSize:16,color:TEXT}}
            placeholder="Type car name, series, color..."
            placeholderTextColor={MUTED}
            value={search}
            onChangeText={doSearch}
            autoFocus
            autoCorrect={false}
            returnKeyType="search"
          />
          {search.length>0&&(
            <TouchableOpacity onPress={()=>{setSearch('');setResults([]);setHasSearched(false);}}>
              <Ionicons name="close-circle" size={20} color={MUTED}/>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Result banner */}
      {hasSearched && (
        <View style={{
          margin:14,marginBottom:0,
          padding:16,
          borderRadius:16,
          backgroundColor: hasIt ? '#EAF3DE' : wantsIt ? '#E6F1FB' : dark?'#2C2C2E':'#F5F4F1',
          borderWidth:2,
          borderColor: hasIt ? '#3B6D11' : wantsIt ? '#185FA5' : BORDER,
          flexDirection:'row',alignItems:'center',gap:12
        }}>
          <Text style={{fontSize:36}}>
            {hasIt ? '✅' : wantsIt ? '♡' : '❌'}
          </Text>
          <View style={{flex:1}}>
            <Text style={{fontSize:18,fontWeight:'800',
              color: hasIt ? '#3B6D11' : wantsIt ? '#185FA5' : dark?TEXT:'#A32D2D'
            }}>
              {hasIt
                ? \`YES! You have \${owned.length} of these!\`
                : wantsIt
                ? \`On your wishlist (\${wishlisted.length})\`
                : results.length===0&&search.length>0
                ? "Not in your collection"
                : \`\${results.length} matches found\`}
            </Text>
            <Text style={{fontSize:13,color:MUTED,marginTop:2}}>
              {hasIt ? 'Tap a car to see details' : wantsIt ? 'You want this one!' : search.length>0 ? 'Safe to buy!' : ''}
            </Text>
          </View>
          {!hasIt && !wantsIt && search.length>1 && (
            <TouchableOpacity
              style={{backgroundColor:'#D85A30',paddingHorizontal:14,paddingVertical:8,borderRadius:20}}
              onPress={()=>router.push({pathname:'/car/[id]',params:{id:'add'}})}
            >
              <Text style={{color:'#fff',fontWeight:'700',fontSize:13}}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Results list */}
      <FlatList
        data={results}
        keyExtractor={c=>c.id}
        contentContainerStyle={{padding:14,gap:10,paddingBottom:80}}
        ListEmptyComponent={
          !hasSearched ? (
            <View style={{paddingTop:40,alignItems:'center',gap:16}}>
              <Text style={{fontSize:64}}>🔍</Text>
              <Text style={{fontSize:20,fontWeight:'700',color:TEXT,textAlign:'center'}}>Check your collection</Text>
              <Text style={{fontSize:14,color:MUTED,textAlign:'center',lineHeight:22}}>
                Type a car name above to see if you already own it.{'\n'}
                Tap the barcode icon to scan the card!
              </Text>
              <View style={{backgroundColor:CARD,borderRadius:16,padding:16,width:'100%',gap:8}}>
                <Text style={{fontSize:13,fontWeight:'600',color:MUTED}}>Quick tips:</Text>
                <Text style={{fontSize:13,color:TEXT}}>📝  Type "Camaro" → see all Camaros</Text>
                <Text style={{fontSize:13,color:TEXT}}>📝  Type "2026" → see all 2026 cars</Text>
                <Text style={{fontSize:13,color:TEXT}}>📝  Type "red" → see all red cars</Text>
                <Text style={{fontSize:13,color:TEXT}}>📷  Scan barcode → instant check</Text>
              </View>
            </View>
          ) : null
        }
        renderItem={({item:c})=>(
          <TouchableOpacity
            style={{backgroundColor:CARD,borderRadius:16,overflow:'hidden',flexDirection:'row',borderWidth:1.5,
              borderColor:c.status==='owned'||c.status==='dup'?'#3B6D11':c.status==='wish'?'#185FA5':BORDER}}
            onPress={()=>router.push({pathname:'/car/[id]',params:{id:c.id}})}
          >
            {c.photo
              ? <Image source={{uri:c.photo}} style={{width:90,height:90}} resizeMode="cover"/>
              : <View style={{width:90,height:90,backgroundColor:dark?'#2C2C2E':'#F5F4F1',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{fontSize:36}}>{c.brand==='hw'?'🔥':'🚙'}</Text>
                </View>
            }
            <View style={{flex:1,padding:12,gap:3}}>
              <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
                <Text style={{fontSize:15,fontWeight:'700',color:TEXT,flex:1}} numberOfLines={1}>{c.name}</Text>
                <View style={{backgroundColor:c.status==='owned'||c.status==='dup'?'#EAF3DE':c.status==='wish'?'#E6F1FB':'#F5F4F1',paddingHorizontal:8,paddingVertical:3,borderRadius:10}}>
                  <Text style={{fontSize:11,fontWeight:'700',color:c.status==='owned'||c.status==='dup'?'#3B6D11':c.status==='wish'?'#185FA5':MUTED}}>
                    {c.status==='owned'?'✓ Owned':c.status==='dup'?'2× Dupe':'♡ Want'}
                  </Text>
                </View>
              </View>
              {!!c.manufacturer&&<Text style={{fontSize:12,color:'#D85A30',fontWeight:'600'}}>{c.manufacturer}</Text>}
              <View style={{flexDirection:'row',gap:8,flexWrap:'wrap'}}>
                {!!c.series&&<Text style={{fontSize:11,color:MUTED}}>{c.series}</Text>}
                {!!c.year&&<Text style={{fontSize:11,color:MUTED}}>· {c.year}</Text>}
                {!!c.color&&<Text style={{fontSize:11,color:MUTED}}>· {c.color}</Text>}
                {!!c.colnum&&<Text style={{fontSize:11,color:'#185FA5',fontWeight:'600'}}>#{c.colnum}</Text>}
              </View>
              {c.th!=='none'&&<Text style={{fontSize:11,fontWeight:'700',color:'#BA7517'}}>{c.th==='sth'?'🌟 Super TH':'⭐ Treasure Hunt'}</Text>}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
`);
console.log('✅ app/scan.tsx — new duplicate checker screen');

console.log(`
✅ ALL DONE! Run: npx expo start --clear

NEW FEATURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 COLLECTOR # PICKER
   1/5, 1/6, 1/8, 1/10, 1/12, 1/15
   + 1/250 for full mainline!
   + custom text box

🎨 COLOR PICKER  
   35 common HW colors as tap buttons:
   Red, Blue, Spectraflame, ZAMAC, Chrome...
   + custom text box

🔍 DUPLICATE CHECKER (tap scan button!)
   Type any car name → instantly shows:
   ✅ YES! You have 2 of these!
   ❌ Not in your collection → Add button
   ♡ On your wishlist
   
   Also shows: photo, series, year, color
   
   📷 Scan barcode → instant check!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
