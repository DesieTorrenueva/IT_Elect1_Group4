import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  Animated,
  Easing,
  Platform
} from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';



const HARD_WORDS = [
  {clue:"Process plants use to make food", answer:"PHOTOSYNTHESIS"},
  {clue:"Study of living organisms", answer:"BIOLOGY"},
  {clue:"Five-sided polygon", answer:"PENTAGON"},
  {clue:"Change shape during life cycle", answer:"METAMORPHOSIS"},
  {clue:"Organism's interacting community", answer:"ECOSYSTEM"},
  {clue:"State of equilibrium", answer:"HOMEOSTASIS"},
  {clue:"Science of classification", answer:"TAXONOMY"},
  {clue:"Force resisting motion", answer:"FRICTION"},
  {clue:"Measure of disorder", answer:"ENTROPY"},
  {clue:"Study of Earth's atmosphere", answer:"METEOROLOGY"},
  {clue:"Related to bones", answer:"OSTEOLOGY"},
  {clue:"Study of the mind", answer:"PSYCHOLOGY"},
  {clue:"Branch of mathematics for rates", answer:"CALCULUS"},
  {clue:"Study of human past", answer:"ARCHAEOLOGY"},
  {clue:"Large mammal with trunk", answer:"ELEPHANT"},
  {clue:"Highest point on Earth", answer:"MOUNTAINEERING"},
  {clue:"Compound of sugar & alcohol", answer:"FERMENTATION"},
  {clue:"A short dramatic play", answer:"VIGNETTE"},
  {clue:"Not easily explained", answer:"ENIGMATIC"},
  {clue:"Not keeping still", answer:"KINETIC"},
  {clue:"Opposite of convex", answer:"CONCAVE"},
  {clue:"Study of weather", answer:"CLIMATOLOGY"},
  {clue:"Remarkably great", answer:"EXTRAORDINARY"},
  {clue:"Relating to hearing", answer:"AUDITORY"},
  {clue:"Mixing of races", answer:"HYBRIDIZATION"},
  {clue:"State of being numerous", answer:"PLETHORA"},
  {clue:"Quick and energetic", answer:"VIGOROUS"},
  {clue:"Multiple countries working together", answer:"INTERNATIONAL"},
  {clue:"Not able to be changed", answer:"IRREVOCABLE"},
  {clue:"Fear of confined spaces", answer:"CLAUSTROPHOBIA"},
  {clue:"Study of structure", answer:"ANATOMY"},
  {clue:"One who loves books", answer:"BIBLIOPHILE"},
  {clue:"Condition of having two forms", answer:"DIMORPHISM"},
  {clue:"Relating to stars", answer:"ASTRONOMICAL"},
  {clue:"Period of record keeping", answer:"CHRONOLOGY"},
  {clue:"A scholar or learned person", answer:"ERUDITE"},
  {clue:"A long, adventurous voyage", answer:"ODYSSEY"},
  {clue:"Clear and persuasive", answer:"COHERENT"},
  {clue:"Impossible to enter", answer:"IMPENETRABLE"},
  {clue:"One who studies fossils", answer:"PALEONTOLOGIST"},
  {clue:"Person who loves fine food", answer:"GOURMET"},
  {clue:"Related to the sun", answer:"SOLAR"},
  {clue:"Study of motion forces", answer:"DYNAMICS"},
  {clue:"A hidden meaning", answer:"ALLEGORY"},
  {clue:"Relating to sound waves", answer:"ACOUSTIC"},
  {clue:"One who avoids work", answer:"IDLER"},
  {clue:"To reduce in intensity", answer:"ABATE"},
  {clue:"Abundant, overflowing", answer:"RIFE"},
  {clue:"Lacking harmony", answer:"DISSONANT"},
  {clue:"Capable of being shaped", answer:"MALLEABLE"},
  {clue:"Belief without proof", answer:"SUPPOSITION"},
  {clue:"Careful and precise", answer:"METICULOUS"},
  {clue:"A long-standing tradition", answer:"ANACHRONISM"},
  {clue:"Belonging to an earlier time", answer:"ARCHEAN"},
  {clue:"Skilled at persuading", answer:"ELOQUENT"},
  {clue:"Skipping from subject to subject", answer:"RAMBLING"},
  {clue:"Something hard to bear", answer:"ONEROUS"},
  {clue:"A sign of future events", answer:"OMEN"},
  {clue:"Permanent, unchanging", answer:"CONSTANT"},
  {clue:"Extremely small", answer:"MINUSCULE"},
  {clue:"Group of related people", answer:"CLAN"},
  {clue:"A secret plan", answer:"CONSPIRACY"},
  {clue:"Strong dislike or hatred", answer:"ANIMOSITY"},
  {clue:"The art of effective speaking", answer:"RHETORIC"},
  {clue:"Skill in public speaking", answer:"ORATORY"},
  {clue:"Short saying with advice", answer:"ADAGE"},
  {clue:"Use of many words", answer:"VERBIAGE"},
  {clue:"Food for thought", answer:"PROVOCATIVE"},
  {clue:"Extremely complicated", answer:"BYZANTINE"},
  {clue:"The way something is done", answer:"METHODOLOGY"},
  {clue:"Brief and to the point", answer:"CONCISE"},
  {clue:"Study of animal behavior", answer:"ETHOLOGY"},
  {clue:"Able to be believed", answer:"PLAUSIBLE"},
  {clue:"Not easily satisfied", answer:"INSATIABLE"},
  {clue:"Relating to painting", answer:"PICTORIAL"},
  {clue:"An official order", answer:"MANDATE"},
  {clue:"A confusing situation", answer:"QUANDARY"},
  {clue:"Skillful, clever", answer:"ADEPT"},
  {clue:"Relating to time", answer:"TEMPORAL"},
  {clue:"Hidden or secret", answer:"COVERT"},
  {clue:"A person who writes poems", answer:"POETESS"},
  {clue:"Extreme patriotism", answer:"JINGOISM"},
  {clue:"Act of showing mercy", answer:"PARDON"},
  {clue:"A natural ability", answer:"KNACK"},
  {clue:"Unclear, vague", answer:"AMBIGUOUS"},
  {clue:"Not typical; unusual", answer:"ECCENTRIC"},
  {clue:"Relating to the mind", answer:"COGNITIVE"},
  {clue:"Not able to be harmed", answer:"INVULNERABLE"},
  {clue:"Extremely noisy", answer:"CLAMOROUS"},
  {clue:"To settle a disagreement", answer:"ARBITRATE"},
  {clue:"Serious or gloomy", answer:"SOMBRE"},
  {clue:"An ornamental band", answer:"FASCIA"},
  {clue:"A strong desire", answer:"YEARNING"},
  {clue:"Unchanging over time", answer:"STABLE"},
  {clue:"To puzzle or confuse", answer:"PERPLEX"}
];

