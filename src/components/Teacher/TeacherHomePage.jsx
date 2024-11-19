import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { message,Select,TimePicker,DatePicker } from 'antd';
import moment from 'moment';
import './Teacher.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeacherHomePage = () => {
    const navigate = useNavigate();
    const [studentsData, setStudentsData] = useState([]);
    const [newNotice, setNewNotice] = useState('');
    const [quizPaper, setQuizPaper] = useState(null);
    const [excelData, setExcelData] = useState([]);
    const [quizName, setQuizName] = useState('');
    const [adminNotices, setAdminNotices] = useState([]);
    // const [quizHistory, setQuizHistory] = useState([]);
    const [teacherProfile, setTeacherProfile] = useState({});
    const teacherID = localStorage.getItem('teacherID');
    const [viewType, setViewType] = useState('all');
    const [myStudents, setMyStudents] = useState([]);
    const [notices, setNotices] = useState([]);
    const [postedAt, setPostedAt] = useState('');
    const [expireAt, setExpireAt] = useState('');
    const [pastQuizzes, setPastQuizzes] = useState([]);
  const [ongoingQuizzes, setOngoingQuizzes] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [teachernotices, setTeacherNotices] = useState([]);


    // const [quizName, setQuizName] = useState('');
  const [quizDate, setQuizDate] = useState('');
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [categorizeQuizze,setcategorizeQuizze] =useState([])
  // const [excelData, setExcelData] = useState([]);
    useEffect(() => {
      const fetchNotices = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/admin/adminNotices');
          setNotices(response.data);
        } catch (error) {
          console.error('Error fetching notices:', error);
        }
      };
  
      fetchNotices();
    }, []);
    useEffect(() => {
      // Fetch the notices when the component mounts
      const fetchTeacherNotices = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/teachers/${teacherID}/notices`);
          setTeacherNotices(response.data);
          console.log(response.data);
          
        } catch (error) {
          console.error('Error fetching notices:', error);
        }
      };
  
      fetchTeacherNotices();
    }, [teacherID]);

    useEffect(() => {
      const fetchData = async () => {
          if (!teacherID) {
              navigate('/teacher-login');
              return;
          }
          console.log(teacherID);
          

          try {
              const profileResponse = await axios.get(`http://localhost:5000/api/teachers/profile/${teacherID}`);  // Fetch profile by teacher ID
              setTeacherProfile(profileResponse.data);
              console.log(profileResponse.data);
              

              const noticesResponse = await axios.get('http://localhost:5000/api/admin/notices');
              setAdminNotices(noticesResponse.data);

              const quizHistoryResponse = await axios.get(`http://localhost:5000/api/teachers/quizzes/${teacherID}`);
              // const quizHistory = quizHistoryResponse.data;
              console.log(quizHistoryResponse.data);
              const quizHistoryArray = Array.isArray(quizHistoryResponse.data) 
              ? quizHistoryResponse.data 
              : [quizHistoryResponse.data]; 
              
              
              setcategorizeQuizze(quizHistoryArray)
              categorizeQuizzes(quizHistoryResponse.data);
        


              
              // setcategorizeQuizze(quizHistoryResponse.data);

              const studentsResponse = await axios.get(`http://localhost:5000/api/admin/students`);
              setStudentsData(studentsResponse.data);

              const myStudentsResponse = await axios.get(`http://localhost:5000/api/teachers/myStudents/${teacherID}`);
            setMyStudents(myStudentsResponse.data);
            // console.log(myStudentsResponse);


            // categorizeQuizzes(categorizeQuizze)
            
            


          } catch (error) {
              console.error('Error fetching data:', error);
              message.error('Error fetching data from the server');
          }
      };

      fetchData();
    }, [teacherID, navigate]);

  const categorizeQuizzes = (categorizeQuizze) => {
    const now = new Date();
    console.log('Current Time:', now);
    console.log('Quiz History:', categorizeQuizze);
  
    // Combine all quizzes into one array
    
  console.log(categorizeQuizze.pastQuizzes);
  
    // Set the categorized quizzes into state
    setPastQuizzes(categorizeQuizze.pastQuizzes);
    setOngoingQuizzes(categorizeQuizze.ongoingQuizzes);
    setUpcomingQuizzes(categorizeQuizze.upcomingQuizzes);
  };
  
  console.log("Past Quizes",pastQuizzes);
  
 
  

  // Function to delete a notice
  const deleteNotice = async (noticeID) => {
    try {
      await axios.delete(`http://localhost:5000/api/teachers/delete-notice/${noticeID}`, {
        data: { teacherID }
      });
      setTeacherNotices(teachernotices.filter(notice => notice._id !== noticeID)); // Remove the deleted notice from the UI
      message.success("Notices Deleted Successfully")
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

    // Handle quiz paper upload
    const [combinedDateTime, setCombinedDateTime] = useState(null);  // Stores the combined datetime

    // Effect to combine date and time once both are selected
    useEffect(() => {
      if (quizDate && quizStartTime) {
        // Combine the selected date with the selected time
        const combined = new Date(`${quizDate}T${quizStartTime}:00`);
        setCombinedDateTime(combined); // Set combined date and time only when both are selected
        console.log(combined);
        
        // setQuizStartTime(combined);
      }
    }, [quizDate, quizStartTime]);  // Dependencies: Re-run effect only when quizDate or quizStartTime changes
  
    const handleDeleteQuiz = async (quizID) => {
      try {
        // Send a request to the backend to delete the quiz
        const response = await axios.delete(`http://localhost:5000/api/teachers/delete-quiz/${quizID}`,{ data: { teacherID: teacherID } });
        
        if (response.status === 200) {
          // Remove the deleted quiz from the frontend state
          setPastQuizzes(pastQuizzes.filter(quiz => quiz._id !== quizID));
          setOngoingQuizzes(ongoingQuizzes.filter(quiz => quiz._id !== quizID));
          setUpcomingQuizzes(upcomingQuizzes.filter(quiz => quiz._id !== quizID));
          
          alert('Quiz deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Error deleting quiz!');
      }
    };
    


    // Handle quiz file upload
    const handleQuizFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const data = reader.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            setExcelData(jsonData);
        };

        reader.readAsBinaryString(file);
    };

    // Handle sending notification to students
    const handleSendNotification = async () => {
        try {
            if (studentsData.length > 0) {
                await axios.post('http://localhost:5000/api/teacher/sendNotification', {
                    students: studentsData,
                    notice: 'New Quiz Scheduled',
                });
                message.success('Notification sent to all students regarding the exam schedule.');
            } else {
                message.error('No students data available.');
            }
        } catch (error) {
            message.error('Failed to send notifications');
        }
    };

    const handleViewChange = (value) => {
      setViewType(value);
  };
  const handleAddStudent = async (studentID) => {
    try {
      console.log(teacherID, studentID);
  
      // Sending the POST request to add the student
      const response = await axios.post(`http://localhost:5000/api/teachers/addStudent`, { teacherID, studentID });
  
      // If the response is successful, display success message
      message.success('Student added to your list.');
  
      // Fetch updated list of students for the teacher
      const updatedMyStudents = await axios.get(`http://localhost:5000/api/teachers/myStudents/${teacherID}`);
      setMyStudents(updatedMyStudents.data);
      console.log(updatedMyStudents);
      
    } catch (error) {
      // Check for specific error response from the backend
      if (error.response) {
        // Server responded with a status other than 2xx
        if (error.response.status === 400) {
          message.error('Student already added to your list.');
        } else if (error.response.status === 404) {
          if (error.response.data.message === 'Teacher not found') {
            message.error('Teacher not found.');
          } else if (error.response.data.message === 'Student not found') {
            message.error('Student not found.');
          }
        } else {
          message.error('Failed to add student. Please try again later.');
        }
      } else if (error.request) {
        // No response from server (e.g., network issue)
        message.error('Network error. Please check your connection and try again.');
      } else {
        // Something went wrong in the setup of the request
        message.error('An unexpected error occurred.');
      }
    }
  };
  
console.log(adminNotices);

const handleRemoveStudent = async (studentID) => {
  try {
    console.log(studentID,teacherID);
    
      await axios.post(`http://localhost:5000/api/teachers/removeStudent`, { teacherID, studentID });
      message.success('Student removed from your list.');
      const updatedMyStudents = await axios.get(`http://localhost:5000/api/teachers/myStudents/${teacherID}`);
      setMyStudents(updatedMyStudents.data);
  } catch (error) {
      message.error('Failed to remove student.');
  }
};
    // Handle posting a new notice
    const handlePostNotice = async () => {
        if (newNotice && studentsData.length > 0) {
            try {
              console.log(newNotice,teacherID);
              
                await axios.post('http://localhost:5000/api/teachers/postNotice', { notice: newNotice,teacherID: teacherID, expireAt: expireAt, postedAt: postedAt });
                
                message.success('Notice posted for students.');
                setNewNotice('');
            } catch (error) {
                message.error('Failed to post notice');
            }
        } else if (studentsData.length === 0) {
            message.error('No students data available to post notice.');
        } else {
            message.info('Please enter a notice.');
        }
    };

    // Handle saving the quiz
    const handleSaveQuiz = async () => {
      // setQuizStartTime(combined)
      console.log(quizName,quizDate,combinedDateTime,excelData.length);

      if (quizName && quizDate && combinedDateTime && excelData.length > 0) {
        
        try {
          console.log(quizName,quizDate,combinedDateTime,excelData.length);
          await axios.post('http://localhost:5000/api/teachers/saveQuiz', {
            quizName,
            questions: excelData,
            quizDate: quizDate,
            combinedDateTime: combinedDateTime.toISOString(), // Send time as ISO
            teacherID: teacherID            // Replace with the teacher ID
          });
          message.success('Quiz saved successfully!');
          setQuizName('');
          setQuizDate(null);
          setQuizStartTime(null);
          setExcelData([]);
        } catch (error) {
          message.error('Failed to save quiz');
          console.log(error);
          
        }
      } else {
        console.log(quizName,quizDate,quizStartTime);
        
        message.info('Please make sure to provide all fields.');
      }
    };

    return (
        <div className="teacher-homepage-container">
            <button className="logout-button" onClick={() => { navigate('/'); }}>
                Log Out
            </button>

            <div className="teacher-homepage-header">
                <h1>Welcome, {teacherProfile.name} !</h1>
            </div>

            {/* Admin Notices */}
            <div>
      <h2>Active Admin Notices</h2>
      <div className="notices-list">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div key={notice._id} className="notice-card">
              <h4>{notice.text}</h4>
              <p>
                <strong>Posted On:</strong> {new Date(notice.postedAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Expires On:</strong> {new Date(notice.expireAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No active notices</p>
        )}
      </div>
    </div>

            {/* Quiz History */}
            <div className="section quiz-history">
  <h2>Quiz History</h2>

  {/* Ongoing Quizzes */}
  <div className="quiz-category">
    <h3>Ongoing Quizzes</h3>
    {ongoingQuizzes.length > 0 ? (
      ongoingQuizzes.map((quiz, index) => (
        <div key={index} className="quiz-card ongoing">
          <p><strong>{quiz.quizName}</strong></p>
          <p>Start Time: {new Date(quiz.quizStartTime).toLocaleString()}</p>
          <p>End Time: {new Date(quiz.quizEndTime).toLocaleString()}</p>
          <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button> {/* Delete button */}
        </div>
      ))
    ) : (
      <div className="quiz-card">No ongoing quizzes at the moment.</div>
    )}
  </div>

  {/* Upcoming Quizzes */}
  <div className="quiz-category">
    <h3>Upcoming Quizzes</h3>
    {upcomingQuizzes.length > 0 ? (
      upcomingQuizzes.map((quiz, index) => (
        <div key={index} className="quiz-card upcoming">
          <p><strong>{quiz.quizName}</strong></p>
          <p>Start Time: {new Date(quiz.quizStartTime).toLocaleString()}</p>
          <p>End Time: {new Date(quiz.quizEndTime).toLocaleString()}</p>
          <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button> {/* Delete button */}
        </div>
      ))
    ) : (
      <div className="quiz-card">No upcoming quizzes.</div>
    )}
  </div>

  {/* Past Quizzes */}
  <div className="quiz-category">
    <h3>Past Quizzes</h3>
    {pastQuizzes.length > 0 ? (
      pastQuizzes.map((quiz, index) => (
        <div key={index} className="quiz-card past">
          <p><strong>{quiz.quizName}</strong></p>
          <p>Scheduled: {new Date(quiz.quizStartTime).toLocaleString()}</p>
          <p>Ended: {new Date(quiz.quizEndTime).toLocaleString()}</p>
          <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button> {/* Delete button */}
        </div>
      ))
    ) : (
      <div className="quiz-card">No past quizzes.</div>
    )}
  </div>
</div>


            {/* Profile */}
            <div className="section profile">
                <h2>Your Profile</h2>
                <div className="profile-info">
                    <p><strong>Name:</strong> {teacherProfile.name}</p>
                    <p><strong>Email:</strong> {teacherProfile.email}</p>
                    <p><strong>Qualification:</strong> {teacherProfile.qualification}</p>
                </div>
            </div>

            <div className="teacher-dashboard">
      <h2>Your Notices</h2>
      {teachernotices.length > 0 ? (
        teachernotices.map((notice) => (
          <div key={notice._id} className="notice-card">
            <p><strong>{notice.title}</strong></p>
            <p>{notice.text}</p>
            <p>{notice.studentId}</p>
            <p>Post Date: {new Date(notice.postedAt).toLocaleString()}</p>
            <p>Expire Date: {new Date(notice.expireAt).toLocaleString()}</p>

            <button onClick={() => deleteNotice(notice._id)}>Delete Notice</button>
          </div>
        ))
      ) : (
        <p>No notices published yet.</p>
      )}
    </div>

            {/* Students Data Section */}
            <div className="section students-data">
  <h2>Students Data</h2>

  {/* Select View Dropdown */}
  <Select defaultValue="all" onChange={handleViewChange}>
    <Select.Option value="all">All Registered Students</Select.Option>
    <Select.Option value="my">My Students</Select.Option>
  </Select>

  {/* Conditionally render based on selected view */}
  {viewType === 'all' ? (
    <div className="students-data-section">
      <h3>All Registered Students</h3>
      {studentsData.length > 0 ? (
        studentsData.map((student, index) => (
          <div key={index}>
            <p><strong>Student Name: </strong>{student.name}</p>
            <p><strong>Student Email: </strong>{student.email}</p>
            <p><strong>Student Phone Number: </strong>{student.phoneNumber}</p>
            <button onClick={() => handleAddStudent(student.studentID)}>Add to My Students</button>
          </div>
        ))
      ) : (
        <div>No registered students available.</div>
      )}
    </div>
  ) : (
    <div className="students-data-section">
      <h3>My Students</h3>
      {myStudents.length > 0 ? (
        myStudents.map((student, index) => (
          <div key={index}>
            <p><strong>Student Name: </strong>{student.studentName}</p>
            <p><strong>Student Email: </strong>{student.studentEmail}</p>
            <p><strong>Student Phone Number: </strong>{student.studentPhone}</p>
            <button onClick={() => handleRemoveStudent(student.studentID)}>Remove Student</button>
          </div>
        ))
      ) : (
        <div>No students in your list yet.</div>
      )}

      {/* Post Notice Section in "My Students" */}
      <div className="notice-section">
        <h3>Post Notice for Students</h3>
        <textarea
          placeholder="Enter your notice here..."
          value={newNotice}
          onChange={(e) => setNewNotice(e.target.value)}
        />
        <div className="form-group">
            <label>Posted At:</label>
            <input
              type="date"
              value={postedAt}
              onChange={(e) => setPostedAt(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Expire At:</label>
            <input
              type="date"
              value={expireAt}
              onChange={(e) => setExpireAt(e.target.value)}
            />
          </div>
        <button onClick={handlePostNotice}>Post Notice</button>
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

      <div className="quiz-date">
        <input 
          type="date" 
          value={quizDate} 
          onChange={(e) => setQuizDate(e.target.value)}  // Set only the date part
          placeholder="Select Quiz Date" 
        />
      </div>

      <div className="quiz-start-time">
        <input 
          type="time" 
          value={quizStartTime} 
          onChange={(e) => setQuizStartTime(e.target.value)}  // Set only the time part
          placeholder="Select Start Time" 
        />
      </div>

      {/* <button onClick={handleSubmit}>Save Quiz</button> */}

      {/* Display the selected date and time */}
      <div>
        <p>Selected Date: {quizDate || 'Not set'}</p>
        <p>Selected Time: {quizStartTime || 'Not set'}</p>
        <p>Combined Date & Time: {combinedDateTime ? combinedDateTime.toString() : 'Not set'}</p>
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

