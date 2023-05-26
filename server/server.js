const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const blogPostController = require('./routes/blogPostController');
const userController = require('./routes/userController');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Replace with your MongoDB connection string
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ex3xzni.mongodb.net/${process.env.MONGO_DB_NAME}`;

// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB database connection established successfully');
  })
  .catch(err => {
    console.log(err);
  });

// Middlewares
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://radiant-cove-09592.herokuapp.com/'
        : 'http://localhost:3000',
    // origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  req.rawBody = '';
  req.on('data', function (chunk) {
    req.rawBody += chunk;
  });
  next();
});

// Routes
app.use('/api/posts', blogPostController);
app.use('/api/user', userController);

if (process.env.NODE_ENV === 'production') {
  app.use('/images', express.static(path.join(__dirname, '../client/images')));
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
