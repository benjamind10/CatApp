import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated here
import 'bootstrap/dist/css/bootstrap.min.css';

import Images from './pages/Images';
import Family from './pages/Family';
import { UserProvider } from './context/UserContext';
import SignUpForm from './pages/SignUpForm';
import UserDashboard from './pages/UserDashboard';
import LoginForm from './pages/Login';
import Home from './pages/Home';
import Breeds from './pages/Breeds';
import Profiles from './pages/Profiles';
import UserProfile from './pages/UserProfile';

import './css/style.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {' '}
          <Route path="images" element={<Images />} />
          <Route path="breeds" element={<Breeds />} />
          <Route path="family" element={<Family />} />
          <Route path="/" element={<Home />} />
          <Route path="/family" Component={Family} />
          <Route path="/register" Component={SignUpForm} />
          <Route path="/dashboard" Component={UserDashboard} />
          <Route path="/login" Component={LoginForm} />
          <Route path="/profile" Component={UserProfile} />
          <Route path="/profiles" Component={Profiles} />
        </Routes>{' '}
      </Router>
    </UserProvider>
  );
}

export default App;
