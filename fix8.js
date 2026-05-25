const fs = require('fs');
let f = fs.readFileSync('app/(tabs)/index.tsx', 'utf8');

const before = f.length;

// Remove markdown link corruption
f = f.replace(/\[allMfgs\.map\]\(http:\/\/allMfgs\.map\)/g, 'allMfgs.map');
f = f.replace(/\[allSeries\.map\]\(http:\/\/allSeries\.map\)/g, 'allSeries.map');

const after = f.length;
console.log('Removed ' + (before - after) + ' characters of corruption');

fs.writeFileSync('app/(tabs)/index.tsx', f);

// Verify
const check = fs.readFileSync('app/(tabs)/index.tsx', 'utf8');
if (check.includes('[allMfgs.map](') || check.includes('[allSeries.map](')) {
  console.log('ERROR: Still corrupted!');
} else {
  console.log('Fixed!');
}
