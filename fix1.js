#!/usr/bin/env node
const fs = require('fs');

let content = fs.readFileSync('app/scan.tsx', 'utf8');

// Fix the unterminated string - replace the problematic newline expression
content = content.replace(
  `Type a car name above to see if you already own it.{'\\n'}
                Tap the barcode icon to scan the card!`,
  `Type a car name above to see if you already own it. Tap the barcode icon to scan the card!`
);

// Also fix any other similar patterns
content = content.replace(/\{'\s*\\n\s*'\}/g, ' ');

fs.writeFileSync('app/scan.tsx', content);
console.log('✅ Fixed! Run: npx expo start --clear');
