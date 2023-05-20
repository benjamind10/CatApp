// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated here
import Main from './pages/Main';
import Images from './pages/Images';
import BlogPage from './pages/BlogPage';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {' '}
        <Route path="images" element={<Images />} /> ""
        <Route path="/" element={<Main />} />
        <Route path="/images" component={Images} />
        <Route path="/blog" Component={BlogPage} />
      </Routes>{' '}
    </Router>
  );
}

export default App;
