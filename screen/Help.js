import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Help({ navigation }) {
  return (
    <LinearGradient colors={["#0b4c85ff", "#dfb487ff"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Introduction */}
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.sectionText}>
            Welcome to the game! The goal is to guess the correct word for each level. 
            For every correct guess, you earn points and move to the next level.
          </Text>

          {/* Rules */}
          <Text style={styles.sectionTitle}>Rules</Text>
          <Text style={styles.sectionText}>1. Each word will be represented by empty boxes (one for each letter).</Text>
          <Text style={styles.sectionText}>2. Tap the letters to guess the word.</Text>
          <Text style={styles.sectionText}>3. If your guess is correct, the score is added and you proceed to the next level.</Text>
          <Text style={styles.sectionText}>4. If your guess is wrong, the boxes will shake, turn red, and then reset for you to try again.</Text>

          {/* Game Flow */}
          <Text style={styles.sectionTitle}>Game Flow</Text>
          <Text style={styles.sectionText}>
            1. Start a level and see boxes representing the letters of the word.{"\n"}
            2. Guess the word by selecting letters.{"\n"}
            3. Correct letters will fill in the boxes.{"\n"}
            4. Wrong letters make the boxes shake and turn red temporarily.{"\n"}
            5. Complete the word to earn points and go to the next level.
          </Text>

          {/* Example Boxes */}
          <Text style={styles.sectionTitle}>Example Word</Text>
          <View style={styles.boxContainer}>
            <View style={styles.box}><Text style={styles.boxText}>A</Text></View>
            <View style={styles.box}><Text style={styles.boxText}>P</Text></View>
            <View style={styles.box}><Text style={styles.boxText}>P</Text></View>
            <View style={styles.box}><Text style={styles.boxText}>L</Text></View>
            <View style={styles.box}><Text style={styles.boxText}>E</Text></View>
          </View>
          <Text style={styles.sectionText}>
            Correct letters fill the boxes. Wrong guesses will make you stay in the level.
          </Text>

          {/* Got It Button */}
          <TouchableOpacity style={styles.gotItButton} onPress={() => navigation.goBack()}>
            <Text style={styles.gotItText}>Got It</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  sectionText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  box: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: "#fff",
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  boxText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  gotItButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  gotItText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
