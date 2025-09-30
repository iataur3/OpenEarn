// routes/blockDevice.js
const functions = require("firebase-functions");

exports.deviceBlock = functions.https.onRequest((req, res) => {
  const { deviceId, reason, time } = req.body;

  if (!deviceId || !reason || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const blockEntry = {
    deviceId,
    reason,
    time,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  };

  console.log("🔒 Block logged:", blockEntry);

  res.status(201).json({ message: "Device block recorded" });
});
