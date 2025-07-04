const express = require('express');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const router = express.Router();

const otpStore = new Map();

const sns = new SNSClient({ region: process.env.AWS_REGION });
const snsConfigured = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

router.post('/send', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'phone required' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });
  try {
    if (snsConfigured) {
      await sns.send(
        new PublishCommand({
          Message: `Your verification code is ${otp}`,
          PhoneNumber: phone,
        }),
      );
    } else {
      console.log(`Mock OTP for ${phone}: ${otp}`);
    }
    res.json({ success: true, otp: snsConfigured ? undefined : otp });
  } catch (err) {
    console.error('OTP send failed:', err);
    if (!snsConfigured) {
      res.json({ success: true, otp });
    } else {
      res.status(500).json({ error: 'Failed to send OTP' });
    }

  }
});

router.post('/verify', (req, res) => {
  const { phone, otp } = req.body;
  const record = otpStore.get(phone);
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }
  otpStore.delete(phone);
  res.json({ success: true });
});

module.exports = router;
