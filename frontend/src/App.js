// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';  // We’ll create this file for the home page.
import Dashboard from './pages/EmployeeDashboard';  // For employee dashboard (later).
import Admin from './pages/Admin'; 
import EmployeeTable from './components/EmployeeTable';
import CourseTable from './components/CourseTable';
import LearningPathManagement from './pages/LearningPathManagement';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import CourseManagementPage from "./pages/CourseManagementPage";
import CertificatePage from './pages/CertificatePage'
 // For admin interface (later).

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />  {/* Home Page */}
          <Route path="/dashboard" element={<Dashboard />} />  {/* Employee Dashboard */}
          <Route path="/admin" element={<Admin />} />  Admin Interface
          <Route path="/employees" element={<EmployeeManagementPage />} />
        <Route path="/courses" element={<CourseManagementPage />} />
        <Route path="/learning-paths" element={<LearningPathManagement />} />
        <Route path="/certificate/:certificateId" element={<CertificatePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
