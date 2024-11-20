import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './Student.css';
import { jsPDF } from "jspdf";
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
  const [calculatedScore,setCalculatedScore]=useState(0);
  const [score, setScore] = useState(null); // Store score
  const [pdfURL, setPdfURL] = useState(''); // Store PDF URL
  const [scorecards,setScorecards]=useState([])
  const [studentQuizzes,setstudentQuizzes]=useState([])
  


  // Fetch data from backend when the component mounts
  // const [teacherQuizzes, setTeacherQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // For opening the modal with selected quiz
  const [showModal, setShowModal] = useState(false); // Modal state

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students/student-quizzes');
        setTeacherQuizzes(response.data);
        const studentresponse = await axios.get('http://localhost:5000/api/students/getStudentQuizes',{studentID:studentID});
        setstudentQuizzes(studentresponse.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAttemptExam = async (quizID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/students/quiz/${quizID}`,{studentID:studentID});
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

  const handleSubmitQuiz = async () => {
    let score = 0;
    console.log(studentAnswers);
    
    selectedQuiz.questions.forEach((question, index) => {
      const selectedOptionIndex = studentAnswers[index]; // The index of the option selected by the student
      const selectedOption = question.options[selectedOptionIndex]; // Get the actual selected option
    console.log(selectedOption);
    console.log(question.correctAnswer);
    
    
      // Compare selected option with correct answer
      if (selectedOption === question.correctAnswer) {
        score++; // Increment the score if the selected option matches the correct answer
      }
    });

    // Update state with calculated score
    setCalculatedScore(score);
    const quizResult = {
      quizName: selectedQuiz.quizName,
      score: score,
      totalQuestions: selectedQuiz.questions.length,
      percentage: (score / selectedQuiz.questions.length) * 100
    };
  
    const pdfUrl = await generateAndUploadPDF(quizResult, studentID, selectedQuiz._id);
  
    if (pdfUrl) {
      // Show download link or success message
      alert(`Your quiz result PDF has been uploaded. You can download it here: ${pdfUrl}`);
    }
  }
  const generateAndUploadPDF = async (quizResult, studentID, quizID) => {
    // Create a new PDF document
    const pdfContent = `
      <div style="padding: 20px;">
        <h2 style="text-align: center;">Quiz Results</h2>
        <p>Student ID: ${studentID}</p>
        <p>Quiz Name: ${quizResult.quizName}</p>
        <p>Score: ${quizResult.score} / ${quizResult.totalQuestions}</p>
        <p>Percentage: ${quizResult.percentage}%</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      </div>
    `;
  
    // Create a container element for the HTML content
    const pdfContainer = document.createElement('div');
    pdfContainer.innerHTML = pdfContent;
    document.body.appendChild(pdfContainer);
  
    // Convert the HTML content to a canvas using html2canvas
    const canvas = await html2canvas(pdfContainer);
    const imgData = canvas.toDataURL('image/png');
  
    // Create a jsPDF instance and add the image (HTML content as image) to the PDF
    const doc = new jsPDF();
    doc.addImage(imgData, 'PNG', 10, 10, 190, 0); // Fit image in PDF page
  
    // Save the PDF as a blob (binary large object)
    doc.save('Results.pdf')
    const pdfBlob = doc.output('blob');
  
    // Create a File object for the PDF
    const pdfFile = new File([pdfBlob], `ScoreCard-${studentID}-${selectedQuiz.quizID}.pdf`, { type: 'application/pdf' });
  
    // Create FormData to send to Cloudinary
    const formData = new FormData();
    formData.append('file', pdfFile); // Add the File object
    formData.append('upload_preset', 'invoices'); // Replace with your Cloudinary upload preset
  
    try {
      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dlo7urgnj/auto/upload', // Correct URL for raw file uploads
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      const pdfUrl = cloudinaryResponse.data.secure_url;
  
      // Store result in database (optional)
      await storeResultInDatabase(studentID, quizID, quizResult, pdfUrl);
      setShowFullScreenModal(false);
  
      return pdfUrl; // Return the Cloudinary URL of the uploaded PDF
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
    } finally {
      // Remove the temporary container
      document.body.removeChild(pdfContainer);
    }
  };
  
  
  // Function to store result in the database
  const storeResultInDatabase = async (studentID, quizID, quizResult, pdfUrl) => {
    console.log(selectedQuiz.quizID);
    console.log(quizResult);
    try {
      await axios.post('http://localhost:5000/api/students/save-quiz-result', {
        quizName:selectedQuiz.quizName,
        studentID,
        quizID:selectedQuiz.quizID,
        score: quizResult.score,
        postedBy:selectedQuiz.teacherName,
        startTime:selectedQuiz.quizStartTime,
        endTime:selectedQuiz.quizEndTime,
        QuizDate:selectedQuiz.quizDate,
        totalQuestions: quizResult.totalQuestions,
        percentage: quizResult.percentage,
        pdfUrl // Store the Cloudinary URL
      });
    } catch (error) {
      console.error('Error saving result in database:', error);
    }
  };
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticesRes = await axios.get('http://localhost:5000/api/students/notices',{params : {studentId:studentID}});
        setNotices(noticesRes.data);
      } catch (error) {
        console.error('Error fetching notices', error);
      }
    };
    const fetchScorecards = async () => {
      try {
        const studentId=studentID;
        const response = await axios.get(`http://localhost:5000/api/students/scorecards/${studentId}`); // Replace studentId with the actual ID
        setScorecards(response.data); // Assuming setScorecards is a state updater for scorecards
      } catch (error) {
        console.error('Error fetching scorecards:', error);
      }
    };
  
    fetchScorecards();
    // Call each fetch function individually
    fetchNotices();
  }, []);
  const downloadScorecard = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };
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
      teacherQuizzes.map((quiz, index) => {
        // Find if the student has attempted this quiz
        const studentQuiz = studentQuizzes.find(q => q.quizID === quiz.quizID);
        const isAttempted = studentQuiz ? studentQuiz.attempted : false;
        
        return (
          <li key={index} style={{ backgroundColor: isAttempted ? '#e0f7e0' : '#f0f0f0' }}>
            <strong>{quiz.quizName}</strong> - Posted by: {quiz.teacherName}
            <p>Status: {isAttempted ? <span style={{ color: 'green' }}>Attempted</span> : <span style={{ color: 'grey' }}>Unattempted</span>}</p>
            <p>Start Time: {new Date(quiz.quizStartTime).toLocaleString()} | End Time: {new Date(quiz.quizEndTime).toLocaleString()}</p>

            {quiz.quizStatus === 'Ongoing' && !isAttempted && (
              <button className="studentHomapage-button" onClick={() => handleAttemptExam(quiz.quizID)}>
                Join Quiz
              </button>
            )}
          </li>
        );
      })
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
          <button onClick={handleSubmitQuiz} className="submit-button">
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
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {scorecards.length > 0 ? (
        scorecards.map((quiz, index) => (
          <tr key={index}>
            <td>{quiz.quizName}</td>
            <td>{quiz.percentage}%</td>
            <td>{new Date(quiz.QuizDate).toLocaleDateString()}</td>
            <td>
              <button className="studentHomapage-button" onClick={() => downloadScorecard(quiz.pdfUrl)}>
                Download Scorecard
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr><td colSpan="4">No past quizzes available.</td></tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default StudentHomapage;
