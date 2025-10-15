import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts, Poppins_600SemiBold } from "@expo-google-fonts/poppins";

// Import screens
import HomeScreen from "./HomeScreen";
import Signin from "./sign/Signin";
import Signup from "./sign/Signup";
import ForGuest from "./guest/ForGuest"; // ✅ fixed path — should be relative to App.js

const Stack = createStackNavigator();

export default function App() {
  // Load the Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  // Simple loading indicator while fonts load
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
          headerShown: false, // hide header for cleaner UI
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignIn" component={Signin} />
        <Stack.Screen name="SignUp" component={Signup} />
        <Stack.Screen name="ForGuest" component={ForGuest} />
        {/* ✅ ForGuest screen added above */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
