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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import * as Haptics from 'expo-haptics';
import { useSettings } from './SettingsContext';

const { width: screenWidth } = Dimensions.get("window");

export default function Easy({ route, navigation }) {
  const { category, difficulty, levels: passedLevels = [], resumeLevel = 0 } = route.params || {};
  const levels = Array.isArray(passedLevels) ? passedLevels : [];

  const initialLevel = Number.isInteger(resumeLevel) && resumeLevel >= 0 && resumeLevel < levels.length ? resumeLevel : 0;

  console.log(`[DEBUG Easy] Received levels:`, levels);
  console.log(`[DEBUG Easy] Current level [${initialLevel}]:`, levels[initialLevel]);

  const [level, setLevel] = useState(initialLevel);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState([]);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold });
  const { vibrationEnabled } = useSettings();

  // Load GLOBAL SCORE from Firestore
  useEffect(() => {
    const loadStoredScore = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            setScore(userDoc.data().score || 0);
          }
        }
      } catch (error) {
        console.error("Error loading stored score:", error);
      }
    };
    loadStoredScore();
  }, []);

  // Save current progress per category + difficulty when level changes
  useEffect(() => {
    if (!difficulty || !category) return;
    const saveProgress = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const key = `${userId}_${difficulty}_${category}_progress`;
        await AsyncStorage.setItem(key, level.toString());
      } catch (e) {
        console.error("Error saving progress:", e);
      }
    };
    saveProgress();
  }, [level, difficulty, category]);

  const updateStoredScore = async (newScore) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        await updateDoc(doc(db, "users", userId), {
          score: newScore
        });
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const triggerShake = () => {
    if (vibrationEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setWrong(true);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start(() => setWrong(false));
  };

  const handleShowHint = () => {
    if (score < 10) {
      Alert.alert("Not Enough Points", "You need at least 10 points to use this feature.");
      return;
    }

    // Find unrevealed letter positions
    const unrevealedPositions = [];
    for (let i = 0; i < currentWord.length; i++) {
      if (!revealedLetters.includes(i)) {
        unrevealedPositions.push(i);
      }
    }

    if (unrevealedPositions.length === 0) {
      Alert.alert("All Letters Revealed", "All letters have already been revealed!");
      return;
    }

    Alert.alert(
      "Use Hint?",
      "This will reveal one letter and cost 10 points. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            // Pick a random unrevealed position
            const randomIndex = Math.floor(Math.random() * unrevealedPositions.length);
            const positionToReveal = unrevealedPositions[randomIndex];
            
            setRevealedLetters([...revealedLetters, positionToReveal]);
            
            const newScore = score - 10;
            setScore(newScore);
            updateStoredScore(newScore);
            
            const revealedLetter = currentWord[positionToReveal];
            Alert.alert("Letter Revealed", `The letter at position ${positionToReveal + 1} is: ${revealedLetter}`);
          }
        }
      ]
    );
  };

  const handleGuess = (letter) => {
    if (vibrationEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Count how many letters player needs to enter (excluding revealed positions)
    const positionsToFill = [];
    for (let i = 0; i < currentWord.length; i++) {
      if (!revealedLetters.includes(i)) {
        positionsToFill.push(i);
      }
    }

    if (userInput.length >= positionsToFill.length) return;

    const newInput = [...userInput, letter];
    setUserInput(newInput);

    // Check if we have all the letters needed (excluding revealed ones)
    if (newInput.length === positionsToFill.length) {
      // Build the complete word from userInput + revealed letters
      const completeWord = [];
      let userInputIndex = 0;
      
      for (let i = 0; i < currentWord.length; i++) {
        if (revealedLetters.includes(i)) {
          completeWord[i] = currentWord[i]; // Use revealed letter
        } else {
          completeWord[i] = newInput[userInputIndex];
          userInputIndex++;
        }
      }

      const guessWord = completeWord.join("");
      setTimeout(() => {
        if (guessWord === currentWord) {
          const newScore = score + 10;
          setScore(newScore);
          updateStoredScore(newScore);

          if (level + 1 === levels.length) {
            setLevel(level + 1);
            setCompleted(true);
          } else {
            setTimeout(() => {
              setLevel(level + 1);
              setUserInput([]);
              setRevealedLetters([]);
            }, 500);
          }
        } else {
          triggerShake();
          setTimeout(() => setUserInput([]), 500);
        }
      }, 200);
    }
  };

  if (!fontsLoaded) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#1B4D90" /></View>;

  if (!levels || levels.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        <View style={{ alignItems: "center", paddingHorizontal: 30 }}>
          <Text style={[styles.title, { fontFamily: "Poppins_600SemiBold", textAlign: "center" }]}>
            No words yet
          </Text>
          <Text style={[styles.text, { fontFamily: "Poppins_400Regular", textAlign: "center" }]}>
            The admin hasn't added words for {category} in {difficulty}.
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, backgroundColor: "#4C9EEB", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentWord = !completed ? (levels[level]?.word?.toUpperCase() || "") : "";
  const currentHint = levels[level]?.hint || "No hint available";
  
  console.log(`[DEBUG Easy] Level ${level}: word="${levels[level]?.word}", hint="${currentHint}"`);
  
  const wordLetters = currentWord.split("");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const totalMargin = (wordLetters.length - 1) * 6;
  const boxWidth = Math.min(50, (screenWidth - 60 - totalMargin) / wordLetters.length);
  const boxHeight = boxWidth * 1.2;

  const keyboardRows = [];
  for (let i = 0; i < alphabet.length; i += 4) keyboardRows.push(alphabet.slice(i, i + 4));
  keyboardRows[keyboardRows.length - 1].push("Erase");

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>
      <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />

      {completed ? (
        <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center", paddingHorizontal: 20, backgroundColor: "#DDF3FF" }}>
          <Text style={[styles.title, { fontFamily: "Poppins_600SemiBold", fontSize: 36, marginBottom: 20, color: "#333" }]}>🎉 Congratulations!</Text>
          <Text style={[styles.text, { fontFamily: "Poppins_400Regular", fontSize: 20, marginBottom: 10, color: "#333", textAlign: "center" }]}>You finished all levels in {category}!</Text>
          <Text style={[styles.text, { fontFamily: "Poppins_400Regular", fontSize: 20, marginBottom: 30, color: "#333" }]}>Final Score: {score}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, backgroundColor: "#4C9EEB", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Back to Categories</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.topInfo}>
            <Text style={[styles.level, { fontFamily: "Poppins_400Regular" }]}>Level: {level + 1}</Text>
            <Text style={[styles.score, { fontFamily: "Poppins_400Regular" }]}>Score: {score}</Text>
          </View>

          <View style={styles.hintContainer}>
            <Text style={[styles.hint, { fontFamily: "Poppins_400Regular" }]}>
              {currentHint}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.showHintButton}
            onPress={handleShowHint}
          >
            <Ionicons name="bulb-outline" size={20} color="#fff" />
            <Text style={styles.showHintText}>
              Use Hint (-10 pts)
            </Text>
          </TouchableOpacity>

          <Animated.View style={[styles.wordContainer, { transform: [{ translateX: shakeAnim }] }]}>
            {wordLetters.map((letter, i) => (
              <View key={i} style={[styles.box, { width: boxWidth, height: boxHeight, borderColor: wrong ? "#E74C3C" : "#1B4D90", backgroundColor: revealedLetters.includes(i) ? "#E8F5E9" : (wrong ? "#FFD6D6" : "#fff") }]}>
                <Text style={[styles.letter, { fontFamily: "Poppins_600SemiBold", fontSize: boxWidth * 0.6 }]}>{revealedLetters.includes(i) ? letter : (userInput[i] || "")}</Text>
              </View>
            ))}
          </Animated.View>

          <View style={styles.keyboard}>
            {keyboardRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((key) =>
                  key === "Erase" ? (
                    <TouchableOpacity key={key} style={styles.eraseKey} onPress={() => setUserInput(userInput.slice(0, -1))}>
                      <Ionicons name="backspace-outline" size={26} color="#fff" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity key={key} style={styles.key} onPress={() => handleGuess(key)}>
                      <Text style={[styles.keyText, { fontFamily: "Poppins_600SemiBold" }]}>{key}</Text>
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
  container: { flex: 1, backgroundColor: "#DDF3FF", alignItems: "center", justifyContent: "center", paddingTop: 30 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#DDF3FF" },
  backButton: { position: "absolute", top: 10, left: 10, zIndex: 10 },
  logo: { width: 150, height: 80, marginBottom: 10 },
  topInfo: { flexDirection: "row", justifyContent: "space-between", width: "85%", marginBottom: 3 },
  level: { fontSize: 18, color: "#333" },
  score: { fontSize: 18, color: "#333" },
  hintContainer: { backgroundColor: "#fff", borderRadius: 10, padding: 12, width: "80%", alignItems: "center", marginBottom: 5, 
    shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  hint: { fontSize: 16, color: "#333", textAlign: "center" },
  showHintButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 1,
  },
  showHintText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
  },
  wordContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10, flexWrap: "wrap" },
  box: { borderWidth: 2, marginHorizontal: 3, alignItems: "center", justifyContent: "center", borderRadius: 10 },
  letter: { color: "#1B4D90" },
  keyboard: { alignItems: "center", marginTop: 1 },
  row: { flexDirection: "row", justifyContent: "center" },
  key: { width: 60, height: 47, backgroundColor: "#4C9EEB", margin: 6, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  eraseKey: { width: 75, height: 46, backgroundColor: "#E74C3C", margin: 6, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  keyText: { color: "white", fontSize: 20 },
  title: { fontSize: 24, marginVertical: 10 },
  text: { fontSize: 18, marginVertical: 6 },
});