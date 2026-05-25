const fs = require('fs');
let f = fs.readFileSync('lib/seriesData.ts', 'utf8');
if (!f.includes('import AsyncStorage')) {
  f = "import AsyncStorage from '@react-native-async-storage/async-storage';\n" + f;
  fs.writeFileSync('lib/seriesData.ts', f);
  console.log('Fixed!');
} else {
  console.log('Already imported');
}
