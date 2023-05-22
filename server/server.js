// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const blogPostController = require('./routes/blogPostController');
const userController = require('./routes/userController');

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

// Accessing the path module
const path = require('path');

// Step 1:
app.use(express.static(path.resolve(__dirname, './client/build')));
// Step 2:
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

// Routes
app.use('/api/posts', blogPostController);
app.use('/api/user', userController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
