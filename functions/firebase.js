import { getDatabase, ref, set } from "firebase/database";

const db = getDatabase();
console.log("Firebase DB connected:", db);

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // 🔐 Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://openearn.firebaseio.com",
});

module.exports = admin;
