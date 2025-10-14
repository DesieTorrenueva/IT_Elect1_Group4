import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';

// Easy-level Word Guess Game (React Native)
// Single-file app (App.js) — functional component, no external libraries.
// Features:
// - Easy words list
// - On-screen A-Z keyboard
// - Shows blanks and correct letters
// - Limited wrong attempts (easy level)
// - Hint button (reveals one random correct letter)
// - Restart / New word

const EASY_WORDS = [
  { word: 'CAT', hint: 'A small furry pet' },
  { word: 'DOG', hint: 'Man\'s best friend' },
  { word: 'SUN', hint: 'Bright star in daytime' },
  { word: 'TREE', hint: 'Grows leaves' },
  { word: 'BIRD', hint: 'Has wings and flies' },
  { word: 'BOOK', hint: 'You read it' },
  { word: 'FISH', hint: 'Lives in water' },
  { word: 'MOON', hint: 'Shines at night' },
  { word: 'STAR', hint: 'Twinkles in the sky' },
  { word: 'BALL', hint: 'You can throw it' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_WRONG = 6; // easy level

export default function App() {
  const [target, setTarget] = useState({ word: '', hint: '' });
  const [guessed, setGuessed] = useState(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => startNewGame(), []);

  function startNewGame() {
    const choice = EASY_WORDS[Math.floor(Math.random() * EASY_WORDS.length)];
    setTarget(choice);
    setGuessed(new Set());
    setWrongCount(0);
    setGameOver(false);
    setWon(false);
  }

  function revealDisplay() {
    return target.word
      .split('')
      .map((ch) => (guessed.has(ch) ? ch : '_'))
      .join(' ');
  }

  function handleGuess(letter) {
    if (gameOver) return;
    if (guessed.has(letter)) return; // already guessed

    const newSet = new Set(guessed);
    newSet.add(letter);
    setGuessed(newSet);

    if (!target.word.includes(letter)) {
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      if (newWrong >= MAX_WRONG) {
        setGameOver(true);
        setWon(false);
      }
    } else {
      // check win
      const allLetters = Array.from(new Set(target.word.split('')));
      const allGuessed = allLetters.every((l) => newSet.has(l));
      if (allGuessed) {
        setGameOver(true);
        setWon(true);
      }
    }
  }

  function handleHint() {
    if (gameOver) return;
    // reveal one random letter that's not yet guessed
    const remaining = target.word.split('').filter((c) => !guessed.has(c));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    const newSet = new Set(guessed);
    newSet.add(pick);
    setGuessed(newSet);
    // small penalty: increase wrongCount by 1 (still friendly)
    const newWrong = Math.min(wrongCount + 1, MAX_WRONG);
    setWrongCount(newWrong);

    // check if that finishes the game
    const allLetters = Array.from(new Set(target.word.split('')));
    const allGuessed = allLetters.every((l) => newSet.has(l));
    if (allGuessed) {
      setGameOver(true);
      setWon(true);
    }
    if (newWrong >= MAX_WRONG && !allGuessed) {
      setGameOver(true);
      setWon(false);
    }
  }

  function renderKeyboard() {
    return (
      <View style={styles.keyboard}>
        {ALPHABET.map((letter) => {
          const disabled = guessed.has(letter) || gameOver;
          const isCorrect = target.word.includes(letter) && guessed.has(letter);
          const isWrong = guessed.has(letter) && !target.word.includes(letter);
          return (
            <TouchableOpacity
              key={letter}
              style={[
                styles.key,
                disabled && styles.keyDisabled,
                isCorrect && styles.keyCorrect,
                isWrong && styles.keyWrong,
              ]}
              onPress={() => handleGuess(letter)}
              disabled={disabled}
            >
              <Text style={styles.keyText}>{letter}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  function renderStatus() {
    if (!gameOver) {
      return (
        <Text style={styles.status}>Attempts left: {MAX_WRONG - wrongCount}</Text>
      );
    }
    if (won) {
      return <Text style={[styles.status, styles.win]}>You won! 🎉</Text>;
    }
    return (
      <Text style={[styles.status, styles.lose]}>You lost — word was: {target.word}</Text>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Word Guess — Easy</Text>

        <View style={styles.hangmanArea}>
          <Text style={styles.display}>{revealDisplay()}</Text>
          <Text style={styles.hintLabel}>Hint: {target.hint}</Text>
        </View>

        {renderStatus()}

        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={handleHint} disabled={gameOver}>
            <Text style={styles.buttonText}>Hint (reveals a letter)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonAlt]}
            onPress={() => startNewGame()}
          >
            <Text style={styles.buttonText}>New Word</Text>
          </TouchableOpacity>
        </View>

        {renderKeyboard()}

        <View style={styles.footer}>
          <Text style={styles.small}>Wrong guesses: {wrongCount} / {MAX_WRONG}</Text>
          <Text style={styles.small}>Guessed: {[...guessed].join(', ') || '—'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  inner: { alignItems: 'center', padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginVertical: 12 },
  hangmanArea: { alignItems: 'center', marginVertical: 12 },
  display: { fontSize: 36, letterSpacing: 6, marginVertical: 8 },
  hintLabel: { fontSize: 14, color: '#374151' },
  status: { fontSize: 18, marginVertical: 8 },
  win: { color: 'green' },
  lose: { color: 'red' },
  controls: { flexDirection: 'row', marginVertical: 10 },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  buttonAlt: { backgroundColor: '#10b981' },
  buttonText: { color: '#fff', fontWeight: '600' },
  keyboard: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 },
  key: {
    width: 38,
    height: 38,
    margin: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
  },
  keyDisabled: { opacity: 0.5 },
  keyCorrect: { backgroundColor: '#bbf7d0' },
  keyWrong: { backgroundColor: '#fecaca' },
  keyText: { fontWeight: '700' },
  footer: { marginTop: 16, alignItems: 'center' },
  small: { fontSize: 12, color: '#6b7280' },
});
