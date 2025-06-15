import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAr_oIaAL9NmH2lgIE8B7Sol54NFR9wVUw",
  authDomain: "one-ai---jarvis.firebaseapp.com",
  projectId: "one-ai---jarvis",
  storageBucket: "one-ai---jarvis.appspot.com",
  messagingSenderId: "690963992597",
  appId: "1:690963992597:web:c43cee4447b2819d55fe1c",
  measurementId: "G-HNGHG95VNE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, googleProvider, facebookProvider, analytics, logEvent };
