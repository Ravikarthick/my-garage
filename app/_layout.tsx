import React, { useState } from 'react';
import { Stack } from 'expo-router';
import SplashOverlay from '../components/SplashOverlay';
export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scan" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="car/[id]" options={{ presentation: 'modal' }} />
      </Stack>
      {showSplash && <SplashOverlay onDone={() => setShowSplash(false)} />}
    </>
  );
}
