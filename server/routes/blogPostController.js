const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
router.post(
  '/user/:userId/create',
  upload.single('image'),
  async (req, res) => {
    const userId = req.params.userId; // Get userId from the path
    const post = new Post({
      user: userId, // Now user is assigned from the path
      title: req.body.title,
      body: req.body.body,
      picture: {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      },
    });

    try {
      const savedPost = await post.save();
      res.json(savedPost);
    } catch (err) {
      res.json({ message: err });
      console.log(err);
    }
  }
);

// Edit a post
router.put(
  '/edit/:postId/user/:userId',
  upload.single('image'),
  async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.params.userId;
      const { title, body } = req.body;

      const post = await Post.findOne({ _id: postId, user: userId });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      let updatedFields = { title, body };

      if (req.file) {
        updatedFields.picture = {
          data: fs.readFileSync(req.file.path),
          contentType: req.file.mimetype,
        };
      }

      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId, user: userId },
        { $set: updatedFields },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

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

// Like a post
router.put('/:postId/like', async (req, res) => {
  try {
    await Post.updateOne({ _id: req.params.postId }, { $inc: { likes: 1 } });
    res.json({ message: 'Liked the post' });
  } catch (err) {
    res.json({ message: err });
  }
});

// Dislike a post
router.put('/:postId/dislike', async (req, res) => {
  try {
    await Post.updateOne({ _id: req.params.postId }, { $inc: { dislikes: 1 } });
    res.json({ message: 'Disliked the post' });
  } catch (err) {
    res.json({ message: err });
  }
});

// Add a comment to a post
router.post('/:postId/comment', async (req, res) => {
  try {
    const comment = {
      user: req.body.user, // TODO: Set this to the actual user
      text: req.body.comment,
    };

    await Post.updateOne(
      { _id: req.params.postId },
      { $push: { comments: comment } }
    );

    res.json({ message: 'Comment added' });
  } catch (err) {
    res.json({ message: err });
  }
});

router.get('/images/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post || !post.picture) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', post.picture.contentType);
    res.send(post.picture.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
