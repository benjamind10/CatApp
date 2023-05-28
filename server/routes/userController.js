const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
});

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
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'none',
    });
    res.json({ message: 'Login successful', token: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new user
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword, // Save the hashed password
    email,
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
// router.patch('/:userId', upload.single('image'), async (req, res) => {
//   try {
//     console.log(req.body);
//     if (req.file) {
//       updatedFields.picture = {
//         data: fs.readFileSync(req.file.path),
//         contentType: req.file.mimetype,
//       };
//     }
//     const updatedUser = await User.updateOne(
//       { _id: req.params.userId },
//       {
//         $set: {
//           age: req.body.age,
//           description: req.body.description,
//           interests: req.body.interests,
//           favoriteBreeds: req.body.favoriteBreeds,
//           currentPets: req.body.currentPets,
//         },
//       }
//     );
//     if (updatedUser.nModified === 0) {
//       res.json({ message: 'No changes were made' });
//     } else {
//       console.log(updatedUser);
//       res.json(updatedUser);
//     }
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// Update user
router.patch('/:userId', upload.single('picture'), async (req, res) => {
  try {
    const updatedFields = {
      age: req.body.age,
      description: req.body.description,
      interests: req.body.interests,
      favoriteBreeds: req.body.favoriteBreeds,
      currentPets: req.body.currentPets,
    };

    if (req.file) {
      updatedFields.picture = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      };
    }

    const updatedUser = await User.updateOne(
      { _id: req.params.userId },
      { $set: updatedFields }
    );

    if (updatedUser.nModified === 0) {
      res.json({ message: 'No changes were made' });
    } else {
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

// Get user images
router.put('/:userId/picture', upload.single('picture'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.picture = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get('/:userId/picture', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || !user.picture.data) {
      return res.status(404).json({ message: 'No picture found' });
    }

    res.set('Content-Type', user.picture.contentType);
    res.send(user.picture.data);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
