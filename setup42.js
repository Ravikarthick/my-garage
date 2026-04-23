#!/usr/bin/env node
const fs = require('fs');

// ── 1. Update HW_CARS with 300+ names ──────────────────────────────────────
let db = fs.readFileSync('lib/carDatabase.ts', 'utf8');

const newCars = [
  // 2026
  'Ford Mustang GTD','Ferrari 296 GTB','Porsche 911 GT3 R 992',
  'Nightspeed','Fiat Beast of Turin','Purple Passion','Dino 206 GT',
  'Ford F-150 Lightning SuperTruck','BMW M3 Wagon','Polester TRX',
  'Triumph TR6','1983 Porsche 928S','Drop Tops','X-Raycers',
  'Exoticars','HW Heavyweights','HW Euro','HW Drag Racers',
  'Layin Low','Truckin Along',
  // 2025
  'Volvo P1800 Gasser','87 Ford Sierra Cosworth',
  'Classic TV Series Batmobile','Ford Escort RS2000',
  'Dimachinni Veloce','HW KITT Concept',
  'Nissan Patrol Custom','1970 Pontiac Firebird',
  '17 Pagani Huayra Roadster','Corvette Grand Sport Roadster',
  '85 Honda City Turbo II','Morgan Super 3',
  '68 Corvette Gas Monkey Garage',
  // 2024
  'Mazda Autozam','Back to the Future Time Machine Hover Mode',
  '70 Plymouth Barracuda','Fiat 500e',
  '2020 Ram 1500 Rebel','Porsche 911 Carrera RS 2.7',
  '72 Stingray Convertible','Honda Civic Si',
  'Nissan Skyline RS KDR30','57 Jeep FC',
  '15 Mazda MX-5 Miata','McLaren Solus GT',
  '87 Dodge D100','55 Chevy Bel Air Gasser',
  '18 Camaro SS','Custom 68 Camaro',
  '89 Mercedes-Benz 560 SEC AMG','76 Greenwood Corvette',
  'Ford GT40','Czinger 21C','Volvo XC40 Recharge','Tesla Model Y',
  'Audi RS e-tron GT','Ford F-150 Lightning Custom',
  'GMC Hummer EV','Corvette C6','BMW 507',
  '47 Chevy Fleetline','19 Ford Ranger Raptor',
  '07 Chevy Tahoe','Mad Mike Drift Attack',
  'El Segundo Coupe','Mod Speeder','Lolux',
  // Ford
  'Ford Mustang','Ford Mustang GT','Ford Mustang Boss 302',
  'Ford Mustang Mach 1','Ford Mustang GTD',
  '65 Ford Mustang Fastback','67 Ford Mustang','69 Ford Mustang',
  'Ford GT','Ford GT Heritage Edition','Ford Bronco','Ford Bronco R',
  'Ford Escort RS2000','Shelby GT500','Shelby Cobra 427',
  // Chevrolet
  'Camaro','67 Camaro','69 Camaro','COPO Camaro',
  'Corvette','Corvette C8.R','Corvette Grand Sport',
  '62 Corvette','63 Corvette',
  'Chevelle SS','70 Chevelle SS',
  'El Camino','68 El Camino','71 El Camino',
  '55 Chevy Bel Air Gasser','57 Chevy',
  'Nova','64 Nova Gasser',
  // Dodge Plymouth
  'Dodge Challenger','70 Dodge Challenger',
  'Dodge Charger','69 Dodge Charger','70 Charger',
  '69 Charger Daytona','Dodge Viper SRT','Dodge Dart',
  '71 Dodge Dart','87 Dodge D100',
  'Plymouth Barracuda','70 Plymouth Barracuda',
  'Plymouth Road Runner','Plymouth Superbird',
  // Pontiac AMC
  '1970 Pontiac Firebird','67 Pontiac Firebird',
  '77 Trans Am','Pontiac GTO',
  '71 AMC Javelin AMX','AMC Gremlin',
  // Ferrari
  'Ferrari 296 GTB','Ferrari 458 Italia','Ferrari 488 GTB',
  'Ferrari F40','Ferrari F50','Ferrari LaFerrari',
  'Ferrari 308 GTS','Ferrari Testarossa','Ferrari 250 GTO',
  'Ferrari Enzo','Ferrari 812 Superfast','Ferrari SF90 Stradale',
  'Dino 206 GT',
  // Lamborghini
  'Lamborghini Countach','Lamborghini Huracan',
  'Lamborghini Huracan STO','Lamborghini Aventador',
  'Lamborghini Urus','Lamborghini Sesto Elemento',
  'Lamborghini Gallardo','Lamborghini Diablo',
  'LB Super Silhouette Nissan Silvia S15',
  // Porsche
  'Porsche 911','Porsche 911 GT3','Porsche 911 GT3 RS',
  'Porsche 918 Spyder','Porsche 911 Carrera RS 2.7',
  'Porsche 914','Porsche 935','Porsche 962',
  'Porsche 356A Outlaw','Porsche Carrera GT',
  '1983 Porsche 928S',
  // BMW Mercedes Audi
  'BMW M3','BMW M4','BMW M5','BMW 507','BMW 2002','BMW i8',
  'BMW M3 Wagon',
  'Mercedes-Benz SLS AMG','Mercedes AMG GT',
  'Mercedes-Benz 300 SL','89 Mercedes-Benz 560 SEC AMG',
  'Audi R8','Audi RS e-tron GT','Audi RS 6 Avant',
  // McLaren Bugatti Pagani
  'McLaren P1','McLaren Senna','McLaren 720S','McLaren Solus GT',
  'Bugatti Veyron','Bugatti Chiron','Bugatti Divo',
  'Koenigsegg Agera R','Koenigsegg Jesko',
  '17 Pagani Huayra Roadster','Pagani Zonda Cinque',
  'Czinger 21C','Rimac Nevera',
  // Aston Martin
  'Aston Martin DB5','Aston Martin Vantage',
  'Aston Martin Valkyrie',
  // Toyota
  'Toyota Supra','82 Toyota Supra','21 Toyota GR Supra',
  'Toyota AE86','Toyota AE86 Trueno','Toyota AE86 Levin',
  'Toyota 2000GT','Toyota Celica TA22',
  'Toyota Tacoma','Toyota Land Cruiser',
  'Toyota GR Yaris','Toyota GR86','Toyota MR2',
  // Nissan Datsun
  'Nissan GT-R','Nissan Skyline GT-R BNR32',
  'Nissan Skyline RS KDR30','Nissan 370Z',
  'Nissan Silvia S15','Nissan 240SX','Nissan 180SX',
  'Nissan Patrol Custom','Nissan Fairlady Z','Nissan Z',
  'Datsun 240Z','Datsun 260Z','Datsun 280Z',
  'Datsun 510','Datsun 510 Bluebird',
  'Datsun 620 Pickup','Datsun Bluebird Wagon',
  // Honda
  'Honda Civic','Honda Civic Type R','Honda Civic Si',
  '90 Honda Civic EF','Honda NSX','Honda S2000',
  'Honda CR-X','Honda Prelude','Honda CB750 Cafe',
  '85 Honda City Turbo II','Honda S660',
  // Mazda Subaru Mitsubishi
  'Mazda RX-7','93 Mazda RX-7','95 Mazda RX-7',
  'Mazda RX-3','15 Mazda MX-5 Miata','Mazda 787B','Mazda Autozam',
  'Subaru WRX STI','Subaru BRZ','Subaru Impreza WRC','Subaru BRAT',
  'Mitsubishi Eclipse','Mitsubishi Lancer Evolution',
  'Mitsubishi 3000GT VR-4','Mitsubishi Starion',
  // VW Jeep Land Rover
  'Volkswagen Beetle','VW Bug','Volkswagen Golf GTI',
  'Kool Kombi','Volkswagen T2 Pickup','Volkswagen Samba Bus',
  'Jeep Scrambler','Jeep CJ-7','Jeep Wrangler','57 Jeep FC',
  'Land Rover Defender','Range Rover',
  // EV
  'Tesla Roadster','Tesla Cybertruck','Tesla Model Y',
  'GMC Hummer EV','Volvo XC40 Recharge','Fiat 500e','Rivian R1T',
  // HW Originals
  'Bone Shaker','Twin Mill','Deora II','Deora III',
  'Rip Rod','Fast Fish','Rodger Dodger',
  'El Segundo Coupe','Bread Box','Ratbomb',
  'Custom Otto','Mod Speeder','Lolux','Punk Rod',
  'Surfin School Bus','Road Bandit','Drift n Break',
  'Hot Wheels High','Knight Draggin',
  'Group C Fantasy','West Coast Flyer',
  // Entertainment
  'Batmobile','Classic TV Series Batmobile',
  'Batmobile Dark Knight','Batman Tumbler',
  'Back to the Future Time Machine',
  'Back to the Future Time Machine Hover Mode',
  'HW KITT Concept','Ghostbusters Ecto-1',
  'Barbie Corvette','1956 Corvette Barbie The Movie',
  'TMNT Party Wagon',
];

