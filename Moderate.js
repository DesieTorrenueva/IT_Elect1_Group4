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
  { word: "HOSPITAL", hint: "A place where doctors work" },
  { word: "COMPUTER", hint: "Used to browse the internet and play games" },
  { word: "LIBRARY", hint: "A quiet place full of books" },
  { word: "MOUNTAIN", hint: "A tall landform that reaches high into the sky" },
  { word: "AURORA", hint: "Colorful lights in the polar sky" },
  { word: "GRAVITY", hint: "Makes things fall to the ground" },
  { word: "ECOSYSTEM", hint: "Living things interacting in an area" },
  { word: "MIRAGE", hint: "An illusion seen in the distance" },
  { word: "RAINBOW", hint: "Colorful arc in the sky after rain" },
  { word: "SUNSET", hint: "When the sun goes down" },
  { word: "EARTHQUAKE", hint: "When the ground shakes" },
  { word: "LIGHTNING", hint: "A bright flash during storms" },
  { word: "FOG", hint: "Thick mist that makes it hard to see" },
  { word: "TIDALWAVE", hint: "A huge ocean wave" },
  { word: "BIOLUMINESCENCE", hint: "When living things glow in the dark" },
  { word: "SUPERCELL", hint: "A rotating thunderstorm" },
 { word: "QUASAR", hint: "A bright object powered by a black hole" },
 { word: "PHOTOSYNTHESIS", hint: "How plants make food from sunlight" },
v{ word: "THERMODYNAMICS", hint: "Rules about heat and energy" },
  { word: "AIRPLANE", hint: "Travels through the sky" },
const MAX_WRONG = 7; // number of wrong guesses allowed

export default function Moderate() {
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
            placeholder="Type a lett
