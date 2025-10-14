import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";

export default function SignUp({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <LinearGradient colors={["#0b4c85ff", "#dfb487ff"]} style={styles.container}>
      {/* 👇 Added Close (X) Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Logo (higher position) */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Card content */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>CREATE YOUR ACCOUNT</Text>

        <TextInput
          placeholder="USERNAME"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <TextInput
          placeholder="EMAIL"
          placeholderTextColor="#999"
          keyboardType="email-address"
          style={styles.input}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="PASSWORD"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
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

        <TouchableOpacity style={styles.button}>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // 👇 Added style for the Close (X) Button
  closeButton: {
    position: "absolute",
    top: 50,
    right: 25,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 20,
  },
  logoContainer: {
    marginBottom: 5,
  },
  logo: {
    width: 300,
    height: 300,
  },
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
  eyeIcon: {
    paddingHorizontal: 10,
  },
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
});
