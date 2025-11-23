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
import { createUser } from "../firebase";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function Signup({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold });

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

    // Strict email validation - only allow common TLDs
    const strictEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov)$/i;
    
    if (!strictEmailRegex.test(email.trim())) {
      Alert.alert(
        "Invalid Email", 
        "Please enter a valid email address"
      );
      return;
    }

    // Additional check for common typos
    const commonTypos = ['.cm', '.cmo', '.con', '.met', '.rog', '.ogr', '.nte', '.ocm'];
    const emailLower = email.trim().toLowerCase();
    
    for (const typo of commonTypos) {
      if (emailLower.endsWith(typo)) {
        Alert.alert(
          "Possible Typo Detected", 
          `Did you mean to use ".com" instead of "${typo}"?\n\nPlease check your email address carefully.`
        );
        return;
      }
    }

    // Check password length (minimum 6 characters)
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    // Check for password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      Alert.alert(
        "Weak Password", 
        "For better security, your password should include:\n• At least one uppercase letter\n• At least one lowercase letter\n• At least one number"
      );
      return;
    }

    setLoading(true);

    try {
      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim().toLowerCase();

      // Check if username already exists
      const usernameQuery = query(
        collection(db, "users"), 
        where("username", "==", trimmedUsername)
      );
      const usernameSnapshot = await getDocs(usernameQuery);
      
      if (!usernameSnapshot.empty) {
        setLoading(false);
        Alert.alert("Username Taken", "This username is already registered. Please choose a different one.");
        return;
      }

      // Create user in Firebase Auth
      const userCredential = await createUser(trimmedEmail, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: trimmedUsername,
        email: trimmedEmail,
        score: 0,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      // Create username mapping for sign-in
      try {
        await setDoc(doc(db, "usernames", trimmedUsername.toLowerCase()), {
          uid: user.uid,
          email: trimmedEmail,
        });
      } catch (e) {
        console.warn('Failed to write username mapping:', e);
      }

      setLoading(false);
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("SignIn") },
      ]);
    } catch (error) {
      setLoading(false);
      console.log("Signup error:", error);
      
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "This email is already registered. Please use a different email or sign in.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Error", "Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email format. Please check your email address.");
      } else {
        Alert.alert("Error", "Signup failed. Please try again.");
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
              <Text style={styles.subtitle}>CREATE YOUR ACCOUNT</Text>

              <TextInput
                placeholder="USERNAME"
                placeholderTextColor="#999"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <TextInput
                placeholder="EMAIL (e.g., user@gmail.com)"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="PASSWORD (min. 6 characters)"
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

              <View style={styles.passwordHintContainer}>
                <Text style={styles.passwordHint}>
                  Strong password should include:
                </Text>
                <Text style={styles.passwordHintItem}>• Uppercase & lowercase letters</Text>
                <Text style={styles.passwordHintItem}>• Numbers (0-9)</Text>
              </View>

              <TouchableOpacity 
                style={[styles.button, loading && { opacity: 0.7 }]} 
                onPress={handleSignUp} 
                disabled={loading}
              >
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

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  closeButton: { 
    position: "absolute", 
    top: 15, 
    right: 20, 
    zIndex: 10, 
    backgroundColor: "rgba(0,0,0,0.3)", 
    padding: 8, 
    borderRadius: 20 
  },
  logoContainer: { marginTop: -70, alignItems: "center" },
  logo: { width: 300, height: 300 },
  card: { 
    width: "85%", 
    backgroundColor: "rgba(255,255,255,0.9)", 
    borderRadius: 20, 
    padding: 25, 
    alignItems: "center", 
    shadowColor: "#000", 
    shadowOpacity: 0.15, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowRadius: 6, 
    elevation: 5 
  },
  subtitle: { 
    fontFamily: "Poppins_600SemiBold", 
    fontSize: 14, 
    color: "#333", 
    marginBottom: 25 
  },
  input: { 
    width: "100%", 
    height: 50, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    fontFamily: "Poppins_400Regular", 
    fontSize: 14, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: "#ddd" 
  },
  passwordContainer: { 
    width: "100%", 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: "#ddd" 
  },
  eyeIcon: { paddingHorizontal: 10 },
  passwordHintContainer: {
    width: "100%",
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  passwordHint: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#1565C0",
    marginBottom: 2,
  },
  passwordHintItem: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#555",
    marginLeft: 10,
  },
  button: { 
    width: "100%", 
    height: 50, 
    backgroundColor: "#1E90FF", 
    borderRadius: 10, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 10 
  },
  buttonText: { 
    color: "#fff", 
    fontFamily: "Poppins_600SemiBold", 
    fontSize: 16 
  },
  signupText: { 
    fontFamily: "Poppins_400Regular", 
    fontSize: 13, 
    color: "#333", 
    marginTop: 20 
  },
  signupLink: { 
    color: "#1E90FF", 
    fontFamily: "Poppins_600SemiBold" 
  },
});