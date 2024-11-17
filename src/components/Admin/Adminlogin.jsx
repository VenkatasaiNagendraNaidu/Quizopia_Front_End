import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import axios from 'axios';
import { message } from 'antd';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminID, setAdminID] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'adminID') {
      setAdminID(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        adminID,
        password
      });

      // Show success message on successful login
      message.success(response.data.message);

      // Redirect to admin dashboard after successful login
      navigate('/admin-dashboard-for-quizopia-for-secure-access');
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="adminLogin-container">
      <div className="adminLogin-card">
        <h2>Admin Login</h2>
        <form className="adminLogin-form" onSubmit={handleLogin}>
          <div className="adminLogin-form-group">
            <label htmlFor="adminID">Admin ID</label>
            <input
              type="text"
              id="adminID"
              name="adminID"
              value={adminID}
              onChange={handleInputChange}
              placeholder="Enter Admin ID"
              required
            />
          </div>
          <div className="adminLogin-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Enter Password"
              required
            />
          </div>
          <button type="submit" className="adminLogin-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
