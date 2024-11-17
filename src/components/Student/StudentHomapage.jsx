import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Student.css';

const StudentHomapage = () => {
  const navigate = useNavigate();

  // State variables to hold data
  const [notices, setNotices] = useState([]);
  const [teacherQuizzes, setTeacherQuizzes] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [ongoingQuizzes, setOngoingQuizzes] = useState([]);
  const [pastQuizzes, setPastQuizzes] = useState([]);

  // Fetch data from backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noticesRes, teacherQuizzesRes, upcomingQuizzesRes, ongoingQuizzesRes, pastQuizzesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/students/notices'),
          axios.get('http://localhost:5000/api/students/quizzes/teacher'),
          axios.get('http://localhost:5000/api/students/quizzes/upcoming'),
          axios.get('http://localhost:5000/api/students/quizzes/ongoing'),
          axios.get('http://localhost:5000/api/students/quizzes/past')
        ]);

        setNotices(noticesRes.data);
        setTeacherQuizzes(teacherQuizzesRes.data);
        setUpcomingQuizzes(upcomingQuizzesRes.data);
        setOngoingQuizzes(ongoingQuizzesRes.data);
        setPastQuizzes(pastQuizzesRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

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
          {notices.length > 0 ? (
            notices.map((notice, index) => (
              <li key={index}>
                <strong>{notice.title}:</strong>
                <p>{notice.content}</p>
              </li>
            ))
          ) : (
            <p>No notices available.</p>
          )}
        </ul>
        <button className="studentHomapage-button">View More</button>
      </div>

      {/* Teacher Quizzes Section */}
      <div className="studentHomapage-section studentHomapage-card">
        <h2>Teacher Quizzes</h2>
        <ul>
          {teacherQuizzes.length > 0 ? (
            teacherQuizzes.map((quiz, index) => (
              <li key={index}>
                <strong>{quiz.name}:</strong>
                <p>Last attempted on {quiz.date}</p>
              </li>
            ))
          ) : (
            <p>No quizzes available.</p>
          )}
        </ul>
        <button className="studentHomapage-button">View Details</button>
      </div>

      {/* Upcoming Quizzes Section */}
      <div className="studentHomapage-section studentHomapage-upcoming-quizzes studentHomapage-card">
        <h2>Upcoming Quizzes</h2>
        <ul>
          {upcomingQuizzes.length > 0 ? (
            upcomingQuizzes.map((quiz, index) => (
              <li key={index}>
                <strong>{quiz.name}</strong>
                <p>Scheduled for {quiz.date}</p>
              </li>
            ))
          ) : (
            <p>No upcoming quizzes.</p>
          )}
        </ul>
        <button className="studentHomapage-button">View More</button>
      </div>

      {/* Ongoing Quizzes Section */}
      <div className="studentHomapage-section studentHomapage-ongoing-quizzes studentHomapage-card">
        <h2>Ongoing Quizzes</h2>
        <ul>
          {ongoingQuizzes.length > 0 ? (
            ongoingQuizzes.map((quiz, index) => (
              <li key={index}>
                <strong>{quiz.name}</strong>
                <p>Currently in progress.</p>
              </li>
            ))
          ) : (
            <p>No ongoing quizzes.</p>
          )}
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
            {pastQuizzes.length > 0 ? (
              pastQuizzes.map((quiz, index) => (
                <tr key={index}>
                  <td>{quiz.name}</td>
                  <td>{quiz.score}%</td>
                  <td>{quiz.date}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3">No past quizzes available.</td></tr>
            )}
          </tbody>
        </table>
        <button className="studentHomapage-button">Download Scorecard</button>
      </div>
    </div>
  );
};

export default StudentHomapage;