const BEST_SCORE_KEY = '@wordguess:bestscore';

export default function HardLevelFull() {
  const [shuffled, setShuffled] = useState(() => shuffleArray([...HARD_WORDS]));
  const [index, setIndex] = useState(0);
  const [displayChars, setDisplayChars] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [typedGuess, setTypedGuess] = useState('');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const winSound = useRef(null);

  useEffect(()=>{
    loadBest();
    startRound(0);
    // preload sounds
    (async ()=>{
      try{
        const { sound: s1 } = await Audio.Sound.createAsync(require('./assets/correct.wav'));
        const { sound: s2 } = await Audio.Sound.createAsync(require('./assets/wrong.wav'));
        const { sound: s3 } = await Audio.Sound.createAsync(require('./assets/win.wav'));
        correctSound.current = s1; wrongSound.current = s2; winSound.current = s3;
      }catch(e){
        // sounds optional — if files missing, ignore
      }
    })();
    return ()=>{
      clearTimer();
      [correctSound.current, wrongSound.current, winSound.current].forEach(s=>{ if(s) s.unloadAsync(); });
    }
  }, []);

  useEffect(()=>{
    if (timeLeft <= 0){
      onTimeUp();
    }
  }, [timeLeft]);

  async function loadBest(){
    try{
      const v = await AsyncStorage.getItem(BEST_SCORE_KEY);
      if (v) setBest(parseInt(v,10));
    }catch(e){ }
  }
  async function saveBest(v){
    try{ await AsyncStorage.setItem(BEST_SCORE_KEY, String(v)); }catch(e){}
  }

  function startRound(startIdx){
    const idx = startIdx ?? index;
    const item = shuffled[idx];
    const blanks = item.answer.split('').map(ch => ch === ' ' ? ' ' : '_');
    setDisplayChars(blanks);
    setTimeLeft(30);
    setTimerRunning(true);
    setTypedGuess('');
    clearTimer();
    timerRef.current = setInterval(()=>{
      setTimeLeft(t=>t-1);
    }, 1000);
  }
  function clearTimer(){ if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }}

  function shuffleArray(a){
    for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }

  function revealLetter(letter){
    const ans = shuffled[index].answer;
    const newChars = [...displayChars];
    let found = false;
    for (let i=0;i<ans.length;i++){
      if (ans[i] === letter && newChars[i] === '_'){
        newChars[i] = letter; found = true;
      }
    }
    setDisplayChars(newChars);
    if (!found){
      // wrong - small penalty
      setTimeLeft(t => Math.max(3, t - 3));
      playSound(wrongSound.current);
    } else {
      playSound(correctSound.current);
    }
    checkComplete(newChars);
  }

  function checkComplete(chars){
    if (!chars.includes('_')){
      // success
      clearTimer();
      const newScore = score + 20;
      setScore(newScore);
      if (newScore > best){ setBest(newScore); saveBest(newScore); }
      animateSuccess();
      playSound(winSound.current);
      setTimeout(()=> nextWord(), 700);
    }
  }

  function animateSuccess(){
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.08, duration: 160, useNativeDriver: true, easing: Easing.out(Easing.ease)}),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true })
    ]).start();
  }

  function onTimeUp(){
    clearTimer();
    Alert.alert("Time's up", `The word was: ${shuffled[index].answer}`,[{text:'Next',onPress:()=> nextWord()}]);
  }

  function nextWord(){
    const next = (index + 1) % shuffled.length;
    setIndex(next);
    startRound(next);
  }

  function useHint(){
    // reveal first unrevealed letter
    const ans = shuffled[index].answer;
    for (let i=0;i<ans.length;i++){
      if (ans[i] !== ' ' && displayChars[i] === '_'){
        revealLetter(ans[i]);
        break;
      }
    }
  }

  function skipWord(){
    clearTimer();
    Alert.alert('Skipped', `Word: ${shuffled[index].answer}` , [{text:'Next', onPress: ()=> nextWord()}]);
  }

  function submitTyped(){
    const guess = typedGuess.trim().toUpperCase();
    if (!guess) return Alert.alert('Enter a word', 'Type your guess in the input below.');
    const real = shuffled[index].answer.toUpperCase();
    if (guess === real){
      // mark all letters revealed
      const full = real.split('');
      setDisplayChars(full);
      checkComplete(full);
    } else {
      setTimeLeft(t=>Math.max(3,t-5));
      playSound(wrongSound.current);
      Alert.alert('Wrong', 'That is not correct. Time penalty applied.');
    }
    setTypedGuess('');
  }

  async function playSound(s){
    try{ if (s) { await s.replayAsync(); } }catch(e){}
  }

  // UI
  const item = shuffled[index];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Word Guess — Expo (Hard)</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>Round {index+1}/{shuffled.length}</Text>
            <Text style={styles.meta}>Score {score}</Text>
            <Text style={styles.meta}>Best {best}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.clue}>Clue: {item.clue}</Text>

          <Animated.View style={[styles.wordRow, { transform:[{scale: scaleAnim}] }]}> 
            {displayChars.map((c,i)=> (
              <View key={i} style={styles.letterBox}>
                <Text style={styles.letterText}>{c === '_' ? '' : c}</Text>
              </View>
            ))}
          </Animated.View>

          <View style={styles.lettersGrid}>
            {Array.from({length:26}).map((_,i)=>{
              const L = String.fromCharCode(65+i);
              return (
                <TouchableOpacity key={L} style={styles.letterBtn} onPress={()=> revealLetter(L)}>
                  <Text style={styles.letterBtnText}>{L}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.hintBtn} onPress={useHint}><Text style={styles.hintText}>Hint</Text></TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} onPress={skipWord}><Text style={styles.skipText}>Skip</Text></TouchableOpacity>
            <TouchableOpacity style={styles.resetBtn} onPress={()=>{ setShuffled(shuffleArray([...HARD_WORDS])); setIndex(0); setScore(0); startRound(0); }}><Text style={styles.resetText}>Restart</Text></TouchableOpacity>
          </View>

          <View style={styles.timerRow}>
            <Text style={styles.timerText}>Time: {timeLeft}s</Text>
            <View style={styles.timeBarBg}><View style={[styles.timeBarFill, { width: `${(timeLeft/30)*100}%` }]} /></View>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              value={typedGuess}
              onChangeText={setTypedGuess}
              placeholder="Type full word and Submit"
              placeholderTextColor="#999"
              style={styles.input}
              autoCapitalize='characters'
            />
            <TouchableOpacity style={styles.submitBtn} onPress={submitTyped}><Text style={styles.submitBtnText}>Submit</Text></TouchableOpacity>
          </View>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor:'#071029' },
  container:{ flex:1, padding:16 },
  header:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  title:{ color:'#fff', fontSize:18, fontWeight:'700' },
  metaRow:{ flexDirection:'row', gap:8 },
  meta:{ color:'#cbd5e1', marginLeft:10 },
  card:{ backgroundColor:'#0b1220', padding:12, borderRadius:12, flex:1 },
  clue:{ color:'#94a3b8', marginBottom:8 },
  wordRow:{ flexDirection:'row', flexWrap:'wrap', justifyContent:'center', marginBottom:12 },
  letterBox:{ width:40, height:52, borderRadius:8, backgroundColor:'#071229', borderWidth:1, borderColor:'#0f1724', margin:4, alignItems:'center', justifyContent:'center' },
  letterText:{ color:'#fff', fontSize:18, fontWeight:'700' },
  lettersGrid:{ flexDirection:'row', flexWrap:'wrap', marginTop:10, justifyContent:'center' },
  letterBtn:{ width:42, height:42, borderRadius:8, backgroundColor:'#081227', alignItems:'center', justifyContent:'center', margin:6, borderWidth:1, borderColor:'#15304a' },
  letterBtnText:{ color:'#e6eef8', fontWeight:'700' },
  controlsRow:{ flexDirection:'row', justifyContent:'space-around', marginTop:12 },
  hintBtn:{ padding:8, borderRadius:8, borderWidth:1, borderColor:'#7c3aed' }, hintText:{ color:'#7c3aed' },
  skipBtn:{ padding:8, borderRadius:8, borderWidth:1, borderColor:'#06b6d4' }, skipText:{ color:'#06b6d4' },
  resetBtn:{ padding:8, borderRadius:8, backgroundColor:'#2b2f3a' }, resetText:{ color:'#fff' },
  timerRow:{ marginTop:12, alignItems:'center' }, timerText:{ color:'#cbd5e1' },
  timeBarBg:{ width:'100%', height:8, backgroundColor:'#071229', borderRadius:8, marginTop:6 },
  timeBarFill:{ height:8, backgroundColor:'#7c3aed', borderRadius:8 },
  inputRow:{ flexDirection:'row', marginTop:12, alignItems:'center' },
  input:{ flex:1, height:44, borderRadius:8, backgroundColor:'#071229', paddingHorizontal:12, color:'#fff', borderWidth:1, borderColor:'#15304a' },
  submitBtn:{ marginLeft:8, backgroundColor:'#4f46e5', paddingHorizontal:14, paddingVertical:10, borderRadius:8 }, submitBtnText:{ color:'#fff', fontWeight:'700' }
});
  
