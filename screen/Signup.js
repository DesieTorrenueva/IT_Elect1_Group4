import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

// Open SQLite DB if available
let db = null;
if (SQLite.openDatabase) {
  db = SQLite.openDatabase("users.db");
} else {
  console.log("SQLite not available, using AsyncStorage fallback");
}

export default function Signup({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold });

  // Create users table if using SQLite
  useEffect(() => {
    if (db) {
      db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT
          );`
        );
      });
    }
  }, []);

  if (!fontsLoaded) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#1E90FF" />
    </View>
  );

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim().toLowerCase();

      if (db) {
        // SQLite signup
        db.transaction(tx => {
          tx.executeSql(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [trimmedUsername, trimmedEmail, password],
            (_, result) => {
              setLoading(false);
              Alert.alert("Success", "Account created successfully!", [
                { text: "OK", onPress: () => navigation.navigate("SignIn") },
              ]);
            },
            (_, error) => {
              setLoading(false);
              console.log("SQLite insert error:", error);
              Alert.alert("Error", "Username or email already exists.");
              return true;
            }
          );
        });
      } else {
        // AsyncStorage fallback
        const existingUsersJSON = await AsyncStorage.getItem("users");
        const existingUsers = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];

        if (existingUsers.some(u => u.username.toLowerCase() === trimmedUsername.toLowerCase() || u.email.toLowerCase() === trimmedEmail)) {
          setLoading(false);
          Alert.alert("Error", "Username or email already exists.");
          return;
        }

        const newUser = { username: trimmedUsername, email: trimmedEmail, password };
        await AsyncStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

        setLoading(false);
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.navigate("SignIn") },
        ]);
      }
    } catch (error) {
      setLoading(false);
      console.log("Signup error:", error);
      Alert.alert("Error", "Signup failed. Please try again.");
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
            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate("Home")}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
            </View>

            <View style={styles.card}>
              <Text style={styles.subtitle}>CREATE YOUR ACCOUNT</Text>

              <TextInput
                placeholder="USERNAME"
                placeholderTextColor="#999"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />

              <TextInput
                placeholder="EMAIL"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
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

              <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleSignUp} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>SIGN UP</Text>}
              </TouchableOpacity>

              <Text style={styles.signupText}>
                Already have an account?{" "}
                <Text style={styles.signupLink} onPress={() => navigation.navigate("SignIn")}>
                  Sign in
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- reuse previous styles ---
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  closeButton: { position: "absolute", top: 15, right: 20, zIndex: 10, backgroundColor: "rgba(0,0,0,0.3)", padding: 8, borderRadius: 20 },
  logoContainer: { marginTop: -60, marginBottom: 10, alignItems: "center" },
  logo: { width: 300, height: 300 },
  card: { width: "85%", backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 20, padding: 25, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 5 },
  subtitle: { fontFamily: "Poppins_600SemiBold", fontSize: 14, color: "#333", marginBottom: 25 },
  input: { width: "100%", height: 50, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 15, fontFamily: "Poppins_400Regular", fontSize: 14, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  passwordContainer: { width: "100%", flexDirection: "row", alignItems: "center", marginBottom: 15, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },
  eyeIcon: { paddingHorizontal: 10 },
  button: { width: "100%", height: 50, backgroundColor: "#1E90FF", borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontFamily: "Poppins_600SemiBold", fontSize: 16 },
  signupText: { fontFamily: "Poppins_400Regular", fontSize: 13, color: "#333", marginTop: 20 },
  signupLink: { color: "#1E90FF", fontFamily: "Poppins_600SemiBold" },
});
