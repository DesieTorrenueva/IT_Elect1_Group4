// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDD2w2KXToWQBG2LYTORVfB6-9AXb7EImI",
  authDomain: "guessthewordgame-73650.firebaseapp.com",
  projectId: "guessthewordgame-73650",
  storageBucket: "guessthewordgame-73650.appspot.com",
  messagingSenderId: "820848845803",
  appId: "1:820848845803:web:37e5315033b9fcee2d2fae",
};

// Initialize App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth (React Native)
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (err) {
  console.log("Firebase Auth already initialized");
}

// Firestore
const db = getFirestore(app);

// Hardcoded Admin
export const ADMIN_ACCOUNT = {
  email: "admindesie@gmail.com",
  password: "admindes",
  username: "desieadmin",
  role: "admin",
};

export { auth, db };