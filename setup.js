#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Created:', filePath);
}

write('app/_layout.tsx', `import { Stack } from 'expo-router';
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="scan" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="car/[id]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}`);

write('app/(tabs)/_layout.tsx', `import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
function ScanButton() {
  const router = useRouter();
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <TouchableOpacity
        style={{ width:56, height:56, borderRadius:28, backgroundColor:'#D85A30', alignItems:'center', justifyContent:'center' }}
        onPress={() => router.push('/scan')}>
        <Ionicons name="scan" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#D85A30',
      tabBarInactiveTintColor: '#6B6B67',
      tabBarStyle: { borderTopColor: '#E0DEDA', borderTopWidth: 0.5, backgroundColor: '#fff', height: 80, paddingBottom: 16 },
      headerShown: false,
    }}>
      <Tabs.Screen name="index" options={{ title:'Garage', tabBarIcon:({color,size})=><Ionicons name="grid" size={size} color={color}/> }} />
      <Tabs.Screen name="scan-tab" options={{ title:'', tabBarButton:()=><ScanButton/> }} />
      <Tabs.Screen name="wishlist" options={{ title:'Wishlist', tabBarIcon:({color,size})=><Ionicons name="heart-outline" size={size} color={color}/> }} />
      <Tabs.Screen name="stats" options={{ title:'Stats', tabBarIcon:({color,size})=><Ionicons name="bar-chart-outline" size={size} color={color}/> }} />
    </Tabs>
  );
}`);

write('app/(tabs)/scan-tab.tsx', `import { View } from 'react-native';
export default function ScanTab() { return <View/>; }`);

write('lib/theme.ts', `export const C = {
  red:'#D85A30', redL:'#FAECE7', redD:'#993C1D',
  blue:'#185FA5', blueL:'#E6F1FB', blueD:'#0C447C',
  green:'#3B6D11', greenL:'#EAF3DE',
  amber:'#BA7517', amberL:'#FAEEDA',
  bg:'#fff', bg2:'#F5F4F1', bg3:'#EEEDEA',
  text:'#1A1A18', muted:'#6B6B67', hint:'#A0A09C',
  border:'#E0DEDA', border2:'#CCCBC6',
};`);

write('lib/storage.ts', `import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'mygarage_v1';
export interface Car {
  id:string; brand:'hw'|'mb'; name:string; series:string; year:string;
  color:string; colnum:string; tampo:string; notes:string;
  th:'none'|'th'|'sth'; status:'owned'|'wish'|'dup';
  photo:string|null; added:number;
}
export const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
export const loadCars = async (): Promise<Car[]> => {
  try { const d = await AsyncStorage.getItem(KEY); return d ? JSON.parse(d) : []; } catch { return []; }
};
export const saveCars = async (cars:Car[]) => {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(cars)); } catch(e) { console.error(e); }
};
export const addCar = async (car:Car) => { const c=await loadCars(); const u=[car,...c]; await saveCars(u); return u; };
export const updateCar = async (car:Car) => { const c=await loadCars(); const u=c.map(x=>x.id===car.id?car:x); await saveCars(u); return u; };
export const deleteCar = async (id:string) => { const c=await loadCars(); const u=c.filter(x=>x.id!==id); await saveCars(u); return u; };`);

