/* eslint-disable */
/* eslint-env node */
const express = require("express");
const router = express.Router();
const db = require("../db");

// For frontend analytics
router.post("/", async (req, res) => {
  const { userId, event, ...details } = req.body;
  await db.query(
    "INSERT INTO user_events (user_id, event, details) VALUES ($1, $2, $3)",
    [userId, event, JSON.stringify(details)]
  );
  res.json({ ok: true });
});
module.exports = router;
