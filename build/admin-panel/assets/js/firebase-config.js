// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDH3uBKj3j5zgvwTeip2sg0EWbFDyWzkHE",
//   authDomain: "openearn.firebaseapp.com",
//   projectId: "openearn",
//   storageBucket: "openearn.firebasestorage.app",
//   messagingSenderId: "328862915484",
//   appId: "1:328862915484:web:b38bbb261b6ee4e1e84659",
//   measurementId: "G-C3ZK6WYR40",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// 🔥 Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 🔐 Firebase config (from Console)
const firebaseConfig = {
  apiKey: "AIzaSyDH3uBKj3j5zgvwTeip2sg0EWbFDyWzkHE",
  authDomain: "openearn.firebaseapp.com",
  projectId: "openearn",
  storageBucket: "openearn.firebasestorage.app",
  messagingSenderId: "328862915484",
  appId: "1:328862915484:web:b38bbb261b6ee4e1e84659",
  measurementId: "G-C3ZK6WYR40",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔑 Export reusable instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