write('components/CarCard.tsx', `import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Car } from '../lib/storage';
import { C } from '../lib/theme';
export default function CarCard({ car, onPress }:{ car:Car; onPress:()=>void }) {
  const owned = car.status==='owned'||car.status==='dup';
  const sub = [car.series,car.year,car.color].filter(Boolean).join(' · ');
  return (
    <TouchableOpacity style={[s.card, car.status==='wish'&&s.wish]} onPress={onPress} activeOpacity={0.7}>
      <View style={s.thumb}>
        {car.photo ? <Image source={{uri:car.photo}} style={s.img}/> : <Text style={s.emoji}>{car.brand==='hw'?'🔥':'🚙'}</Text>}
      </View>
      <View style={s.info}>
        <Text style={s.name} numberOfLines={1}>{car.name||'Unnamed'}</Text>
        {!!sub && <Text style={s.sub} numberOfLines={1}>{sub}</Text>}
        <View style={s.tags}>
          <View style={[s.tag, car.brand==='hw'?s.tagHW:s.tagMB]}>
            <Text style={[s.tagT, car.brand==='hw'?s.tagHWT:s.tagMBT]}>{car.brand==='hw'?'Hot Wheels':'Matchbox'}</Text>
          </View>
          {car.th==='th'&&<View style={[s.tag,s.tagTH]}><Text style={[s.tagT,s.tagTHT]}>TH</Text></View>}
          {car.th==='sth'&&<View style={[s.tag,s.tagSTH]}><Text style={[s.tagT,s.tagSTHT]}>Super TH</Text></View>}
          {car.status==='dup'&&<View style={[s.tag,s.tagDup]}><Text style={[s.tagT,s.tagDupT]}>Dupe</Text></View>}
          {!!car.colnum&&<View style={[s.tag,s.tagCol]}><Text style={[s.tagT,s.tagColT]}>#{car.colnum}</Text></View>}
        </View>
      </View>
      <View style={[s.chk,owned&&s.chkOn]}>{owned&&<Ionicons name="checkmark" size={14} color="#fff"/>}</View>
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  card:{backgroundColor:'#fff',borderRadius:16,borderWidth:0.5,borderColor:'#E0DEDA',padding:12,flexDirection:'row',gap:12,marginBottom:8},
  wish:{opacity:0.72},
  thumb:{width:64,height:64,borderRadius:10,backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA',alignItems:'center',justifyContent:'center',overflow:'hidden'},
  img:{width:'100%',height:'100%'},
  emoji:{fontSize:28},
  info:{flex:1,minWidth:0},
  name:{fontSize:18,fontWeight:'700',color:'#1A1A18'},
  sub:{fontSize:12,color:'#6B6B67',marginTop:2},
  tags:{flexDirection:'row',flexWrap:'wrap',gap:4,marginTop:6},
  tag:{paddingHorizontal:8,paddingVertical:2,borderRadius:10},
  tagT:{fontSize:11,fontWeight:'600'},
  tagHW:{backgroundColor:'#FAECE7'}, tagHWT:{color:'#993C1D'},
  tagMB:{backgroundColor:'#E6F1FB'}, tagMBT:{color:'#0C447C'},
  tagTH:{backgroundColor:'#EAF3DE'}, tagTHT:{color:'#3B6D11'},
  tagSTH:{backgroundColor:'#FAEEDA'}, tagSTHT:{color:'#BA7517'},
  tagDup:{backgroundColor:'#FCEBEB'}, tagDupT:{color:'#A32D2D'},
  tagCol:{backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA'}, tagColT:{color:'#6B6B67'},
  chk:{width:24,height:24,borderRadius:12,borderWidth:1.5,borderColor:'#E0DEDA',alignSelf:'center',alignItems:'center',justifyContent:'center'},
  chkOn:{backgroundColor:'#3B6D11',borderColor:'#3B6D11'},
});`);

