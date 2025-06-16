const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Claim = require('../models/Claim');
const mongoose = require('mongoose');

// List all pending posts (admin)
router.get('/posts/pending', async (req, res) => {
  try {
    const posts = await Post.find({ isApproved: false }).sort({ postDate: -1 }).lean();
    // Optionally populate username
    for (const post of posts) {
      const user = await User.findById(post.userId);
      post.username = user ? user.username : '';
    }
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all approved posts (admin)
router.get('/posts/approved', async (req, res) => {
  try {
    const posts = await Post.find({ isApproved: true }).sort({ postDate: -1 }).lean();
    for (const post of posts) {
      const user = await User.findById(post.userId);
      post.username = user ? user.username : '';
    }
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all claims for a specific post
router.get('/posts/:postId/claims', async (req, res) => {
  try {
    const { postId } = req.params;
    const claims = await Claim.find({ postId: new mongoose.Types.ObjectId(postId) }).sort({ claimDate: -1 }).lean();
    for (const claim of claims) {
      const user = await User.findById(claim.userId);
      claim.username = user ? user.username : '';
    }
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve or disapprove a post
router.patch('/posts/:postId/approve', async (req, res) => {
  try {
    const { postId } = req.params;
    const { approve } = req.body;
    const updated = await Post.findByIdAndUpdate(postId, { isApproved: approve }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve a claim (approve claim, set post as claimed, delete other claims)
router.patch('/claims/:claimId/approve', async (req, res) => {
  try {
    const { claimId } = req.params;
    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ error: 'Claim not found' });

    // 1. Approve this claim
    await Claim.findByIdAndUpdate(claimId, { isApproved: true });

    // 2. Set post as claimed
    await Post.findByIdAndUpdate(claim.postId, { isClaimed: true });

    // 3. Delete all other claims for the same post
    await Claim.deleteMany({ postId: claim.postId, _id: { $ne: claimId } });

    res.json({ message: 'Claim approved and others removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject (delete) a claim
router.delete('/claims/:claimId', async (req, res) => {
  try {
    const { claimId } = req.params;
    await Claim.findByIdAndDelete(claimId);
    res.json({ message: 'Claim deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;