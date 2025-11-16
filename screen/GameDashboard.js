import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Setting from "../user/Setting";
import Quit from "../user/Quit";

// STATIC CATEGORY LIST
const categories = [
  { name: "Fruit", image: require("../assets/fruit.jpg") },
  { name: "Animal", image: require("../assets/animal.jpg") },
  { name: "Career", image: require("../assets/career.jpg") },
  { name: "Country", image: require("../assets/country.jpg") },
  { name: "Literature", image: require("../assets/literature.jpg") },
  { name: "Phenomena", image: require("../assets/phenomena.jpg") },
];

export default function GameDashboard({ navigation }) {
  const [score, setScore] = useState(0);
  const [settingVisible, setSettingVisible] = useState(false);
  const [quitVisible, setQuitVisible] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [categoryLevels, setCategoryLevels] = useState({});
  const [categoryWords, setCategoryWords] = useState({});

  // Load user score on focus
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

  const updateUserScore = async (newScore) => {
  try {
    const credRaw = await AsyncStorage.getItem("user_credentials");
    if (!credRaw) return;

    const currentUser = JSON.parse(credRaw);

    const usersRaw = await AsyncStorage.getItem("users");
    let usersArr = usersRaw ? JSON.parse(usersRaw) : [];

    // find user
    const index = usersArr.findIndex(u => u.email === currentUser.email);

    if (index !== -1) {
      usersArr[index].score = newScore;
    } else {
      // if not found, push new user
      usersArr.push({ ...currentUser, score: newScore });
    }

    await AsyncStorage.setItem("users", JSON.stringify(usersArr));
  } catch (e) {
    console.log("Error updating user score:", e);
  }
};

const loadCategoryData = useCallback(async () => {
  if (!selectedDifficulty) return;

  const levelsData = {};
  const wordsData = {};

  for (let cat of categories) {
    try {
      // --- LEVELS ---
      const levelKey = `${selectedDifficulty}_${cat.name}_level`;
      let levelVal = await AsyncStorage.getItem(levelKey);

      if (!levelVal) {
        levelVal = JSON.stringify({ current: 0, total: 0 });
        await AsyncStorage.setItem(levelKey, levelVal);
      }

      const parsedLevel = JSON.parse(levelVal);

      // --- WORDS ---
      const wordsKey = `${selectedDifficulty}_${cat.name}_words`;
      let wordsVal = await AsyncStorage.getItem(wordsKey);

      if (!wordsVal) {
        wordsVal = JSON.stringify([]);
        await AsyncStorage.setItem(wordsKey, wordsVal);
      }

      const parsedWords = JSON.parse(wordsVal);
      wordsData[cat.name] = parsedWords;

      // --- Determine total ---
      const derivedTotal = parsedLevel.total > 0 ? parsedLevel.total : parsedWords.length;

      // --- Correct current if completed ---
      let correctedCurrent = parsedLevel.current || 0;
      if (correctedCurrent > derivedTotal) correctedCurrent = derivedTotal;

      // --- Persist corrected value ---
      if (correctedCurrent !== parsedLevel.current || derivedTotal !== parsedLevel.total) {
        await AsyncStorage.setItem(levelKey, JSON.stringify({
          current: correctedCurrent,
          total: derivedTotal
        }));
      }

      levelsData[cat.name] = { current: correctedCurrent, total: derivedTotal };

    } catch (e) {
      console.error("Error loading category data", e);
      levelsData[cat.name] = { current: 0, total: 0 };
      wordsData[cat.name] = [];
    }
  }

  setCategoryLevels(levelsData);
  setCategoryWords(wordsData);
}, [selectedDifficulty]);


  // Load category data when difficulty changes
  useEffect(() => {
    loadCategoryData();
  }, [selectedDifficulty]);

  // Reload category data when the screen comes into focus, to pick up admin changes
  useFocusEffect(
    useCallback(() => {
      if (selectedDifficulty) loadCategoryData();
    }, [selectedDifficulty])
  );

  // Handle difficulty button press
  const handleDifficulty = (difficulty) => setSelectedDifficulty(difficulty);

  // Handle category card press
  const handleCategory = (category) => {
    if (!selectedDifficulty) return;

    const screenName =
      selectedDifficulty === "Easy"
        ? "Easy"
        : selectedDifficulty === "Intermediate"
        ? "Intermediate"
        : "Expert";

    const categoryLevel = categoryLevels?.[category] || { current: 0, total: 0 };
    const isCompleted = categoryLevel.current === categoryLevel.total && categoryLevel.total > 0;
    if (isCompleted) {
      Alert.alert("Completed", "You've already finished this category.");
      return;
    }
    const resumeLevel = categoryLevel.current || 0;
    const levels = categoryWords?.[category] || [];

    navigation.navigate(screenName, {
      category,
      difficulty: selectedDifficulty,
      resumeLevel,
      levels,
    });
  };

  // If difficulty selected, show categories
  if (selectedDifficulty) {
    return (
      <LinearGradient colors={["#0b4c85", "#dfb487"]} style={styles.gradient}>
        <StatusBar barStyle="light-content" />
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setSelectedDifficulty(null)}>
            <Ionicons name="arrow-back-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>{selectedDifficulty}</Text>
          <TouchableOpacity onPress={() => setSettingVisible(true)}>
            <Ionicons name="settings-outline" size={30} color="#f5d9a4" />
          </TouchableOpacity>
        </View>

        <FlatList
  contentContainerStyle={styles.categoriesContainer}
  data={categories}
  numColumns={2}
  keyExtractor={(item) => item.name}
  renderItem={({ item }) => {
    const level = categoryLevels[item.name];
    const isCompleted = level?.current === level?.total && level?.total > 0;

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategory(item.name)}
      >
        <Image
          source={item.image}
          style={{ width: 100, height: 100, borderRadius: 15 }}
          resizeMode="cover"
        />
        <Text style={styles.categoryLevel}>
          {isCompleted ? "Completed!" : `Level: ${level?.current || 0}/${level?.total || 0}`}
        </Text>
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    );
  }}
