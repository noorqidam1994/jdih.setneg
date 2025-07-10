import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(clientCredentials);
const db = getFirestore(app);

export {
  db,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
};
