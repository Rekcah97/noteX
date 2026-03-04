const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.Routes.js");
const noteRoutes = require("./notes.Rouets.js");

//Route 1
router.use("/auth", authRoutes);

//Route 2
router.use("/notes", noteRoutes);

//Route for Health
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
    msg: "up",
  });
});

module.exports = router;
