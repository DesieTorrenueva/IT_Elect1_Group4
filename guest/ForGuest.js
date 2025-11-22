import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const { width: screenWidth } = Dimensions.get("window");

const levels = [
  { word: "APPLE", hint: "A fruit that keeps the doctor away" },
  { word: "BANANA", hint: "A long yellow fruit" },
  { word: "ORANGE", hint: "A citrus fruit" },
  { word: "MANGO", hint: "A tropical sweet fruit" },
  { word: "PEACH", hint: "A soft, fuzzy fruit" },
  { word: "GRAPE", hint: "A small purple fruit" },
  { word: "CHERRY", hint: "A small red fruit often on cakes" },
  { word: "LEMON", hint: "A sour yellow fruit" },
  { word: "PAPAYA", hint: "An orange tropical fruit" },
  { word: "WATERMELON", hint: "A large juicy fruit with many seeds" },
];

export default function ForGuest({ navigation }) {
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [wrong, setWrong] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.guest_loadingContainer}>
        <ActivityIndicator size="large" color="#1B4D90" />
      </View>
    );
  }

  const current = levels[level];
  const wordLetters = current.word.split("");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const totalMargin = (wordLetters.length - 1) * 6;
  const boxWidth = Math.min(
    50,
    (screenWidth - 60 - totalMargin) / wordLetters.length
  );
  const boxHeight = boxWidth * 1.2;

  const triggerShake = () => {
    setWrong(true);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start(() => setWrong(false));
  };

  const handleGuess = (letter) => {
    if (userInput.length >= wordLetters.length) return;

    const newInput = [...userInput, letter];
    setUserInput(newInput);

    if (newInput.length === wordLetters.length) {
      const guessWord = newInput.join("");
      const correctWord = current.word;

      setTimeout(() => {
        if (guessWord === correctWord) {
          setScore(prev => prev + 10);
          if (level + 1 === levels.length) {
            setCompleted(true);
          } else {
            setTimeout(() => {
              setLevel(level + 1);
              setUserInput([]);
            }, 500);
          }
        } else {
          triggerShake();
          setTimeout(() => setUserInput([]), 500);
        }
      }, 200);
    }
  };

  const handleErase = () => {
    if (userInput.length > 0) {
      const newInput = [...userInput];
      newInput.pop();
      setUserInput(newInput);
    }
  };

  if (completed) {
    return (
      <View style={styles.guest_container}>
        <TouchableOpacity
          style={styles.guest_baCkButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>

        <Image
          source={require("../assets/logo.png")}
          style={styles.guest_logo}
          resizeMode="contain"
        />

        <Text style={[styles.guest_title, { fontFamily: "Poppins_600SemiBold" }]}>
          🎉 Congratulations!
        </Text>

        <Text style={[styles.guest_text, { fontFamily: "Poppins_400Regular" }]}>
          You finished all levels.
        </Text>

        <Text style={[styles.guest_text, { fontFamily: "Poppins_400Regular" }]}>
          Final Score: {score}
        </Text>
      </View>
    );
  }

  const rows = [];
  for (let i = 0; i < alphabet.length; i += 4) {
    rows.push(alphabet.slice(i, i + 4));
  }
  rows[rows.length - 1].push("Erase");

  return (
    <View style={styles.guest_container}>
      <TouchableOpacity
        style={styles.guest_baCkButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Image
        source={require("../assets/logo.png")}
        style={styles.guest_logo}
        resizeMode="contain"
      />

      <View style={styles.guest_topInfo}>
        <Text style={[styles.guest_level, { fontFamily: "Poppins_400Regular" }]}>
          Level: {level + 1}
        </Text>

        <Text style={[styles.guest_score, { fontFamily: "Poppins_400Regular" }]}>
          Score: {score}
        </Text>
      </View>

      <View style={styles.guest_hintContainer}>
        <Text style={[styles.guest_hint, { fontFamily: "Poppins_400Regular" }]}>
          {current.hint}
        </Text>
      </View>

      <Animated.View
        style={[
          styles.guest_wordContainer,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        {wordLetters.map((_, i) => (
          <View
            key={i}
            style={[
              styles.guest_box,
              {
                width: boxWidth,
                height: boxHeight,
                borderColor: wrong ? "#E74C3C" : "#1B4D90",
                backgroundColor: wrong ? "#FFD6D6" : "#fff",
              },
            ]}
          >
            <Text
              style={[
                styles.guest_letter,
                { fontFamily: "Poppins_600SemiBold", fontSize: boxWidth * 0.6 },
              ]}
            >
              {userInput[i] || ""}
            </Text>
          </View>
        ))}
      </Animated.View>

      <View style={styles.guest_keyboard}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.guest_row}>
            {row.map((key) =>
              key === "Erase" ? (
                <TouchableOpacity
                  key={key}
                  style={styles.guest_eraseKey}
                  onPress={handleErase}
                >
                  <Ionicons name="backspace-outline" size={26} color="#fff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={key}
                  style={styles.guest_key}
                  onPress={() => handleGuess(key)}
                >
                  <Text
                    style={[
                      styles.guest_keyText,
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
  guest_container: {
    flex: 1,
    backgroundColor: "#DDF3FF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingTop: 20,
  },
  guest_loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DDF3FF",
  },
  guest_baCkButton: {
    top: 30,
    left: 15,
    position: "absolute",
    zIndex: 10,
  },
  guest_logo: {
    width: 120,
    height: 60,
    marginBottom: 5,
    marginTop: 10,
  },
  guest_topInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 10,
  },
  guest_level: {
    fontSize: 18,
    color: "#333",
  },
  guest_score: {
    fontSize: 18,
    color: "#333",
  },
  guest_hintContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    width: "80%",
    alignItems: "center",
    marginBottom: 5,
  },
  guest_hint: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  guest_wordContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  guest_box: {
    borderWidth: 2,
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  guest_letter: {
    color: "#1B4D90",
  },
  guest_keyboard: {
    alignItems: "center",
    marginTop: 2,
  },
  guest_row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  guest_key: {
    width: 60,
    height: 50,
    backgroundColor: "#4C9EEB",
    margin: 5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  guest_eraseKey: {
    width: 75,
    height: 50,
    backgroundColor: "#E74C3C",
    margin: 6,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  guest_keyText: {
    color: "white",
    fontSize: 20,
  },
  guest_title: {
    fontSize: 24,
    marginVertical: 10,
  },
  guest_text: {
    fontSize: 18,
    marginVertical: 6,
  },
});