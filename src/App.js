// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated here
import Main from './pages/Main';
import Images from './pages/Images';
import BlogPage from './pages/BlogPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import SignUpForm from './pages/SignUpForm';
import UserDashboard from './pages/UserDashboard';
import LoginForm from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {' '}
        <Route path="images" element={<Images />} /> ""
        <Route path="/" element={<Main />} />
        <Route path="/images" component={Images} />
        <Route path="/blog" Component={BlogPage} />
        <Route path="/register" Component={SignUpForm} />
        <Route path="/dashboard" Component={UserDashboard} />
        <Route path="/login" Component={LoginForm} />
      </Routes>{' '}
    </Router>
  );
}

export default App;
