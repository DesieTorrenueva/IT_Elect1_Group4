import React, { useState, useEffect, useRef } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  { word: "MUSIC", hint: "You listen to this for entertainment" },
];

export default function Easy({ route, navigation }) {
  const resumeLevel = route.params?.resumeLevel || 0;

  const [level, setLevel] = useState(resumeLevel);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [wrong, setWrong] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  // Load global score
  useEffect(() => {
    const loadStoredScore = async () => {
      try {
        const storedScore = await AsyncStorage.getItem("userScore");
        if (storedScore !== null) setScore(parseInt(storedScore));
      } catch (error) {
        console.error("Error loading stored score:", error);
      }
    };
    loadStoredScore();
  }, []);

  // Save current level whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("EasyLevel", level.toString()).catch((e) =>
      console.error("Error saving level:", e)
    );
  }, [level]);

  const current = levels[level];
  const wordLetters = current.word.split("");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const totalMargin = (wordLetters.length - 1) * 6;
  const boxWidth = Math.min(
    50,
    (screenWidth - 60 - totalMargin) / wordLetters.length
  );
  const boxHeight = boxWidth * 1.2;

  const updateStoredScore = async (newScore) => {
    try {
      await AsyncStorage.setItem("userScore", newScore.toString());
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

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
          const newScore = score + 10;
          setScore(newScore);
          updateStoredScore(newScore);

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

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B4D90" />
      </View>
    );
  }

  const rows = [];
  for (let i = 0; i < alphabet.length; i += 4) {
    rows.push(alphabet.slice(i, i + 4));
  }
  rows[rows.length - 1].push("Erase");

  return (
    <View style={styles.container}>
      {/* BACK BUTTON */}
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

      {completed ? (
        <View style={{ alignItems: "center" }}>
          <Text style={[styles.title, { fontFamily: "Poppins_600SemiBold" }]}>
            🎉 Congratulations!
          </Text>
          <Text style={[styles.text, { fontFamily: "Poppins_400Regular" }]}>
            You finished all levels!
          </Text>
          <Text style={[styles.text, { fontFamily: "Poppins_400Regular" }]}>
            Final Score: {score}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.topInfo}>
            <Text style={[styles.level, { fontFamily: "Poppins_400Regular" }]}>
              Level: {level + 1}
            </Text>
            <Text style={[styles.score, { fontFamily: "Poppins_400Regular" }]}>
              Score: {score}
            </Text>
          </View>

          <View style={styles.hintContainer}>
            <Text style={[styles.hint, { fontFamily: "Poppins_400Regular" }]}>
              {current.hint}
            </Text>
          </View>

          <Animated.View
            style={[
              styles.wordContainer,
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            {wordLetters.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.box,
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
                    styles.letter,
                    { fontFamily: "Poppins_600SemiBold", fontSize: boxWidth * 0.6 },
                  ]}
                >
                  {userInput[i] || ""}
                </Text>
              </View>
            ))}
          </Animated.View>

          <View style={styles.keyboard}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((key) =>
                  key === "Erase" ? (
                    <TouchableOpacity
                      key={key}
                      style={styles.eraseKey}
                      onPress={() => setUserInput(userInput.slice(0, -1))}
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#DDF3FF", alignItems: "center", justifyContent: "center", paddingTop: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#DDF3FF" },
  backButton: { position: "absolute", top: 40, left: 20, zIndex: 10 },
  logo: { width: 150, height: 80, marginBottom: 2 },
  topInfo: { flexDirection: "row", justifyContent: "space-between", width: "85%", marginBottom: 10 },
  level: { fontSize: 18, color: "#333" },
  score: { fontSize: 18, color: "#333" },
  hintContainer: { backgroundColor: "#fff", borderRadius: 10, padding: 12, width: "80%", alignItems: "center", marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  hint: { fontSize: 16, color: "#333", textAlign: "center" },
  wordContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 20, flexWrap: "wrap" },
  box: { borderWidth: 2, marginHorizontal: 3, alignItems: "center", justifyContent: "center", borderRadius: 10 },
  letter: { color: "#1B4D90" },
  keyboard: { alignItems: "center", marginTop: 2 },
  row: { flexDirection: "row", justifyContent: "center" },
  key: { width: 60, height: 55, backgroundColor: "#4C9EEB", margin: 6, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  eraseKey: { width: 75, height: 55, backgroundColor: "#E74C3C", margin: 6, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  keyText: { color: "white", fontSize: 20 },
  title: { fontSize: 24, marginVertical: 10 },
  text: { fontSize: 18, marginVertical: 6 },
});
