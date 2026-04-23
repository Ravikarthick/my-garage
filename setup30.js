#!/usr/bin/env node
const fs = require('fs');

let db = fs.readFileSync('lib/carDatabase.ts', 'utf8');

// Show what bus-related entries exist
const lines = db.split('\n');
const busLines = lines.filter(l => l.toLowerCase().includes('bus'));
console.log('Current bus-related entries:');
busLines.forEach(l => console.log(' ', l.trim()));

// Remove any generic 'bus' → Volkswagen mapping
db = db.replace(/\s*\['bus',\s*'Volkswagen'\],/g, '');
db = db.replace(/\s*'bus':\s*'Volkswagen',/g, '');

// Make sure school bus and surfin → HW Original
if (!db.includes("'school bus'")) {
  db = db.replace(
    "['bone shaker'",
    "['school bus',  'Hot Wheels Original'],\n  ['surfin school','Hot Wheels Original'],\n  ['surfin',       'Hot Wheels Original'],\n  ['bone shaker'"
  );
}

// VW bus should only match specific VW terms
if (!db.includes("['vw bus'")) {
  db = db.replace(
    "['volkswagen'",
    "['vw bus',      'Volkswagen'],\n  ['samba',        'Volkswagen'],\n  ['volkswagen'"
  );
}

fs.writeFileSync('lib/carDatabase.ts', db);

// Verify
const final = fs.readFileSync('lib/carDatabase.ts', 'utf8');
console.log('\n✅ Verification:');
console.log('  Generic bus→VW removed:', !final.includes("'bus',  'Volkswagen'") ? '✅' : '❌');
console.log('  School bus→HW Original:', final.includes("'school bus'") ? '✅' : '❌');
console.log('  Surfin→HW Original:    ', final.includes("'surfin'") ? '✅' : '❌');
console.log('\nSurfin School Bus → should now show Hot Wheels Original ✅');
