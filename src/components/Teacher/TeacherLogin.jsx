import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Teacher.css';
import { message } from 'antd';

const TeacherLogin = () => {
  const [teacherID, setTeacherID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignupRedirect = () => {
    navigate('/teacher-signup');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/teachers/login', {
        teacherID,
        password
      });

      if (response.status === 200) {
        message.success("Login Successful")
        navigate('/TeacherHomePage');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Something went wrong. Please try again.');
      } else {
        setError('Network error. Please try again later.');
      }
    }
  };

  return (
    <div className='teacher-login-container'>
      <div className='teacher-login-card'>
        <h2 className='teacher-login-title'>Teacher Login</h2>
        <form className='teacher-login-form' onSubmit={handleSubmit}>
          <div className='teacher-login-form-group'>
            <label htmlFor="teacherID" className='teacher-login-form-label'>Teacher ID</label>
            <input
              type="text"
              id="teacherID"
              name="teacherID"
              className='teacher-login-form-input'
              value={teacherID}
              onChange={(e) => setTeacherID(e.target.value)}
              required
            />
          </div>
          <div className='teacher-login-form-group'>
            <label htmlFor="password" className='teacher-login-form-label'>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className='teacher-login-form-input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className='teacher-login-btn'>Login</button>
        </form>

        {error && <p className='teacher-login-error'>{error}</p>}

        <p className='teacher-login-signup-text'>
          If you don't have an account,{' '}
          <span 
            className='teacher-login-signup-link' 
            onClick={handleSignupRedirect}
          >
            create one here
          </span>.
        </p>
      </div>
    </div>
  );
};

export default TeacherLogin;
