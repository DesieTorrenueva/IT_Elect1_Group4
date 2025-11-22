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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Setting from "../user/Setting";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Quit from "../user/Quit";

export default function GameDashboard({ navigation }) {
  const [score, setScore] = useState(0);
  const [settingVisible, setSettingVisible] = useState(false);
  const [quitVisible, setQuitVisible] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [categoryLevels, setCategoryLevels] = useState({});
  const [categoryWords, setCategoryWords] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminFlag = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        setIsAdmin(role && role.toLowerCase() === 'admin');
      } catch (err) {
        setIsAdmin(false);
      }
    };
    checkAdminFlag();
  }, []);

  // Load categories from Firebase (admin-managed only)
  const loadCustomCategories = useCallback(async () => {
    try {
      const categoriesQuery = query(collection(db, "categories"));
      const querySnapshot = await getDocs(categoriesQuery);
      const customCats = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let imageSource = null;
        if (data.imageUrl) {
          imageSource = { uri: data.imageUrl };
        } else if (data.imageBase64) {
          imageSource = { uri: `data:image/png;base64,${data.imageBase64}` };
        }
        customCats.push({
          name: data.name,
          image: imageSource,
          id: doc.id
        });
      });

      setCategories(customCats);
    } catch (error) {
      console.error("Error loading custom categories:", error);
    }
  }, []);

  // Load user score on focus
  useFocusEffect(
    useCallback(() => {
      const loadScore = async () => {
        try {
          const userId = await AsyncStorage.getItem("userId");
          if (userId) {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
              setScore(userDoc.data().score || 0);
            }
          }
        } catch (e) {
          console.error("Failed to load score", e);
        }
      };
      loadScore();
      loadCustomCategories();
    }, [])
  );

  const loadCategoryData = useCallback(async () => {
    if (!selectedDifficulty) return;

    setLoading(true);
    const levelsData = {};
    const wordsData = {};

    try {
      const userId = await AsyncStorage.getItem("userId");
      
      for (let cat of categories) {
        // Fetch words from Firestore
        const wordsQuery = query(
          collection(db, "words"),
          where("level", "==", selectedDifficulty),
          where("category", "==", cat.name)
        );
        const querySnapshot = await getDocs(wordsQuery);
        const words = [];
        
        querySnapshot.forEach((doc) => {
          const wordData = { id: doc.id, ...doc.data() };
          console.log(`[DEBUG] Loaded word for ${cat.name} (${selectedDifficulty}):`, wordData);
          console.log(`[DEBUG] Word: "${wordData.word}", Hint: "${wordData.hint}"`);
          words.push(wordData);
        });
        
        wordsData[cat.name] = words;

        // Get user progress from AsyncStorage
        const progressKey = `${userId}_${selectedDifficulty}_${cat.name}_progress`;
        const progress = await AsyncStorage.getItem(progressKey);
        const currentLevel = progress ? parseInt(progress) : 0;

        levelsData[cat.name] = {
          current: currentLevel,
          total: words.length
        };
      }

      setCategoryLevels(levelsData);
      setCategoryWords(wordsData);
    } catch (e) {
      console.error("Error loading category data", e);
    }
    setLoading(false);
  }, [selectedDifficulty, categories]);

  // Load category data when difficulty changes
  useEffect(() => {
    loadCategoryData();
  }, [selectedDifficulty, categories]);

  // Reload category data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (selectedDifficulty) loadCategoryData();
    }, [selectedDifficulty, categories])
  );

  // Handle difficulty button press
  const handleDifficulty = (difficulty) => {
    setSettingVisible(false);
    setSelectedDifficulty(difficulty);
  };

  // Handle category card press
  const handleCategory = (category) => {
    if (!selectedDifficulty) return;
    setSettingVisible(false);
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
        <View style={styles.gameTopBar}>
          <TouchableOpacity onPress={() => setSelectedDifficulty(null)}>
            <Ionicons name="arrow-back-outline" size={30} color="#fff"  />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>{selectedDifficulty}</Text>
          <TouchableOpacity onPress={() => setSettingVisible(true)}>
            <Ionicons name="settings-outline" size={30} color="#f5d9a4" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 100 }} />
        ) : (
          <View style={{ flex: 1, width: '100%' }}>
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
              showsVerticalScrollIndicator={true}
            />
          </View>
        )}

        <Quit
          visible={quitVisible}
          onClose={() => setQuitVisible(false)}
          onConfirm={() => {
            setQuitVisible(false);
            setSelectedDifficulty(null);
          }}
        />

        {/* Only show Setting modal when explicitly triggered */}
        {settingVisible && (
          <Setting
            isVisible={settingVisible}
            onClose={() => setSettingVisible(false)}
            navigation={navigation}
          />
        )}
      </LinearGradient>
    );
  }

  // Main home screen
  return (
    <LinearGradient colors={["#0b4c85", "#dfb487"]} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={styles.gametopBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Help")}>
          <Ionicons name="help-circle-outline" size={30} color="#f5d9a4" />
        </TouchableOpacity>
        <Image
          source={require("../assets/logo.png")}
          style={styles.loGo}
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

      {/* Only show Setting modal when explicitly triggered */}
      {/* Only show Setting modal when explicitly triggered */}
      {!isAdmin && settingVisible && (
        <Setting
          isVisible={settingVisible}
          onClose={() => {
            setSettingVisible(false);
          }}
          navigation={navigation}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, alignItems: "center", justifyContent: "flex-start" },
  gametopBar: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    zIndex: 10,
    marginTop: 18,
  },
  gameTopBar: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    zIndex: 10,
    marginTop: -10,
  },
  loGo: { width: 80, height: 80, marginTop: -20 },
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
    marginTop: 50,
  },
});

