import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";

// Moderate word list with short hints. You can expand or replace this list.
const WORDS = [
  { w: "planet", hint: "A celestial body orbiting a star" },
  { w: "jungle", hint: "Dense tropical forest" },
  { w: "orchard", hint: "A place where fruit trees grow" },
  { w: "fortress", hint: "A heavily defended building" },
  { w: "library", hint: "Place full of books" },
  { w: "canvas", hint: "Material for painting" },
  { w: "harvest", hint: "Gathering crops" },
  { w: "cabinet", hint: "Storage furniture" },
  { w: "clarity", hint: "Clearness of thought or style" },
  { w: "voyage", hint: "A long journey by sea or space" },
];

const MAX_WRONG = 7; // number of wrong guesses allowed

export default function App() {
  const [wordObj, setWordObj] = useState(() => randomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [revealedHint, setRevealedHint] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    resetForNewWord(wordObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordObj.w]);

  function randomWord() {
    const idx = Math.floor(Math.random() * WORDS.length);
    return WORDS[idx];
  }

  function resetForNewWord(newWordObj = randomWord()) {
    setWordObj(newWordObj);
    setGuessedLetters([]);
    setWrongCount(0);
    setInput("");
    setMessage("");
    setRevealedHint(false);
  }

  function displayProgress() {
    return wordObj.w
      .split("")
      .map((ch) => (guessedLetters.includes(ch.toLowerCase()) ? ch : "_"))
      .join(" ");
  }

  function isWon() {
    return wordObj.w.split("").every((c) => guessedLetters.includes(c));
  }

  function isLost() {
    return wrongCount >= MAX_WRONG;
  }

  function consumeLetter(letter) {
    letter = letter.toLowerCase();
    if (!/^[a-z]$/.test(letter)) return;
    if (guessedLetters.includes(letter)) return;

    setGuessedLetters((prev) => [...prev, letter]);

    if (!wordObj.w.includes(letter)) {
      setWrongCount((c) => c + 1);
    }
  }

  function onSubmitGuess() {
    const val = input.trim().toLowerCase();
    if (!val) return;

    // If user guessed full word
    if (val.length > 1) {
      if (val === wordObj.w) {
        // reveal all letters
        setGuessedLetters(wordObj.w.split(""));
        setMessage("You guessed the word! Nice!");
      } else {
        setWrongCount((c) => c + 1);
        setMessage("Wrong word guess — try letters or another word.");
      }
    } else {
      consumeLetter(val);
    }

    setInput("");
    Keyboard.dismiss();
  }

  useEffect(() => {
    if (isWon()) {
      setMessage("🎉 You won! Tap Next Word to play again.");
    } else if (isLost()) {
      setMessage(`😞 You lost — the word was: ${wordObj.w}`);
    } else {
      setMessage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guessedLetters, wrongCount]);

  function revealHint() {
    setRevealedHint(true);
    setWrongCount((c) => Math.min(MAX_WRONG, c + 1)); // cost: one wrong attempt
  }

  function nextWord() {
    resetForNewWord(randomWord());
  }

  function letterButtons() {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    return (
      <FlatList
        contentContainerStyle={styles.lettersContainer}
        data={letters}
        numColumns={7}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const disabled = guessedLetters.includes(item) || isWon() || isLost();
          return (
            <TouchableOpacity
              style={[
                styles.letterBtn,
                disabled && styles.letterBtnDisabled,
              ]}
              onPress={() => consumeLetter(item)}
              disabled={disabled}
            >
              <Text style={styles.letterText}>{item.toUpperCase()}</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Word Guess (Moderate)</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Progress</Text>
        <Text style={styles.progress}>{displayProgress()}</Text>

        <View style={styles.rowSpace}>
          <Text style={styles.small}>Wrong: {wrongCount} / {MAX_WRONG}</Text>
          <Text style={styles.small}>Used: {guessedLetters.filter(l=>!wordObj.w.includes(l)).join(", ") || "—"}</Text>
        </View>

        <View style={{ marginTop: 10 }}>{letterButtons()}</View>

        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            value={input}
            onChangeText={setInput}
            placeholder="Type a letter or full word"
            style={styles.input}
            editable={!isWon() && !isLost()}
            autoCapitalize="none"
            onSubmitEditing={onSubmitGuess}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.btn, (isWon() || isLost()) && styles.btnDisabled]}
            onPress={onSubmitGuess}
            disabled={isWon() || isLost()}
          >
            <Text style={styles.btnText}>Guess</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowSpace}>
          <TouchableOpacity
            style={[styles.hintBtn, revealedHint && styles.hintBtnDisabled]}
            onPress={revealHint}
            disabled={revealedHint || isWon() || isLost()}
          >
            <Text style={styles.hintText}>Reveal Hint (cost 1 wrong)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextBtn} onPress={nextWord}>
            <Text style={styles.nextText}>Next Word</Text>
          </TouchableOpacity>
        </View>

        {revealedHint && (
          <Text style={styles.hint}>{wordObj.hint}</Text>
        )}

        {message.length > 0 && (
          <Text style={styles.message}>{message}</Text>
        )}
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.instructions}>How to play:</Text>
        <Text style={styles.small}>• Tap letters or type a letter to guess it.</Text>
        <Text style={styles.small}>• You can also type a full-word guess — wrong full-word guesses cost 1 attempt.</Text>
        <Text style={styles.small}>• Reveal the hint if you need a clue (costs 1 wrong attempt).</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f6f8fa" },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  card: { backgroundColor: "white", padding: 14, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.04, elevation: 2 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  progress: { fontSize: 32, letterSpacing: 4, textAlign: "center", marginVertical: 8 },
  rowSpace: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  small: { fontSize: 12, color: "#333" },
  lettersContainer: { marginTop: 8, alignItems: "center" },
  letterBtn: { width: 40, height: 40, margin: 6, borderRadius: 6, backgroundColor: "#e8eef6", justifyContent: "center", alignItems: "center" },
  letterBtnDisabled: { backgroundColor: "#cfd8e8" },
  letterText: { fontWeight: "700" },
  inputRow: { flexDirection: "row", marginTop: 12, alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 6, marginRight: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#3b82f6", borderRadius: 6 },
  btnDisabled: { backgroundColor: "#a5c1f9" },
  btnText: { color: "white", fontWeight: "700" },
  hintBtn: { padding: 8, borderRadius: 6, borderWidth: 1, borderColor: "#e5a" },
  hintBtnDisabled: { opacity: 0.6 },
  hintText: { fontSize: 12 },
  nextBtn: { padding: 8 },
  nextText: { color: "#3b82f6", fontWeight: "700" },
  hint: { marginTop: 10, fontStyle: "italic", color: "#555" },
  message: { marginTop: 10, fontWeight: "700", textAlign: "center" },
});
