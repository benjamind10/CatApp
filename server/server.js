// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogPostsRoutes = require('./routes/blogPosts');

const app = express();
const port = 5000;

// Replace with your MongoDB connection string
const uri =
  'mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

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
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/blogPosts', blogPostsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
