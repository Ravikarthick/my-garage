const fs = require('fs');

// Fix 1: car/[id].tsx - remove calls to saveCustomSeries and getCustomSeries
let form = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Fix the broken onPress that still calls saveCustomSeries/getCustomSeries
form = form.replace(
  /onPress=\{async \(\) => \{ await saveCustomSeries\(seriesQ\); setSeries\(seriesQ\); setModal\(null\); setSeriesQ\(''\); const custom = await getCustomSeries\(\); setSeriesList\(\[\.\.\. custom, \.\.\.HW_SERIES\]\); \}\}/g,
  "onPress={() => { setSeries(seriesQ); setModal(null); setSeriesQ(''); setSeriesList(HW_SERIES); }}"
);

// Also fix the import line just in case it still has saveCustomSeries
form = form.replace(
  /import \{ HW_SERIES, searchSeries, saveCustomSeries, getCustomSeries \} from '\.\.\/\.\.\/lib\/seriesData';/g,
  "import { HW_SERIES, searchSeries } from '../../lib/seriesData';"
);

fs.writeFileSync('app/car/[id].tsx', form);
console.log('✅ Fixed car form - removed broken series calls');

// Fix 2: Verify backup.tsx Clipboard import is correct
let backup = fs.readFileSync('app/backup.tsx', 'utf8');
if (backup.startsWith("import * as Clipboard from 'expo-clipboard';")) {
  console.log('✅ backup.tsx Clipboard import looks correct');
} else {
  console.log('⚠️  backup.tsx may have issues');
}

// Verify the fix
const check = fs.readFileSync('app/car/[id].tsx', 'utf8');
if (check.includes('saveCustomSeries') || check.includes('getCustomSeries')) {
  console.log('❌ Still has saveCustomSeries/getCustomSeries calls!');
  // Find and show the lines
  check.split('\n').forEach((line, i) => {
    if (line.includes('saveCustomSeries') || line.includes('getCustomSeries')) {
      console.log('Line ' + (i+1) + ': ' + line.trim());
    }
  });
} else {
  console.log('✅ Verified - no more broken calls!');
}

console.log('\nNow in Xcode:');
console.log('  Product → Clean Build Folder');
console.log('  Product → Archive');
console.log('  Distribute → TestFlight Internal Only');
