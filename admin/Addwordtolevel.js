import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function AddWordToLevel({ navigation }) {
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [level, setLevel] = useState("Easy");

  const handleSubmit = () => {
    if (!word || !hint) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    console.log({ word, hint, level });
    Alert.alert("Success", `Word "${word}" added to ${level} level!`);
    setWord("");
    setHint("");
    setLevel("Easy");
  };

  return (
    <LinearGradient colors={["#2E5C8A", "#CDA474"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Word:</Text>
          <TextInput
            placeholder="Enter Word"
            placeholderTextColor="#888"
            value={word}
            onChangeText={setWord}
            style={styles.input}
          />

          <Text style={styles.label}>Hint:</Text>
          <TextInput
            placeholder="Enter Hint"
            placeholderTextColor="#888"
            value={hint}
            onChangeText={setHint}
            style={styles.input}
          />
        </View>

        {/* Level Selection */}
        <Text style={styles.levelLabel}>Select Level:</Text>
        <View style={styles.levelRow}>
          {["Easy", "Intermediate", "Expert"].map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[
                styles.levelButton,
                level === lvl && styles.activeLevelButton,
              ]}
              onPress={() => setLevel(lvl)}
            >
              <Text
                style={[
                  styles.levelText,
                  level === lvl && { color: "#fff", fontWeight: "700" },
                ]}
              >
                {lvl}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Word Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Add Word</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: "center",
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 40,
    left: 20,
    zIndex: 10,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 100,
    paddingHorizontal: 25,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    width: "100%",
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: "#dfe4ea",
    borderRadius: 12,
    alignItems: "center",
  },
  activeLevelButton: {
    backgroundColor: "#1565C0",
  },
  levelText: {
    color: "#333",
    fontWeight: "600",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#eadcdcff",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitText: {
    color: "#536b8eff",
    fontSize: 18,
    fontWeight: "700",
  },
});
