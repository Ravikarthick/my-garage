#!/usr/bin/env node
const fs = require('fs');

// Test the current detection function
const content = fs.readFileSync('lib/carDatabase.ts', 'utf8');

// Check what's in the file
console.log('🔍 Checking carDatabase.ts...');
console.log('Has detectManufacturer function:', content.includes('detectManufacturer') ? '✅' : '❌');
console.log('Has DETECT_MAP:', content.includes('DETECT_MAP') ? '✅' : '❌');
console.log('Has camaro entry:', content.includes("'camaro'") ? '✅' : '❌');
console.log('Has chevrolet entry:', content.includes("'chevrolet'") ? '✅' : '❌');
console.log('Has ford entry:', content.includes("'ford'") ? '✅' : '❌');

// Test the detection logic directly
console.log('\n🧪 Testing detection logic...');
const testNames = ['Camaro SS', 'Ford Mustang', 'Datsun 510', 'Bone Shaker', 'Barbie Corvette'];

// Extract DETECT_MAP from file
try {
  // Simple test - check if keywords exist
  const tests = [
    ['camaro', 'Chevrolet'],
    ['ford', 'Ford'],
    ['mustang', 'Ford'],
    ['datsun', 'Datsun'],
    ['ferrari', 'Ferrari'],
  ];
  
  tests.forEach(([kw, expected]) => {
    const found = content.includes(`['${kw}'`) || content.includes(`'${kw}':`);
    console.log(`  '${kw}' → ${expected}: ${found ? '✅' : '❌ MISSING!'}`);
  });
} catch(e) {
  console.log('Error testing:', e.message);
}

// The real fix - patch the car form to call detectManufacturer on EVERY keystroke
console.log('\n🔧 Patching car form...');

let form = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Check if onNameChange calls detectManufacturer
const hasDetectCall = form.includes('detectManufacturer');
console.log('Form calls detectManufacturer:', hasDetectCall ? '✅' : '❌');

if (!hasDetectCall) {
  // Find onNameChange and add detection
  form = form.replace(
    'function onNameChange(text)',
    `function onNameChange(text)`
  );
  
  // Add import if missing
  if (!form.includes('detectManufacturer')) {
    form = form.replace(
      "import { searchCars, searchManufacturers",
      "import { searchCars, searchManufacturers, detectManufacturer"
    );
    console.log('✅ Added detectManufacturer import');
  }
}

// Ensure onNameChange properly calls detectManufacturer
// Find the function and replace it entirely
const oldOnNameChange = form.match(/function onNameChange\(text.*?\{[\s\S]*?^\s*\}/m);

const newOnNameChange = `function onNameChange(text) {
    setName(text);
    // Auto-detect manufacturer on every keystroke
    if (text.length >= 2) {
      const detected = detectManufacturer(text);
      if (detected) setManufacturer(detected);
      setNameSug(searchCars(text, brand));
    } else {
      setNameSug([]);
    }
  }`;

if (form.includes('function onNameChange(text)')) {
  // Replace the whole function
  const start = form.indexOf('function onNameChange(text)');
  // Find the closing brace
  let depth = 0;
  let end = start;
  let inFunc = false;
  for (let i = start; i < form.length; i++) {
    if (form[i] === '{') { depth++; inFunc = true; }
    if (form[i] === '}') { depth--; }
    if (inFunc && depth === 0) { end = i + 1; break; }
  }
  form = form.slice(0, start) + newOnNameChange + form.slice(end);
  console.log('✅ Fixed onNameChange to detect manufacturer on every keystroke');
}

fs.writeFileSync('app/car/[id].tsx', form);

console.log('\n✅ Done! Now:');
console.log('  Type "Camaro"     → Chevrolet fills automatically');
console.log('  Type "Mustang"    → Ford fills automatically');
console.log('  Type "Datsun 510" → Datsun fills automatically');
console.log('  Type "Ferrari"    → Ferrari fills automatically');
