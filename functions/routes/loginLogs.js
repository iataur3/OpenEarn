const express = require("express");
/* eslint-disable new-cap */ // 🔧 Router() lint exception
const router = express.Router();
/* eslint-enable new-cap */

const admin = require("../firebase"); // 🔥 Firebase Admin SDK

router.post("/api/login-logs", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({error: "Empty login log data"});
    }

    const logsRef = admin.firestore().collection("login_logs");
    const uid = req.body.uid || "anonymous";

    await logsRef.add({
      uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ...req.body,
    });

    console.log("📥 Login log saved for UID:", uid);
    res.json({status: "success"});
  } catch (err) {
    console.error("❌ Firestore error:", err.message);
    res.status(500).json({error: "Failed to save login log"});
  }
});

module.exports = router;
