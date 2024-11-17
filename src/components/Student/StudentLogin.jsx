import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook
import axios from 'axios'; // Importing axios
import './Student.css'; // Importing the stylesheet
import {message} from 'antd'

const StudentLogin = () => {
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For error messages
  const navigate = useNavigate();

  // Handle redirection to signup page
  const handleSignupRedirect = () => {
    navigate('/student-signup');
  };

  // Handle form submission and API call
  const handleSubmit = async (e) => {
    console.log(studentID,password);
    
    e.preventDefault();
    setError(''); // Reset any previous errors

    try {
      // Make API call to backend login endpoint
      const response = await axios.post('http://localhost:5000/api/students/login', {
        studentID,
        password
      });

      // Assuming successful login returns a message and studentID
      if (response.status === 200) {
        message.success("Login Successful")
        // Redirect to student home page or dashboard
        navigate('/studentHomePage');
      }
    } catch (err) {
      // Handling errors from backend
      if (err.response) {
        message.error('Kindly check your credentials')

        setError(err.response.data.message); // Show error message from backend
      } else {
        message.error('An error occurred, please try again.')
        setError('An error occurred, please try again.');
      }
    }
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
        {/* {error && <p className="error-message">{error}</p>} */}

        <button type="submit" className="student-login-button">Login</button>
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
