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
import { Ionicons } from "@expo/vector-icons";

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
          <Text style={styles.sectionText}>5. You can use the "Show Hint" button to reveal one random letter, but it costs 10 points.</Text>

          {/* Game Flow */}
          <Text style={styles.sectionTitle}>Game Flow</Text>
          <Text style={styles.sectionText}>
            1. Start a level and see boxes representing the letters of the word.{"\n"}
            2. Guess the word by selecting letters.{"\n"}
            3. Correct letters will fill in the boxes.{"\n"}
            4. Wrong letters make the boxes shake and turn red temporarily.{"\n"}
            5. Complete the word to earn points and go to the next level.
          </Text>

          {/* Hint Feature */}
          <Text style={styles.sectionTitle}>Hint Feature</Text>
          <View style={styles.hintExampleContainer}>
            <View style={styles.hintButtonExample}>
              <Ionicons name="bulb-outline" size={20} color="#fff" />
              <Text style={styles.hintButtonText}>Show Hint (-10 pts)</Text>
            </View>
          </View>
          <Text style={styles.sectionText}>
            Press the "Show Hint" button to reveal one random letter in the word. 
            This will cost you 10 points, so use it wisely! You need at least 10 points to use this feature.
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

          {/* Divider */}
          <View style={styles.divider} />

          {/* Credits Section */}
          <View style={styles.creditsContainer}>
            <Text style={styles.creditsTitle}>About Us</Text>
            
            <View style={styles.creditRow}>
              <Text style={styles.creditLabel}>Submitted by:</Text>
              <Text style={styles.creditValue}>Desie Torrenueva</Text>
              <Text style={styles.creditValue}>Jenny Rose Guisihan</Text>
              <Text style={styles.creditValue}>Althea Carias</Text>
              <Text style={styles.creditValue}>Jamel Aniasco</Text>
              <Text style={styles.creditValue}>Bresah Mae Flores</Text>
              <Text style={styles.creditValue}>Maryjoy Ampoloquio</Text>
              <Text style={styles.creditValue}>Jay Mark Flordeliza</Text>
              <Text style={styles.creditValue}>Michael John Zapanta</Text>
              <Text style={styles.creditValue}>Decerie Amba</Text>
              <Text style={styles.creditValue}>Kim Ferrer</Text>
              <Text style={styles.creditValue}>Jayson Avenido</Text>

            </View>

            <View style={styles.creditRow}>
              <Text style={styles.creditLabel}>Submitted to:</Text>
              <Text style={styles.creditValue}>Jay Ian Camelotes</Text>
            </View>
          </View>

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
    paddingBottom: 40,
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
    lineHeight: 24,
    paddingHorizontal: 10,
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  boxText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  hintExampleContainer: {
    marginVertical: 15,
    alignItems: "center",
  },
  hintButtonExample: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  hintButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
  divider: {
    width: "90%",
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginVertical: 25,
  },
  creditsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  creditsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  creditRow: {
    marginBottom: 12,
  },
  creditLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f5d9a4",
    marginBottom: 4,
  },
  creditValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  gotItButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  gotItText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});