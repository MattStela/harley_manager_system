import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrWw9eESNR6O4H-Eot3ScHKigepen8fS8",
  authDomain: "motoclub-1d6b7.firebaseapp.com",
  projectId: "motoclub-1d6b7",
  storageBucket: "motoclub-1d6b7.firebasestorage.app",
  messagingSenderId: "1017072702236",
  appId: "1:1017072702236:web:37dcc91f13fb683b5be0d9",
  measurementId: "G-GGTHPTP49B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  // Inicialize o Analytics apenas no lado do cliente
  const { getAnalytics } = require("firebase/analytics");
  analytics = getAnalytics(app);
}

export { auth, db, analytics };
