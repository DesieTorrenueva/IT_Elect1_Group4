import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import AdminQuit from "../admin/AdminQuit"; // Modal for quit
import { CommonActions } from "@react-navigation/native"; // safe navigation dispatch

export default function AdminDashboard({ navigation }) {
  const [quitVisible, setQuitVisible] = useState(false);

  const navigateToAddWord = () => {
    // Safe navigation to Addwordtolevel screen
    navigation.dispatch(
      CommonActions.navigate({ name: "Addwordtolevel" })
    );
  };

  return (
    <LinearGradient colors={["#102c44ff", "#8c673fff"]} style={styles.gradient}>
      <StatusBar barStyle="light-content" />

      {/* Top Bar with Logo */}
      <View style={styles.topBar}>
        <View style={styles.leftPlaceholder} />
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.leftPlaceholder} />
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Hello, ADMIN!</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={navigateToAddWord}>
        <View style={styles.buttonContent}>
          <FontAwesome5 name="plus-circle" size={22} color="#1d3557" />
          <Text style={styles.buttonText}>ADD WORD TO LEVEL</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quitButton} onPress={() => setQuitVisible(true)}>
        <View style={styles.buttonContent}>
          <MaterialIcons name="exit-to-app" size={22} color="#fff" />
          <Text style={styles.quitText}>QUIT</Text>
        </View>
      </TouchableOpacity>

      {/* Quit Modal */}
      <AdminQuit
        visible={quitVisible}
        onClose={() => setQuitVisible(false)}
        onConfirm={() => {
          setQuitVisible(false);
          navigation.navigate("Home");
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 40,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  leftPlaceholder: { width: 30 },
  logo: { width: 300, height: 300, marginTop: -10 },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e3e1dfff",
    marginTop: 370,
    marginBottom: 80,
  },
  button: {
    width: "75%",
    backgroundColor: "#eadcdcff",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginVertical: 12,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: { fontSize: 20, fontWeight: "700", color: "#536b8eff" },
  quitButton: {
    width: "75%",
    backgroundColor: "#1565C0",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 18,
  },
  quitText: { fontSize: 20, fontWeight: "700", color: "#fff" },
});
