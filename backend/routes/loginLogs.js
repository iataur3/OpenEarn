const express = require("express");
const router = express.Router();
const client = require("../db/mongoClient");

router.post("/api/login-logs", async (req, res) => {
  try {
    const db = client.db("adminPanel");
    const logs = db.collection("login_logs");
    await logs.insertOne(req.body);
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save login log" });
  }
});

module.exports = router;
