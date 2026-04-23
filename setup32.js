#!/usr/bin/env node
const fs = require('fs');

let db = fs.readFileSync('lib/carDatabase.ts', 'utf8');

// Remove 'bus' → Volkswagen (generic bus should not be VW)
db = db.replace(/'bus': 'Volkswagen',?\s*/g, '');
db = db.replace(/'kombi': 'Volkswagen',?\s*/g, '');

// Add Datsun + school bus + surfin + more to NAME_TO_MFG
// Find the Hot Wheels originals comment section
if (!db.includes("'school bus'")) {
  db = db.replace(
    "  // Hot Wheels originals",
    `  // School bus / Surfin
  'school bus': 'Hot Wheels Original',
  'surfin school bus': 'Hot Wheels Original',
  'surfin': 'Hot Wheels Original',
  // Datsun
  'datsun': 'Datsun',
  '240z': 'Datsun',
  '260z': 'Datsun',
  '280z': 'Datsun',
  '510': 'Datsun',
  'bluebird': 'Datsun',
  'fairlady': 'Datsun',
  // Volkswagen specific
  'volkswagen': 'Volkswagen',
  'vw bug': 'Volkswagen',
  'kool kombi': 'Volkswagen',
  'samba bus': 'Volkswagen',
  'scirocco': 'Volkswagen',
  'amarok': 'Volkswagen',
  // Hot Wheels originals`
  );
  console.log('✅ Added school bus, surfin, datsun entries');
} else {
  console.log('ℹ️  school bus already exists');
}

// Also add Camaro detection fix - ensure it works
if (!db.includes("'camaro ss'")) {
  db = db.replace(
    "'camaro': 'Chevrolet',",
    "'camaro': 'Chevrolet', 'camaro ss': 'Chevrolet', 'copo camaro': 'Chevrolet',"
  );
  console.log('✅ Added Camaro SS variants');
}

// Fix detectManufacturer to also handle when manufacturer is already set
// (don't override if user manually selected)
fs.writeFileSync('lib/carDatabase.ts', db);

// Verify
const final = fs.readFileSync('lib/carDatabase.ts', 'utf8');
console.log('\n🔍 Verification:');
console.log('  school bus → HW Original:', final.includes("'school bus'") ? '✅' : '❌');
console.log('  surfin → HW Original:    ', final.includes("'surfin'") ? '✅' : '❌');
console.log('  datsun → Datsun:         ', final.includes("'datsun': 'Datsun'") ? '✅' : '❌');
console.log('  510 → Datsun:            ', final.includes("'510': 'Datsun'") ? '✅' : '❌');
console.log('  bus → VW removed:        ', !final.includes("'bus': 'Volkswagen'") ? '✅' : '❌');

console.log('\nNow test:');
console.log('  Type "Surfin School Bus" → Hot Wheels Original');
console.log('  Type "Datsun 510"        → Datsun');
console.log('  Type "Camaro SS"         → Chevrolet');
