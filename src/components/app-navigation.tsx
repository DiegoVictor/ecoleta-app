import { Stack } from 'expo-router';

export type StackParamList = {
  home: undefined;
  points: {
    city: string;
    uf: string;
  };
  detail: {
    pointId: number;
  };
};

export const AppNavigation = () => {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="points" />
      <Stack.Screen name="detail" />
    </Stack>
  );
};