write('app/(tabs)/index.tsx', `import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadCars, Car } from '../../lib/storage';
import { C } from '../../lib/theme';
import CarCard from '../../components/CarCard';
export default function GarageScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState<'all'|'hw'|'mb'>('all');
  const [thOnly, setThOnly] = useState(false);
  const router = useRouter();
  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));
  function filtered(list:Car[]) {
    const q = search.toLowerCase();
    return list.filter(c => {
      if(brand!=='all'&&c.brand!==brand) return false;
      if(thOnly&&c.th==='none') return false;
      if(q&&![c.name,c.series,c.color,c.colnum].filter(Boolean).join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
  }
  const owned = filtered(cars.filter(c=>c.status!=='wish'));
  const wished = filtered(cars.filter(c=>c.status==='wish'));
  const items:any[] = [...owned,...(wished.length?[{type:'header'},...wished]:[])];
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <View style={s.row}>
          <Text style={s.title}>MY <Text style={s.accent}>GARAGE</Text></Text>
          <View style={s.pills}>
            <View style={s.pill}><Text style={s.pillN}>{cars.filter(c=>c.status!=='wish').length}</Text><Text style={s.pillL}> owned</Text></View>
            <View style={s.pill}><Text style={s.pillN}>{cars.filter(c=>c.status==='wish').length}</Text><Text style={s.pillL}> want</Text></View>
          </View>
        </View>
        <View style={s.searchRow}>
          <View style={s.searchWrap}>
            <Ionicons name="search" size={16} color={C.muted} style={{marginRight:6}}/>
            <TextInput style={s.searchIn} placeholder="Search name, series, color" placeholderTextColor={C.hint} value={search} onChangeText={setSearch}/>
          </View>
          <TouchableOpacity style={[s.thBtn,thOnly&&s.thBtnOn]} onPress={()=>setThOnly(!thOnly)}>
            <Text style={[s.thT,thOnly&&s.thTOn]}>TH</Text>
          </TouchableOpacity>
        </View>
        <View style={s.brandRow}>
          {(['all','hw','mb'] as const).map(b=>(
            <TouchableOpacity key={b} style={[s.bp,brand===b&&(b==='hw'?s.bpHW:b==='mb'?s.bpMB:s.bpAll)]} onPress={()=>setBrand(b)}>
              <Text style={[s.bpT,brand===b&&(b==='hw'?s.bpHWT:b==='mb'?s.bpMBT:s.bpAllT)]}>{b==='all'?'All':b==='hw'?'Hot Wheels':'Matchbox'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList data={items} keyExtractor={(item,i)=>item.id||'h'+i} contentContainerStyle={s.list}
        ListEmptyComponent={<View style={s.empty}><Text style={{fontSize:52}}>🚗</Text><Text style={s.emptyT}>{cars.length===0?'Garage is empty!':'No results'}</Text><Text style={s.emptyM}>{cars.length===0?'Tap scan to add your first car.':'Try a different search.'}</Text></View>}
        renderItem={({item})=>item.type==='header'
          ?<Text style={s.sec}>On my wishlist</Text>
          :<CarCard car={item} onPress={()=>router.push({pathname:'/car/[id]',params:{id:item.id}})}/>
        }/>
      <TouchableOpacity style={s.fab} onPress={()=>router.push({pathname:'/car/[id]',params:{id:'add'}})}>
        <Ionicons name="add" size={28} color="#fff"/>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#fff'},
  header:{paddingHorizontal:16,paddingTop:8,paddingBottom:10,borderBottomWidth:0.5,borderBottomColor:'#E0DEDA'},
  row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10},
  title:{fontSize:28,fontWeight:'700',color:'#1A1A18'},
  accent:{color:'#D85A30'},
  pills:{flexDirection:'row',gap:6},
  pill:{flexDirection:'row',alignItems:'center',backgroundColor:'#F5F4F1',borderRadius:20,paddingHorizontal:10,paddingVertical:4,borderWidth:0.5,borderColor:'#E0DEDA'},
  pillN:{fontSize:16,fontWeight:'700',color:'#1A1A18'},
  pillL:{fontSize:12,color:'#6B6B67'},
  searchRow:{flexDirection:'row',gap:8,marginBottom:8},
  searchWrap:{flex:1,flexDirection:'row',alignItems:'center',backgroundColor:'#F5F4F1',borderRadius:10,borderWidth:0.5,borderColor:'#E0DEDA',paddingHorizontal:10},
  searchIn:{flex:1,paddingVertical:10,fontSize:15,color:'#1A1A18'},
  thBtn:{paddingHorizontal:12,paddingVertical:10,borderRadius:10,borderWidth:0.5,borderColor:'#E0DEDA',backgroundColor:'#F5F4F1'},
  thBtnOn:{backgroundColor:'#FAEEDA',borderColor:'#BA7517'},
  thT:{fontSize:13,fontWeight:'500',color:'#6B6B67'},
  thTOn:{color:'#BA7517'},
  brandRow:{flexDirection:'row',gap:6},
  bp:{paddingHorizontal:14,paddingVertical:5,borderRadius:20,borderWidth:0.5,borderColor:'#E0DEDA',backgroundColor:'#F5F4F1'},
  bpT:{fontSize:12,fontWeight:'500',color:'#6B6B67'},
  bpAll:{borderColor:'#CCCBC6'}, bpAllT:{color:'#1A1A18'},
  bpHW:{backgroundColor:'#FAECE7',borderColor:'#D85A30'}, bpHWT:{color:'#993C1D'},
  bpMB:{backgroundColor:'#E6F1FB',borderColor:'#185FA5'}, bpMBT:{color:'#0C447C'},
  list:{padding:16,paddingBottom:100},
  sec:{fontSize:11,fontWeight:'500',color:'#A0A09C',textTransform:'uppercase',letterSpacing:0.8,marginTop:8,marginBottom:4},
  empty:{paddingTop:80,alignItems:'center',gap:8},
  emptyT:{fontSize:22,fontWeight:'700',color:'#1A1A18'},
  emptyM:{fontSize:14,color:'#6B6B67',textAlign:'center'},
  fab:{position:'absolute',bottom:100,right:20,width:52,height:52,borderRadius:26,backgroundColor:'#D85A30',alignItems:'center',justifyContent:'center'},
});`);

