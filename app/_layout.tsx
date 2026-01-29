import { uiText } from '@/src/content/ui';
import { uiColors } from '@/src/theme/ui';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore if it's already prevented.
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const logo = require('../assets/images/logo3.svg');
  const questionBg = require('../assets/images/question-bg.webp');
  const rewardBg = require('../assets/images/reward-bg.webp');
  const penaltyBg = require('../assets/images/penalty-bg.webp');

  useEffect(() => {
    let isMounted = true;

    async function preload() {
      try {
        await Asset.loadAsync([logo, questionBg, rewardBg, penaltyBg]);
      } finally {
        if (isMounted) setAssetsLoaded(true);
      }
    }

    preload();

    return () => {
      isMounted = false;
    };
  }, [logo, questionBg, rewardBg, penaltyBg]);

  useEffect(() => {
    if (fontsLoaded && assetsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, assetsLoaded]);

  if (!fontsLoaded || !assetsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: uiColors.screenBackground },
          // expo-router/native-stack headerStyle typing is intentionally narrow;
          // use the native shadow for separation instead of custom borders/heights.
          headerShadowVisible: true,
          headerTitle: () => (
            <Image source={logo} style={{ width: 54, height: 54 }} resizeMode="contain" />
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: uiText.app.title,
          }}
        />

        <Stack.Screen
          name="home"
          options={{
            title: uiText.app.title,
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
