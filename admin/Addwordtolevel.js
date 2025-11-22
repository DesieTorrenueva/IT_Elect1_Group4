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
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import * as FileSystem from 'expo-file-system/legacy';

export default function Addwordtolevel({ navigation }) {
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [level, setLevel] = useState("Easy");
  const [category, setCategory] = useState("Fruit");
  const [wordsList, setWordsList] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLevel, setSearchLevel] = useState("");

  // Category Management States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const ALL_LEVELS = ["Easy", "Intermediate", "Expert"];

  // Load categories from Firebase
  const loadCategories = async () => {
    try {
      const categoriesQuery = query(collection(db, "categories"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(categoriesQuery);
      const cats = [];
      querySnapshot.forEach((doc) => {
        cats.push({ id: doc.id, ...doc.data() });
      });
      setCategories(cats);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  // Only use admin-added categories
  const getAllCategories = () => categories.map(cat => cat.name);

  // Load words from Firebase Firestore
  const loadWords = async () => {
    setLoading(true);
    try {
      const wordsQuery = query(collection(db, "words"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(wordsQuery);
      const words = [];
      
      querySnapshot.forEach((doc) => {
        words.push({ id: doc.id, ...doc.data() });
      });
      
      setWordsList(words);
      setFilteredWords(words);
    } catch (error) {
      console.error("Failed to load words from Firestore:", error);
      Alert.alert("Error", "Failed to load words.");
    }
    setLoading(false);
  };

  // Pick image from gallery
  const pickImage = async () => {
    console.log('pickImage called');
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need camera roll permissions to select an image.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2, // Lower quality for smaller size
      });

      if (!result.canceled) {
        setNewCategoryImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      Alert.alert('Error', 'Image picker failed to open.');
    }
  };

  // Save image as base64 string in Firestore (Expo Go compatible)
  const getImageBase64 = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error('File does not exist');
      // Resize/compress image before converting to base64
      // Use expo-image-manipulator for resizing
      const { manipulateAsync } = require('expo-image-manipulator');
      const resized = await manipulateAsync(
        uri,
        [{ resize: { width: 400 } }], // Resize to max 400px width
        { compress: 0.2, format: 'jpeg', base64: true }
      );
      return resized.base64;
    } catch (error) {
      console.error("Error reading image as base64:", error);
      throw error;
    }
  };

  // Add or update category
  const handleSaveCategory = async () => {
    if (!isAdmin) {
      Alert.alert('Permission denied', 'Only admins can add or edit categories.');
      return;
    }
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Please enter a category name.");
      return;
    }

    // Check if category name already exists
    const allCats = getAllCategories();
    const categoryExists = allCats.some(
      cat => cat.toLowerCase() === newCategoryName.trim().toLowerCase() && 
      (!editingCategory || cat !== editingCategory.name)
    );

    if (categoryExists) {
      Alert.alert("Error", "A category with this name already exists.");
      return;
    }

    if (!editingCategory && !newCategoryImage) {
      Alert.alert("Error", "Please select an image for the category.");
      return;
    }

    setLoading(true);

    try {

      let imageBase64 = editingCategory?.imageBase64 || "";
      let imageUrl = editingCategory?.imageUrl || "";

      // Read new image as base64 if selected AND it's a new file URI (not a data URI)
      if (newCategoryImage && !newCategoryImage.startsWith('data:')) {
        // This is a new file from the image picker
        imageBase64 = await getImageBase64(newCategoryImage);
        imageUrl = `data:image/png;base64,${imageBase64}`;
      } else if (newCategoryImage && newCategoryImage.startsWith('data:')) {
        // This is already a data URI (existing image), keep it as is
        imageUrl = newCategoryImage;
        // Extract base64 part if needed
        if (newCategoryImage.includes('base64,')) {
          imageBase64 = newCategoryImage.split('base64,')[1];
        }
      }

      if (editingCategory) {
        // Update existing category
        const categoryRef = doc(db, "categories", editingCategory.id);
        await updateDoc(categoryRef, {
          name: newCategoryName.trim(),
          imageBase64: imageBase64,
          imageUrl: imageUrl,
          updatedAt: new Date().toISOString(),
        });
        Alert.alert("Success", "Category updated!");
      } else {
        // Add new category
        await addDoc(collection(db, "categories"), {
          name: newCategoryName.trim(),
          imageBase64: imageBase64,
          imageUrl: imageUrl,
          createdAt: new Date().toISOString(),
        });
        Alert.alert("Success", "Category added!");
      }

      setNewCategoryName("");
      setNewCategoryImage(null);
      setEditingCategory(null);
      setShowCategoryModal(false);
      await loadCategories();
      
      // Set the newly added category as selected if adding new
      if (!editingCategory) {
        setCategory(newCategoryName.trim());
      }
    } catch (error) {
      console.error("Failed to save category:", error);
      Alert.alert("Error", "Failed to save category. Please try again.");
    }

    setLoading(false);
  };

  // Delete category
  const deleteCategory = async (cat) => {
    if (!isAdmin) {
      Alert.alert('Permission denied', 'Only admins can delete categories.');
      return;
    }
    // Check if any words use this category
    const wordsInCategory = wordsList.filter(word => word.category === cat.name);
    
    if (wordsInCategory.length > 0) {
      Alert.alert(
        "Cannot Delete",
        `This category has ${wordsInCategory.length} word(s) assigned to it. Please reassign or delete those words first.`
      );
      return;
    }

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${cat.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "categories", cat.id));
              await loadCategories();
              
              // Reset category selection if the deleted one was selected
              if (category === cat.name) {
                const remainingCats = getAllCategories();
                setCategory(remainingCats[0] || "");
              }
              
              Alert.alert("Success", "Category deleted successfully!");
            } catch (error) {
              console.error("Failed to delete category:", error);
              Alert.alert("Error", "Failed to delete category.");
            }
          },
        },
      ]
    );
  };

  // Edit category
  const handleEditCategory = (cat) => {
    setNewCategoryName(cat.name);
    // Prefer stored image URL, otherwise fall back to base64 field
    setNewCategoryImage(cat.imageUrl || cat.imageBase64 || null);
    setEditingCategory(cat);
    setShowCategoryModal(true);
  };

  // Filter words based on search criteria
  const handleSearch = () => {
    let filtered = [...wordsList];
    
    if (searchCategory) {
      filtered = filtered.filter(word => word.category === searchCategory);
    }
    
    if (searchLevel) {
      filtered = filtered.filter(word => word.level === searchLevel);
    }
    
    setFilteredWords(filtered);
  };

  // Clear filters
  const handleClearFilter = () => {
    setSearchCategory("");
    setSearchLevel("");
    setFilteredWords(wordsList);
  };

  useEffect(() => {
    loadWords();
    loadCategories();
    checkAdminFlag();
  }, []);

  const checkAdminFlag = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      if (role && role.toLowerCase() === 'admin') setIsAdmin(true);
      else setIsAdmin(false);
    } catch (err) {
      console.warn('Failed to read userRole from storage', err);
      setIsAdmin(false);
    }
  };

  const handleSubmit = async () => {
    if (!word.trim() || !hint.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const newWord = word.trim().toUpperCase();
    const newHint = hint.trim();

    // Check for duplicate words
    const duplicate = wordsList.find(
      w => w.word === newWord && 
      w.level === level && 
      w.category === category &&
      (!editingItem || w.id !== editingItem.id)
    );

    if (duplicate) {
      Alert.alert("Error", `The word "${newWord}" already exists in ${category} - ${level}.`);
      return;
    }

    setLoading(true);

    try {
      if (editingItem) {
        // Update existing word
        const wordRef = doc(db, "words", editingItem.id);
        await updateDoc(wordRef, {
          word: newWord,
          hint: newHint,
          level: level,
          category: category,
          updatedAt: new Date().toISOString(),
        });
        
        Alert.alert("Success", `Word "${newWord}" updated!`);
        setEditingItem(null);
      } else {
        // Add new word
        await addDoc(collection(db, "words"), {
          word: newWord,
          hint: newHint,
          level: level,
          category: category,
          createdAt: new Date().toISOString(),
        });
        
        Alert.alert("Success", `Word "${newWord}" added!`);
      }

      setWord("");
      setHint("");
      setLevel("Easy");
      await loadWords();
    } catch (error) {
      console.error("Failed to save word:", error);
      Alert.alert("Error", "Failed to save word. Please try again.");
    }
    
    setLoading(false);
  };

  const handleEdit = (item) => {
    setWord(item.word);
    setHint(item.hint);
    setLevel(item.level);
    setCategory(item.category);
    setEditingItem(item);
    
    // Scroll to top
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, 100);
  };

  const handleCancelEdit = () => {
    setWord("");
    setHint("");
    setLevel("Easy");
    const cats = getAllCategories();
    setCategory(cats[0] || "");
    setEditingItem(null);
  };

  const deleteWord = async (item) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${item.word}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "words", item.id));
              await loadWords();
              Alert.alert("Success", "Word deleted successfully!");
            } catch (error) {
              console.error("Failed to delete word:", error);
              Alert.alert("Error", "Failed to delete word.");
            }
          },
        },
      ]
    );
  };

  const allCategories = getAllCategories();
  const scrollViewRef = React.useRef(null);

  return (
    <LinearGradient colors={["#2E5C8A", "#CDA474"]} style={styles.gradient}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tOpBar}>
          <TouchableOpacity style={styles.bacKButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <Image source={require("../assets/logo.png")} style={styles.logO} resizeMode="contain" />


        {/* Input */}
        <View style={styles.inputCrd}>
          {editingItem && (
            <View style={styles.editingBadge}>
              <Ionicons name="create-outline" size={20} color="#FF9800" />
              <Text style={styles.editingText}>Editing Mode</Text>
            </View>
          )}
          
          <Text style={styles.label}>Word:</Text>
          <TextInput
            placeholder="Enter Word"
            placeholderTextColor="#888"
            value={word}
            onChangeText={setWord}
            style={styles.inputWrd}
            autoCapitalize="characters"
          />
          <Text style={styles.label}>Hint:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ maxWidth: '100%' }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <TextInput
              placeholder="Enter Hint"
              placeholderTextColor="#888"
              value={hint}
              onChangeText={setHint}
              style={[styles.inputHnt, { minWidth: 100, maxWidth: 252 }]}
              multiline
              scrollEnabled={true}
              textAlignVertical="top"
            />
          </ScrollView>
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
              <Text style={[styles.levelText, level === lvl && { color: "#fff", fontWeight: "700" }]}>
                {lvl}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <Text style={styles.levelLabel}>Select Category:</Text>
        <View style={styles.categoryRow}>
          {allCategories.length === 0 ? (
            <Text style={{ color: '#fff', fontStyle: 'italic', marginBottom: 10 }}>No categories yet. Add one in Manage Categories below.</Text>
          ) : (
            allCategories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryButton, category === cat && styles.activeCategoryButton]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryText, category === cat && { color: "#fff", fontWeight: "700" }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Submit */}
        <View style={{ width: "100%" }}>
          <TouchableOpacity 
            style={[styles.submitButton, loading && { opacity: 0.7 }]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#536b8e" />
            ) : (
              <Text style={styles.submitText}>
                {editingItem ? "Update Word" : "Add Word"}
              </Text>
            )}
          </TouchableOpacity>
          {editingItem && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Text style={styles.cancelText}>Cancel Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.hr} />

        {/* Category Management Section */}
        {isAdmin && (
        <View style={styles.manageCategorySection}>
          <View style={styles.manageCategoryHeader}>
            <Text style={styles.manageCategoryTitle}>Manage Categories</Text>
            <TouchableOpacity 
              style={styles.addCategoryButton} 
              onPress={() => {
                setNewCategoryName("");
                setNewCategoryImage(null);
                setEditingCategory(null);
                setShowCategoryModal(true);
              }}
            >
              <Ionicons name="add-circle" size={24} color="#4CAF50" />
              <Text style={styles.addCategoryText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {/* Display Custom Categories */}
          {categories.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              {categories.map((cat) => {
                let imageSource = null;
                if (cat.imageUrl) {
                  imageSource = { uri: cat.imageUrl };
                } else if (cat.imageBase64) {
                  imageSource = { uri: `data:image/png;base64,${cat.imageBase64}` };
                }
                return (
                  <View key={cat.id} style={styles.categoryPreviewCard}>
                    <Image source={imageSource} style={styles.categoryPreviewImage} />
                    <Text style={styles.categoryPreviewName} numberOfLines={1}>{cat.name}</Text>
                    <View style={styles.categoryPreviewActions}>
                      <TouchableOpacity onPress={() => handleEditCategory(cat)}>
                        <Ionicons name="create-outline" size={20} color="#1B4D90" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteCategory(cat)}>
                        <Ionicons name="trash-outline" size={20} color="#b00020" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
          
          {categories.length === 0 && (
            <Text style={styles.noCategoriesText}>No custom categories yet. Add one above!</Text>
          )}
        </View>
        )}

        <View style={styles.hr} />

        {/* Words List */}
        <Text style={styles.listTitle}>Recently Added Words ({filteredWords.length})</Text>
        
        {/* Search/Filter Section */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>Filter by Category:</Text>
          <View style={styles.filterRow}>
            {allCategories.length === 0 ? (
              <Text style={{ color: '#333', fontStyle: 'italic', marginBottom: 10 }}>No categories yet.</Text>
            ) : (
              allCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterButton,
                    searchCategory === cat && styles.activeFilterButton
                  ]}
                  onPress={() => setSearchCategory(searchCategory === cat ? "" : cat)}
                >
                  <Text style={[
                    styles.filterText,
                    searchCategory === cat && { color: "#fff", fontWeight: "700" }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          <Text style={styles.searchLabel}>Filter by Level:</Text>
          <View style={styles.filterRow}>
            {ALL_LEVELS.map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.filterButton,
                  searchLevel === lvl && styles.activeFilterButton
                ]}
                onPress={() => setSearchLevel(searchLevel === lvl ? "" : lvl)}
              >
                <Text style={[
                  styles.filterText,
                  searchLevel === lvl && { color: "#fff", fontWeight: "700" }
                ]}>
                  {lvl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.searchButtonRow}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilter}>
              <Ionicons name="close-circle" size={20} color="#fff" />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && wordsList.length === 0 ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
        ) : filteredWords.length === 0 ? (
          <Text style={styles.noWordsText}>No words found.</Text>
        ) : (
          filteredWords.map((item) => (
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
                <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
                  <Ionicons name="create-outline" size={22} color="#1B4D90" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => deleteWord(item)}>
                  <Ionicons name="trash-outline" size={22} color="#b00020" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Add/Edit Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowCategoryModal(false);
          setNewCategoryName("");
          setNewCategoryImage(null);
          setEditingCategory(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </Text>

            <TextInput
              placeholder="Category Name (e.g., Sports, Food)"
              placeholderTextColor="#888"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              style={styles.modalInput}
            />

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={24} color="#fff" />
              <Text style={styles.imagePickerText}>
                {newCategoryImage ? "Change Image" : "Select Image"}
              </Text>
            </TouchableOpacity>

            {newCategoryImage && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: newCategoryImage }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setNewCategoryImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setShowCategoryModal(false);
                  setNewCategoryName("");
                  setNewCategoryImage(null);
                  setEditingCategory(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveModalButton, loading && { opacity: 0.7 }]}
                onPress={handleSaveCategory}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {editingCategory ? "Update" : "Save"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  gradient: { flex: 1, alignItems: "center" },

  tOpBar: {
    position: "absolute",
    top: 8,
    left: 10,
    zIndex: 10,
  },

  bacKButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    padding: 8,
  },

  container: {
    flexGrow: 1,
    alignItems: "center",
    marginTop: 10,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  logO: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },

  /* CATEGORY MANAGEMENT */
  manageCategorySection: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  manageCategoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  manageCategoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  addCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  addCategoryText: {
    color: "#4CAF50",
    fontWeight: "700",
    marginLeft: 5,
    fontSize: 14,
  },

  categoriesScroll: {
    marginTop: 10,
  },

  categoryPreviewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    width: 100,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  categoryPreviewImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 5,
  },

  categoryPreviewName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },

  categoryPreviewActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingTop: 5,
  },

  noCategoriesText: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
  },

  /* INPUT CARD */
  
  editingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 15,
  },

  editingText: {
    color: "#FF9800",
    fontWeight: "700",
    marginLeft: 5,
    fontSize: 14,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    alignSelf: "flex-start",
  },

  inputWrd: {
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
  inputCrd: {
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: "stretch",
    width: "90%",
    padding: 18,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    flexShrink: 1,
  },
  inputHnt: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    minHeight: 44,
    maxHeight: 100,
    marginBottom: 8,
    textAlignVertical: "top",
  },

  /* LEVEL */
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

  activeLevelButton: {
    backgroundColor: "#1565C0",
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  levelText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },

  hr: {
    width: "100%",
    height: 5,
    backgroundColor: "rgba(255,255,255,0.7)",
    marginVertical: 30,
    borderRadius: 2,
  },

  /* CATEGORY BUTTONS */
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

  activeCategoryButton: {
    backgroundColor: "#8A531C",
    shadowColor: "#8A531C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  categoryText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },

  /* SUBMIT */
  submitButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },

  submitText: {
    color: "#1B4D90",
    fontWeight: "700",
    fontSize: 16,
  },

  cancelButton: {
    backgroundColor: "#b00020",
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },

  cancelText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  /* WORD LIST */
  listTitle: {
    marginTop: 10,
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    alignSelf: "flex-start",
  },

  searchContainer: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    marginBottom: 15,
  },

  searchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#dfe4ea",
    borderRadius: 10,
    margin: 5,
  },

  activeFilterButton: {
    backgroundColor: "#1B4D90",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  searchButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B4D90",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  searchButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "700",
  },

  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b00020",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  clearButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "700",
  },

  noWordsText: {
    textAlign: "center",
    color: "#fff",
    marginTop: 10,
    fontSize: 15,
    fontStyle: "italic",
  },

  wordItem: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
  },

  wordText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  hintText: {
    fontWeight: "500",
    color: "#666",
  },

  infoText: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },

  wordActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  actionButton: {
    padding: 8,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B4D90",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: "center",
  },

  imagePickerText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },

  previewContainer: {
    alignItems: "center",
    marginBottom: 15,
  },

  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },

  removeImageButton: {
    marginTop: 8,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },

  cancelModalButton: {
    backgroundColor: "#b00020",
  },

  saveModalButton: {
    backgroundColor: "#4CAF50",
  },

  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});