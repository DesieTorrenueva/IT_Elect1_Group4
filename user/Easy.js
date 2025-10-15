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
  { word: "BROOM", hint: "Used to sweep the floor" },
  { word: "MIRROR", hint: "Reflects your image" },
  { word: "BLANKET", hint: "Keeps you warm while sleeping" },
  { word: "GARDEN", hint: "Where flowers and plants grow" },
  { word: "BRUSH", hint: "Used to comb hair or clean surfaces" },

  { word: "PHONE", hint: "Used to call or text people" },
  { word: "TABLE", hint: "Furniture where you put things" },
  { word: "CLOUD", hint: "White and floats in the sky" },
  { word: "RIVER", hint: "Flows with water toward the sea" },
  { word: "MUSIC", hint: "You listen to this for entertainment" }
];

export default function Easy() {
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
          onPress={() => navigation.navigate("GameDashboard")}
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
        onPress={() => navigation.navigate("GameDashboard")}
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
          >
            <Text
              style={[
                styles.letter,
                { fontFamily: "Poppins_600SemiBold", fontSize: boxWidth * 0.6 },
              ]}
            >
              {userInput[i] || ""}
            </Text>
          </View>
        ))}
      </View>

      {/* Keyboard (4 columns per row) */}
      <View style={styles.keyboard}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key) =>
              key === "Erase" ? (
                <TouchableOpacity
                  key={key}
                  style={styles.eraseKey}
                  onPress={handleErase}
                >
                  <Ionicons name="backspace-outline" size={26} color="#fff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={key}
                  style={styles.key}
                  onPress={() => handleGuess(key)}
                >
                  <Text
                    style={[
                      styles.keyText,
                      { fontFamily: "Poppins_600SemiBold" },
                    ]}
                  >
                    {key}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDF3FF",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DDF3FF",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  logo: {
    width: 150,
    height: 80,
    marginBottom: 2,
  },
  topInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 10,
  },
  level: {
    fontSize: 18,
    color: "#333",
  },
  score: {
    fontSize: 18,
    color: "#333",
  },
  hintContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  hint: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  wordContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    flexWrap: "wrap",
  },
  box: {
    borderWidth: 2,
    borderColor: "#1B4D90",
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  letter: {
    color: "#1B4D90",
  },
  keyboard: {
    alignItems: "center",
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  key: {
    width: 60,
    height: 55,
    backgroundColor: "#4C9EEB",
    margin: 6,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  eraseKey: {
    width: 75,
    height: 55,
    backgroundColor: "#E74C3C",
    margin: 6,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    color: "white",
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    marginVertical: 10,
  },
  text: {
    fontSize: 18,
    marginVertical: 6,
  },
});