write('app/(tabs)/wishlist.tsx', `import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { loadCars, Car } from '../../lib/storage';
import CarCard from '../../components/CarCard';
export default function WishlistScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const router = useRouter();
  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));
  const wishlist = cars.filter(c=>c.status==='wish');
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
      <View style={{padding:16,borderBottomWidth:0.5,borderBottomColor:'#E0DEDA'}}>
        <Text style={{fontSize:28,fontWeight:'700',color:'#1A1A18'}}>WISH <Text style={{color:'#D85A30'}}>LIST</Text></Text>
      </View>
      <FlatList data={wishlist} keyExtractor={c=>c.id} contentContainerStyle={{padding:16,paddingBottom:100}}
        ListEmptyComponent={<View style={{paddingTop:80,alignItems:'center',gap:8}}><Text style={{fontSize:52}}>♡</Text><Text style={{fontSize:22,fontWeight:'700',color:'#1A1A18'}}>Wishlist empty</Text><Text style={{fontSize:14,color:'#6B6B67',textAlign:'center'}}>Add cars with status Wishlist.</Text></View>}
        renderItem={({item})=><CarCard car={item} onPress={()=>router.push({pathname:'/car/[id]',params:{id:item.id}})}/>}/>
    </SafeAreaView>
  );
}`);

