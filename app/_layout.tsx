import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../globals.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="invoice/[invoiceId]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="dashboard/[userId]"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="+not-found" />
          </Stack>
          <Toast position="top" topOffset={60} visibilityTime={4000} autoHide={true} />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}
