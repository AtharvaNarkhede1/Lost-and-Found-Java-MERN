const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const mongoose = require('mongoose');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lostfound_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});
const upload = multer({ storage: storage });

// Create a new post (with image)
router.post('/posts', upload.single('image'), async (req, res) => {
  try {
    const { userId, title, description, location, dateFound } = req.body;
    const image_path = req.file ? req.file.path : '';
    const newPost = new Post({
      userId,
      title,
      description,
      image_path,
      location,
      dateFound: dateFound ? new Date(dateFound) : undefined,
      isApproved: false,
      isClaimed: false,
      postDate: new Date(),
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created!', post: newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all posts (optionally filter by approval and userId), and populate username
router.get('/posts', async (req, res) => {
  try {
    const { isApproved, userId } = req.query;
    const filter = {};
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
    if (userId) {
      // Try to convert to ObjectId, fallback to string if invalid
      try {
        filter.userId = mongoose.Types.ObjectId(userId);
      } catch {
        filter.userId = userId;
      }
    }
    // Populate userId to get username
    const posts = await Post.find(filter)
      .sort({ postDate: -1 })
      .populate('userId', 'username'); // Only pull username from user

    // Map posts to include top-level username field for frontend
    const mappedPosts = posts.map(post => {
      const p = post.toObject();
      p.username = p.userId?.username || 'Unknown';
      return p;
    });

    res.json(mappedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;