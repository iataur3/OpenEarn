// functions/firebase.js
// const admin = require("./firebase");
// const logsRef = admin.firestore().collection("loginLogs");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // 🔐 Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://openearn.firebaseio.com",
});

module.exports = admin;
