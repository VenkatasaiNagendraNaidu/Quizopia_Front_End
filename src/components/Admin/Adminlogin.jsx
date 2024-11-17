import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; 

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleSignupRedirect = () => {
    navigate('/admin-dashboard-for-quizopia-for-secure-access');
  };

  return (
    <div className="adminLogin-container">
      <div className="adminLogin-card">
        <h2>Admin Login</h2>
        <form className="adminLogin-form">
          <div className="adminLogin-form-group">
            <label htmlFor="adminID">Admin ID</label>
            <input
              type="text"
              id="adminID"
              name="adminID"
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
              placeholder="Enter Password"
              required
            />
          </div>
          <button type="submit" className="adminLogin-button" onClick={handleSignupRedirect}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
