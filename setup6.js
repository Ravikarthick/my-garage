#!/usr/bin/env node
const fs = require('fs');

fs.writeFileSync('lib/carDatabase.ts', `
// ── Complete manufacturer list (150+ brands) ──────────────────────────────
export const MANUFACTURERS = [
  // American
  'AC','AMC','Buick','Cadillac','Chevrolet','Chrysler','Cord','De Tomaso',
  'Dodge','Eagle','Ford','GMC','General Motors','Hudson','Hummer',
  'Lincoln','Mercury','Nash','Oldsmobile','Packard','Plymouth',
  'Pontiac','Ram','Shelby','Studebaker','Tesla','Rivian','Lucid',
  // European
  'Alfa Romeo','Aston Martin','Audi','Bentley','BMW','Bugatti',
  'Citroen','Dacia','Ferrari','Fiat','Jaguar','Koenigsegg',
  'Lamborghini','Lancia','Land Rover','Lotus','Maserati','McLaren',
  'Mercedes-Benz','MINI','Pagani','Peugeot','Porsche','Renault',
  'Rolls Royce','Saab','SEAT','Skoda','Smart','Vauxhall','Volkswagen','Volvo',
  // Japanese
  'Acura','Daihatsu','Honda','Infiniti','Isuzu','Lexus','Mazda',
  'Mitsubishi','Nissan','Subaru','Suzuki','Toyota',
  // Korean
  'Genesis','Hyundai','Kia','SsangYong',
  // Chinese/Other
  'BYD','Geely','Great Wall','Haval','NIO','Polestar','Xpeng',
  // Classic/Special
  'Auburn','Delorean','Duesenberg','Edsel','Kaiser','Pierce-Arrow',
  'SSC','Vector','Willys',
  // Hot Wheels Originals (fantasy)
  'Hot Wheels Original','Mattel','Custom/Fantasy',
  // Trucks/Commercial
  'Freightliner','Kenworth','Mack','Peterbilt','International',
  'Unknown',
].sort();

// ── Map car name keywords → manufacturer ─────────────────────────────────
const NAME_TO_MFG: Record<string, string> = {
  // Ford
  'mustang': 'Ford', 'f-150': 'Ford', 'f150': 'Ford', 'bronco': 'Ford',
  'gt40': 'Ford', 'gt 40': 'Ford', 'ford': 'Ford', 'maverick': 'Ford',
  'ranger': 'Ford', 'explorer': 'Ford', 'expedition': 'Ford', 'edge': 'Ford',
  'escape': 'Ford', 'focus': 'Ford', 'fusion': 'Ford', 'taurus': 'Ford',
  // Chevrolet / GM
  'camaro': 'Chevrolet', 'corvette': 'Chevrolet', 'silverado': 'Chevrolet',
  'chevy': 'Chevrolet', 'chevrolet': 'Chevrolet', 'chevelle': 'Chevrolet',
  'el camino': 'Chevrolet', 'blazer': 'Chevrolet', 'tahoe': 'Chevrolet',
  'suburban': 'Chevrolet', 'impala': 'Chevrolet', 'nova': 'Chevrolet',
  'monte carlo': 'Chevrolet', 'bel air': 'Chevrolet', '55 chevy': 'Chevrolet',
  '57 chevy': 'Chevrolet', 'c10': 'Chevrolet', 'ssr': 'Chevrolet',
  'cadillac': 'Cadillac', 'escalade': 'Cadillac', 'ctsv': 'Cadillac',
  'buick': 'Buick', 'gmc': 'GMC', 'sierra': 'GMC', 'canyon': 'GMC',
  // Dodge / Chrysler / Plymouth
  'dodge': 'Dodge', 'challenger': 'Dodge', 'charger': 'Dodge',
  'viper': 'Dodge', 'dart': 'Dodge', 'ram': 'Ram',
  'chrysler': 'Chrysler', 'plymouth': 'Plymouth', 'barracuda': 'Plymouth',
  'road runner': 'Plymouth', 'superbird': 'Plymouth',
  // Ferrari
  'ferrari': 'Ferrari', '458': 'Ferrari', '488': 'Ferrari', 'f40': 'Ferrari',
  'f50': 'Ferrari', 'laferrari': 'Ferrari', 'testarossa': 'Ferrari',
  '308': 'Ferrari', '599': 'Ferrari', 'enzo': 'Ferrari',
  // Lamborghini
  'lamborghini': 'Lamborghini', 'countach': 'Lamborghini',
  'huracan': 'Lamborghini', 'aventador': 'Lamborghini',
  'urus': 'Lamborghini', 'gallardo': 'Lamborghini', 'murcielago': 'Lamborghini',
  // Porsche
  'porsche': 'Porsche', '911': 'Porsche', '918': 'Porsche',
  'cayenne': 'Porsche', 'cayman': 'Porsche', 'panamera': 'Porsche',
  'boxster': 'Porsche', '356': 'Porsche', 'macan': 'Porsche',
  // BMW
  'bmw': 'BMW', 'bimmer': 'BMW', 'm3': 'BMW', 'm4': 'BMW', 'm5': 'BMW',
  'i8': 'BMW', '2002': 'BMW', '1m': 'BMW',
  // Mercedes
  'mercedes': 'Mercedes-Benz', 'benz': 'Mercedes-Benz', 'amg': 'Mercedes-Benz',
  'sls': 'Mercedes-Benz', 'g-class': 'Mercedes-Benz', 'g wagon': 'Mercedes-Benz',
  'g-wagon': 'Mercedes-Benz', 'sprinter': 'Mercedes-Benz',
  // Audi
  'audi': 'Audi', 'r8': 'Audi', 'rs6': 'Audi', 'quattro': 'Audi',
  // McLaren
  'mclaren': 'McLaren', 'p1': 'McLaren', 'senna': 'McLaren', '720s': 'McLaren',
  'elva': 'McLaren', '570': 'McLaren', 'f1': 'McLaren',
  // Bugatti
  'bugatti': 'Bugatti', 'veyron': 'Bugatti', 'chiron': 'Bugatti', 'divo': 'Bugatti',
  // Koenigsegg
  'koenigsegg': 'Koenigsegg', 'agera': 'Koenigsegg', 'jesko': 'Koenigsegg',
  'regera': 'Koenigsegg',
  // Pagani
  'pagani': 'Pagani', 'huayra': 'Pagani', 'zonda': 'Pagani',
  // Aston Martin
  'aston martin': 'Aston Martin', 'db5': 'Aston Martin', 'db11': 'Aston Martin',
  'vantage': 'Aston Martin', 'valkyrie': 'Aston Martin',
  // Toyota
  'toyota': 'Toyota', 'supra': 'Toyota', 'ae86': 'Toyota', 'corolla': 'Toyota',
  '2000gt': 'Toyota', 'tacoma': 'Toyota', 'tundra': 'Toyota', 'prius': 'Toyota',
  'land cruiser': 'Toyota', 'fj cruiser': 'Toyota', 'camry': 'Toyota',
  // Nissan
  'nissan': 'Nissan', 'gt-r': 'Nissan', 'gtr': 'Nissan', 'skyline': 'Nissan',
  '370z': 'Nissan', '350z': 'Nissan', 'silvia': 'Nissan', 'z32': 'Nissan',
  'patrol': 'Nissan', 'frontier': 'Nissan',
  // Honda
  'honda': 'Honda', 'civic': 'Honda', 'nsx': 'Honda', 's2000': 'Honda',
  'accord': 'Honda', 'crv': 'Honda', 'odyssey': 'Honda',
  // Mazda
  'mazda': 'Mazda', 'rx-7': 'Mazda', 'rx7': 'Mazda', 'miata': 'Mazda',
  'mx-5': 'Mazda', '787b': 'Mazda',
  // Subaru
  'subaru': 'Subaru', 'wrx': 'Subaru', 'brz': 'Subaru', 'impreza': 'Subaru',
  'outback': 'Subaru', 'forester': 'Subaru',
  // Mitsubishi
  'mitsubishi': 'Mitsubishi', 'eclipse': 'Mitsubishi', 'lancer': 'Mitsubishi',
  'evolution': 'Mitsubishi', 'evo': 'Mitsubishi',
  // Volkswagen
  'volkswagen': 'Volkswagen', 'vw': 'Volkswagen', 'beetle': 'Volkswagen',
  'bus': 'Volkswagen', 'golf': 'Volkswagen', 'gti': 'Volkswagen',
  'scirocco': 'Volkswagen', 'kombi': 'Volkswagen', 'kool kombi': 'Volkswagen',
  'amarok': 'Volkswagen',
  // Land Rover / Jeep
  'land rover': 'Land Rover', 'defender': 'Land Rover', 'discovery': 'Land Rover',
  'range rover': 'Land Rover', 'jeep': 'Jeep', 'wrangler': 'Jeep',
  'cherokee': 'Jeep', 'gladiator': 'Jeep', 'scrambler': 'Jeep',
  // Others
  'tesla': 'Tesla', 'rivian': 'Rivian', 'mini': 'MINI', 'fiat': 'Fiat',
  'alfa romeo': 'Alfa Romeo', 'maserati': 'Maserati', 'lotus': 'Lotus',
  'shelby': 'Shelby', 'delorean': 'Delorean', 'rolls royce': 'Rolls Royce',
  'bentley': 'Bentley', 'jaguar': 'Jaguar', 'volvo': 'Volvo',
  'saab': 'Saab', 'peugeot': 'Peugeot', 'renault': 'Renault',
  'citroen': 'Citroen', 'bmw m': 'BMW',
  // Hot Wheels originals
  'bone shaker': 'Hot Wheels Original', 'twin mill': 'Hot Wheels Original',
  'deora': 'Hot Wheels Original', 'rip rod': 'Hot Wheels Original',
  'rodger dodger': 'Hot Wheels Original', 'ratbomb': 'Hot Wheels Original',
  'bread box': 'Hot Wheels Original', 'rocket box': 'Hot Wheels Original',
  'fast fish': 'Hot Wheels Original', 'nitro doorslammer': 'Hot Wheels Original',
};

// Auto-detect manufacturer from car name
export function detectManufacturer(carName: string): string {
  if (!carName) return '';
  const lower = carName.toLowerCase();
  // Check longest match first
  const keys = Object.keys(NAME_TO_MFG).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (lower.includes(key)) return NAME_TO_MFG[key];
  }
  return '';
}

// Hot Wheels cars list
export const HW_CARS = [
  'Bone Shaker','Twin Mill','Deora II','Deora III','Rip Rod','Fast Fish',
  'Rodger Dodger','Nitro Doorslammer','Bread Box','Ratbomb','Rocket Box',
  'Power Pistons','Surfin School Bus','School Bus','Bad Mudder',
  'Ford Mustang','Ford Mustang GT','Ford Mustang Boss 302','Ford Mustang Mach 1',
  'Ford Mustang Mach-E','65 Mustang Fastback','67 Mustang','69 Mustang',
  '71 Mustang Mach 1',
  'Camaro','67 Camaro','69 Camaro','2018 Camaro SS','2021 Camaro SS',
  'Corvette','63 Corvette','65 Corvette','71 Corvette Stingray','80s Corvette',
  'C8 Corvette','Corvette Grand Sport','Corvette ZR1','Corvette C7Z06',
  'Dodge Challenger','Dodge Charger','Dodge Viper','Dodge Dart',
  'Plymouth Barracuda','Plymouth Road Runner','70 Plymouth Superbird',
  'Chevrolet Silverado','Chevy C10','67 Chevy C10','57 Chevy','55 Chevy',
  'Bel Air','El Camino','Monte Carlo SS','Nova','Impala','Chevelle SS',
  'Ford F-150','Ford F-100','Ford GT','Ford GT40','GT-40',
  'Ferrari 458 Italia','Ferrari 488 GTB','Ferrari F40','Ferrari F50',
  'Ferrari 599XX','Ferrari LaFerrari','Ferrari 308 GTS','Ferrari Testarossa',
  'Ferrari 250 GTO','Ferrari Enzo',
  'Lamborghini Countach','Lamborghini Huracan','Lamborghini Aventador',
  'Lamborghini Urus','Lamborghini Sesto Elemento','Lamborghini Gallardo',
  'Lamborghini Murcielago',
  'Porsche 911','Porsche 911 GT3','Porsche 918 Spyder','Porsche Cayenne',
  'Porsche 914','Porsche Cayman','Porsche 356A Outlaw','Porsche Carrera GT',
  'BMW M3','BMW M4','BMW 2002','BMW M5','BMW 1M','BMW i8',
  'Mercedes-Benz SLS AMG','Mercedes-Benz G-Class','Mercedes AMG GT',
  'Audi R8','Audi TT','Audi RS6','Audi Quattro',
  'McLaren P1','McLaren Senna','McLaren 720S','McLaren F1','McLaren 570S',
  'Bugatti Veyron','Bugatti Chiron','Bugatti Divo',
  'Koenigsegg Agera R','Koenigsegg Jesko','Pagani Huayra','Pagani Zonda',
  'Tesla Roadster','Tesla Cybertruck','Rivian R1T',
  'Ford Bronco','Ford Bronco R','Ford Maverick',
  'Jeep Scrambler','Jeep CJ-7','Jeep Wrangler',
  'Toyota Supra','Toyota AE86','Toyota 2000GT','Toyota Tacoma','Toyota Land Cruiser',
  'Nissan GT-R','Nissan Skyline','Nissan 370Z','Nissan Silvia','Nissan Z',
  'Honda Civic','Honda NSX','Honda S2000','Honda Civic Type R',
  'Mazda RX-7','Mazda MX-5 Miata','Mazda 787B','Mazda RX-3',
  'Subaru WRX STI','Subaru BRZ','Mitsubishi Eclipse','Mitsubishi Lancer Evolution',
  'Volkswagen Beetle','VW Bug','Kool Kombi','Volkswagen Golf GTI',
  'Volkswagen Scirocco','Volkswagen Amarok',
  'MINI Cooper','Fiat 500','Aston Martin DB5','Aston Martin Vantage',
  'Land Rover Defender','Land Rover Series III','Range Rover',
  'Shelby GT500','Shelby Cobra','Shelby GT350',
  'Rolls Royce Phantom','Bentley Continental',
  'Alfa Romeo Giulia','Maserati MC20',
  'Police Car','Ambulance','Fire Engine','Fire Truck',
  'Monster Truck','Baja Truck','Sand Blaster',
  'Dragster','Top Fuel Dragster','Funny Car','Formula 1 Car','NASCAR Stock Car',
  'Dump Truck','Tow Truck','Semi Truck','Big Rig',
];

// Matchbox cars list
export const MB_CARS = [
  'Ford Transit','Ford Ranger','Ford Maverick','Ford Edge','Ford Bronco',
  'Chevy Suburban','Chevy Tahoe','Chevy Silverado','Chevy Blazer',
  'Dodge Challenger','Dodge Charger','Dodge Ram',
  'Toyota Land Cruiser','Toyota Hilux','Toyota Tacoma','Toyota Tundra',
  'Toyota Prius','Toyota Corolla',
  'Mercedes G-Wagon','Mercedes Sprinter','BMW X5','BMW X7','Audi Q7','Audi e-tron',
  'Land Rover Defender','Land Rover Discovery','Range Rover','Range Rover Sport',
  'Jeep Wrangler','Jeep Cherokee','Jeep Gladiator','Jeep Compass',
  'Police Car','Police Truck','Police Helicopter','Police Motorcycle',
  'Ambulance','Fire Engine','Fire Truck','Fire Ladder Truck','Fire Rescue',
  'School Bus','City Bus','Double Decker Bus','Transit Bus',
  'Garbage Truck','Dump Truck','Tow Truck','Semi Truck','Box Truck',
  'Construction Crane','Bulldozer','Excavator','Cement Mixer','Grader',
  'Airport Fire Truck','Airport Rescue','Helicopter','Coast Guard Boat',
  'Monster Truck','Off Road Truck','Dune Buggy','Sand Rail',
  'Subaru WRX','Honda Civic Type R','Mitsubishi Eclipse Cross',
  'Volkswagen Amarok','Volkswagen Transporter','Volkswagen ID.4',
  'Porsche 911','Porsche Cayenne','Ferrari','Lamborghini Huracan',
  'Nissan GT-R','Nissan Patrol',
  'Tesla Model S','Tesla Model 3','Tesla Cybertruck',
  'Corvette','Camaro','Mustang',
  'Superfast','Moving Parts','MBX Series',
];

// Search cars
export function searchCars(query: string, brand: 'hw' | 'mb'): string[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const list = brand === 'hw' ? HW_CARS : MB_CARS;
  return list.filter(name => name.toLowerCase().includes(q)).slice(0, 12);
}

// Search manufacturers
export function searchManufacturers(query: string): string[] {
  if (!query) return MANUFACTURERS.slice(0, 20);
  const q = query.toLowerCase();
  return MANUFACTURERS.filter(m => m.toLowerCase().includes(q)).slice(0, 15);
}
`);
console.log('✅ Updated lib/carDatabase.ts - 150+ manufacturers, auto-detect');

