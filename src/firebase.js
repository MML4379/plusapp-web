
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByMj8NnblrPvDfbRxKDFMVgQOpmcV1duE",
  authDomain: "mmlplus.firebaseapp.com",
  databaseURL: "https://mmlplus-default-rtdb.firebaseio.com",
  projectId: "mmlplus",
  storageBucket: "mmlplus.appspot.com",
  messagingSenderId: "524672239629",
  appId: "1:524672239629:web:413f835caeede6d26dad44",
  measurementId: "G-FM7DZ5VGWQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);