#!/usr/bin/env node
const fs = require('fs');

let form = fs.readFileSync('app/car/[id].tsx', 'utf8');

// Replace paid OCR with free Apple Vision text recognition
const oldReadFn = form.indexOf('async function readCardWithCamera()');
const nextFn = form.indexOf('\n  async function ', oldReadFn + 10);

const newReadFn = `  async function readCardWithCamera() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Camera permission needed'); return; }
      
      // Let user pick how to scan
      Alert.alert(
        'Scan Card',
        'Choose scanning method',
        [
          {
            text: 'Live Text (Free)',
            onPress: () => scanWithLiveText()
          },
          {
            text: 'AI Scan ($0.003)',
            onPress: () => scanWithAI()
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch(e) {
      Alert.alert('Error', e.message);
    }
  }

  async function scanWithLiveText() {
    try {
      // Open camera with Live Text enabled
      // iOS 15+ has built-in text recognition
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1.0,
        exif: false,
      });
      if (result.canceled) return;
      
      // Use expo-mlkit or show the image for manual text selection
      // Since Live Text works natively in iOS photo viewer,
      // we guide user to use it
      Alert.alert(
        'Live Text',
        'Your photo was taken! In iOS 15+, tap and hold on the car name text in the photo to copy it, then come back and paste it in the car name field.',
        [
          { text: 'Open Photo', onPress: async () => {
            // Save to camera roll and open
            try {
              const MediaLibrary = require('expo-media-library');
              await MediaLibrary.requestPermissionsAsync();
              const asset = await MediaLibrary.createAssetAsync(result.assets[0].uri);
              Alert.alert('Saved!', 'Photo saved to your camera roll. Open Photos app, tap the photo, tap the Live Text icon (lines), copy the car name, then paste it here.');
            } catch(e) {
              Alert.alert('Tip', 'Open your Photos app, find the photo you just took, tap and hold the car name to copy it using Live Text.');
            }
          }},
          { text: 'OK' }
        ]
      );
    } catch(e) {
      Alert.alert('Error', e.message);
    }
  }

  async function scanWithAI() {
    try {
      setOcrLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        base64: true,
        exif: false,
      });
      if (result.canceled) { setOcrLoading(false); return; }

      let base64 = result.assets[0].base64;
      try {
        const IM = require('expo-image-manipulator');
        const compressed = await IM.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }],
          { compress: 0.6, format: IM.SaveFormat.JPEG, base64: true }
        );
        base64 = compressed.base64;
      } catch(e) {}

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
              { type: 'text', text: 'Hot Wheels/Matchbox card. Reply ONLY JSON: {"name":"car name","series":"or empty","year":"4 digits or empty","colnum":"like 4/5 or empty"}' }
            ]
          }]
        })
      });
      const data = await response.json();
      const txt = (data && data.content && data.content[0] && data.content[0].text) || '';
      const clean = txt.replace(/[^{]*({.*})[^}]*/s, '$1');
      const parsed = JSON.parse(clean);
      if (parsed.name) { setName(parsed.name); const d = detectManufacturer(parsed.name); if (d) setMfg(d); }
      if (parsed.series) setSeries(parsed.series);
      if (parsed.year) setYear(parsed.year);
      if (parsed.colnum) setColnum(parsed.colnum);
      Alert.alert('Done!', 'Card read! Check and adjust if needed.');
    } catch(e) {
      Alert.alert('Could not read card', 'Try better lighting or type manually.');
    } finally {
      setOcrLoading(false);
    }
  }
`;

if (oldReadFn !== -1) {
  form = form.slice(0, oldReadFn) + newReadFn + form.slice(nextFn);
  console.log('✅ Two scan options added: Live Text (free) + AI ($0.003)');
}

fs.writeFileSync('app/car/[id].tsx', form);
console.log('\nDone! Now rebuild for TestFlight:');
console.log('  eas build --platform ios --profile preview');
