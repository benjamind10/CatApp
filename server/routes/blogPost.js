const express = require('express');
const router = express.Router();

let blogPosts = [];

router.get('/', (req, res) => {
  res.json(blogPosts);
});

router.post('/', (req, res) => {
  const newPost = req.body;
  blogPosts.push(newPost);
  res.json(newPost);
});

module.exports = router;
