const express = require('express');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Simple in-memory OTP store. In real apps use a DB or cache.
const otpStore = new Map();

const sns = new SNSClient({ region: process.env.AWS_REGION });

// Send OTP to phone
router.post('/request-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'phone required' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });
  try {
    await sns.send(new PublishCommand({
      Message: `Your verification code is ${otp}`,
      PhoneNumber: phone,
    }));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP and send password reset link via SMS
router.post('/send-reset-link', async (req, res) => {
  const { phone, otp } = req.body;
  const record = otpStore.get(phone);
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }
  otpStore.delete(phone);

  const token = jwt.sign({ phone }, process.env.RESET_SECRET || 'secret', {
    expiresIn: '10m',
  });
  const resetLink = `${process.env.FRONTEND_URL || 'https://example.com'}/reset-password?token=${token}`;

  try {
    await sns.send(new PublishCommand({
      Message: `Reset your password using this link: ${resetLink}`,
      PhoneNumber: phone,
    }));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

module.exports = router;
