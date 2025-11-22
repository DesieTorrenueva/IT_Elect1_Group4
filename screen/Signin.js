import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { signInUser, db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signin({ navigation }) {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold });

  if (!fontsLoaded) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#1E90FF" />
    </View>
  );

  const handleSignIn = async () => {
    if (!emailOrUsername.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please fill in your information.");
      return;
    }

    setLoading(true);
    const input = emailOrUsername.trim().toLowerCase();

    try {
      // Sign-in via REST helper. `signInUser` will accept email or username (it looks up username -> email)
      const userCredential = await signInUser(input, password);
      const user = userCredential.user;

      // Get user data from Firestore using uid
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        await AsyncStorage.setItem("userId", user.uid);
        await AsyncStorage.setItem("username", userData.username || "");
        await AsyncStorage.setItem("userRole", userData.role || "user");

        setLoading(false);
        const welcomeMsg = userData.username ? `Welcome back, ${userData.username}!` : "Welcome back!";

        if (userData.role && userData.role.toLowerCase() === "admin") {
          Alert.alert("Success", welcomeMsg, [
            { text: "OK", onPress: () => navigation.replace("AdminDashboard") },
          ]);
        } else {
          Alert.alert("Success", welcomeMsg, [
            { text: "OK", onPress: () => navigation.replace("GameDashboard") },
          ]);
        }
      } else {
        // If user doc doesn't exist, treat as missing profile
        setLoading(false);
        Alert.alert("Error", "User data not found. Please complete your profile or contact support.");
      }
    } catch (error) {
      setLoading(false);
      console.log("Login error:", error);
      // Provide clearer messages for common cases
      if (error.message && error.message.includes('Missing or insufficient permissions')) {
        Alert.alert('Permission Error', 'Cannot access user data. Check Firestore rules for `usernames` or `users`.');
        return;
      }

      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        Alert.alert("Login Failed", "Incorrect email or password.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Login Failed", "Invalid email format.");
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    }
  };

  return (
    <LinearGradient colors={["#0b4c85ff", "#dfb487ff"]} style={styles.gradient}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -80}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate("Home")}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
            </View>

            <View style={styles.card}>
              <Text style={styles.subtitle}>SIGN IN TO YOUR ACCOUNT</Text>

              <TextInput
                placeholder="EMAIL"
                placeholderTextColor="#999"
                style={styles.input}
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="PASSWORD"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#555" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleSignIn} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>SIGN IN</Text>}
              </TouchableOpacity>

              <Text style={styles.signupText}>
                Don't have an account?{" "}
                <Text style={styles.signupLink} onPress={() => navigation.navigate("SignUp")}>
                  Sign up
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  closeButton: { position: "absolute", top: 15, right: 20, zIndex: 10, backgroundColor: "rgba(0,0,0,0.3)", padding: 8, borderRadius: 20 },
  logoContainer: { marginTop: -60, marginBottom: 10, alignItems: "center" },
  logo: { width: 300, height: 300 },
  card: { width: "85%", backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: 20, padding: 25, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 5 },
  subtitle: { fontFamily: "Poppins_600SemiBold", fontSize: 14, color: "#333", marginBottom: 25 },
  input: { width: "100%", height: 50, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 15, fontFamily: "Poppins_400Regular", fontSize: 14, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  passwordContainer: { width: "100%", flexDirection: "row", alignItems: "center", marginBottom: 15, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },
  eyeIcon: { paddingHorizontal: 10 },
  button: { width: "100%", height: 50, backgroundColor: "#1E90FF", borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontFamily: "Poppins_600SemiBold", fontSize: 16 },
  signupText: { fontFamily: "Poppins_400Regular", fontSize: 13, color: "#333", marginTop: 20 },
  signupLink: { color: "#1E90FF", fontFamily: "Poppins_600SemiBold" },
});