const express = require("express");
const router = express.Router();
const db = require("../db"); // Your DB client/Pool

// Create new user and record event
router.post("/", async (req, res) => {
  const {
    phone, country_code, email, name, city, occupation, otherOccupation, age, pincode, source
  } = req.body;

  try {
    // 1. Insert user
    const result = await db.query(`
      INSERT INTO users (phone, country_code, email, name, city, occupation, other_occupation, age, pincode, source, recent_login, most_login)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10,$10)
      ON CONFLICT (phone) DO NOTHING
      RETURNING id
    `, [phone, country_code, email, name, city, occupation, otherOccupation, age, pincode, source]);

    const userId = result.rows[0]?.id;

    // 2. Record analytics event
    await db.query(
      "INSERT INTO user_events (user_id, event, details) VALUES ($1, $2, $3)",
      [userId, 'User Created', JSON.stringify(req.body)]
    );

    res.json({ ok: true, userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
