const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username');
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get posts by user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ user: userId }).populate(
      'user',
      'username'
    );
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

// Create a new post
router.post('/create', async (req, res) => {
  const post = new Post({
    user: req.body.userId, // You would typically get this from the session or a secure token
    title: req.body.title,
    body: req.body.body,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

// Edit a post
router.put('/edit/:postId', async (req, res) => {
  try {
    const updatedPost = await Post.updateOne(
      { _id: req.params.postId, user: req.body.userId }, // Match by both postId and userId to ensure users can only edit their own posts
      { $set: { title: req.body.title, body: req.body.body } }
    );
    res.json(updatedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

// Delete a post
router.delete('/delete/:postId', async (req, res) => {
  try {
    const removedPost = await Post.remove({
      _id: req.params.postId,
      user: req.body.userId,
    }); // Match by both postId and userId to ensure users can only delete their own posts
    res.json(removedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
