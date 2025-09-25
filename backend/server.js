// server.js
const express = require("express");
const app = express();

// Importing the route
const blockDeviceRoute = require("./routes/blockDevice");

// Middleware
app.use(express.json());

// Route mounting
app.use("/api", blockDeviceRoute);

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
