//components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/LoginPage.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        // Handle successful login
        console.log('Login successful:', data);

         // Store user data in local storage
        localStorage.setItem('user', JSON.stringify(data)); // Save the entire user object
        
        // Redirect based on user role
        if (data.role === 'admin'||data.role === 'Admin') {
          navigate('/admin'); // Redirect to admin dashboard
        } else {
          navigate('/dashboard'); // Redirect to employee dashboard
        }
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <div className="home-container"></div>
      <div className="content">
        <div className="header">
          <div className="logo">CourseConnect</div>
          <button className="btn sign-in-btn">Sign In</button>
        </div>
        <div className="welcome-text">
          <h1>Welcome to Learning Path & Course Completion System</h1>
          <p>Track your progress and master new skills to build a better future!</p>
        </div>
        <div className="login-form">
          <input
            type="text"
            placeholder="Enter Your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn get-started-btn" onClick={handleLogin}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
