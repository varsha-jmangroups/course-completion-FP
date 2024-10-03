// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';  // We’ll create this file for the home page.
import Dashboard from './pages/Dashboard';  // For employee dashboard (later).
import Admin from './pages/Admin'; 
import 'bootstrap/dist/css/bootstrap.min.css';
 // For admin interface (later).

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />  {/* Home Page */}
          <Route path="/dashboard" element={<Dashboard />} />  {/* Employee Dashboard */}
          <Route path="/admin" element={<Admin />} />  Admin Interface
        </Routes>
      </div>
    </Router>
  );
}

export default App;
