#!/usr/bin/env node
const fs = require('fs');

fs.writeFileSync('README.md', `# 🚗 My Garage — Hot Wheels & Matchbox Collector App

A free, open-source mobile app for diecast car collectors. Track your Hot Wheels and Matchbox collection, scan cards with AI, check for duplicates before buying, and organize by series, manufacturer, and more.

![Platform](https://img.shields.io/badge/platform-iOS-blue)
![React Native](https://img.shields.io/badge/React%20Native-Expo-black)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📱 Screenshots

> Add Car • Garage • Series Tracker • Duplicate Checker

---

## ✨ Features

### 🔍 Duplicate Checker
- Type any car name to instantly see if you already own it
- Shows ✅ YES or ❌ NO with full details
- Perfect for checking before buying at the store

### 📷 Scan Card (AI-powered)
- Point your camera at any Hot Wheels card
- AI reads the car name, series, year, and collector number automatically
- No typing needed!

### 🚗 Garage
- Track your entire collection
- Search by name, series, manufacturer, color
- Sort by date added, name, year, manufacturer, color
- Filter by Hot Wheels or Matchbox
- Filter by manufacturer (Ford, Ferrari, Datsun, etc.)

### 📋 Add Car Form
- 500+ car names with auto-suggest
- History recall — previously entered cars appear first
- Manufacturer auto-detection from car name
- Color picker with 35 colors (Spectraflame, ZAMAC, Chrome, etc.)
- Series picker with 150+ series (2024/2025/2026)
- Series # picker (1/5, 1/6, 1/8, 1/10, 1/12)
- Mainline # picker (1-250) for full year tracking
- Treasure Hunt / Super TH tagging
- Photo from camera or library
- Status: Owned / Wishlist / Duplicate

### 📊 Series Tracker
- See progress for every series you collect
- Shows 5/10, 3/6 etc for each set
- Progress bar turns green when complete ✅
- Tap to set total for any series
- Known totals auto-loaded (HW Exotics=10, Car Culture=6, etc.)

### 📈 Stats & Charts
- Total owned, wishlist, treasure hunts
- Cars by year bar chart
- Top manufacturers bar chart
- Series completion overview

### 🖼️ Gallery
- Photo grid of all your cars
- Instagram-style swipe up for full details
- Car Makers browser

### ♡ Wishlist
- Track cars you want to buy
- Add directly from duplicate checker

### 💾 Backup & Restore
- Export all your cars as JSON
- Import on any device
- Never lose your collection

---

## 🛠️ Tech Stack

- **React Native** with **Expo SDK 54**
- **expo-router** for navigation
- **AsyncStorage** for local data persistence
- **expo-image-picker** for photos
- **expo-image-manipulator** for compression
- **Claude AI API** for card scanning OCR
- **TypeScript**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS device or simulator

### Installation

\`\`\`bash
# Clone the repo
git clone https://github.com/Ravikarthick/my-garage.git
cd my-garage

# Install dependencies
npm install --legacy-peer-deps

# Start the app
npx expo start
\`\`\`

### Running on iPhone
1. Install **Expo Go** from App Store
2. Scan the QR code from terminal
3. App loads on your iPhone!

### Building for TestFlight
\`\`\`bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios --latest
\`\`\`

---

## 📁 Project Structure

\`\`\`
app/
├── (tabs)/
│   ├── index.tsx          # Garage screen
│   ├── gallery.tsx        # Photo gallery
│   ├── wishlist.tsx       # Wishlist
│   └── stats.tsx          # Stats & series tracker
├── car/[id].tsx           # Add/Edit car form
├── scan.tsx               # Duplicate checker
└── backup.tsx             # Backup & restore

lib/
├── storage.ts             # AsyncStorage data layer
├── carDatabase.ts         # 500+ car names & manufacturer detection
├── seriesData.ts          # 150+ series (2024-2026)
└── seriesTotal.ts         # Known series totals

components/
└── CarCard.tsx            # Car list item component
\`\`\`

---

## 🤝 Contributing

Contributions welcome! The Hot Wheels collector community is huge — help make this app better for everyone.

- Add more car names to \`lib/carDatabase.ts\`
- Add new series to \`lib/seriesData.ts\`
- Fix manufacturer detection
- Add new features
- Report bugs

### How to contribute
1. Fork the repo
2. Create a branch: \`git checkout -b feature/my-feature\`
3. Commit changes: \`git commit -m 'Add some feature'\`
4. Push: \`git push origin feature/my-feature\`
5. Open a Pull Request

---

## 📝 Roadmap

- [ ] iCloud sync
- [ ] Share collection as PDF
- [ ] Price tracking
- [ ] App Store release
- [ ] Android support
- [ ] Barcode scanner for instant lookup
- [ ] Community database of all HW castings

---

## 📄 License

MIT License — free to use, modify and distribute.

---

## 🙏 Credits

Built with ❤️ for the Hot Wheels collector community.

If you find this useful, give it a ⭐ on GitHub!
`);

console.log('✅ README.md created!');
console.log('\nNow run:');
console.log('  git add README.md');
console.log('  git commit -m "Add README"');
console.log('  git push -u origin main --force');
