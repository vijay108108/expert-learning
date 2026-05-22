import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAiZQhXF3_bPh-vavpAbBcf24Vlm5z-0xo",
  authDomain: "genznext-e93b1.firebaseapp.com",
  projectId: "genznext-e93b1",
  storageBucket: "genznext-e93b1.firebasestorage.app",
  messagingSenderId: "779179898682",
  appId: "1:779179898682:web:48912db39223c812848203",
  measurementId: "G-C4YYFPD4YF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);