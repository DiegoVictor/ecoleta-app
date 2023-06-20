import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../pages/Home';
import Points from '../pages/Points';
import Detail from '../pages/Detail';

export type StackParamList = {
  Home: undefined;
  Points: {
    city: string;
    uf: string;
  };
  Detail: {
    pointId: number;
  };
};

const AppStack = createNativeStackNavigator<StackParamList>();

export default () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Home"
      >
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="Points" component={Points} />
        <AppStack.Screen name="Detail" component={Detail} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};
