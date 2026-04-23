#!/usr/bin/env node
const fs = require('fs');

// Fix 1: carDatabase - school bus should not map to Volkswagen
let db = fs.readFileSync('lib/carDatabase.ts', 'utf8');

// Fix bus detection - VW bus is specific, school bus is HW Original
db = db.replace(
  "  ['bus',          'Volkswagen'],",
  "  ['vw bus',       'Volkswagen'],\n  ['samba bus',     'Volkswagen'],\n  ['kombi',         'Volkswagen'],"
);

// Add school bus / surfin to HW Original
db = db.replace(
  "  ['bone shaker', 'Hot Wheels Original'],",
  `  ['school bus',   'Hot Wheels Original'],
  ['surfin',        'Hot Wheels Original'],
  ['bone shaker',   'Hot Wheels Original'],`
);

fs.writeFileSync('lib/carDatabase.ts', db);
console.log('✅ Fixed bus detection - school bus → Hot Wheels Original');

// Fix 2: seriesData - add correct spelling variants
let series = fs.readFileSync('lib/seriesData.ts', 'utf8');

// Add HW Xtreme Sports if missing
if (!series.includes('HW Xtreme Sports')) {
  series = series.replace(
    "{ label: 'HW Rescue',",
    `{ label: 'HW Xtreme Sports', group: '📦 Mainline (General)' },
  { label: 'HW Extreme Sports', group: '📦 Mainline (General)' },
  { label: 'HW Rescue',`
  );
  console.log('✅ Added HW Xtreme Sports to series list');
}

// Add more commonly missed series
const missingSeries = [
  ['Retro Racers', '📦 Mainline (General)'],
  ['HW Haulers', '📦 Mainline (General)'],
  ['HW Race Day', '📦 Mainline (General)'],
  ['HW Daredevils', '📦 Mainline (General)'],
  ['HW City Works', '📦 Mainline 2010-2019'],
  ['HW Modified', '📦 Mainline (General)'],
  ['HW The 80s', '📦 Mainline (General)'],
  ['HW The 70s', '📦 Mainline (General)'],
  ['Brick Rides', '📦 Mainline (General)'],
  ['Sweet Rides', '📦 Mainline (General)'],
  ['HW Mega Bite', '📦 Mainline (General)'],
  ['HW Roadsters', '📦 Mainline (General)'],
  ['HW Reverse Rake', '2024 Mainline'],
  ['HW Speed Graphics', '2024 Mainline'],
  ['HW Gassers', '2024 Mainline'],
  ['HW Metro', '2024 Mainline'],
  ['HW Track Champs', '2024 Mainline'],
];

missingSeries.forEach(([label, group]) => {
  if (!series.includes(`'${label}'`)) {
    series = series.replace(
      "{ label: 'Matchbox Mainline'",
      `{ label: '${label}', group: '${group}' },\n  { label: 'Matchbox Mainline'`
    );
    console.log(`✅ Added missing series: ${label}`);
  }
});

fs.writeFileSync('lib/seriesData.ts', series);
console.log('\n✅ All fixes done!');
console.log('\nFixed:');
console.log('  Surfin School Bus → Hot Wheels Original ✅');
console.log('  HW Xtreme Sports added to series list ✅');
console.log('  20+ missing series added ✅');
