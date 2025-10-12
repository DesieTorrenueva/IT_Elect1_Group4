import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

export default function GuessTheWordApp() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"dashboard" | "game">("dashboard");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handlePlay = () => {
    setView("game");
  };

  const handleSaveProgress = async () => {
    try {
      const progress = {
        timestamp: new Date().toISOString(),
        level: 1,
        score: 0,
      };
      Alert.alert("Progress Saved", JSON.stringify(progress, null, 2));
      setMessage("Progress saved!");
    } catch {
      setMessage("Failed to save progress");
    }
  };

  if (loading) {
    // Loading / Logo area
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>LOGO</Text>
          </View>
          <ActivityIndicator size="large" color="#4B9CD3" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (view === "game") {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>GUESS THE WORD</Text>
          <Text style={styles.description}>
            This is where your word guessing logic will go.
          </Text>
          <TouchableOpacity style={styles.playButton} onPress={() => setView("dashboard")}>
            <Text style={styles.playButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Dashboard view
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoBoxSmall}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
        <Text style={styles.title}>GUESS THE WORD</Text>

        <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProgress}>
          <Text style={styles.saveButtonText}>Save your progress</Text>
        </TouchableOpacity>

        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#f97316",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  logoBox: {
    width: 120,
    height: 100,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#94a3b8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBoxSmall: {
    width: 80,
    height: 60,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#94a3b8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  logoText: {
    fontWeight: "800",
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    color: "#E2E8F0"
  },
  description: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 10,
  },
  playButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  saveButton: {
    borderColor: "#94a3b8",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 5,
  },
  saveButtonText: {
    color: "#475569",
    fontWeight: "500",
  },
  message: {
    marginTop: 15,
    color: "#10b981",
    fontSize: 14,
  },
  loadingText: {
    marginTop: 10,
    color: "#64748b",
  },
});
