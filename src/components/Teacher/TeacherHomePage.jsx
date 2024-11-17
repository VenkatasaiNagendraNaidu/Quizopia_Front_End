import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {message} from 'antd'
import './Teacher.css';
import { useNavigate } from 'react-router-dom';

const TeacherHomePage = () => {
    const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState([]);
  const [newNotice, setNewNotice] = useState('');
  const [quizPaper, setQuizPaper] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [quizName, setQuizName] = useState('');
  
  // Handle student data upload
  const handleStudentsDataUpload = (e) => {
    const file = e.target.files[0];
    setStudentsData([{ name: 'John Doe', id: '12345' }, { name: 'Jane Smith', id: '67890' }]);
  };

  // Handle quiz paper upload
  const handleQuizPaperUpload = (e) => {
    const file = e.target.files[0];
    setQuizPaper(file);
  };

  // Handle creating quiz
  const handleQuizFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const data = reader.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Assuming the Excel has columns: Question, Option1, Option2, Option3, Option4, CorrectAnswer
      setExcelData(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  // Handle sending notification to students
  const handleSendNotification = () => {
    if (studentsData.length > 0) {
      message.success('Notification sent to all students regarding the exam schedule.');
    } else {
      message.error('No students data available.');
    }
  };

  // Handle posting a new notice
  const handlePostNotice = () => {
    if (newNotice && studentsData.length > 0) {
        message.success('Notice posted for students.');
      setNewNotice('');
    } else if (studentsData.length === 0) {
        message.error('No students data available to post notice.');
    } else {
        message.info('Please enter a notice.');
    }
  };

  // Handle saving the quiz
  const handleSaveQuiz = () => {
    if (quizName && excelData.length > 0) {
        message.success('Quiz saved successfully!');
      setQuizName('');
      setExcelData([]);
    } else {
        message.info('Please make sure to upload a valid Excel file and provide a quiz name.');
    }
  };

  return (
    <div className="teacher-homepage-container">
        <button className="logout-button" onClick={()=>{navigate('/')}}>
        Log Out
      </button>
      <div className="teacher-homepage-header">
        <h1>Welcome, Teacher!</h1>
      </div>

      {/* Admin Notices */}
      <div className="section admin-notices">
        <h2>Admin Notices</h2>
        <div className="notice-card">No new notices from admin.</div>
      </div>

      {/* Quiz History */}
      <div className="section quiz-history">
        <h2>Quiz History</h2>
        <div className="quiz-card">No quizzes created yet.</div>
      </div>

      {/* Profile */}
      <div className="section profile">
        <h2>Your Profile</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> Vicky</p>
          <p><strong>Email:</strong> vicky@gmail.com</p>
          <p><strong>Subjects:</strong> Mathematics, Physics</p>
        </div>
      </div>

      {/* Students Data Section */}
      <div className="section students-data">
        <h2>Students Data</h2>
        {studentsData.length === 0 ? (
          <div className="students-data-upload">
            <p>No student data uploaded. Please upload students data:</p>
            <input type="file" accept=".csv" onChange={handleStudentsDataUpload} />
          </div>
        ) : (
          <div className="students-data-section">
            <h3>Students List</h3>
            <ul>
              {studentsData.map((student, index) => (
                <li key={index}>{student.name} (ID: {student.id})</li>
              ))}
            </ul>

            <div className="notice-section">
              <h3>Post Notice for Students</h3>
              <textarea
                placeholder="Enter your notice here..."
                value={newNotice}
                onChange={(e) => setNewNotice(e.target.value)}
              />
              <button onClick={handlePostNotice}>Post Notice</button>
            </div>

            <div className="quiz-upload-section">
              <h3>Upload Quiz Examination Paper</h3>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleQuizPaperUpload} />
              {quizPaper && <p>Uploaded: {quizPaper.name}</p>}
              <button onClick={handleSendNotification}>Send Notification to All Students</button>
            </div>
          </div>
        )}
      </div>

      {/* Create Quiz Section */}
      <div className="section create-quiz">
        <h2>Create a New Quiz</h2>
        <div className="quiz-name">
          <input
            type="text"
            placeholder="Quiz Name"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
        </div>

        <div className="upload-quiz-file">
          <input type="file" accept=".xlsx,.xls" onChange={handleQuizFileUpload} />
        </div>

        {excelData.length > 0 && (
          <div className="quiz-preview">
            <h3>Quiz Preview</h3>
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Option 1</th>
                  <th>Option 2</th>
                  <th>Option 3</th>
                  <th>Option 4</th>
                  <th>Correct Answer</th>
                </tr>
              </thead>
              <tbody>
                {excelData.map((question, index) => (
                  <tr key={index}>
                    <td>{question.Question}</td>
                    <td>{question.Option1}</td>
                    <td>{question.Option2}</td>
                    <td>{question.Option3}</td>
                    <td>{question.Option4}</td>
                    <td>{question.CorrectAnswer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={handleSaveQuiz}>Save Quiz</button>
      </div>
    </div>
  );
};

export default TeacherHomePage;