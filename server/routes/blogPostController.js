const express = require('express');
const router = express.Router();
const Post = require('../models/post');

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
router.post('/user/:userId/create', async (req, res) => {
  const userId = req.params.userId; // Get userId from the path

  const post = new Post({
    user: userId, // Now user is assigned from the path
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
router.put('/edit/:postId/user/:userId', async (req, res) => {
  try {
    const updatedPost = await Post.updateOne(
      { _id: req.params.postId, user: req.params.userId }, // Match by both postId and userId to ensure users can only edit their own posts
      { $set: { title: req.body.title, body: req.body.body } }
    );
    res.json(updatedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

// Delete a post
router.delete('/delete/:postId/user/:userId', async (req, res) => {
  try {
    const removedPost = await Post.remove({
      _id: req.params.postId,
      user: req.params.userId,
    }); // Match by both postId and userId to ensure users can only delete their own posts
    res.json(removedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