write('app/(tabs)/stats.tsx', `import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { loadCars, Car } from '../../lib/storage';
export default function StatsScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  useFocusEffect(useCallback(() => { loadCars().then(setCars); }, []));
  const owned = cars.filter(c=>c.status!=='wish');
  const byYear:Record<string,number>={};
  owned.filter(c=>c.year).forEach(c=>{byYear[c.year]=(byYear[c.year]||0)+1;});
  const topY = Object.entries(byYear).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,6);
  const mx = topY.length?Number(topY[0][1]):1;
  const stats = [
    {l:'Total owned',v:owned.length,col:'#1A1A18'},
    {l:'Wishlist',v:cars.filter(c=>c.status==='wish').length,col:'#185FA5'},
    {l:'Hot Wheels',v:owned.filter(c=>c.brand==='hw').length,col:'#D85A30'},
    {l:'Matchbox',v:owned.filter(c=>c.brand==='mb').length,col:'#185FA5'},
    {l:'Treasure Hunts',v:owned.filter(c=>c.th==='th').length,col:'#3B6D11'},
    {l:'Super TH',v:owned.filter(c=>c.th==='sth').length,col:'#BA7517'},
    {l:'Duplicates',v:cars.filter(c=>c.status==='dup').length,col:'#A32D2D'},
    {l:'Total in app',v:cars.length,col:'#1A1A18'},
  ];
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
      <View style={{padding:16,borderBottomWidth:0.5,borderBottomColor:'#E0DEDA'}}>
        <Text style={{fontSize:28,fontWeight:'700',color:'#1A1A18'}}>MY <Text style={{color:'#D85A30'}}>STATS</Text></Text>
      </View>
      <ScrollView contentContainerStyle={{padding:16,paddingBottom:100}}>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>
          {stats.map(({l,v,col})=>(
            <View key={l} style={{backgroundColor:'#F5F4F1',borderRadius:16,padding:14,width:'47%'}}>
              <Text style={{fontSize:11,color:'#A0A09C',marginBottom:4}}>{l}</Text>
              <Text style={{fontSize:34,fontWeight:'700',color:col}}>{v}</Text>
            </View>
          ))}
        </View>
        {topY.length>0 && <>
          <Text style={{fontSize:11,fontWeight:'500',color:'#A0A09C',textTransform:'uppercase',letterSpacing:0.8,marginTop:20,marginBottom:10}}>Cars by year</Text>
          {topY.map(([y,n])=>(
            <View key={y} style={{flexDirection:'row',alignItems:'center',gap:10,marginBottom:10}}>
              <Text style={{fontSize:13,fontWeight:'500',minWidth:44,color:'#1A1A18'}}>{y}</Text>
              <View style={{flex:1,height:8,backgroundColor:'#EEEDEA',borderRadius:4,overflow:'hidden'}}>
                <View style={{height:'100%',width:(Math.round(Number(n)/mx*100)+'%'),backgroundColor:'#D85A30',borderRadius:4}}/>
              </View>
              <Text style={{fontSize:12,color:'#6B6B67',minWidth:20,textAlign:'right'}}>{n}</Text>
            </View>
          ))}
        </>}
      </ScrollView>
    </SafeAreaView>
  );
}`);

