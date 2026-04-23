#!/usr/bin/env node
const fs = require('fs');

// ── 1. FIX CAR FORM - auto-suggest + remember previous entries ──────────────
fs.writeFileSync('app/car/[id].tsx', `import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Image, Alert,
  KeyboardAvoidingView, Platform, Modal, FlatList
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadCars, addCar, updateCar, deleteCar, uid } from '../../lib/storage';
import { searchCars, searchManufacturers, detectManufacturer, MANUFACTURERS, HW_CARS, MB_CARS } from '../../lib/carDatabase';
import { HW_SERIES, searchSeries } from '../../lib/seriesData';

const HISTORY_KEY = 'mygarage_car_history';

async function compressPhoto(uri) {
  try {
    const IM = require('expo-image-manipulator');
    const r = await IM.manipulateAsync(uri,[{resize:{width:300}}],{compress:0.6,format:IM.SaveFormat.JPEG});
    return r.uri;
  } catch { return uri; }
}

export default function CarForm() {
  const { id, prefill } = useLocalSearchParams();
  const router = useRouter();
  const isEdit = !!id && id !== 'add';

  const [brand, setBrand] = useState('hw');
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [series, setSeries] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [color, setColor] = useState('');
  const [colnum, setColnum] = useState('');
  const [tampo, setTampo] = useState('');
  const [notes, setNotes] = useState('');
  const [th, setTh] = useState('none');
  const [status, setStatus] = useState('owned');
  const [photo, setPhoto] = useState(null);
  const [nameSug, setNameSug] = useState([]);
  const [showMfgPicker, setShowMfgPicker] = useState(false);
  const [mfgSearch, setMfgSearch] = useState('');
  const [mfgList, setMfgList] = useState(MANUFACTURERS.slice(0,30));
  const [showSeriesPicker, setShowSeriesPicker] = useState(false);
  const [seriesSearch, setSeriesSearch] = useState('');
  const [seriesList, setSeriesList] = useState(HW_SERIES);
  const [history, setHistory] = useState([]);

  // Load history of previously entered car names
  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then(d => {
      if (d) setHistory(JSON.parse(d));
    });
  }, []);

  useEffect(() => {
    if (prefill) { try { const p=JSON.parse(prefill); if(p.colnum) setColnum(p.colnum); if(p.brand) setBrand(p.brand); if(p.status) setStatus(p.status); } catch {} }
    if (isEdit) {
      loadCars().then(cars => {
        const c = cars.find(x => x.id === id);
        if (c) {
          setBrand(c.brand||'hw'); setName(c.name); setManufacturer(c.manufacturer||'');
          setSeries(c.series||''); setYear(c.year||''); setColor(c.color||'');
          setColnum(c.colnum||''); setTampo(c.tampo||''); setNotes(c.notes||'');
          setTh(c.th||'none'); setStatus(c.status||'owned'); setPhoto(c.photo||null);
        }
      });
    }
  }, [id, prefill]);

  // Save car name to history
  async function saveToHistory(carName) {
    if (!carName || carName.length < 2) return;
    const updated = [carName, ...history.filter(h => h !== carName)].slice(0, 50);
    setHistory(updated);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }

  function onNameChange(text) {
    setName(text);
    // Auto-detect manufacturer
    const detected = detectManufacturer(text);
    if (detected) setManufacturer(detected);

    if (text.length >= 1) {
      const q = text.toLowerCase();
      // Combine: history + built-in list + any text match
      const builtIn = brand === 'hw' ? HW_CARS : MB_CARS;
      const fromHistory = history.filter(h => h.toLowerCase().includes(q));
      const fromBuiltIn = builtIn.filter(n => n.toLowerCase().includes(q));
      // Merge and deduplicate
      const combined = [...new Set([...fromHistory, ...fromBuiltIn])].slice(0, 15);
      setNameSug(combined);
    } else {
      // Show recent history when field is tapped
      setNameSug(history.slice(0, 10));
    }
  }

  function onNameFocus() {
    if (!name) setNameSug(history.slice(0, 10));
  }

  function pickNameSug(val) {
    setName(val);
    setNameSug([]);
    const detected = detectManufacturer(val);
    if (detected) setManufacturer(detected);
  }

  function onMfgSearch(text) {
    setMfgSearch(text);
    setMfgList(searchManufacturers(text));
  }

  function pickMfg(val) {
    setManufacturer(val);
    setShowMfgPicker(false);
    setMfgSearch('');
    setMfgList(MANUFACTURERS.slice(0,30));
  }

  async function pickPhoto() {
    const r = await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.Images,allowsEditing:true,aspect:[1,1],quality:0.8});
    if (!r.canceled) setPhoto(await compressPhoto(r.assets[0].uri));
  }

  async function takePhoto() {
    const {status:cs} = await ImagePicker.requestCameraPermissionsAsync();
    if (cs!=='granted') { Alert.alert('Permission needed','Allow camera in Settings.'); return; }
    const r = await ImagePicker.launchCameraAsync({allowsEditing:true,aspect:[1,1],quality:0.8});
    if (!r.canceled) setPhoto(await compressPhoto(r.assets[0].uri));
  }

  async function save() {
    if (!name.trim()) { Alert.alert('Name required','Please enter the car name.'); return; }
    await saveToHistory(name.trim());
    const cars = await loadCars();
    const car = {
      id:isEdit?id:uid(), brand, name:name.trim(), manufacturer:manufacturer.trim(),
      series:series.trim(), year:year.trim(), color:color.trim(),
      colnum:colnum.trim(), tampo:tampo.trim(), notes:notes.trim(),
      th, status, photo,
      added:isEdit?(cars.find(c=>c.id===id)?.added||Date.now()):Date.now()
    };
    if (isEdit) await updateCar(car); else await addCar(car);
    router.back();
  }

  async function handleDelete() {
    Alert.alert('Delete','Are you sure?',[
      {text:'Cancel',style:'cancel'},
      {text:'Delete',style:'destructive',onPress:async()=>{await deleteCar(id);router.back();}}
    ]);
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
          <TouchableOpacity onPress={()=>router.back()} style={{padding:4}}>
            <Ionicons name="chevron-back" size={24} color="#1A1A18"/>
          </TouchableOpacity>
          <Text style={s.topT}>{isEdit?'Edit Car':'Add Car'}</Text>
          <TouchableOpacity onPress={save} style={s.saveBtn}>
            <Text style={s.saveBtnT}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Brand */}
          <Text style={s.lbl}>Brand</Text>
          <View style={s.row}>
            <T label="🔥 Hot Wheels" active={brand==='hw'} onPress={()=>{setBrand('hw');setNameSug([]);}} ac="#FAECE7" tc="#993C1D"/>
            <T label="🚙 Matchbox" active={brand==='mb'} onPress={()=>{setBrand('mb');setNameSug([]);}} ac="#E6F1FB" tc="#0C447C"/>
          </View>

          {/* Car Name */}
          <Text style={s.lbl}>Car name *</Text>
          <View style={{zIndex:999,marginBottom:2}}>
            <View style={s.nameBox}>
              <Ionicons name="search" size={16} color="#A0A09C" style={{marginLeft:12}}/>
              <TextInput
                style={s.nameInput}
                value={name}
                onChangeText={onNameChange}
                onFocus={onNameFocus}
                placeholder="Type or search car name..."
                placeholderTextColor="#A0A09C"
                autoCorrect={false}
                autoCapitalize="words"
              />
              {name.length>0 && (
                <TouchableOpacity onPress={()=>{setName('');setNameSug(history.slice(0,10));setManufacturer('');}} style={{padding:10}}>
                  <Ionicons name="close-circle" size={18} color="#A0A09C"/>
                </TouchableOpacity>
              )}
            </View>

            {/* Suggestions dropdown */}
            {nameSug.length>0 && (
              <View style={s.sugBox}>
                {nameSug.slice(0,12).map((item,i)=>(
                  <TouchableOpacity
                    key={i}
                    style={[s.sugRow,i<nameSug.length-1&&s.sugBorder]}
                    onPress={()=>pickNameSug(item)}
                  >
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',gap:8}}>
                      {history.includes(item) && <Ionicons name="time-outline" size={14} color="#A0A09C"/>}
                      <Text style={s.sugTxt}>{item}</Text>
                    </View>
                    <Ionicons name="arrow-up-back" size={14} color="#A0A09C"/>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Manufacturer */}
          <Text style={s.lbl}>
            Car Manufacturer
            {manufacturer
              ? <Text style={{color:'#3B6D11',fontWeight:'600'}}> (auto-detected ✓)</Text>
              : <Text style={{color:'#A0A09C'}}> (tap to select)</Text>
            }
          </Text>
          <TouchableOpacity style={[s.mfgBtn, manufacturer&&s.mfgBtnFilled]} onPress={()=>setShowMfgPicker(true)}>
            <Ionicons name="business-outline" size={16} color={manufacturer?'#1A1A18':'#A0A09C'} style={{marginRight:8}}/>
            <Text style={[s.mfgBtnTxt,!manufacturer&&{color:'#A0A09C'}]} numberOfLines={1}>
              {manufacturer||'Select manufacturer...'}
            </Text>
            <Ionicons name={manufacturer?'pencil-outline':'chevron-down'} size={15} color="#A0A09C"/>
          </TouchableOpacity>

          {/* Series + Year */}
          <View style={s.grid}>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Series</Text>
              <TouchableOpacity
                style={[s.input,{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11}]}
                onPress={()=>setShowSeriesPicker(true)}
              >
                <Text style={{fontSize:15,color:series?'#1A1A18':'#A0A09C',flex:1}} numberOfLines={1}>
                  {series||'Select series...'}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C"/>
              </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Year</Text>
              <TextInput style={s.input} value={year} onChangeText={setYear} placeholder="2026" placeholderTextColor="#A0A09C" keyboardType="numeric"/>
            </View>
          </View>

          {/* Color + Collector # */}
          <View style={s.grid}>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Color</Text>
              <TextInput style={s.input} value={color} onChangeText={setColor} placeholder="Flame Red" placeholderTextColor="#A0A09C"/>
            </View>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Collector # (e.g. 4/5)</Text>
              <TextInput style={s.input} value={colnum} onChangeText={setColnum} placeholder="4/5 or 042/250" placeholderTextColor="#A0A09C"/>
            </View>
          </View>

          {/* Tampo */}
          <Text style={s.lbl}>Tampo</Text>
          <TextInput style={s.input} value={tampo} onChangeText={setTampo} placeholder="flames on hood..." placeholderTextColor="#A0A09C"/>

          {/* TH */}
          <Text style={s.lbl}>Treasure Hunt?</Text>
          <View style={s.row}>
            <T label="None" active={th==='none'} onPress={()=>setTh('none')} ac="#EAF3DE" tc="#3B6D11"/>
            <T label="⭐ TH" active={th==='th'} onPress={()=>setTh('th')} ac="#EAF3DE" tc="#3B6D11"/>
            <T label="🌟 Super TH" active={th==='sth'} onPress={()=>setTh('sth')} ac="#FAEEDA" tc="#BA7517"/>
          </View>

          {/* Photo */}
          <Text style={s.lbl}>Photo <Text style={{fontSize:11,color:'#A0A09C',fontWeight:'400'}}>(auto compressed)</Text></Text>
          <View style={{flexDirection:'row',gap:10,marginBottom:14}}>
            <TouchableOpacity style={[s.photoBox,{flex:2}]} onPress={takePhoto}>
              {photo?<Image source={{uri:photo}} style={StyleSheet.absoluteFill}/>:<><Ionicons name="camera" size={22} color="#6B6B67"/><Text style={s.photoT}>Camera</Text></>}
            </TouchableOpacity>
            <TouchableOpacity style={[s.photoBox,{flex:1}]} onPress={pickPhoto}>
              <Ionicons name="images" size={22} color="#6B6B67"/>
              <Text style={s.photoT}>Library</Text>
            </TouchableOpacity>
            {photo&&(
              <TouchableOpacity style={[s.photoBox,{flex:1}]} onPress={()=>setPhoto(null)}>
                <Ionicons name="trash-outline" size={20} color="#A32D2D"/>
                <Text style={[s.photoT,{color:'#A32D2D'}]}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Status */}
          <Text style={s.lbl}>Status</Text>
          <View style={s.row}>
            <T label="✓ I own it" active={status==='owned'} onPress={()=>setStatus('owned')} ac="#EAF3DE" tc="#3B6D11"/>
            <T label="♡ Wishlist" active={status==='wish'} onPress={()=>setStatus('wish')} ac="#E6F1FB" tc="#0C447C"/>
            <T label="2× Duplicate" active={status==='dup'} onPress={()=>setStatus('dup')} ac="#FCEBEB" tc="#A32D2D"/>
          </View>

          {/* Notes */}
          <Text style={s.lbl}>Notes</Text>
          <TextInput
            style={[s.input,{height:80,textAlignVertical:'top'}]}
            value={notes} onChangeText={setNotes}
            placeholder="Where you got it, price paid, condition..."
            placeholderTextColor="#A0A09C" multiline
          />

          {isEdit&&(
            <TouchableOpacity style={s.delBtn} onPress={handleDelete}>
              <Text style={s.delT}>Delete Car</Text>
            </TouchableOpacity>
          )}
          <View style={{height:40}}/>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Series Picker */}
      <Modal visible={showSeriesPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <View style={s.modalTop}>
            <TouchableOpacity onPress={()=>{setShowSeriesPicker(false);setSeriesSearch('');setSeriesList(HW_SERIES);}} style={{padding:4}}>
              <Ionicons name="chevron-back" size={24} color="#1A1A18"/>
            </TouchableOpacity>
            <Text style={s.modalTitle}>Select Series</Text>
            <TouchableOpacity onPress={()=>{setSeries('');setShowSeriesPicker(false);}} style={{padding:4}}>
              <Text style={{color:'#A0A09C',fontSize:14}}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={s.mfgSearchBox}>
            <Ionicons name="search" size={16} color="#A0A09C" style={{marginLeft:12}}/>
            <TextInput
              style={s.mfgSearchInput}
              value={seriesSearch}
              onChangeText={t=>{setSeriesSearch(t);setSeriesList(searchSeries(t));}}
              placeholder="Search series..."
              placeholderTextColor="#A0A09C"
              autoCorrect={false}
              autoFocus
            />
            {seriesSearch.length>0&&(
              <TouchableOpacity onPress={()=>{setSeriesSearch('');setSeriesList(HW_SERIES);}} style={{padding:10}}>
                <Ionicons name="close-circle" size={18} color="#A0A09C"/>
              </TouchableOpacity>
            )}
          </View>
          {/* Custom entry */}
          {seriesSearch.length>1 && !seriesList.find(s=>s.label.toLowerCase()===seriesSearch.toLowerCase()) && (
            <TouchableOpacity
              style={{margin:16,marginTop:8,flexDirection:'row',alignItems:'center',gap:10,backgroundColor:'#FAECE7',borderRadius:12,padding:12,borderWidth:1,borderColor:'#D85A30'}}
              onPress={()=>{setSeries(seriesSearch);setShowSeriesPicker(false);setSeriesSearch('');setSeriesList(HW_SERIES);}}
            >
              <Ionicons name="add-circle" size={22} color="#D85A30"/>
              <View>
                <Text style={{fontSize:12,color:'#993C1D',fontWeight:'600'}}>Add custom series</Text>
                <Text style={{fontSize:15,color:'#D85A30',fontWeight:'800'}}>{seriesSearch}</Text>
              </View>
            </TouchableOpacity>
          )}
          <FlatList
            data={seriesList}
            keyExtractor={(item,i)=>item.label+i}
            contentContainerStyle={{paddingHorizontal:16,paddingBottom:60}}
            renderItem={({item,index})=>{
              const showGroup = index===0||seriesList[index-1].group!==item.group;
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
          />
        </SafeAreaView>
      </Modal>

      {/* Manufacturer Picker */}
      <Modal visible={showMfgPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <View style={s.modalTop}>
            <TouchableOpacity onPress={()=>{setShowMfgPicker(false);setMfgSearch('');setMfgList(MANUFACTURERS.slice(0,30));}} style={{padding:4}}>
              <Ionicons name="chevron-back" size={24} color="#1A1A18"/>
            </TouchableOpacity>
            <Text style={s.modalTitle}>Select Manufacturer</Text>
            <TouchableOpacity onPress={()=>{setManufacturer('');setShowMfgPicker(false);}} style={{padding:4}}>
              <Text style={{color:'#A0A09C',fontSize:14}}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={s.mfgSearchBox}>
            <Ionicons name="search" size={16} color="#A0A09C" style={{marginLeft:12}}/>
            <TextInput
              style={s.mfgSearchInput}
              value={mfgSearch}
              onChangeText={onMfgSearch}
              placeholder="Search manufacturer..."
              placeholderTextColor="#A0A09C"
              autoCorrect={false}
              autoFocus
            />
            {mfgSearch.length>0&&(
              <TouchableOpacity onPress={()=>{setMfgSearch('');setMfgList(MANUFACTURERS.slice(0,30));}} style={{padding:10}}>
                <Ionicons name="close-circle" size={18} color="#A0A09C"/>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={mfgList}
            keyExtractor={(item,i)=>item+i}
            contentContainerStyle={{paddingHorizontal:16,paddingBottom:60}}
            renderItem={({item})=>(
              <TouchableOpacity
                style={[s.mfgRow,manufacturer===item&&s.mfgRowActive]}
                onPress={()=>pickMfg(item)}
              >
                <Text style={[s.mfgRowTxt,manufacturer===item&&{color:'#D85A30',fontWeight:'700'}]}>{item}</Text>
                {manufacturer===item&&<Ionicons name="checkmark-circle" size={20} color="#D85A30"/>}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
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
  nameBox:{flexDirection:'row',alignItems:'center',backgroundColor:'#F5F4F1',borderWidth:1,borderColor:'#D85A30',borderRadius:10},
  nameInput:{flex:1,paddingHorizontal:10,paddingVertical:11,fontSize:15,color:'#1A1A18'},
  sugBox:{backgroundColor:'#fff',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:12,marginTop:4,overflow:'hidden',shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.12,shadowRadius:12,elevation:8},
  sugRow:{paddingHorizontal:14,paddingVertical:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  sugBorder:{borderBottomWidth:0.5,borderBottomColor:'#E0DEDA'},
  sugTxt:{fontSize:15,fontWeight:'500',color:'#1A1A18'},
  mfgBtn:{flexDirection:'row',alignItems:'center',backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:10,padding:12,marginBottom:14},
  mfgBtnFilled:{borderColor:'#3B6D11',backgroundColor:'#EAF3DE'},
  mfgBtnTxt:{flex:1,fontSize:15,color:'#1A1A18'},
  photoBox:{height:100,borderRadius:10,borderWidth:1.5,borderStyle:'dashed',borderColor:'#CCCBC6',backgroundColor:'#F5F4F1',alignItems:'center',justifyContent:'center',gap:4,overflow:'hidden'},
  photoT:{fontSize:12,color:'#6B6B67'},
  delBtn:{marginTop:20,padding:14,borderRadius:10,backgroundColor:'#FCEBEB',borderWidth:0.5,borderColor:'#F7C1C1',alignItems:'center'},
  delT:{color:'#A32D2D',fontWeight:'700',fontSize:16},
  modalTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:16,borderBottomWidth:0.5,borderBottomColor:'#E0DEDA'},
  modalTitle:{fontSize:20,fontWeight:'700',color:'#1A1A18'},
  mfgSearchBox:{flexDirection:'row',alignItems:'center',backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:10,margin:16},
  mfgSearchInput:{flex:1,paddingHorizontal:10,paddingVertical:11,fontSize:15,color:'#1A1A18'},
  mfgRow:{paddingVertical:14,paddingHorizontal:4,borderBottomWidth:0.5,borderBottomColor:'#F5F4F1',flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  mfgRowActive:{backgroundColor:'#FAECE7',borderRadius:10,paddingHorizontal:10},
  mfgRowTxt:{fontSize:16,color:'#1A1A18'},
});
`);
console.log('✅ app/car/[id].tsx — complete rewrite with auto-suggest + history');
console.log('\nRun: npx expo start --clear');
console.log('\nNEW FEATURES:');
console.log('1. Tap car name field → shows recent cars you entered before');
console.log('2. Type any letter → shows matching suggestions from history + built-in list');
console.log('3. Clock icon 🕐 shows previously entered cars');
console.log('4. Collector # placeholder shows "4/5 or 042/250" hint');
console.log('5. Every car you save is remembered for next time');