// Add any missing cars to HW_CARS
let addedCars = 0;
newCars.forEach(car => {
  if (!db.includes("'" + car + "'") && !db.includes('"' + car + '"')) {
    db = db.replace(
      "'Bone Shaker'",
      "'" + car + "',\n  'Bone Shaker'"
    );
    addedCars++;
  }
});

fs.writeFileSync('lib/carDatabase.ts', db);
console.log('✅ Added ' + addedCars + ' new car names to database');

// ── 2. Update series data ───────────────────────────────────────────────────
let series = fs.readFileSync('lib/seriesData.ts', 'utf8');

const newSeries = [
  ['Nightspeed','2026 Mainline'],['Drop Tops','2026 Mainline'],
  ['X-Raycers','2026 Mainline'],['HW Starting Grid','2026 Mainline'],
  ['Exoticars','2026 Mainline'],['HW Heavyweights','2026 Mainline'],
  ['HW Euro','2026 Mainline'],['HW Drag Racers','2026 Mainline'],
  ['Factory Fresh','2026 Mainline'],['Layin Low','2026 Mainline'],
  ['Truckin Along','2026 Mainline'],['Ferrari Series','2026 Mainline'],
  ['Mattel Series','2026 Mainline'],
  ['HW First Response','2025 Mainline'],['HW Designed By','2025 Mainline'],
  ['HW Metro','2025 Mainline'],['HW Ride-Ons','2025 Mainline'],
  ['HW J-Imports','2025 Mainline'],['HW Celebration Racers','2025 Mainline'],
  ['Fast Foodie','2025 Mainline'],['HW EV','2025 Mainline'],
  ['Track Aces','2025 Mainline'],['Compact Kings','2025 Mainline'],
  ['HW Moto','2025 Mainline'],['Wild Widebody','2025 Mainline'],
  ['HW Track Champs','2025 Mainline'],['HW Dream Garage','2025 Mainline'],
  ['HW Art Cars','2025 Mainline'],['HW Screen Time','2025 Mainline'],
  ['HW Exotics','2025 Mainline'],['HW Modified','2025 Mainline'],
  ['Experimotors','2025 Mainline'],['HW Xtreme Sports','2025 Mainline'],
  ['HW Mega Bite','2025 Mainline'],['HW Roadsters','2025 Mainline'],
  ['HW Hot Trucks','2025 Mainline'],['Rod Squad','2025 Mainline'],
  ['Then and Now','2025 Mainline'],['Muscle Mania','2025 Mainline'],
  ['HW Dirt','2025 Mainline'],['Retro Racers','2025 Mainline'],
  ['HW The 80s','2025 Mainline'],['HW The 70s','2025 Mainline'],
  ['Brick Rides','2025 Mainline'],['Sweet Rides','2025 Mainline'],
  ['HW Turbo','2025 Mainline'],['HW Haulers','2025 Mainline'],
  ['HW Race Day','2025 Mainline'],['HW Green Speed','2025 Mainline'],
  ['HW Fast Transit','2025 Mainline'],['HW Fan Driven','2025 Mainline'],
  ['Target Exclusive','2025 Mainline'],['Mustang 60th','2025 Mainline'],
  ['Car Culture - Japan Historics 4','2025 Premium'],
  ['Car Culture - Modern Classics','2025 Premium'],
  ['Car Culture - Slide Street 2','2025 Premium'],
  ['Car Culture - Aerostyles','2025 Premium'],
  ['Car Culture - Drag Strip Demons','2025 Premium'],
  ['Car Culture - Wild Terrain','2025 Premium'],
  ['Car Culture - Ultra Hots','2025 Premium'],
  ['Pop Culture - Barbie','2025 Premium'],
  ['Pop Culture - Batman','2025 Premium'],
  ['Pop Culture - Fast and Furious','2025 Premium'],
  ['Pop Culture - Mario Kart','2025 Premium'],
  ['Pop Culture - Star Wars','2025 Premium'],
];

