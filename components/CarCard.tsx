import React from 'react';
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
});