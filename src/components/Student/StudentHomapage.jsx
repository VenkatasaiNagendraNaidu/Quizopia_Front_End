import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Student.css';

const StudentHomapage = () => {
  const navigate = useNavigate();

  // State variables to hold data
  const [notices, setNotices] = useState([]);
  // const [teacherQuizzes, setTeacherQuizzes] = useState([]);
  // const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  // const [ongoingQuizzes, setOngoingQuizzes] = useState([]);
  const [pastQuizzes, setPastQuizzes] = useState([]);
  const studentID = localStorage.getItem('studentID');
  const [teacherQuizzes, setTeacherQuizzes] = useState([]);
  // const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showFullScreenModal, setShowFullScreenModal] = useState(false); // Full-screen modal state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [studentAnswers, setStudentAnswers] = useState([]);

  const [score, setScore] = useState(null); // Store score
  const [pdfURL, setPdfURL] = useState(''); // Store PDF URL
  


  // Fetch data from backend when the component mounts
  // const [teacherQuizzes, setTeacherQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // For opening the modal with selected quiz
  const [showModal, setShowModal] = useState(false); // Modal state

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students/student-quizzes');
        setTeacherQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAttemptExam = async (quizID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/students/quiz/${quizID}`);
      setSelectedQuiz(response.data);
      console.log(response.data);
      
      setShowFullScreenModal(true);
      setCurrentQuestionIndex(0);
      setStudentAnswers(new Array(response.data.questions.length).fill(null));
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    const updatedAnswers = [...studentAnswers];
    updatedAnswers[currentQuestionIndex] = optionIndex;
    setStudentAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async (quizID) => {
    console.log(quizID);
    
    
    try {
      const response = await axios.post(`http://localhost:5000/api/students/submit-quiz/${quizID}`, {
        studentAnswers,
        studentID: studentID, // Replace with the actual student ID
      });
      setScore(response.data.score);
      setPdfURL(response.data.pdfURL);
      setShowFullScreenModal(false);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }}

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticesRes = await axios.get('http://localhost:5000/api/students/notices',{params : {studentId:studentID}});
        setNotices(noticesRes.data);
      } catch (error) {
        console.error('Error fetching notices', error);
      }
    };
    // Call each fetch function individually
    fetchNotices();
  }, []);

console.log(notices);

  // Handle logout functionality
  const handleLogout = () => {
    // You can clear user session or token if needed
    navigate('/');
  };

  return (
    <div className="studentHomapage-container">
      <div className="studentHomapage-header">
        <h1>Welcome to Your Dashboard {studentID}</h1>
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
                <p>{index+1} ) &nbsp; Name of the Teacher :&nbsp; 
                 <strong>{notice.teacherName}</strong></p>
                <p>Notice Issued : {notice.text}</p>
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
              <strong>{quiz.quizName}</strong> - Posted by: {quiz.teacherName}
              <p>Status: {quiz.quizStatus}</p>
              <p>Start Time: {new Date(quiz.quizStartTime).toLocaleString()} | End Time: {new Date(quiz.quizEndTime).toLocaleString()}</p>

              {quiz.quizStatus === 'Ongoing' && (
                <button className="studentHomapage-button" onClick={() => handleAttemptExam(quiz.quizID)}>
                  Join Quiz
                </button>
              )}
            </li>
          ))
        ) : (
          <p>No quizzes available.</p>
        )}
      </ul>

      {/* Full-Screen Quiz Modal */}
      {showFullScreenModal && selectedQuiz && (
        <div className="full-screen-modal">
          <div className="quiz-content">
            <h3>{selectedQuiz.quizName}</h3>
            <p>Posted by: {selectedQuiz.teacherName}</p>

            {/* Question Display */}
            <div className="question-section">
              <p><strong>Question {currentQuestionIndex + 1}:</strong> {selectedQuiz.questions[currentQuestionIndex].question}</p>
              <ul>
                {selectedQuiz.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={optionIndex}
                        checked={studentAnswers[currentQuestionIndex] === optionIndex}
                        onChange={() => handleAnswerSelect(optionIndex)}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Buttons */}
            <div className="navigation-buttons">
              <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                Previous
              </button>
              <button onClick={handleNextQuestion} disabled={currentQuestionIndex === selectedQuiz.questions.length - 1}>
                Next
              </button>
            </div>
                
            {/* Submit Button */}
            {currentQuestionIndex === selectedQuiz.questions.length - 1 && (
              <button onClick={()=>handleSubmitQuiz(selectedQuiz.quizID)} className="submit-button">
                Submit Exam
              </button>
            )}

            <button className="close-modal" onClick={() => setShowFullScreenModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Show score after submission */}
      {score !== null && (
        <div>
          <h3>Your Score: {score}</h3>
          {pdfURL && (
            <a href={pdfURL} download>
              Download your score as PDF
            </a>
          )}
        </div>
      )}
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
