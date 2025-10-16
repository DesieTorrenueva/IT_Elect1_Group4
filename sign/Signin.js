import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signin({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Move admin/user credentials to component scope
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admindes";
  const testEmail = "testuser@gmail.com";
  const testPassword = "test123";

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  const handleSignIn = async () => {
    setLoading(true);

    setTimeout(async () => {
      setLoading(false);

      if (
        (email === adminEmail && password === adminPassword) ||
        (email === testEmail && password === testPassword)
      ) {
        // Save username locally
        const username = email === adminEmail ? "Admin" : "Player1";
        await AsyncStorage.setItem("username", username);

        setShowSuccess(true);
      } else {
        Alert.alert("Invalid credentials", "Please check your email and password.");
      }
    }, 1200);
  };

  const handleSuccess = () => {
    setShowSuccess(false);

    // Navigate based on user type
    if (email === adminEmail) {
      navigation.replace("AdminDashboard");
    } else {
      navigation.replace("GameDashboard");
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
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: "transparent" }}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Sign-in Card */}
            <View style={styles.card}>
              <Text style={styles.subtitle}>SIGN IN TO YOUR ACCOUNT</Text>

              <TextInput
                placeholder="USERNAME OR EMAIL"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="PASSWORD"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleSignIn}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>SUBMIT</Text>}
              </TouchableOpacity>

              <Text style={styles.signupText}>
                Don’t have an account?{" "}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate("SignUp")}
                >
                  Sign up
                </Text>
              </Text>
            </View>
          </ScrollView>

          {/* Success Modal */}
          <Modal
            transparent
            animationType="fade"
            visible={showSuccess}
            onRequestClose={() => setShowSuccess(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={64}
                  color="#1E90FF"
                  style={{ marginBottom: 10 }}
                />
                <Text style={styles.modalTitle}>Signing in successfully!</Text>
                <Text style={styles.modalSubtitle}>
                  {email === adminEmail ? "Welcome, Admin!" : "Welcome back!"}
                </Text>

                <TouchableOpacity style={styles.okButton} onPress={handleSuccess}>
                  <Text style={styles.okText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- Styles remain unchanged ---
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 20,
  },
  logoContainer: {
    marginTop: -60,
    marginBottom: 10,
    alignItems: "center",
  },
  logo: { width: 300, height: 300 },
  card: {
    width: "85%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  subtitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#333",
    marginBottom: 25,
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
    borderColor: "#ddd",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  eyeIcon: { paddingHorizontal: 10 },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E90FF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  signupText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#333",
    marginTop: 20,
  },
  signupLink: { color: "#1E90FF", fontFamily: "Poppins_600SemiBold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  modalSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 20,
    textAlign: "center",
  },
  okButton: {
    backgroundColor: "#1E90FF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  okText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },
});
