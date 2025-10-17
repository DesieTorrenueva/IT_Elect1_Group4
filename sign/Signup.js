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

export default function Signup({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🧩 Input States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSignUp = () => {
    // ✅ Check for empty fields
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please fill in all the fields.");
      return;
    }

    // ✅ (Optional) Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // If all good
    setShowSuccess(true);
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
          >
            {/* Close (X) Button */}
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

            {/* Card */}
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

              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>SIGN UP</Text>
              </TouchableOpacity>

              <Text style={styles.signupText}>
                Already have an account?{" "}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate("SignIn")}
                >
                  Sign in
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
                <Text style={styles.modalTitle}>
                  Account created successfully!
                </Text>
                <Text style={styles.modalSubtitle}>
                  Welcome! You can now sign in.
                </Text>

                <TouchableOpacity
                  style={styles.okButton}
                  onPress={() => {
                    setShowSuccess(false);
                    navigation.navigate("SignIn");
                  }}
                >
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

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  signupLink: {
    color: "#1E90FF",
    fontFamily: "Poppins_600SemiBold",
  },
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
