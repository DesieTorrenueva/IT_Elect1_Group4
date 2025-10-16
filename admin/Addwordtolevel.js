import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddWordToLevel({ navigation }) {
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [level, setLevel] = useState("Easy");

  const handleSubmit = () => {
    if (!word || !hint) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Here you can save the word, hint, and level to AsyncStorage, server, or DB
    console.log({ word, hint, level });
    Alert.alert("Success", `Word "${word}" added to ${level} level!`);

    // Reset fields
    setWord("");
    setHint("");
    setLevel("Easy");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
  style={styles.backButton}
  onPress={() => navigation.goBack()}
>
  <Ionicons name="arrow-back" size={28} color="#333" />
</TouchableOpacity>

      <Text style={styles.heading}>Add Word to Level</Text>

      <TextInput
        placeholder="Word"
        value={word}
        onChangeText={setWord}
        style={styles.input}
      />
      <TextInput
        placeholder="Hint"
        value={hint}
        onChangeText={setHint}
        style={styles.input}
      />

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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Add Word</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    color: "#1E90FF",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: "600",
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
    backgroundColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
  },
  activeLevelButton: {
    backgroundColor: "#1E90FF",
  },
  levelText: {
    color: "#333",
    fontWeight: "600",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
