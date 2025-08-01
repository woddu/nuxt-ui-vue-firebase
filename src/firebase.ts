// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNGHfd-y95qbzwOw8Mu79LPFuYAXfBd_E",
  authDomain: "vue-firebase-test-3b12a.firebaseapp.com",
  projectId: "vue-firebase-test-3b12a",
  storageBucket: "vue-firebase-test-3b12a.firebasestorage.app",
  messagingSenderId: "748264823489",
  appId: "1:748264823489:web:5094843349e226b00b1240",
  measurementId: "G-5M24D5MEQK"
};

export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);

export const firebaseAnalytics = getAnalytics(firebaseApp);

const db = getFirestore(firebaseApp);

export const studentsRef = collection(db, "students");