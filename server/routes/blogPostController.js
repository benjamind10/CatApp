const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const mongoose = require('mongoose');

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
    const userId = req.params.userId;

    let picture = {};

    if (req.file) {
      picture = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      };
    }

    const post = new Post({
      user: userId,
      title: req.body.title,
      body: req.body.body,
      picture: picture,
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
    const postId = req.params.postId;
    const userId = req.query.userId;
    console.log(postId, userId);

    // Check if the user has already liked the post
    const post = await Post.findOne({
      _id: postId,
      likes: userId,
    });

    if (post) {
      // User has already liked the post, return an error or appropriate response
      return res
        .status(400)
        .json({ message: 'User has already liked the post' });
    }

    // Push the user to the likes array
    await Post.updateOne(
      { _id: postId },
      { $inc: { likesCount: 1 }, $push: { likes: userId } }
    );

    res.json({ message: 'Liked the post' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  const { body, userId, username } = req.body;
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).send('Invalid postId');
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).send('Post not found');
  }

  const comment = {
    user: userId,
    body: body,
    username: username,
  };

  post.comments.push(comment);

  await post.save();

  return res.status(200).send('Comment added successfully');
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
