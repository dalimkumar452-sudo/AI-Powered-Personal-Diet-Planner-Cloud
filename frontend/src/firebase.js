import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxhQwnVBoSn62k3sqaiKUBnIZkYhc2dyU",
  authDomain: "nutricloud-diet-planner.firebaseapp.com",
  projectId: "nutricloud-diet-planner",
  storageBucket: "nutricloud-diet-planner.firebasestorage.app",
  messagingSenderId: "341689912716",
  appId: "1:341689912716:web:9c5e889c21038563cbdaa9",
  measurementId: "G-NQYWHVQQZC"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);