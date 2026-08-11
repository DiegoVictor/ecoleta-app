import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppNavigation } from '@/components/app-navigation';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  useFonts,
} from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={'#34cb79'}
        translucent
      />
      <AnimatedSplashOverlay />
      <AppNavigation />
    </>
  );
}