write('app/scan.tsx', `import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');
const FW=280, FH=160, SIDE=(width-FW)/2, TOP=(height-FH)/2-60;
export default function ScanScreen() {
  const [perm, reqPerm] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);
  const router = useRouter();
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    if(!perm?.granted) reqPerm();
    const a = Animated.loop(Animated.sequence([
      Animated.timing(anim,{toValue:1,duration:1800,useNativeDriver:true}),
      Animated.timing(anim,{toValue:0,duration:1800,useNativeDriver:true}),
    ]));
    a.start(); return ()=>a.stop();
  },[]);
  const lineY = anim.interpolate({inputRange:[0,1],outputRange:[8,FH-8]});
  function handleScan({data}){
    if(scanned) return;
    setScanned(true); setResult(data);
  }
  if(!perm?.granted) return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',padding:32}}>
      <Ionicons name="camera-outline" size={60} color="#6B6B67"/>
      <Text style={{fontSize:22,fontWeight:'700',color:'#1A1A18',marginTop:16,marginBottom:8}}>Camera Access Needed</Text>
      <TouchableOpacity style={{backgroundColor:'#D85A30',paddingHorizontal:32,paddingVertical:14,borderRadius:12,marginTop:16}} onPress={reqPerm}>
        <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Allow Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{padding:12,marginTop:8}} onPress={()=>router.replace({pathname:'/car/[id]',params:{id:'add'}})}>
        <Text style={{color:'#185FA5',fontSize:15}}>Add Manually Instead</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
  return (
    <View style={{flex:1,backgroundColor:'#000'}}>
      <CameraView style={StyleSheet.absoluteFill} facing="back"
        onBarcodeScanned={scanned?undefined:handleScan}
        barcodeScannerSettings={{barcodeTypes:['upc_a','upc_e','ean13','ean8','code128','code39','qr']}}/>
      <View style={StyleSheet.absoluteFill}>
        <View style={{height:TOP,backgroundColor:'rgba(0,0,0,0.6)'}}/>
        <View style={{height:FH,flexDirection:'row'}}>
          <View style={{width:SIDE,backgroundColor:'rgba(0,0,0,0.6)'}}/>
          <View style={{width:FW,height:FH,overflow:'hidden'}}>
            {!scanned&&<Animated.View style={{position:'absolute',left:4,right:4,height:2,backgroundColor:'#D85A30',borderRadius:1,transform:[{translateY:lineY}]}}/>}
          </View>
          <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.6)'}}/>
        </View>
        <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.6)'}}/>
      </View>
      <SafeAreaView style={{position:'absolute',top:0,left:0,right:0}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:8}}>
          <TouchableOpacity style={{width:40,height:40,borderRadius:20,backgroundColor:'rgba(255,255,255,0.15)',alignItems:'center',justifyContent:'center'}} onPress={()=>router.back()}>
            <Ionicons name="close" size={24} color="#fff"/>
          </TouchableOpacity>
          <Text style={{color:'#fff',fontSize:18,fontWeight:'700'}}>SCAN BARCODE</Text>
          <View style={{width:40}}/>
        </View>
      </SafeAreaView>
      <View style={{position:'absolute',bottom:0,left:0,right:0,padding:20,paddingBottom:40}}>
        <Text style={{color:'rgba(255,255,255,0.75)',fontSize:14,textAlign:'center',marginBottom:16}}>
          {scanned?'Barcode found! Tap Add Car':'Point at the barcode on the back of the card'}
        </Text>
        {scanned&&result&&(
          <View style={{backgroundColor:'rgba(255,255,255,0.12)',borderRadius:12,padding:14,marginBottom:12}}>
            <Text style={{color:'rgba(255,255,255,0.55)',fontSize:11,textTransform:'uppercase',marginBottom:4}}>Barcode detected</Text>
            <Text style={{color:'#fff',fontSize:20,fontWeight:'700'}}>{result}</Text>
          </View>
        )}
        <View style={{flexDirection:'row',gap:8}}>
          <TouchableOpacity style={{flex:1,padding:13,borderRadius:10,backgroundColor:'rgba(255,255,255,0.15)',alignItems:'center'}} onPress={()=>router.back()}>
            <Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>Close</Text>
          </TouchableOpacity>
          {scanned?(
            <>
              <TouchableOpacity style={{flex:1,padding:13,borderRadius:10,backgroundColor:'rgba(255,255,255,0.15)',alignItems:'center'}} onPress={()=>{setScanned(false);setResult(null);}}>
                <Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>Retry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex:1,padding:13,borderRadius:10,backgroundColor:'#D85A30',alignItems:'center'}}
                onPress={()=>router.replace({pathname:'/car/[id]',params:{id:'add',prefill:JSON.stringify({colnum:result})}})}>
                <Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>Add Car</Text>
              </TouchableOpacity>
            </>
          ):(
            <TouchableOpacity style={{flex:1,padding:13,borderRadius:10,backgroundColor:'rgba(255,255,255,0.15)',alignItems:'center'}} onPress={()=>router.replace({pathname:'/car/[id]',params:{id:'add'}})}>
              <Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>Manual</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}`);

