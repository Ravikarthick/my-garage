#!/usr/bin/env node
const fs = require('fs');

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
import { searchManufacturers, detectManufacturer, MANUFACTURERS, HW_CARS, MB_CARS } from '../../lib/carDatabase';
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

  const [brand, setBrand]           = useState('hw');
  const [name, setName]             = useState('');
  const [manufacturer, setMfg]      = useState('');
  const [series, setSeries]         = useState('');
  const [year, setYear]             = useState(String(new Date().getFullYear()));
  const [color, setColor]           = useState('');
  const [colnum, setColnum]         = useState('');
  const [mainline, setMainline]     = useState('');
  const [tampo, setTampo]           = useState('');
  const [notes, setNotes]           = useState('');
  const [th, setTh]                 = useState('none');
  const [status, setStatus]         = useState('owned');
  const [photo, setPhoto]           = useState(null);
  const [nameSug, setNameSug]       = useState([]);
  const [history, setHistory]       = useState([]);
  const [showMfgPicker, setShowMfgPicker]             = useState(false);
  const [showSeriesPicker, setShowSeriesPicker]       = useState(false);
  const [showColPicker, setShowColPicker]             = useState(false);
  const [showMainlinePicker, setShowMainlinePicker]   = useState(false);
  const [showColorPicker, setShowColorPicker]         = useState(false);
  const [mfgSearch, setMfgSearch]   = useState('');
  const [mfgList, setMfgList]       = useState(MANUFACTURERS.slice(0,30));
  const [seriesSearch, setSeriesSearch] = useState('');
  const [seriesList, setSeriesList] = useState(HW_SERIES);

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then(d => { if(d) setHistory(JSON.parse(d)); });
    if (prefill) { try { const p=JSON.parse(prefill); if(p.status) setStatus(p.status); if(p.brand) setBrand(p.brand); } catch {} }
    if (isEdit) {
      loadCars().then(cars => {
        const c = cars.find(x => x.id === id);
        if (c) {
          setBrand(c.brand||'hw'); setName(c.name||''); setMfg(c.manufacturer||'');
          setSeries(c.series||''); setYear(c.year||''); setColor(c.color||'');
          setColnum(c.colnum||''); setMainline(c.mainline||'');
          setTampo(c.tampo||''); setNotes(c.notes||'');
          setTh(c.th||'none'); setStatus(c.status||'owned'); setPhoto(c.photo||null);
        }
      });
    }
  }, []);

  async function saveHistory(n) {
    const updated = [n, ...history.filter(h=>h!==n)].slice(0,50);
    setHistory(updated);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }

  function onNameChange(text) {
    setName(text);
    const detected = detectManufacturer(text);
    if (detected) setMfg(detected);
    if (text.length >= 1) {
      const q = text.toLowerCase();
      const list = brand==='hw' ? HW_CARS : MB_CARS;
      const fromHistory = history.filter(h=>h.toLowerCase().includes(q));
      const fromList = list.filter(n=>n.toLowerCase().includes(q));
      setNameSug([...new Set([...fromHistory,...fromList])].slice(0,12));
    } else {
      setNameSug(history.slice(0,8));
    }
  }

  function pickSug(val) {
    setName(val); setNameSug([]);
    const d = detectManufacturer(val); if(d) setMfg(d);
  }

  async function save() {
    if (!name.trim()) { Alert.alert('Name required'); return; }
    await saveHistory(name.trim());
    const cars = await loadCars();
    const car = {
      id: isEdit?id:uid(), brand, name:name.trim(), manufacturer:manufacturer.trim(),
      series:series.trim(), year:year.trim(), color:color.trim(),
      colnum:colnum.trim(), mainline:mainline.trim(),
      tampo:tampo.trim(), notes:notes.trim(), th, status, photo,
      added: isEdit?(cars.find(c=>c.id===id)?.added||Date.now()):Date.now()
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

  const Tog = ({label,active,onPress,ac,tc}) => (
    <TouchableOpacity style={[s.tog,active&&{backgroundColor:ac,borderColor:tc}]} onPress={onPress}>
      <Text style={[s.togT,active&&{color:tc}]}>{label}</Text>
    </TouchableOpacity>
  );

  const COLORS = ['Red','Blue','Green','Yellow','Orange','Purple','Pink','White','Black','Silver','Gold','Gray','Brown','Teal','Dark Blue','Dark Red','Metallic Red','Metallic Blue','Metallic Silver','Metallic Gold','Flat Black','Pearl White','Chrome','Spectraflame Red','Spectraflame Blue','Spectraflame Green','Spectraflame Orange','Spectraflame Purple','ZAMAC'];

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
            <Tog label="🔥 Hot Wheels" active={brand==='hw'} onPress={()=>{setBrand('hw');setNameSug([]);}} ac="#FAECE7" tc="#993C1D"/>
            <Tog label="🚙 Matchbox" active={brand==='mb'} onPress={()=>{setBrand('mb');setNameSug([]);}} ac="#E6F1FB" tc="#0C447C"/>
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
                onFocus={()=>!name&&setNameSug(history.slice(0,8))}
                placeholder="Type or search car name..."
                placeholderTextColor="#A0A09C"
                autoCorrect={false}
                autoCapitalize="words"
              />
              {name.length>0&&(
                <TouchableOpacity onPress={()=>{setName('');setNameSug([]);setMfg('');}} style={{padding:10}}>
                  <Ionicons name="close-circle" size={18} color="#A0A09C"/>
                </TouchableOpacity>
              )}
            </View>
            {nameSug.length>0&&(
              <View style={s.sugBox}>
                {nameSug.map((item,i)=>(
                  <TouchableOpacity key={i} style={[s.sugRow,i<nameSug.length-1&&s.sugBorder]} onPress={()=>pickSug(item)}>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',gap:8}}>
                      {history.includes(item)&&<Ionicons name="time-outline" size={13} color="#A0A09C"/>}
                      <Text style={s.sugTxt}>{item}</Text>
                    </View>
                    <Ionicons name="arrow-up-back" size={13} color="#A0A09C"/>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Manufacturer */}
          <Text style={s.lbl}>Manufacturer{manufacturer?<Text style={{color:'#3B6D11'}}> (auto-detected ✓)</Text>:<Text style={{color:'#A0A09C'}}> (tap to select)</Text>}</Text>
          <TouchableOpacity style={[s.mfgBtn,manufacturer&&s.mfgBtnFilled]} onPress={()=>setShowMfgPicker(true)}>
            <Ionicons name="business-outline" size={16} color={manufacturer?'#1A1A18':'#A0A09C'} style={{marginRight:8}}/>
            <Text style={[s.mfgBtnTxt,!manufacturer&&{color:'#A0A09C'}]} numberOfLines={1}>{manufacturer||'Select manufacturer...'}</Text>
            <Ionicons name={manufacturer?'pencil-outline':'chevron-down'} size={15} color="#A0A09C"/>
          </TouchableOpacity>

          {/* Series + Year */}
          <View style={s.grid}>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Series</Text>
              <TouchableOpacity style={[s.input,{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11}]} onPress={()=>setShowSeriesPicker(true)}>
                <Text style={{fontSize:15,color:series?'#1A1A18':'#A0A09C',flex:1}} numberOfLines={1}>{series||'Select...'}</Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C"/>
              </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Year</Text>
              <TextInput style={s.input} value={year} onChangeText={setYear} placeholder="2026" placeholderTextColor="#A0A09C" keyboardType="numeric"/>
            </View>
          </View>

          {/* Color + Series # */}
          <View style={s.grid}>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Color</Text>
              <TouchableOpacity style={[s.input,{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11}]} onPress={()=>setShowColorPicker(true)}>
                <Text style={{fontSize:15,color:color?'#1A1A18':'#A0A09C',flex:1}} numberOfLines={1}>{color||'Select...'}</Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C"/>
              </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Series # (e.g. 4/5)</Text>
              <TouchableOpacity style={[s.input,{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11}]} onPress={()=>setShowColPicker(true)}>
                <Text style={{fontSize:15,color:colnum?'#1A1A18':'#A0A09C',flex:1}}>{colnum||'4/5'}</Text>
                <Ionicons name="chevron-down" size={14} color="#A0A09C"/>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mainline # */}
          <Text style={s.lbl}>Mainline # (e.g. 32/250)</Text>
          <TouchableOpacity style={[s.input,{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11,marginBottom:10}]} onPress={()=>setShowMainlinePicker(true)}>
            <Text style={{fontSize:15,color:mainline?'#1A1A18':'#A0A09C',flex:1}}>{mainline||'32/250 — tap to set'}</Text>
            <Ionicons name="chevron-down" size={14} color="#A0A09C"/>
          </TouchableOpacity>

          {/* Tampo */}
          <Text style={s.lbl}>Tampo</Text>
          <TextInput style={s.input} value={tampo} onChangeText={setTampo} placeholder="flames on hood..." placeholderTextColor="#A0A09C"/>

          {/* TH */}
          <Text style={s.lbl}>Treasure Hunt?</Text>
          <View style={s.row}>
            <Tog label="None" active={th==='none'} onPress={()=>setTh('none')} ac="#EAF3DE" tc="#3B6D11"/>
            <Tog label="⭐ TH" active={th==='th'} onPress={()=>setTh('th')} ac="#EAF3DE" tc="#3B6D11"/>
            <Tog label="🌟 Super TH" active={th==='sth'} onPress={()=>setTh('sth')} ac="#FAEEDA" tc="#BA7517"/>
          </View>

          {/* Photo */}
          <Text style={s.lbl}>Photo</Text>
          <View style={{flexDirection:'row',gap:10,marginBottom:14}}>
            <TouchableOpacity style={[s.photoBox,{flex:2}]} onPress={async()=>{
              const {status:cs}=await ImagePicker.requestCameraPermissionsAsync();
              if(cs!=='granted'){Alert.alert('Permission needed');return;}
              const r=await ImagePicker.launchCameraAsync({allowsEditing:true,aspect:[1,1],quality:0.8});
              if(!r.canceled) setPhoto(await compressPhoto(r.assets[0].uri));
            }}>
              {photo?<Image source={{uri:photo}} style={StyleSheet.absoluteFill}/>:<><Ionicons name="camera" size={22} color="#6B6B67"/><Text style={s.photoT}>Camera</Text></>}
            </TouchableOpacity>
            <TouchableOpacity style={[s.photoBox,{flex:1}]} onPress={async()=>{
              const r=await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.Images,allowsEditing:true,aspect:[1,1],quality:0.8});
              if(!r.canceled) setPhoto(await compressPhoto(r.assets[0].uri));
            }}>
              <Ionicons name="images" size={22} color="#6B6B67"/>
              <Text style={s.photoT}>Library</Text>
            </TouchableOpacity>
            {photo&&<TouchableOpacity style={[s.photoBox,{flex:1}]} onPress={()=>setPhoto(null)}>
              <Ionicons name="trash-outline" size={20} color="#A32D2D"/>
              <Text style={[s.photoT,{color:'#A32D2D'}]}>Remove</Text>
            </TouchableOpacity>}
          </View>

          {/* Status */}
          <Text style={s.lbl}>Status</Text>
          <View style={s.row}>
            <Tog label="✓ I own it" active={status==='owned'} onPress={()=>setStatus('owned')} ac="#EAF3DE" tc="#3B6D11"/>
            <Tog label="♡ Wishlist" active={status==='wish'} onPress={()=>setStatus('wish')} ac="#E6F1FB" tc="#0C447C"/>
            <Tog label="2× Duplicate" active={status==='dup'} onPress={()=>setStatus('dup')} ac="#FCEBEB" tc="#A32D2D"/>
          </View>

          {/* Notes */}
          <Text style={s.lbl}>Notes</Text>
          <TextInput style={[s.input,{height:80,textAlignVertical:'top'}]} value={notes} onChangeText={setNotes} placeholder="Where you got it, price, condition..." placeholderTextColor="#A0A09C" multiline/>

          {isEdit&&<TouchableOpacity style={s.delBtn} onPress={handleDelete}><Text style={s.delT}>Delete Car</Text></TouchableOpacity>}
          <View style={{height:40}}/>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* COLOR PICKER */}
      <Modal visible={showColorPicker} transparent animationType="slide">
        <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)'}} activeOpacity={1} onPress={()=>setShowColorPicker(false)}/>
        <View style={{backgroundColor:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,paddingBottom:34}}>
          <View style={{width:40,height:4,borderRadius:2,backgroundColor:'#E0DEDA',alignSelf:'center',marginVertical:12}}/>
          <Text style={{fontSize:18,fontWeight:'700',color:'#1A1A18',paddingHorizontal:20,marginBottom:14}}>Select Color</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,paddingHorizontal:20,marginBottom:14}}>
            {COLORS.map(c=>(
              <TouchableOpacity key={c} style={{paddingHorizontal:12,paddingVertical:7,borderRadius:20,borderWidth:1.5,backgroundColor:color===c?'#D85A30':'#F5F4F1',borderColor:color===c?'#D85A30':'#E0DEDA'}} onPress={()=>{setColor(c);setShowColorPicker(false);}}>
                <Text style={{fontSize:13,fontWeight:'600',color:color===c?'#fff':'#1A1A18'}}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{flexDirection:'row',gap:10,paddingHorizontal:20}}>
            <TextInput style={{flex:1,backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:10,paddingHorizontal:12,paddingVertical:10,fontSize:15,color:'#1A1A18'}} value={color} onChangeText={setColor} placeholder="Custom color..." placeholderTextColor="#A0A09C"/>
            <TouchableOpacity style={{backgroundColor:'#D85A30',borderRadius:10,paddingHorizontal:18,justifyContent:'center'}} onPress={()=>setShowColorPicker(false)}>
              <Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SERIES # PICKER */}
      <Modal visible={showColPicker} transparent animationType="slide">
        <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)'}} activeOpacity={1} onPress={()=>setShowColPicker(false)}/>
        <View style={{backgroundColor:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,paddingBottom:34,maxHeight:'80%'}}>
          <View style={{width:40,height:4,borderRadius:2,backgroundColor:'#E0DEDA',alignSelf:'center',marginVertical:12}}/>
          <Text style={{fontSize:18,fontWeight:'700',color:'#1A1A18',paddingHorizontal:20,marginBottom:4}}>Series Position</Text>
          <Text style={{fontSize:13,color:'#A0A09C',paddingHorizontal:20,marginBottom:12}}>Car's position within the series</Text>
          <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:20}}>
            {[{l:'Out of 5',t:5},{l:'Out of 6 (Car Culture)',t:6},{l:'Out of 8',t:8},{l:'Out of 10',t:10},{l:'Out of 12 (Target)',t:12}].map(({l,t})=>(
              <View key={t} style={{marginBottom:14}}>
                <Text style={{fontSize:11,fontWeight:'700',color:'#A0A09C',textTransform:'uppercase',letterSpacing:0.8,marginBottom:8}}>{l}</Text>
                <View style={{flexDirection:'row',flexWrap:'wrap',gap:6}}>
                  {Array.from({length:t},(_,i)=>i+1).map(n=>(
                    <TouchableOpacity key={n} style={{paddingHorizontal:12,paddingVertical:8,borderRadius:16,borderWidth:1.5,backgroundColor:colnum===n+'/'+t?'#D85A30':'#F5F4F1',borderColor:colnum===n+'/'+t?'#D85A30':'#E0DEDA'}} onPress={()=>{setColnum(n+'/'+t);setShowColPicker(false);}}>
                      <Text style={{fontSize:14,fontWeight:'700',color:colnum===n+'/'+t?'#fff':'#1A1A18'}}>{n}/{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
            <View style={{flexDirection:'row',gap:10,marginTop:4}}>
              <TextInput style={{flex:1,backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:10,paddingHorizontal:12,paddingVertical:10,fontSize:15,color:'#1A1A18'}} value={colnum} onChangeText={setColnum} placeholder="Custom e.g. 042/250" placeholderTextColor="#A0A09C"/>
              <TouchableOpacity style={{backgroundColor:'#D85A30',borderRadius:10,paddingHorizontal:18,justifyContent:'center'}} onPress={()=>setShowColPicker(false)}>
                <Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>Done</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* MAINLINE # PICKER */}
      <Modal visible={showMainlinePicker} transparent animationType="slide">
        <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)'}} activeOpacity={1} onPress={()=>setShowMainlinePicker(false)}/>
        <View style={{backgroundColor:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,paddingBottom:34}}>
          <View style={{width:40,height:4,borderRadius:2,backgroundColor:'#E0DEDA',alignSelf:'center',marginVertical:12}}/>
          <Text style={{fontSize:18,fontWeight:'700',color:'#1A1A18',paddingHorizontal:20,marginBottom:4}}>Mainline Number</Text>
          <Text style={{fontSize:13,color:'#A0A09C',paddingHorizontal:20,marginBottom:14}}>Car's number out of 250 in the full year</Text>
          <View style={{paddingHorizontal:20,marginBottom:16}}>
            <View style={{flexDirection:'row',gap:10}}>
              <TextInput
                style={{flex:1,backgroundColor:'#F5F4F1',borderWidth:1,borderColor:'#D85A30',borderRadius:12,paddingHorizontal:16,paddingVertical:12,fontSize:24,fontWeight:'700',color:'#1A1A18',textAlign:'center'}}
                value={mainline.replace('/250','')}
                onChangeText={v=>{const n=v.replace(/[^0-9]/g,'');setMainline(n?n+'/250':'');}}
                placeholder="e.g. 32"
                placeholderTextColor="#A0A09C"
                keyboardType="numeric"
                maxLength={3}
              />
              <TouchableOpacity style={{backgroundColor:'#D85A30',borderRadius:12,paddingHorizontal:20,justifyContent:'center'}} onPress={()=>setShowMainlinePicker(false)}>
                <Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>Done</Text>
              </TouchableOpacity>
            </View>
            {!!mainline&&<Text style={{fontSize:16,color:'#3B6D11',fontWeight:'700',marginTop:10,textAlign:'center'}}>Saving as: {mainline}</Text>}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:20,gap:8}}>
            {[1,10,25,50,75,100,125,150,175,200,225,250].map(n=>(
              <TouchableOpacity key={n} style={{paddingHorizontal:14,paddingVertical:8,borderRadius:20,borderWidth:1.5,backgroundColor:mainline===n+'/250'?'#D85A30':'#F5F4F1',borderColor:mainline===n+'/250'?'#D85A30':'#E0DEDA'}} onPress={()=>{setMainline(n+'/250');setShowMainlinePicker(false);}}>
                <Text style={{fontSize:14,fontWeight:'700',color:mainline===n+'/250'?'#fff':'#1A1A18'}}>{n}/250</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* SERIES PICKER */}
      <Modal visible={showSeriesPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <View style={s.modalTop}>
            <TouchableOpacity onPress={()=>{setShowSeriesPicker(false);setSeriesSearch('');setSeriesList(HW_SERIES);}} style={{padding:4}}><Ionicons name="chevron-back" size={24} color="#1A1A18"/></TouchableOpacity>
            <Text style={s.modalTitle}>Select Series</Text>
            <TouchableOpacity onPress={()=>{setSeries('');setShowSeriesPicker(false);}} style={{padding:4}}><Text style={{color:'#A0A09C',fontSize:14}}>Clear</Text></TouchableOpacity>
          </View>
          <View style={s.mfgSearchBox}>
            <Ionicons name="search" size={16} color="#A0A09C" style={{marginLeft:12}}/>
            <TextInput style={s.mfgSearchInput} value={seriesSearch} onChangeText={t=>{setSeriesSearch(t);setSeriesList(searchSeries(t));}} placeholder="Search series..." placeholderTextColor="#A0A09C" autoCorrect={false} autoFocus/>
            {seriesSearch.length>0&&<TouchableOpacity onPress={()=>{setSeriesSearch('');setSeriesList(HW_SERIES);}} style={{padding:10}}><Ionicons name="close-circle" size={18} color="#A0A09C"/></TouchableOpacity>}
          </View>
          {seriesSearch.length>1&&!seriesList.find(s=>s.label.toLowerCase()===seriesSearch.toLowerCase())&&(
            <TouchableOpacity style={{margin:16,marginTop:8,flexDirection:'row',alignItems:'center',gap:10,backgroundColor:'#FAECE7',borderRadius:12,padding:12,borderWidth:1,borderColor:'#D85A30'}} onPress={()=>{setSeries(seriesSearch);setShowSeriesPicker(false);setSeriesSearch('');setSeriesList(HW_SERIES);}}>
              <Ionicons name="add-circle" size={22} color="#D85A30"/>
              <View><Text style={{fontSize:12,color:'#993C1D',fontWeight:'600'}}>Add custom series</Text><Text style={{fontSize:15,color:'#D85A30',fontWeight:'800'}}>{seriesSearch}</Text></View>
            </TouchableOpacity>
          )}
          <FlatList data={seriesList} keyExtractor={(item,i)=>item.label+i} contentContainerStyle={{paddingHorizontal:16,paddingBottom:60}}
            renderItem={({item,index})=>{
              const showGroup=index===0||seriesList[index-1].group!==item.group;
              return (<>
                {showGroup&&<Text style={{fontSize:11,fontWeight:'700',color:'#A0A09C',textTransform:'uppercase',letterSpacing:0.8,marginTop:16,marginBottom:4}}>{item.group}</Text>}
                <TouchableOpacity style={[s.mfgRow,series===item.label&&s.mfgRowActive]} onPress={()=>{setSeries(item.label);setShowSeriesPicker(false);setSeriesSearch('');setSeriesList(HW_SERIES);}}>
                  <Text style={[s.mfgRowTxt,series===item.label&&{color:'#D85A30',fontWeight:'700'}]}>{item.label}</Text>
                  {series===item.label&&<Ionicons name="checkmark-circle" size={20} color="#D85A30"/>}
                </TouchableOpacity>
              </>);
            }}
          />
        </SafeAreaView>
      </Modal>

      {/* MANUFACTURER PICKER */}
      <Modal visible={showMfgPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <View style={s.modalTop}>
            <TouchableOpacity onPress={()=>{setShowMfgPicker(false);setMfgSearch('');setMfgList(MANUFACTURERS.slice(0,30));}} style={{padding:4}}><Ionicons name="chevron-back" size={24} color="#1A1A18"/></TouchableOpacity>
            <Text style={s.modalTitle}>Select Manufacturer</Text>
            <TouchableOpacity onPress={()=>{setMfg('');setShowMfgPicker(false);}} style={{padding:4}}><Text style={{color:'#A0A09C',fontSize:14}}>Clear</Text></TouchableOpacity>
          </View>
          <View style={s.mfgSearchBox}>
            <Ionicons name="search" size={16} color="#A0A09C" style={{marginLeft:12}}/>
            <TextInput style={s.mfgSearchInput} value={mfgSearch} onChangeText={t=>{setMfgSearch(t);setMfgList(searchManufacturers(t));}} placeholder="Search manufacturer..." placeholderTextColor="#A0A09C" autoCorrect={false} autoFocus/>
            {mfgSearch.length>0&&<TouchableOpacity onPress={()=>{setMfgSearch('');setMfgList(MANUFACTURERS.slice(0,30));}} style={{padding:10}}><Ionicons name="close-circle" size={18} color="#A0A09C"/></TouchableOpacity>}
          </View>
          <FlatList data={mfgList} keyExtractor={(item,i)=>item+i} contentContainerStyle={{paddingHorizontal:16,paddingBottom:60}}
            renderItem={({item})=>(
              <TouchableOpacity style={[s.mfgRow,manufacturer===item&&s.mfgRowActive]} onPress={()=>{setMfg(item);setShowMfgPicker(false);setMfgSearch('');setMfgList(MANUFACTURERS.slice(0,30));}}>
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
  lbl:{fontSize:12,fontWeight:'500',color:'#6B6B67',marginBottom:5,marginTop:6},
  input:{backgroundColor:'#F5F4F1',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:10,paddingHorizontal:12,paddingVertical:10,fontSize:15,color:'#1A1A18',marginBottom:2},
  grid:{flexDirection:'row',gap:10,marginBottom:2},
  row:{flexDirection:'row',gap:6,flexWrap:'wrap',marginBottom:14},
  tog:{paddingHorizontal:14,paddingVertical:7,borderRadius:20,borderWidth:0.5,borderColor:'#E0DEDA',backgroundColor:'#F5F4F1'},
  togT:{fontSize:13,fontWeight:'500',color:'#6B6B67'},
  nameBox:{flexDirection:'row',alignItems:'center',backgroundColor:'#F5F4F1',borderWidth:1,borderColor:'#D85A30',borderRadius:10},
  nameInput:{flex:1,paddingHorizontal:10,paddingVertical:11,fontSize:15,color:'#1A1A18'},
  sugBox:{backgroundColor:'#fff',borderWidth:0.5,borderColor:'#E0DEDA',borderRadius:12,marginTop:4,overflow:'hidden',shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.12,shadowRadius:12,elevation:8},
  sugRow:{paddingHorizontal:14,paddingVertical:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
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

console.log('✅ app/car/[id].tsx — complete clean rewrite!');
console.log('Run: npx expo start --clear');
