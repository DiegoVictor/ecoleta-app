import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import * as SplashScreen from 'expo-splash-screen';

import Routes from './src/routes';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold,
  });

  useEffect(() => {
    (async () => {
      if (fontsLoaded) {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    })();
  }, [fontsLoaded]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Routes />
    </>
  );
}
