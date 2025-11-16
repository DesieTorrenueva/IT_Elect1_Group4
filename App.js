import "./firebase"; // MUST be first to initialize auth
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { SafeAreaProvider } from "react-native-safe-area-context"; // updated safe area

// Screens
import HomeScreen from "./screen/HomeScreen";
import Help from "./screen/Help";
import Signin from "./screen/Signin";
import Signup from "./screen/Signup";
import ForGuest from "./guest/ForGuest";
import AdminDashboard from "./screen/AdminDashboard";
import GameDashboard from "./screen/GameDashboard";
import Addwordtolevel from "./admin/Addwordtolevel";
import AdminQuit from "./admin/AdminQuit";
import Easy from "./user/Easy";
import Intermediate from "./user/Intermediate";
import Expert from "./user/Expert";
import Leaderboard from "./user/Leaderboard";
import Setting from "./user/Setting";
import ManageAccount from "./user/ManageAccount";
import PrivacyPolicy from "./user/PrivacyPolicy";
import Quit from "./user/Quit";

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_600SemiBold });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#4FC3F7" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator  screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Help" component={Help} />
          <Stack.Screen name="SignIn" component={Signin} />
          <Stack.Screen name="SignUp" component={Signup} />
          <Stack.Screen name="ForGuest" component={ForGuest} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="GameDashboard" component={GameDashboard} />
          <Stack.Screen name="Addwordtolevel" component={Addwordtolevel} />
          <Stack.Screen name="AdminQuit" component={AdminQuit} />
          <Stack.Screen name="Easy" component={Easy} />
          <Stack.Screen name="Intermediate" component={Intermediate} />
          <Stack.Screen name="Expert" component={Expert} />
          <Stack.Screen name="Leaderboard" component={Leaderboard} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="ManageAccount" component={ManageAccount} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="Quit" component={Quit} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}