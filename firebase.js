import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDD2w2KXToWQBG2LYTORVfB6-9AXb7EImI",
  authDomain: "guessthewordgame-73650.firebaseapp.com",
  projectId: "guessthewordgame-73650",
  storageBucket: "guessthewordgame-73650.appspot.com",
  messagingSenderId: "820848845803",
  appId: "1:820848845803:web:37e5315033b9fcee2d2fae",
};

// Initialize app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth (Expo/React Native compatible)
const auth = getAuth(app);
auth.persistence = getReactNativePersistence(AsyncStorage);

// Firestore
export const db = getFirestore(app);
export { auth };

export async function signInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;
    const idToken = user && user.getIdToken ? await user.getIdToken() : null;
    return {
      user: {
        uid: user.uid,
        email: user.email,
      },
      idToken,
    };
  } catch (error) {
    throw error;
  }
}

export async function createUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const idToken = user && user.getIdToken ? await user.getIdToken() : null;
    return {
      user: {
        uid: user.uid,
        email: user.email,
      },
      idToken,
    };
  } catch (error) {
    throw error;
  }
}

export async function getAuthCurrentUser() {
  return auth.currentUser || null;
}

export async function updateUserPassword(currentPassword, newPassword) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently signed in.");
    // Re-authenticate user before updating password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    throw error;
  }
}
