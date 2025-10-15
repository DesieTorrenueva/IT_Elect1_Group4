import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const { width: screenWidth } = Dimensions.get("window");

const levels = [
 { word: "POLICE", hint: "Keeps people safe and enforces laws" },
  { word: "GUITAR", hint: "A musical instrument with strings" },
  { word: "VOLCANO", hint: "Erupts with lava and ash" },
  { word: "BRIDGE", hint: "Connects two areas over a river or road" },
  { word: "ROBOT", hint: "A machine that can do tasks automatically" }
];

export default function Level() {
  const navigation = useNavigation();
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState([]);
  const [completed, setCompleted] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B4D90" />
      </View>
    );
  }

  const current = levels[level];
  const wordLetters = current.word.split("");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Smaller word box size for responsiveness
  const totalMargin = (wordLetters.length - 1) * 6;
  const boxWidth = Math.min(
    50,
    (screenWidth - 60 - totalMargin) / wordLetters.length
  );
  const boxHeight = boxWidth * 1.2;

  // Handle letter press
  const handleGuess = (letter) => {
    if (userInput.length >= wordLetters.length) return;

    const newInput = [...userInput, letter];
    setUserInput(newInput);

    if (newInput.length === wordLetters.length) {
      const guessWord = newInput.join("");
      const correctWord = current.word;

      setTimeout(() => {
        if (guessWord === correctWord) {
          const newScore = score + 10;
          setScore(newScore);
          if (level + 1 === levels.length) {
            setCompleted(true);
            Alert.alert("🏁 Game Complete!", `Your final score: ${newScore}`);
          } else {
            Alert.alert("✅ Correct!", `+10 points! Moving to next level.`);
            setTimeout(() => {
              setLevel(level + 1);
              setUserInput([]);
            }, 800);
          }
        } else {
          Alert.alert("❌ Try Again!", "That’s not correct.");
          setUserInput([]);
        }
      }, 300);
    }
  };

  // Handle erase
  const handleErase = () => {
    if (userInput.length > 0) {
      const newInput = [...userInput];
      newInput.pop();
      setUserInput(newInput);
    }
  };

  if (completed) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>

        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { fontFamily: "Poppins_600SemiBold" }]}>
          🎉 Congratulations!
        </Text>
        <Text style={[styles.text, { fontFamily: "Poppins_400Regular" }]}>
          You finished all levels.
        </Text>
        <Text style={[styles.text, { fontFamily: "Poppins_400Regular" }]}>
          Final Score: {score}
        </Text>
      </View>
    );
  }

  // Break alphabet into 4-column rows
  const rows = [];
  for (let i = 0; i < alphabet.length; i += 4) {
    rows.push(alphabet.slice(i, i + 4));
  }
  // Add Erase button next to Z (last row)
  rows[rows.length - 1].push("Erase");

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Level and Score */}
      <View style={styles.topInfo}>
        <Text style={[styles.level, { fontFamily: "Poppins_400Regular" }]}>
          Level: {level + 1}
        </Text>
        <Text style={[styles.score, { fontFamily: "Poppins_400Regular" }]}>
          Score: {score}
        </Text>
      </View>

      {/* Hint */}
      <View style={styles.hintContainer}>
        <Text style={[styles.hint, { fontFamily: "Poppins_400Regular" }]}>
          {current.hint}
        </Text>
      </View>

      {/* Word Boxes */}
      <View style={styles.wordContainer}>
        {wordLetters.map((_, i) => (
          <View
            key={i}
style={[styles.box, { width: boxWidth, height: boxHeight }]}

           
