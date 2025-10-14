import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function EasyMode() {
  const [loading, setLoading] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [message, setMessage] = useState("");

  const words = [
    { word: "APPLE", hint: "A red or green fruit" },
    { word: "HOUSE", hint: "A place where people live" },
    { word: "CHAIR", hint: "You sit on it" },
    { word: "PHONE", hint: "Used for calling" },
    { word: "WATER", hint: "You drink it" },
    { word: "BREAD", hint: "Baked food made from flour" },
    { word: "CLOCK", hint: "It tells time" },
    { word: "MOUSE", hint: "Small animal or computer device" },
    { word: "TABLE", hint: "Used for eating or working" },
    { word: "PLANT", hint: "Grows in soil" },
  ];

  const currentWord = words[currentWordIndex].word;
  const hint = words[currentWordIndex].hint;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLetterPress = (letter) => {
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);

    if (newSelected.join("") === currentWord) {
      setMessage("✅ Correct! Moving to next word...");
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setSelectedLetters([]);
        setMessage("");
      }, 1500);
    }
  };

  const shuffledLetters = currentWord.split("").sort(() => Math.random() - 0.5);

  if (loading) {
    return (
      <LinearGradient colors={["#cce5ff", "#fff0cc"]} style={styles.container}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#4B9CD3" />
          <Text style={styles.loadingText}>Loading Easy Mode...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#cce5ff", "#fff0cc"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>EASY MODE</Text>
        <Text style={styles.hint}>Hint: {hint}</Text>

        <View style={styles.wordBox}>
          {currentWord.split("").map((letter, index) => (
            <Text key={index} style={styles.letterBox}>
              {selectedLetters[index] || "_"}
            </Text>
          ))}
        </View>

        <View style={styles.lettersContainer}>
          {shuffledLetters.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.letterButton}
              onPress={() => handleLetterPress(letter)}
              disabled={selectedLetters.includes(letter)}
            >
              <Text style={styles.letterText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 10,
  },
  hint: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 20,
  },
  wordBox: {
    flexDirection: "row",
    marginBottom: 25,
  },
  letterBox: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563EB",
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderColor: "#2563EB",
    width: 24,
    textAlign: "center",
  },
  lettersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },
  letterButton: {
    backgroundColor: "#4FC3F7",
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  letterText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
  loadingText: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 16,
  },
});
