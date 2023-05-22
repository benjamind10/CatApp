import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated here
import 'bootstrap/dist/css/bootstrap.min.css';

import Main from './pages/Main';
import Images from './pages/Images';
import BlogPage from './pages/BlogPage';
import { UserProvider } from './context/UserContext';
import SignUpForm from './pages/SignUpForm';
import UserDashboard from './pages/UserDashboard';
import LoginForm from './pages/Login';
import BlogPosts from './pages/BlogPosts';

import './css/style.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {' '}
          <Route path="images" element={<Images />} /> ""
          <Route path="/" element={<Main />} />
          <Route path="/images" component={Images} />
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
