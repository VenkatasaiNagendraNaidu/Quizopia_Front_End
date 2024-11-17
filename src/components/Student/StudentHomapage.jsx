import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Student.css'

const StudentHomapage = () => {
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    // You can clear user session or token if needed
    navigate('/');
  };

  return (
    <div className="studentHomapage-container">
      <div className="studentHomapage-header">
        <h1>Welcome to Your Dashboard</h1>
        <button className="studentHomapage-logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Teacher Notices Section */}
      <div className="studentHomapage-section studentHomapage-card">
        <h2>Teacher Notices</h2>
        <ul>
          <li>
            <strong>Notice 1:</strong>
            <p>There will be a holiday on Monday.</p>
          </li>
          <li>
            <strong>Notice 2:</strong>
            <p>Exam schedule is out! Please check your portal.</p>
          </li>
        </ul>
        <button className="studentHomapage-button">View More</button>
      </div>

      {/* Teacher Quizzes Section */}
      <div className="studentHomapage-section studentHomapage-card">
        <h2>Teacher Quizzes</h2>
        <ul>
          <li>
            <strong>Math Quiz:</strong>
            <p>Last attempted on 15th October, 2024.</p>
          </li>
          <li>
            <strong>Science Quiz:</strong>
            <p>Scheduled for 20th October, 2024.</p>
          </li>
        </ul>
        <button className="studentHomapage-button">View Details</button>
      </div>

      {/* Upcoming Quizzes Section */}
      <div className="studentHomapage-section studentHomapage-upcoming-quizzes studentHomapage-card">
        <h2>Upcoming Quizzes</h2>
        <ul>
          <li>
            <strong>Math Quiz</strong>
            <p>Scheduled for 20th October, 2024</p>
          </li>
        </ul>
        <button className="studentHomapage-button">View More</button>
      </div>

      {/* Ongoing Quizzes Section */}
      <div className="studentHomapage-section studentHomapage-ongoing-quizzes studentHomapage-card">
        <h2>Ongoing Quizzes</h2>
        <ul>
          <li>
            <strong>Science Quiz</strong>
            <p>Currently in progress.</p>
          </li>
        </ul>
        <button className="studentHomapage-button">Join Quiz</button>
      </div>

      {/* Scorecard Section */}
      <div className="studentHomapage-section studentHomapage-scorecard studentHomapage-card">
        <h2>Your Scorecard</h2>
        <table className="studentHomapage-scorecard-table">
          <thead>
            <tr>
              <th>Quiz Name</th>
              <th>Score</th>
              <th>Date Attempted</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Math Quiz</td>
              <td>85%</td>
              <td>15th October, 2024</td>
            </tr>
            <tr>
              <td>Science Quiz</td>
              <td>92%</td>
              <td>10th October, 2024</td>
            </tr>
          </tbody>
        </table>
        <button className="studentHomapage-button">Download Scorecard</button>
      </div>
    </div>
  );
};

export default StudentHomapage;
