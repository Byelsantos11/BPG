// routes/pages.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../Middleware/authenticateToken");

// GET /protected/pages/dashboard
router.get("/dashboard", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Dashboard page accessed successfully",
    user: req.user
  });
});

module.exports = router;
