          const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');

// Create a new claim
router.post('/claims', async (req, res) => {
  try {
    const { postId, userId, claimReason, contactInfo } = req.body;
    const newClaim = new Claim({
      postId,
      userId,
      claimReason,
      contactInfo,
      isApproved: false,
      claimDate: new Date(),
    });
    await newClaim.save();
    res.status(201).json({ message: 'Claim submitted!', claim: newClaim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List claims for a post
router.get('/claims/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const claims = await Claim.find({ postId });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;