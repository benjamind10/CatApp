import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated here
import 'bootstrap/dist/css/bootstrap.min.css';

import Images from './pages/Images';
import BlogPage from './pages/BlogPage';
import { UserProvider } from './context/UserContext';
import SignUpForm from './pages/SignUpForm';
import UserDashboard from './pages/UserDashboard';
import LoginForm from './pages/Login';
import BlogPosts from './pages/BlogPosts';
import Home from './pages/Home';
import Breeds from './pages/Breeds';

import './css/style.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {' '}
          <Route path="images" element={<Images />} />
          <Route path="breeds" element={<Breeds />} />
          <Route path="/" element={<Home />} />
          <Route path="/family" Component={BlogPage} />
          <Route path="/register" Component={SignUpForm} />
          <Route path="/blog" Component={BlogPosts} />
          <Route path="/dashboard" Component={UserDashboard} />
          <Route path="/login" Component={LoginForm} />
        </Routes>{' '}
      </Router>
    </UserProvider>
  );
}

export default App;
