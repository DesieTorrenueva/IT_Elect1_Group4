// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDD2w2KXToWQBG2LYTORVfB6-9AXb7EImI",
  authDomain: "guessthewordgame-73650.firebaseapp.com",
  projectId: "guessthewordgame-73650",
  storageBucket: "guessthewordgame-73650.firebasestorage.app",
  messagingSenderId: "820848845803",
  appId: "1:820848845803:web:37e5315033b9fcee2d2fae"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