write('app/car/[id].tsx', `import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { loadCars, addCar, updateCar, deleteCar, uid, Car } from '../../lib/storage';
export default function CarForm() {
  const { id, prefill } = useLocalSearchParams();
  const router = useRouter();
  const isEdit = !!id && id !== 'add';
  const [brand, setBrand] = useState('hw');
  const [name, setName] = useState('');
  const [series, setSeries] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [color, setColor] = useState('');
  const [colnum, setColnum] = useState('');
  const [tampo, setTampo] = useState('');
  const [notes, setNotes] = useState('');
  const [th, setTh] = useState('none');
  const [status, setStatus] = useState('owned');
  const [photo, setPhoto] = useState(null);
  useEffect(()=>{
    if(prefill){try{const p=JSON.parse(prefill);if(p.colnum)setColnum(p.colnum);if(p.brand)setBrand(p.brand);}catch{}}
    if(isEdit){loadCars().then(cars=>{const c=cars.find(x=>x.id===id);if(c){setBrand(c.brand);setName(c.name);setSeries(c.series);setYear(c.year);setColor(c.color);setColnum(c.colnum);setTampo(c.tampo);setNotes(c.notes);setTh(c.th);setStatus(c.status);setPhoto(c.photo);}});}
  },[id,prefill]);
  async function pickPhoto(){
    const r = await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.Images,allowsEditing:true,aspect:[1,1],quality:0.7});
    if(!r.canceled) setPhoto(r.assets[0].uri);
  }
  async function takePhoto(){
    const {status:cs} = await ImagePicker.requestCameraPermissionsAsync();
    if(cs!=='granted'){Alert.alert('Permission needed','Allow camera in Settings.');return;}
    const r = await ImagePicker.launchCameraAsync({allowsEditing:true,aspect:[1,1],quality:0.7});
    if(!r.canceled) setPhoto(r.assets[0].uri);
  }
  async function save(){
    if(!name.trim()){Alert.alert('Name required','Please enter the car name.');return;}
    const cars = await loadCars();
    const car = {id:isEdit?id:uid(),brand,name:name.trim(),series:series.trim(),year:year.trim(),color:color.trim(),colnum:colnum.trim(),tampo:tampo.trim(),notes:notes.trim(),th,status,photo,added:isEdit?(cars.find(c=>c.id===id)?.added||Date.now()):Date.now()};
    if(isEdit) await updateCar(car); else await addCar(car);
    router.back();
  }
  async function handleDelete(){
    Alert.alert('Delete','Are you sure?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:async()=>{await deleteCar(id);router.back();}}]);
  }
  const T = ({label,active,onPress,ac,tc}) => (
    <TouchableOpacity style={[s.tog,active&&{backgroundColor:ac,borderColor:tc}]} onPress={onPress}>
      <Text style={[s.togT,active&&{color:tc}]}>{label}</Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
        <View style={s.topbar}>
          <TouchableOpacity onPress={()=>router.back()} style={{padding:4}}><Ionicons name="chevron-back" size={24} color="#1A1A18"/></TouchableOpacity>
          <Text style={s.topT}>{isEdit?'Edit Car':'Add Car'}</Text>
          <TouchableOpacity onPress={save} style={s.saveBtn}><Text style={s.saveBtnT}>Save</Text></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Text style={s.lbl}>Brand</Text>
          <View style={s.row}>
            <T label="Hot Wheels" active={brand==='hw'} onPress={()=>setBrand('hw')} ac="#FAECE7" tc="#993C1D"/>
            <T label="Matchbox" active={brand==='mb'} onPress={()=>setBrand('mb')} ac="#E6F1FB" tc="#0C447C"/>
          </View>
          <Text style={s.lbl}>Car name *</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} placeholder="e.g. Twin Mill, Bone Shaker" placeholderTextColor="#A0A09C"/>
          <View style={s.grid}>
            <View style={{flex:1}}><Text style={s.lbl}>Series</Text><TextInput style={s.input} value={series} onChangeText={setSeries} placeholder="Mainline" placeholderTextColor="#A0A09C"/></View>
            <View style={{flex:1}}><Text style={s.lbl}>Year</Text><TextInput style={s.input} value={year} onChangeText={setYear} placeholder="2024" placeholderTextColor="#A0A09C" keyboardType="numeric"/></View>
          </View>
          <View style={s.grid}>
            <View style={{flex:1}}><Text style={s.lbl}>Color</Text><TextInput style={s.input} value={color} onChangeText={setColor} placeholder="Flame Red" placeholderTextColor="#A0A09C"/></View>
            <View style={{flex:1}}><Text style={s.lbl}>Collector #</Text><TextInput style={s.input} value={colnum} onChangeText={setColnum} placeholder="042/250" placeholderTextColor="#A0A09C"/></View>
          </View>
          <Text style={s.lbl}>Tampo</Text>
          <TextInput style={s.input} value={tampo} onChangeText={setTampo} placeholder="flames on hood" placeholderTextColor="#A0A09C"/>
          <Text style={s.lbl}>Treasure Hunt?</Text>
          <View style={s.row}>
            <T label="None" active={th==='none'} onPress={()=>setTh('none')} ac="#EAF3DE" tc="#3B6D11"/>
            <T label="TH" active={th==='th'} onPress={()=>setTh('th')} ac="#EAF3DE" tc="#3B6D11"/>
            <T label="Super TH" active={th==='sth'} onPress={()=>setTh('sth')} ac="#FAEEDA" tc="#BA7517"/>
          </View>
          <Text style={s.lbl}>Photo</Text>
          <View style={{flexDirection:'row',gap:10,marginBottom:14}}>
            <TouchableOpacity style={[s.photoBox,{flex:2}]} onPress={takePhoto}>
              {photo?<Image source={{uri:photo}} style={StyleSheet.absoluteFill}/>:<><Ionicons name="camera" size={22} color="#6B6B67"/><Text style={s.photoT}>Camera</Text></>}
            </TouchableOpacity>
            <TouchableOpacity style={[s.photoBox,{flex:1}]} onPress={pickPhoto}>
              <Ionicons name="images" size={22} color="#6B6B67"/><Text style={s.photoT}>Library</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.lbl}>Status</Text>
          <View style={s.row}>
            <T label="I own it" active={status==='owned'} onPress={()=>setStatus('owned')} ac="#EAF3DE" tc="#3B6D11"/>
            <T label="Wishlist" active={status==='wish'} onPress={()=>setStatus('wish')} ac="#E6F1FB" tc="#0C447C"/>
            <T label="Duplicate" active={status==='dup'} onPress={()=>setStatus('dup')} ac="#FCEBEB" tc="#A32D2D"/>
          </View>
          <Text style={s.lbl}>Notes</Text>
          <TextInput style={[s.input,{height:80,textAlignVertical:'top'}]} value={notes} onChangeText={setNotes} placeholder="Where you got it, price paid" placeholderTextColor="#A0A09C" multiline/>
          {isEdit&&<TouchableOpacity style={s.delBtn} onPress={handleDelete}><Text style={s.delT}>Delete Car</Text></TouchableOpacity>}
          <View style={{height:40}}/>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#fff'},
  topbar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingVertical:12,borderBottomWidth:0.5,borderBottomColor:'#E0DEDA'},
  topT:{fontSize:18,fontWeight:'700',color:'#1A1A18'},
  saveBtn:{backgroundColor:'#D85A30',paddingHorizontal:18,paddingVertical:8,borderRadius:20},
  saveBtnT:{color:'#fff',fontWeight:'700',fontSize:15},
  scroll:{padding:16},
  lbl:{fontSize:12,fontWeight:'500',color:'#6B6B67',marginBottom:5,marginTop:4},
  input:{backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:10,paddingHorizontal:12,paddingVertical:10,fontSize:15,color:'#1A1A18',marginBottom:2},
  grid:{flexDirection:'row',gap:10,marginBottom:2},
  row:{flexDirection:'row',gap:6,flexWrap:'wrap',marginBottom:14},
  tog:{paddingHorizontal:14,paddingVertical:7,borderRadius:20,borderWidth:0.5,borderColor:'#E0DEDA',backgroundColor:'#F5F4F1'},
  togT:{fontSize:13,fontWeight:'500',color:'#6B6B67'},
  photoBox:{height:100,borderRadius:10,borderWidth:1.5,borderStyle:'dashed',borderColor:'#CCCBC6',backgroundColor:'#F5F4F1',alignItems:'center',justifyContent:'center',gap:4,overflow:'hidden'},
  photoT:{fontSize:12,color:'#6B6B67'},
  delBtn:{marginTop:20,padding:14,borderRadius:10,backgroundColor:'#FCEBEB',borderWidth:0.5,borderColor:'#F7C1C1',alignItems:'center'},
  delT:{color:'#A32D2D',fontWeight:'700',fontSize:16},
});`);

// Update package.json main field
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
pkg.main = 'expo-router/entry';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Updated package.json');

// Update app.json
const app = JSON.parse(fs.readFileSync('app.json','utf8'));
app.expo.scheme = 'mygarage';
app.expo.plugins = ['expo-router'];
fs.writeFileSync('app.json', JSON.stringify(app, null, 2));
console.log('✅ Updated app.json');

console.log('\n🚗 ALL DONE! Now run: npx expo start --clear');
