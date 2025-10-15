import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts, Poppins_600SemiBold } from "@expo-google-fonts/poppins";

// Import screens
import HomeScreen from "./HomeScreen";
import Signin from "./sign/Signin";
import Signup from "./sign/Signup";
import ForGuest from "./guest/ForGuest";
import GameDashboard from "./GameDashboard";

// ✅ Import game mode screens
import Easy from "./user/Easy";
import Intermediate from "./user/Intermediate";
import Expert from "./user/Expert";

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#4FC3F7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Hide header for a clean look
        }}
      >
        {/* Main Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignIn" component={Signin} />
        <Stack.Screen name="SignUp" component={Signup} />
        <Stack.Screen name="ForGuest" component={ForGuest} />
        <Stack.Screen name="GameDashboard" component={GameDashboard} />

        {/* ✅ Game mode screens */}
        <Stack.Screen name="Easy" component={Easy} />
        <Stack.Screen name="Intermediate" component={Intermediate} />
        <Stack.Screen name="Expert" component={Expert} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
