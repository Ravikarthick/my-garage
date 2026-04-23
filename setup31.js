#!/usr/bin/env node
const fs = require('fs');

let db = fs.readFileSync('lib/carDatabase.ts', 'utf8');

// Show first 50 lines of DETECT_MAP to understand structure
const detectStart = db.indexOf('DETECT_MAP');
const detectSnippet = db.slice(detectStart, detectStart + 500);
console.log('DETECT_MAP structure:');
console.log(detectSnippet);
console.log('...\n');

// Find where to insert - look for any HW Original entry
const hwOriginalIdx = db.indexOf('Hot Wheels Original');
if (hwOriginalIdx === -1) {
  console.log('❌ No Hot Wheels Original entry found!');
  console.log('Adding at start of DETECT_MAP...');
  
  // Find DETECT_MAP array start
  const mapStart = db.indexOf(']: [string, string][] = [');
  if (mapStart !== -1) {
    const insertAt = db.indexOf('[', mapStart + 20);
    db = db.slice(0, insertAt) + 
      `['surfin school', 'Hot Wheels Original'],
  ['school bus',    'Hot Wheels Original'],
  ['surfin',        'Hot Wheels Original'],
  ` + db.slice(insertAt);
    console.log('✅ Inserted at start of DETECT_MAP');
  }
} else {
  // Find the line with Hot Wheels Original and add before it
  const lines = db.split('\n');
  const hwOrigLine = lines.findIndex(l => l.includes("'Hot Wheels Original'") && l.includes('['));
  if (hwOrigLine !== -1) {
    lines.splice(hwOrigLine, 0, 
      `  ['surfin school', 'Hot Wheels Original'],`,
      `  ['school bus',    'Hot Wheels Original'],`,
      `  ['surfin',        'Hot Wheels Original'],`
    );
    db = lines.join('\n');
    console.log('✅ Added before existing Hot Wheels Original entry at line', hwOrigLine);
  }
}

// Also remove any 'bus' → VW mapping
const before = db;
db = db.replace(/\['bus',\s*'Volkswagen'\],?\n?/g, '');
if (db !== before) console.log('✅ Removed bus→Volkswagen mapping');

fs.writeFileSync('lib/carDatabase.ts', db);

// Verify
const final = fs.readFileSync('lib/carDatabase.ts', 'utf8');
console.log('\n🔍 Verification:');
console.log('  surfin→HW Original:', final.includes("'surfin'") ? '✅' : '❌');
console.log('  school bus→HW Original:', final.includes("'school bus'") ? '✅' : '❌');
console.log('  bus→VW removed:', !final.includes("'bus',  'Volkswagen'") && !final.includes("'bus', 'Volkswagen'") ? '✅' : '❌');