/>


        <Quit
          visible={quitVisible}
          onClose={() => setQuitVisible(false)}
          onConfirm={() => {
            setQuitVisible(false);
            setSelectedDifficulty(null);
          }}
        />

        <Setting
          isVisible={settingVisible}
          onClose={() => setSettingVisible(false)}
          navigation={navigation}
        />
      </LinearGradient>
    );
  }

  // Main home screen
  return (
    <LinearGradient colors={["#0b4c85", "#dfb487"]} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Help")}>
          <Ionicons name="help-circle-outline" size={30} color="#f5d9a4" />
        </TouchableOpacity>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => setSettingVisible(true)}>
          <Ionicons name="settings-outline" size={30} color="#f5d9a4" />
        </TouchableOpacity>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.scoreNumber}>{score}</Text>
      </View>

      {/* LEVEL BUTTONS */}
      <TouchableOpacity
        style={[styles.button, styles.easyButton]}
        onPress={() => handleDifficulty("Easy")}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="musical-notes-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>EASY</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.intermediateButton]}
        onPress={() => handleDifficulty("Intermediate")}
      >
        <View style={styles.buttonContent}>
          <FontAwesome5 name="trophy" size={20} color="#fff" />
          <Text style={styles.buttonText}>INTERMEDIATE</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.expertButton]}
        onPress={() => handleDifficulty("Expert")}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="flame-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>EXPERT</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.leaderboardButton]}
        onPress={() => navigation.navigate("Leaderboard")}
      >
        <View style={styles.buttonContent}>
          <FontAwesome5 name="medal" size={20} color="#fff" />
          <Text style={styles.buttonText}>LEADERBOARD</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.quitButton]}
        onPress={() => setQuitVisible(true)}
      >
        <View style={styles.buttonContent}>
          <MaterialIcons name="exit-to-app" size={22} color="#fff" />
          <Text style={styles.buttonText}>QUIT</Text>
        </View>
      </TouchableOpacity>

      <Quit
        visible={quitVisible}
        onClose={() => setQuitVisible(false)}
        onConfirm={() => {
          setQuitVisible(false);
          navigation.navigate("Home");
        }}
      />

      <Setting
        isVisible={settingVisible}
        onClose={() => setSettingVisible(false)}
        navigation={navigation}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, alignItems: "center", justifyContent: "flex-start" },
  topBar: {
    position: "absolute",
    top: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 5 : 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    zIndex: 10,
  },
  logo: { width: 95, height: 95, marginTop: -10 },
  scoreContainer: { alignItems: "center", marginTop: 180, marginBottom: 25 },
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
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginVertical: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: { fontSize: 20, fontWeight: "700", color: "#fff" },
  easyButton: { backgroundColor: "#4cb771ff" },
  intermediateButton: { backgroundColor: "#c2a44dff" },
  expertButton: { backgroundColor: "#aa2fb0ff" },
  leaderboardButton: { backgroundColor: "#3a6b94ff" },
  quitButton: { backgroundColor: "#9a1b1bff", marginTop: 18 },
  categoriesContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 15,
    marginTop: 50,
  },
  categoryCard: {
    width: 150,
    height: 180,
    backgroundColor: "#1565C0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  categoryLevel: {
    color: "#f5d9a4",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 5,
  },
  categoryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center",
  },
  topBarTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#f5d9a4",
    textAlign: "center",
  },
});
