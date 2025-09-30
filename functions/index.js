// functions/index.js
const { deviceBlock } = require("./routes/blockDevice");

exports.deviceBlock = deviceBlock;

// functions/index.js
const functions = require("firebase-functions");
const admin = require("./firebase");

// 🔍 GET: Fetch login logs
exports.getLoginLogs = functions.https.onRequest((req, res) => {
  const logsRef = admin.firestore().collection("loginLogs");
  logsRef
    .get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push(doc.data()));
      res.json(data);
    })
    .catch((error) => {
      res.status(500).send("Error fetching logs");
    });
});

// 📝 POST: Save login log with UID + timestamp
exports.saveLoginLog = functions.https.onRequest(async (req, res) => {
  try {
    const logsRef = admin.firestore().collection("login_logs");
    const uid = req.body.uid || "anonymous";

    await logsRef.add({
      uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ...req.body,
    });

    res.json({ status: "success" });
  } catch (error) {
    res.status(500).send("Error saving log");
  }
});
