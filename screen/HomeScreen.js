import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient colors={["#0b4c85ff", "#dfb487ff"]} style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        {/* Help Button */}
        <TouchableOpacity
          style={styles.help}
          onPress={() => navigation.navigate("Help")} // replace with your help screen
        >
          <Text style={styles.helpText}>?</Text>
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Play as Guest */}
          <TouchableOpacity
            style={[styles.button, styles.guestButton]}
            onPress={() => navigation.navigate("ForGuest")}
          >
            <FontAwesome name="user-secret" size={22} color="#000" />
            <Text style={[styles.buttonText, styles.darkText, styles.poppinsText]}>
              PLAY AS GUEST
            </Text>
          </TouchableOpacity>

          {/* Save Progress */}
          <Text style={styles.saveText}>SAVE YOUR PROGRESS</Text>

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.button, styles.signInButton]}
            onPress={() => navigation.navigate("SignIn")}
          >
            <MaterialIcons name="lock-outline" size={22} color="#fff" />
            <Text style={[styles.buttonText, styles.poppinsText]}>
              SIGN IN
            </Text>
          </TouchableOpacity>

          {/* Sign Up */}
          <TouchableOpacity
            style={[styles.button, styles.signUpButton]}
            onPress={() => navigation.navigate("SignUp")}
          >
            <MaterialIcons name="person-add-alt" size={22} color="#fff" />
            <Text style={[styles.buttonText, styles.poppinsText]}>
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  help: {
    position: "absolute",
    top: 30,
    left: 25,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  helpText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0b4c85",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 40,
  },
  logo: {
    width: 220,
    height: 220,
  },
  buttonsContainer: {
    alignItems: "center",
    width: "80%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 15,
    marginVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  guestButton: {
    backgroundColor: "#FFD54F",
  },
  signInButton: {
    backgroundColor: "#4FC3F7",
  },
  signUpButton: {
    backgroundColor: "#81C784",
  },
  buttonText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 17,
    marginLeft: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  poppinsText: {
    fontFamily: "Poppins_600SemiBold",
  },
  darkText: {
    color: "#000",
  },
  saveText: {
    color: "#333",
    marginVertical: 10,
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "bold",
  },
});