let addedSeries = 0;
newSeries.forEach(([label, group]) => {
  if (!series.includes("'" + label + "'")) {
    series = series.replace(
      "{ label: 'Matchbox Mainline'",
      "{ label: '" + label + "', group: '" + group + "' },\n  { label: 'Matchbox Mainline'"
    );
    addedSeries++;
  }
});

fs.writeFileSync('lib/seriesData.ts', series);
console.log('✅ Added ' + addedSeries + ' new series');

// ── 3. Better photo quality ─────────────────────────────────────────────────
let form = fs.readFileSync('app/car/[id].tsx', 'utf8');

form = form.replace(/resize:\{width:300\}/g, 'resize:{width:600}');
form = form.replace(/compress:0\.6/g, 'compress:0.85');
console.log('✅ Photo quality improved');

// ── 4. Add OCR Scan Card button ─────────────────────────────────────────────
if (!form.includes('Scan Card')) {
  // Add ocrLoading state
  form = form.replace(
    "  const [showMfg, setShowMfg]     = useState(false);",
    "  const [showMfg, setShowMfg]     = useState(false);\n  const [ocrLoading, setOcrLoading] = useState(false);"
  );

  // Add OCR function
  const ocrFn = `
  async function readCardWithCamera() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Camera permission needed'); return; }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 1.0, base64: true });
      if (result.canceled || !result.assets[0].base64) return;
      setOcrLoading(true);
      const base64 = result.assets[0].base64;
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
              { type: 'text', text: 'This is a Hot Wheels or Matchbox diecast car card. Read the car name. Reply ONLY with JSON: {"name":"car name","series":"series if visible","year":"year if visible","colnum":"like 4/5 if visible"}. Empty string if not visible.' }
            ]
          }]
        })
      });
      const data = await response.json();
      const txt = (data && data.content && data.content[0] && data.content[0].text) || '';
      const clean = txt.replace(/json|/g, '').trim();
      const parsed = JSON.parse(clean);
      if (parsed.name) { setName(parsed.name); const d = detectManufacturer(parsed.name); if (d) setMfg(d); }
      if (parsed.series) setSeries(parsed.series);
      if (parsed.year) setYear(parsed.year);
      if (parsed.colnum) setColnum(parsed.colnum);
      Alert.alert('Done!', 'Card read! Check fields and adjust if needed.');
    } catch(e) {
      Alert.alert('Could not read card', 'Try again with better lighting.');
    } finally {
      setOcrLoading(false);
    }
  }
`;

  form = form.replace(
    '  function onNameChange(text) {',
    ocrFn + '\n  function onNameChange(text) {'
  );

  // Add scan button
  form = form.replace(
    "          {/* Car Name with auto-suggest */}\n          <Text style={s.lbl}>Car name *</Text>",
    `          {/* Car Name with auto-suggest */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, marginTop: 6 }}>
            <Text style={[s.lbl, { marginBottom: 0, marginTop: 0 }]}>Car name *</Text>
            <TouchableOpacity
              onPress={readCardWithCamera}
              disabled={ocrLoading}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: ocrLoading ? '#ccc' : '#185FA5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 }}
            >
              <Ionicons name={ocrLoading ? 'hourglass-outline' : 'camera-outline'} size={14} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{ocrLoading ? 'Reading...' : 'Scan Card'}</Text>
            </TouchableOpacity>
          </View>`
  );
  console.log('✅ Scan Card OCR button added');
} else {
  console.log('ℹ️  Scan Card already exists');
}

fs.writeFileSync('app/car/[id].tsx', form);

console.log('\n✅ ALL DONE!');
console.log('\nNow build for TestFlight:');
console.log('  eas build --platform ios --profile preview');
