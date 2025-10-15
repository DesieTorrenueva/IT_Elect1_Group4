import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ✅ Import screens using relative paths
import EasyScreen from './Screens/EasyScreen';
import ExpertScreen from './Screens/ExpertScreen';
import IntermediateScreen from './Screens/IntermediateScreen';
import LeaderboardScreen from './Screens/LeaderboardScreen';
import QuitScreen from './Screens/QuitScreen';
import HomeScreen from './Screens/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Easy" component={EasyScreen} />
        <Stack.Screen name="Intermediate" component={IntermediateScreen} />
        <Stack.Screen name="Expert" component={ExpertScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="Quit" component={QuitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
