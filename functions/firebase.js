// //functions/firebase.js
// import { initializeApp } from "firebase/app";
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   databaseURL: "YOUR_DATABASE_URL",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// const app = initializeApp(firebaseConfig);
// import { getDatabase, ref, set } from "firebase/database";

// const db = getDatabase();
// console.log("Firebase DB connected:", db);

// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://openearn.firebaseio.com",
// });

// module.exports = admin;

// functions/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://openearn.firebaseio.com",
});

const db = admin.database();
console.log("Firebase connected");

module.exports = {admin, db};