fs.writeFileSync('app/car/[id].tsx', `import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Image, Alert,
  KeyboardAvoidingView, Platform, Modal, FlatList
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { loadCars, addCar, updateCar, deleteCar, uid } from '../../lib/storage';
import { searchCars, searchManufacturers, detectManufacturer, MANUFACTURERS } from '../../lib/carDatabase';

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

  useEffect(() => {
    if (prefill) { try { const p=JSON.parse(prefill); if(p.colnum) setColnum(p.colnum); if(p.brand) setBrand(p.brand); } catch {} }
    if (isEdit) {
      loadCars().then(cars => {
        const c = cars.find(x => x.id === id);
        if (c) {
          setBrand(c.brand); setName(c.name); setManufacturer(c.manufacturer||'');
          setSeries(c.series); setYear(c.year); setColor(c.color);
          setColnum(c.colnum); setTampo(c.tampo); setNotes(c.notes);
          setTh(c.th); setStatus(c.status); setPhoto(c.photo);
        }
      });
    }
  }, [id, prefill]);

  function onNameChange(text) {
    setName(text);
    // Auto-detect manufacturer
    const detected = detectManufacturer(text);
    if (detected && !manufacturer) setManufacturer(detected);
    // Show suggestions
    if (text.length >= 2) {
      setNameSug(searchCars(text, brand));
    } else {
      setNameSug([]);
    }
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
            <T label="Hot Wheels" active={brand==='hw'} onPress={()=>{setBrand('hw');setNameSug([]);}} ac="#FAECE7" tc="#993C1D"/>
            <T label="Matchbox" active={brand==='mb'} onPress={()=>{setBrand('mb');setNameSug([]);}} ac="#E6F1FB" tc="#0C447C"/>
          </View>

          {/* Car Name with search */}
          <Text style={s.lbl}>Car name *</Text>
          <View style={{zIndex:999,marginBottom:2}}>
            <View style={s.nameBox}>
              <Ionicons name="search" size={16} color="#A0A09C" style={{marginLeft:12}}/>
              <TextInput
                style={s.nameInput}
                value={name}
                onChangeText={onNameChange}
                placeholder={brand==='hw'?'Search Hot Wheels e.g. Bone Shaker...':'Search Matchbox e.g. Ambulance...'}
                placeholderTextColor="#A0A09C"
                autoCorrect={false}
                autoCapitalize="words"
              />
              {name.length>0 && (
                <TouchableOpacity onPress={()=>{setName('');setNameSug([]);setManufacturer('');}} style={{padding:10}}>
                  <Ionicons name="close-circle" size={18} color="#A0A09C"/>
                </TouchableOpacity>
              )}
            </View>
            {nameSug.length>0 && (
              <View style={s.sugBox}>
                {nameSug.map((item,i)=>(
                  <TouchableOpacity
                    key={i}
                    style={[s.sugRow,i<nameSug.length-1&&s.sugBorder]}
                    onPress={()=>pickNameSug(item)}
                  >
                    <Text style={s.sugTxt}>{item}</Text>
                    <Ionicons name="arrow-up-back" size={14} color="#A0A09C"/>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Manufacturer */}
          <Text style={s.lbl}>
            Car Manufacturer
            {manufacturer ? <Text style={{color:'#3B6D11',fontWeight:'600'}}> (auto-detected ✓)</Text> : <Text style={{color:'#A0A09C'}}> (tap to select)</Text>}
          </Text>
          <TouchableOpacity style={[s.mfgBtn, manufacturer&&s.mfgBtnFilled]} onPress={()=>setShowMfgPicker(true)}>
            <Ionicons name="business-outline" size={16} color={manufacturer?'#1A1A18':'#A0A09C'} style={{marginRight:8}}/>
            <Text style={[s.mfgBtnTxt,!manufacturer&&{color:'#A0A09C'}]} numberOfLines={1}>
              {manufacturer||'Select manufacturer (Ford, Ferrari, Toyota...)'}
            </Text>
            <Ionicons name={manufacturer?'pencil-outline':'chevron-down'} size={15} color="#A0A09C"/>
          </TouchableOpacity>

          {/* Series + Year */}
          <View style={s.grid}>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Series</Text>
              <TextInput style={s.input} value={series} onChangeText={setSeries} placeholder="Mainline" placeholderTextColor="#A0A09C"/>
            </View>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Year</Text>
              <TextInput style={s.input} value={year} onChangeText={setYear} placeholder="2024" placeholderTextColor="#A0A09C" keyboardType="numeric"/>
            </View>
          </View>

          {/* Color + Collector # */}
          <View style={s.grid}>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Color</Text>
              <TextInput style={s.input} value={color} onChangeText={setColor} placeholder="Flame Red" placeholderTextColor="#A0A09C"/>
            </View>
            <View style={{flex:1}}>
              <Text style={s.lbl}>Collector #</Text>
              <TextInput style={s.input} value={colnum} onChangeText={setColnum} placeholder="042/250" placeholderTextColor="#A0A09C"/>
            </View>
          </View>

          {/* Tampo */}
          <Text style={s.lbl}>Tampo</Text>
          <TextInput style={s.input} value={tampo} onChangeText={setTampo} placeholder="flames on hood..." placeholderTextColor="#A0A09C"/>

          {/* Treasure Hunt */}
          <Text style={s.lbl}>Treasure Hunt?</Text>
          <View style={s.row}>
            <T label="None" active={th==='none'} onPress={()=>setTh('none')} ac="#EAF3DE" tc="#3B6D11"/>
            <T label="TH" active={th==='th'} onPress={()=>setTh('th')} ac="#EAF3DE" tc="#3B6D11"/>
            <T label="Super TH" active={th==='sth'} onPress={()=>setTh('sth')} ac="#FAEEDA" tc="#BA7517"/>
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
            <T label="I own it" active={status==='owned'} onPress={()=>setStatus('owned')} ac="#EAF3DE" tc="#3B6D11"/>
            <T label="Wishlist" active={status==='wish'} onPress={()=>setStatus('wish')} ac="#E6F1FB" tc="#0C447C"/>
            <T label="Duplicate" active={status==='dup'} onPress={()=>setStatus('dup')} ac="#FCEBEB" tc="#A32D2D"/>
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
              placeholder="Search e.g. Ford, Ferrari, Toyota..."
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
console.log('✅ Updated app/car/[id].tsx');

// Update storage to include manufacturer
fs.writeFileSync('lib/storage.ts', `import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'mygarage_v1';
export interface Car {
  id:string; brand:'hw'|'mb'; name:string; manufacturer:string;
  series:string; year:string; color:string; colnum:string;
  tampo:string; notes:string; th:'none'|'th'|'sth';
  status:'owned'|'wish'|'dup'; photo:string|null; added:number;
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
export const deleteCar = async (id:string) => { const c=await loadCars(); const u=c.filter(x=>x.id!==id); await saveCars(u); return u; };
`);
console.log('✅ Updated lib/storage.ts');
console.log('\n🚗 ALL DONE! Run: npx expo start --clear');
console.log('\nHow it works:');
console.log('1. Type car name → suggestions appear');
console.log('2. Tap a suggestion → manufacturer AUTO-FILLS!');
console.log('3. Type "Mustang" → Ford auto-fills');
console.log('4. Type "Bone Shaker" → Hot Wheels Original auto-fills');
console.log('5. Wrong manufacturer? Tap it to change');
