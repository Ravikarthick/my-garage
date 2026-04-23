#!/usr/bin/env node
const fs = require('fs');

let db = fs.readFileSync('lib/carDatabase.ts', 'utf8');

// Add Datsun to MANUFACTURERS
db = db.replace(
  "'Daihatsu','Delorean'",
  "'Daihatsu','Datsun','Delorean'"
);

// Add Datsun to NAME_TO_MFG detector
db = db.replace(
  "  // Barbie\n  'barbie': 'Mattel',",
  `  // Datsun
  'datsun': 'Datsun', '510': 'Datsun', 'bluebird': 'Datsun',
  '240z': 'Datsun', '260z': 'Datsun', '280z': 'Datsun',
  'datsun 510': 'Datsun', 'datsun 240z': 'Datsun',
  // Barbie
  'barbie': 'Mattel',`
);

// Add Datsun cars to HW_CARS list
db = db.replace(
  "'Dragster','Top Fuel Dragster'",
  `'Datsun 240Z','Datsun 260Z','Datsun 280Z',
  'Datsun 510','Datsun 510 Bluebird',
  'Datsun Bluebird Wagon','Datsun 620 Pickup',
  'Datsun 1600 Roadster','Datsun B210','Datsun Fairlady',
  'Dragster','Top Fuel Dragster'`
);

fs.writeFileSync('lib/carDatabase.ts', db);
console.log('✅ Datsun added!');
console.log('Run: npx expo start --clear');
