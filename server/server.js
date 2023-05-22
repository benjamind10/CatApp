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
    origin: 'http://localhost:3000', // replace with the URL of front-end app
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
