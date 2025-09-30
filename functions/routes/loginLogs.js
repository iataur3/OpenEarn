// routes/loginLogs.js
const express = require("express");
const router = express.Router();
const admin = require("../firebase"); // 🔥 Firebase Admin SDK

router.post("/api/login-logs", async (req, res) => {
  try {
    const logsRef = admin.firestore().collection("login_logs");
    await logsRef.add(req.body); // ✅ Firestore insert
    res.json({ status: "success" });
  } catch (err) {
    console.error("❌ Firestore error:", err.message);
    res.status(500).json({ error: "Failed to save login log" });
  }
});

module.exports = router;

const uid = req.body.uid || "anonymous";
await logsRef.add({
  uid,
  timestamp: admin.firestore.FieldValue.serverTimestamp(),
  ...req.body,
});
