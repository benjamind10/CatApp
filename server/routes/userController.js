const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // If user not found or password doesn't match, return an error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token with the user ID as the payload
    // Generate a JWT token with the user ID as the payload
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    // Set the token as a cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'none',
    });

    // Return a success response
    res.json({ message: 'Login successful', token: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new user
router.post('/register', async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password, // We're not hashing the password here.
    email: req.body.email,
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

// Delete user
router.delete('/:userId', async (req, res) => {
  try {
    const removedUser = await User.remove({ _id: req.params.userId });
    res.json(removedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

// Update user
router.patch('/:userId', async (req, res) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.userId },
      {
        $set: {
          age: req.body.age,
          description: req.body.description,
          interests: req.body.interests,
          favoriteBreeds: req.body.favoriteBreeds,
        },
      }
    );
    if (updatedUser.nModified === 0) {
      res.json({ message: 'No changes were made' });
    } else {
      console.log(updatedUser);
      res.json(updatedUser);
    }
  } catch (err) {
    res.json({ message: err });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'none',
    });

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user info
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
