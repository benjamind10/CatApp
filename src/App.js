// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated here
import Main from './pages/Main';
import InfoPage from './pages/InfoPage';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {' '}
        {/* Updated here */}
        <Route path="info" element={<InfoPage />} /> {/* Updated here */}
        <Route path="/" element={<Main />} /> {/* Updated here */}
      </Routes>{' '}
      {/* Updated here */}
    </Router>
  );
}

export default App;
