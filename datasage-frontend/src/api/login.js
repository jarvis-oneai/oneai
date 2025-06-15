const express = require("express");
const router = express.Router();
const db = require("../db");

// When login is successful
router.post("/", async (req, res) => {
  const { phone, email, type } = req.body; // type: 'phone', 'email', 'google', 'facebook'
  try {
    // 1. Find user by phone or email
    const userResult = await db.query(
      "SELECT id, recent_login, most_login FROM users WHERE phone=$1 OR email=$2",
      [phone, email]
    );
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Update recent_login, and count most frequent
    // (This is simplified logic. You might want to track counts in a separate table or JSON field)
    await db.query(
      "UPDATE users SET recent_login=$1 WHERE id=$2",
      [type, user.id]
    );

    // 3. Add event
    await db.query(
      "INSERT INTO user_events (user_id, event, details) VALUES ($1, $2, $3)",
      [user.id, "User Login", JSON.stringify({ type })]
    );

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
