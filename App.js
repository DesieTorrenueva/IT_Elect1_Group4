import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts, Poppins_600SemiBold } from "@expo-google-fonts/poppins";

// 🏠 Main Screens
import HomeScreen from "./HomeScreen";
import Signin from "./sign/Signin";
import Signup from "./sign/Signup";
import ForGuest from "./guest/ForGuest";
import GameDashboard from "./GameDashboard";

// 🎮 Game Mode Screens
import Easy from "./user/Easy";
import Intermediate from "./user/Intermediate";
import Expert from "./user/Expert";

// 🏆 Other Screens
import Leaderboard from "./user/Leaderboard";
import Quit from "./user/Quit";

const Stack = createStackNavigator();

export default function App() {
  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  // Loading indicator while font loads
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
          headerShown: false, // hides top header for custom UIs
          animationEnabled: true, // smoother screen transitions
        }}
      >
        {/* 🔹 Main Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignIn" component={Signin} />
        <Stack.Screen name="SignUp" component={Signup} />
        <Stack.Screen name="ForGuest" component={ForGuest} />
        <Stack.Screen name="GameDashboard" component={GameDashboard} />

        {/* 🔹 Game Modes */}
        <Stack.Screen name="Easy" component={Easy} />
        <Stack.Screen name="Intermediate" component={Intermediate} />
        <Stack.Screen name="Expert" component={Expert} />

        {/* 🔹 Extras */}
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
        <Stack.Screen name="Quit" component={Quit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}