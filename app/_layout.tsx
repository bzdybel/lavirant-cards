import { uiText } from '@/src/content/ui';
import { uiColors } from '@/src/theme/ui';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image, Platform } from 'react-native';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});

  const logo = ''//require('../assets/images/icon.png');

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: ({
            backgroundColor: uiColors.screenBackground,
            height: Platform.OS === 'ios' ? 56 : undefined,
          } as any),
          headerTitle: () => (
            <Image source={logo} style={{ width: 34, height: 34 }} resizeMode="contain" />
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
