#!/usr/bin/env node
const fs = require('fs');

let content = fs.readFileSync('lib/carDatabase.ts', 'utf8');

// Find DETECT_MAP and check what's there
const hasDetectMap = content.includes('DETECT_MAP');
const hasDatsunDetect = content.includes("'datsun'");
const hasDatsunMfg = content.includes("'Datsun'");
const hasDatsunCars = content.includes('"Datsun 240Z"');

console.log('Current state:');
console.log('  DETECT_MAP exists:', hasDetectMap ? '✅' : '❌');
console.log('  Datsun in detection:', hasDatsunDetect ? '✅' : '❌');
console.log('  Datsun in manufacturers:', hasDatsunMfg ? '✅' : '❌');
console.log('  Datsun cars in list:', hasDatsunCars ? '✅' : '❌');

let changed = false;

// Fix 1: Add Datsun to MANUFACTURERS if missing
if (!hasDatsunMfg) {
  content = content.replace(
    "'Daihatsu',",
    "'Daihatsu','Datsun',"
  );
  console.log('✅ Added Datsun to MANUFACTURERS');
  changed = true;
}

// Fix 2: Add Datsun to DETECT_MAP if missing
if (!hasDatsunDetect && hasDetectMap) {
  // Add after nissan entry
  content = content.replace(
    "  ['nissan',",
    `  ['datsun',      'Datsun'],
  ['240z',        'Datsun'],
  ['260z',        'Datsun'],
  ['280z',        'Datsun'],
  ['510',         'Datsun'],
  ['bluebird',    'Datsun'],
  ['fairlady',    'Datsun'],
  ['nissan',`
  );
  console.log('✅ Added Datsun to DETECT_MAP');
  changed = true;
}

// Fix 3: Add Datsun cars if missing
if (!hasDatsunCars) {
  content = content.replace(
    '"Nissan GT-R"',
    `"Datsun 240Z","Datsun 260Z","Datsun 280Z",
  "Datsun 510","Datsun 510 Bluebird",
  "Datsun 620 Pickup","Datsun Bluebird Wagon",
  "Datsun 1600 Roadster","Datsun Fairlady",
  "Nissan GT-R"`
  );
  console.log('✅ Added Datsun cars to search list');
  changed = true;
}

if (changed) {
  fs.writeFileSync('lib/carDatabase.ts', content);
  console.log('\n✅ File saved!');
} else {
  console.log('\nℹ️  No changes needed');
}

// Final verification
const final = fs.readFileSync('lib/carDatabase.ts', 'utf8');
console.log('\n🔍 Final verification:');
console.log('  Datsun in MANUFACTURERS:', final.includes("'Datsun'") ? '✅' : '❌');
console.log('  Datsun in DETECT_MAP:   ', final.includes("['datsun'") ? '✅' : '❌');
console.log('  Datsun 240Z in cars:    ', final.includes('"Datsun 240Z"') ? '✅' : '❌');
console.log('\nType "Datsun 510" in Add Car → should auto-fill Datsun 🚗');
