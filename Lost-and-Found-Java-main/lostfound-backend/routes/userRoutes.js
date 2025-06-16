const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// POST /api/register
router.post('/register', async (req, res) => {
  const { username, password, email, phone, isAdmin } = req.body;
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }
    // Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      passwordHash,
      email,
      phone,
      registrationDate: new Date(),
      isAdmin: isAdmin === true // Allow admin creation if sent, else default to false
    });
    await user.save();
    res.status(201).json({ success: true, message: 'User registered!' });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid username' });
    }
    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid password' });
    }
    // Send isAdmin in the response!
    res.json({
       success: true,
       message: 'Login success',
       user: { _id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;