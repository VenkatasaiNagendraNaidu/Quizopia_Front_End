import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook
import './Student.css'; // Importing the stylesheet

const StudentLogin = () => {
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle redirection to signup page
  const handleSignupRedirect = () => {
    navigate('/student-signup');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add your login logic here
    // For now, let's just log the credentials
    console.log('Student ID:', studentID);
    console.log('Password:', password);
  };

  return (
    <div className="student-login-container">
      <h2 className="student-login-heading">Student Login</h2>
      <form onSubmit={handleSubmit} className="student-login-form">
        <div className="student-login-input-group">
          <label htmlFor="studentID" className="student-login-label">Student ID</label>
          <input
            type="text"
            id="studentID"
            name="studentID"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            placeholder="Enter your Student ID"
            required
            className="student-login-input"
          />
        </div>
        <div className="student-login-input-group">
          <label htmlFor="password" className="student-login-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="student-login-input"
          />
        </div>
        <button type="submit" className="student-login-button" onClick={()=>{navigate('/studentHomePage')}} >Login</button>
      </form>

      <p className="student-login-signup-text">
        Don't have an account?{' '}
        <span
          className="student-login-signup-link"
          onClick={handleSignupRedirect}
        >
          Create one here
        </span>
        .
      </p>
    </div>
  );
};

export default StudentLogin;
