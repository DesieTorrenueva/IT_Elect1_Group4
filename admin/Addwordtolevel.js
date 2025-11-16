import React, { useState, useEffect } from "react";
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
import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";

let db = null;
const SQL_AVAILABLE = SQLite && typeof SQLite.openDatabase === "function";
if (SQL_AVAILABLE) {
  db = SQLite.openDatabase("words.db");
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT,
        hint TEXT,
        level TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => console.log("Addwordtolevel: ensured words table exists"),
      (t, error) => {
        console.error("Failed to create words table", error);
        return false;
      }
    );
  });
} else {
  console.warn(
    "expo-sqlite not available; falling back to AsyncStorage-only mode"
  );
}

export default function Addwordtolevel({ navigation }) {
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [level, setLevel] = useState("Easy");
  const [category, setCategory] = useState("Fruit");
  const [wordsList, setWordsList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const ALL_LEVELS = ["Easy", "Intermediate", "Expert"];
  const ALL_CATS = [
    "Fruit",
    "Animal",
    "Career",
    "Country",
    "Literature",
    "Phenomena",
  ];

  const loadWords = async () => {
    if (SQL_AVAILABLE && db) {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM words ORDER BY id DESC",
          [],
          (txObj, { rows }) => {
            setWordsList(rows._array || []);
          },
          (t, error) => {
            console.error("Failed to load words from SQLite", error);
            setWordsList([]);
            return false;
          }
        );
      });
    } else {
      try {
        const combined = [];
        for (let lvl of ALL_LEVELS) {
          for (let cat of ALL_CATS) {
            const key = `${lvl}_${cat}_words`;
            const raw = await AsyncStorage.getItem(key);
            if (raw) {
              const list = JSON.parse(raw) || [];
              list.forEach((w, idx) => {
                combined.push({
                  id: `${lvl}_${cat}_${idx}_${Date.now()}`,
                  word: w.word,
                  hint: w.hint,
                  level: lvl,
                  category: cat,
                });
              });
            }
          }
        }
        setWordsList(combined.reverse());
      } catch (err) {
        console.error("Failed to load words from AsyncStorage fallback", err);
        setWordsList([]);
      }
    }
  };

  useEffect(() => {
    loadWords();
  }, []);

  const handleSubmit = async () => {
    if (!word.trim() || !hint.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const newWord = word.trim().toUpperCase();
    const newHint = hint.trim();

    if (editingItem) {
      // --- EDIT WORD ---
      if (
        SQL_AVAILABLE &&
        db &&
        editingItem.id &&
        String(editingItem.id).indexOf("_") === -1
      ) {
        db.transaction((tx) => {
          tx.executeSql(
            "UPDATE words SET word = ?, hint = ?, level = ?, category = ? WHERE id = ?",
            [newWord, newHint, level, category, editingItem.id],
            () => loadWords(),
            (t, error) => console.error("SQLite update error:", error)
          );
        });
      }

      try {
        const key = `${editingItem.level}_${editingItem.category}_words`;
        const existing = await AsyncStorage.getItem(key);
        if (existing) {
          const list = JSON.parse(existing).map((w) => {
            if (w.word === editingItem.word && w.hint === editingItem.hint)
              return { word: newWord, hint: newHint };
            return w;
          });
          await AsyncStorage.setItem(key, JSON.stringify(list));
        }
      } catch (e) {
        console.error("Failed to edit word in AsyncStorage", e);
      }

      Alert.alert("Success", `Word "${newWord}" updated!`);
      setEditingItem(null);
    } else {
      // --- ADD WORD ---
      if (SQL_AVAILABLE && db) {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO words (word, hint, level, category) VALUES (?, ?, ?, ?)",
            [newWord, newHint, level, category],
            () => loadWords(),
            (t, error) => console.error("SQLite insert error:", error)
          );
        });
      }

      try {
        const key = `${level}_${category}_words`;
        const existing = await AsyncStorage.getItem(key);
        const list = existing ? JSON.parse(existing) : [];
        list.push({ word: newWord, hint: newHint });
        await AsyncStorage.setItem(key, JSON.stringify(list));
      } catch (e) {
        console.error("Failed to save words to AsyncStorage", e);
      }

      Alert.alert("Success", `Word "${newWord}" added!`);
    }

    setWord("");
    setHint("");
    setLevel("Easy");
    setCategory("Fruit");
    loadWords();
  };

  const handleEdit = (item) => {
    setWord(item.word);
    setHint(item.hint);
    setLevel(item.level);
    setCategory(item.category);
    setEditingItem(item);
  };

  const handleCancelEdit = () => {
    setWord("");
    setHint("");
    setLevel("Easy");
    setCategory("Fruit");
    setEditingItem(null);
  };

  const deleteWord = async (item) => {
    if (
      SQL_AVAILABLE &&
      db &&
      item.id &&
      String(item.id).indexOf("_") === -1
    ) {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM words WHERE id = ?",
          [item.id],
          () => loadWords(),
          (t, error) => console.error("SQLite delete error:", error)
        );
      });
    }

    try {
      const key = `${item.level}_${item.category}_words`;
      const existing = await AsyncStorage.getItem(key);
      if (existing) {
        const list = JSON.parse(existing).filter(
          (w) => w.word !== item.word || w.hint !== item.hint
        );
        await AsyncStorage.setItem(key, JSON.stringify(list));
      }
    } catch (e) {
      console.error("Failed to delete word from AsyncStorage", e);
    }

    loadWords();
  };

  return (
    <LinearGradient colors={["#2E5C8A", "#CDA474"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Input */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Word:</Text>
          <TextInput
            placeholder="Enter Word"
            placeholderTextColor="#888"
            value={word}
            onChangeText={setWord}
            style={styles.inputWord}
          />
          <Text style={styles.label}>Hint:</Text>
          <TextInput
            placeholder="Enter Hint"
            placeholderTextColor="#888"
            value={hint}
            onChangeText={setHint}
            style={styles.inputHint}
            multiline={true}
            textAlignVertical="top"
            scrollEnabled={false} // prevent horizontal scrolling
          />
        </View>

        {/* Level */}
        <Text style={styles.levelLabel}>Select Level:</Text>
        <View style={styles.levelRow}>
          {ALL_LEVELS.map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[styles.levelButton, level === lvl && styles.activeLevelButton]}
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

        {/* Category */}
        <Text style={styles.levelLabel}>Select Category:</Text>
        <View style={styles.categoryRow}>
          {ALL_CATS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.activeCategoryButton,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && { color: "#fff", fontWeight: "700" },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit */}
        <View style={{ width: "100%" }}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              {editingItem ? "Update Word" : "Add Word"}
            </Text>
          </TouchableOpacity>
          {editingItem && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Words List */}
        <Text style={styles.listTitle}>Recently Added Words</Text>
        {wordsList.map((item) => (
          <View key={item.id} style={styles.wordItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.wordText}>
                {item.word} — <Text style={styles.hintText}>{item.hint}</Text>
              </Text>
              <Text style={styles.infoText}>
                Level: {item.level} • Category: {item.category}
              </Text>
            </View>
            <View style={styles.wordActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEdit(item)}
              >
                <Ionicons name="create-outline" size={22} color="#1B4D90" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => deleteWord(item)}
              >
                <Ionicons name="trash-outline" size={22} color="#b00020" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, alignItems: "center" },
  topBar: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 40,
    left: 20,
    zIndex: 10,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 25,
  },
  logo: { width: 120, height: 120, marginBottom: 8 },
  inputCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    width: "100%",
    padding: 20,
    marginBottom: 25,
  },
  label: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 5 },
  inputWord: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputHint: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    minHeight: 50,
    maxHeight: 150,
    flexShrink: 1,
    // auto-growing
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
    marginBottom: 20,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: "#dfe4ea",
    borderRadius: 12,
    alignItems: "center",
  },
  activeLevelButton: { backgroundColor: "#1565C0" },
  levelText: { color: "#333", fontWeight: "600" },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    justifyContent: "center",
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#dfe4ea",
    borderRadius: 12,
    margin: 5,
  },
  activeCategoryButton: { backgroundColor: "#8A531C" },
  categoryText: { color: "#333", fontWeight: "600" },
  submitButton: {
    width: "100%",
    backgroundColor: "#eadcdc",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 10,
  },
  submitText: { color: "#536b8e", fontSize: 18, fontWeight: "700" },
  cancelButton: {
    width: "100%",
    backgroundColor: "#ccc",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 15,
  },
  cancelText: { color: "#333", fontSize: 16, fontWeight: "700" },
  listTitle: {
    fontSize: 20,
    color: "white",
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "700",
  },
  wordItem: {
    width: "100%",
    backgroundColor: "#ffffffdd",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  wordText: { fontSize: 16, fontWeight: "700", flexWrap: "wrap" },
  hintText: { fontStyle: "italic", flexWrap: "wrap" },
  infoText: { fontSize: 13, color: "#555" },
  wordActions: { justifyContent: "space-between" },
  actionButton: { marginVertical: 4 },
});
