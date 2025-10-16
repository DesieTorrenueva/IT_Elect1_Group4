import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Setting from "./user/Setting"; // Your updated Setting modal
import Quit from "./user/Quit";

export default function GameDashboard({ navigation }) {
  const [score, setScore] = useState(0);
  const [settingVisible, setSettingVisible] = useState(false); // <-- new state for settings
  const [quitVisible, setQuitVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadScore = async () => {
        try {
          const storedScore = await AsyncStorage.getItem("userScore");
          if (storedScore !== null) setScore(parseInt(storedScore));
        } catch (e) {
          console.error("Failed to load score", e);
        }
      };
      loadScore();
    }, [])
  );

  const handleNavigate = async (difficulty) => {
    try {
      const storedLevel = await AsyncStorage.getItem(`${difficulty}Level`);
      navigation.navigate(difficulty, {
        resumeLevel: storedLevel ? parseInt(storedLevel) : 0,
      });
    } catch (e) {
      console.error("Failed to load last level", e);
      navigation.navigate(difficulty, { resumeLevel: 0 });
    }
  };

  return (
    <LinearGradient colors={["#0b4c85", "#dfb487"]} style={styles.gradient}>
      <StatusBar barStyle="light-content" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.leftPlaceholder} />
        <Image source={require("./assets/logo.png")} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity onPress={() => setSettingVisible(true)}>
          <Ionicons name="settings-outline" size={30} color="#f5d9a4" />
        </TouchableOpacity>
      </View>

      {/* Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.scoreNumber}>{score}</Text>
      </View>

      {/* Difficulty Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => handleNavigate("Easy")}>
        <View style={styles.buttonContent}>
          <Ionicons name="musical-notes-outline" size={22} color="#1d3557" />
          <Text style={styles.buttonText}>EASY</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleNavigate("Intermediate")}>
        <View style={styles.buttonContent}>
          <FontAwesome5 name="trophy" size={20} color="#1d3557" />
          <Text style={styles.buttonText}>INTERMEDIATE</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleNavigate("Expert")}>
        <View style={styles.buttonContent}>
          <Ionicons name="flame-outline" size={24} color="#1d3557" />
          <Text style={styles.buttonText}>EXPERT</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Leaderboard")}>
        <View style={styles.buttonContent}>
          <FontAwesome5 name="medal" size={20} color="#1d3557" />
          <Text style={styles.buttonText}>LEADERBOARD</Text>
        </View>
      </TouchableOpacity>

      {/* Quit Button */}
      <TouchableOpacity style={styles.quitButton} onPress={() => setQuitVisible(true)}>
        <View style={styles.buttonContent}>
          <MaterialIcons name="exit-to-app" size={22} color="#fff" />
          <Text style={styles.quitText}>QUIT</Text>
        </View>
      </TouchableOpacity>

      {/* Modals */}
      <Quit
        visible={quitVisible}
        onClose={() => setQuitVisible(false)}
        onConfirm={() => {
          setQuitVisible(false);
          navigation.navigate("Home");
        }}
      />

      <Setting
        isVisible={settingVisible}  // <-- pass the visibility
        onClose={() => setSettingVisible(false)} // <-- handle closing
        navigation={navigation}      // <-- pass navigation prop
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
    top: Platform.OS === "android" ? StatusBar.currentHeight - 15 : 10,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  leftPlaceholder: {
    width: 30, // same width as the settings icon to perfectly center logo
  },
  logo: {
    width: 95,
    height: 95,
    marginTop: -10,
  },
  scoreContainer: {
    alignItems: "center",
    marginTop: 160,
    marginBottom: 25,
  },
  scoreLabel: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f3efefff",
    letterSpacing: 2,
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: "900",
    color: "#ffffff",
    textShadowColor: "#00000055",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  button: {
    width: "75%",
    backgroundColor: "#eadcdcff",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginVertical: 8,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#536b8eff",
  },
  quitButton: {
    width: "75%",
    backgroundColor: "#1565C0",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 18,
  },
  quitText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
});