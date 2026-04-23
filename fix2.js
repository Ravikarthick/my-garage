#!/usr/bin/env node
const fs = require('fs');

let form = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Fix 1: Replace dynamic require of expo-image-manipulator with top-level import
if (!form.includes("import * as ImageManipulator")) {
  form = form.replace(
    "import * as ImagePicker from 'expo-image-picker';",
    "import * as ImagePicker from 'expo-image-picker';\nimport * as ImageManipulator from 'expo-image-manipulator';"
  );
  console.log('✅ Added ImageManipulator import');
}

// Fix 2: Replace dynamic require inside functions
form = form.replace(
  /const IM = require\('expo-image-manipulator'\);/g,
  'const IM = ImageManipulator;'
);
form = form.replace(
  /require\('expo-image-manipulator'\)/g,
  'ImageManipulator'
);
console.log('✅ Replaced dynamic requires with static import');

// Fix 3: Replace dynamic require of expo-clipboard
if (!form.includes("import * as Clipboard")) {
  form = form.replace(
    "import AsyncStorage from '@react-native-async-storage/async-storage';",
    "import AsyncStorage from '@react-native-async-storage/async-storage';\nimport * as Clipboard from 'expo-clipboard';"
  );
  console.log('✅ Added Clipboard import');
}

form = form.replace(
  /const Clipboard = require\('expo-clipboard'\);/g,
  '// Clipboard already imported'
);
form = form.replace(
  /require\('expo-clipboard'\)/g,
  'Clipboard'
);
console.log('✅ Replaced Clipboard dynamic requires');

fs.writeFileSync('app/car/[id].tsx', form);
console.log('\n✅ Done! Now rebuild in Xcode:');
console.log('  Product → Clean Build Folder');
console.log('  Then ▶ Play');
