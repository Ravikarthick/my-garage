const fs = require('fs');
let f = fs.readFileSync('lib/seriesData.ts', 'utf8');

// Fix the corrupted list.map link
f = f.replace(
  /\[list\.map\]\([^)]*\)/g,
  'list.map'
);

fs.writeFileSync('lib/seriesData.ts', f);
console.log('Fixed corrupted list.map!');

// Verify fix
const check = fs.readFileSync('lib/seriesData.ts', 'utf8');
if (check.includes('[list.map]')) {
  console.log('ERROR: Still corrupted!');
} else {
  console.log('Verified clean!');
}
