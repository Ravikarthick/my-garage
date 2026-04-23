#!/usr/bin/env node
const fs = require('fs');

let content = fs.readFileSync('lib/carDatabase.ts', 'utf8');

// Check if Datsun is already in MANUFACTURERS
if (!content.includes("'Datsun'")) {
  content = content.replace(
    "'Daihatsu','Honda'",
    "'Daihatsu','Datsun','Honda'"
  );
  console.log('✅ Added Datsun to MANUFACTURERS list');
} else {
  console.log('ℹ️  Datsun already in MANUFACTURERS');
}

// Check if Datsun is in DETECT_MAP
if (!content.includes("['datsun'")) {
  content = content.replace(
    "  ['nissan',      'Nissan'],",
    `  ['nissan',      'Nissan'],
  ['datsun',      'Datsun'],
  ['240z',        'Datsun'],
  ['260z',        'Datsun'],
  ['280z',        'Datsun'],
  ['510',         'Datsun'],
  ['bluebird',    'Datsun'],
  ['fairlady',    'Datsun'],`
  );
  console.log('✅ Added Datsun to detection map');
} else {
  console.log('ℹ️  Datsun already in detection map');
}

// Check if Datsun cars are in HW_CARS
if (!content.includes('"Datsun 240Z"')) {
  content = content.replace(
    '"Nissan GT-R"',
    `"Datsun 240Z", "Datsun 260Z", "Datsun 280Z",
  "Datsun 510", "Datsun 510 Bluebird",
  "Datsun 620 Pickup", "Datsun Bluebird Wagon",
  "Datsun 1600 Roadster", "Datsun Fairlady",
  "Nissan GT-R"`
  );
  console.log('✅ Added Datsun cars to search list');
} else {
  console.log('ℹ️  Datsun cars already in list');
}

fs.writeFileSync('lib/carDatabase.ts', content);

// Verify
const final = fs.readFileSync('lib/carDatabase.ts', 'utf8');
console.log('\n🔍 Verification:');
console.log('  Datsun in MANUFACTURERS:', final.includes("'Datsun'") ? '✅' : '❌');
console.log('  Datsun in DETECT_MAP:   ', final.includes("['datsun'") ? '✅' : '❌');
console.log('  Datsun 240Z in cars:    ', final.includes('"Datsun 240Z"') ? '✅' : '❌');
console.log('\nDone! Test by typing "Datsun 510" in the Add Car form.');
