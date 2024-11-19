import React, { useState, useEffect } from 'react';
import './Admin.css';
import axios from 'axios';
import { message } from 'antd';

const AdminDashboard = () => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [students, setStudents] = useState([]);


  const [text, setText] = useState('');
  const [postedAt, setPostedAt] = useState('');
  const [expireAt, setExpireAt] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notices, setNotices] = useState([]);

  const [pastTeacherNotices, setPastTeacherNotices] = useState([]);
  const [presentTeacherNotices, setPresentTeacherNotices] = useState([]);
  const [upcomingTeacherNotices, setUpcomingTeacherNotices] = useState([]);

  const fetchteacherNotices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/teacherNotices');
      const { pastNotices, presentNotices, upcomingNotices } = response.data;
      console.log(response.data);
      
      setPastTeacherNotices(pastNotices);
      setPresentTeacherNotices(presentNotices);
      setUpcomingTeacherNotices(upcomingNotices);
    } catch (error) {
      console.error('Error fetching teacher notices:', error);
    }
  };

  // Fetch notices when the component mounts
  useEffect(() => {
    fetchteacherNotices();  // Use the fetch function here
  }, []);

  // Toggle visibility of a notice
  const toggleVisibility = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/toggleVisibility/${id}`);
      // After toggling, fetch the updated notices list again to reflect changes
      fetchteacherNotices();  // Call the fetch function again after visibility change
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

    useEffect(() => {
      const fetchNotices = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/admin/allAdminNotices');
          setNotices(response.data);
        } catch (error) {
          console.error('Error fetching notices:', error);
        }
      };
  
      fetchNotices();
    }, []);
    const deleteNotice = async (noticeId) => {
      try {
        await axios.delete(`http://localhost:5000/api/admin/deladminNotices/${noticeId}`);
        message.success('Notice deleted successfully');
        setNotices((prevNotices) => prevNotices.filter((notice) => notice._id !== noticeId)); // Update the state
      } catch (error) {
        console.error('Error deleting notice:', error);
        message.error('Failed to delete notice');
      }
    };

    const categorizeNotices = () => {
      const now = new Date();
      const currentNotices = [];
      const upcomingNotices = [];
      const expiredNotices = [];
  
      notices.forEach((notice) => {
        const postedAt = new Date(notice.postedAt);
        const expireAt = new Date(notice.expireAt);
  
        if (expireAt < now) {
          expiredNotices.push(notice); // Expired
        } else if (postedAt > now) {
          upcomingNotices.push(notice); // Upcoming
        } else {
          currentNotices.push(notice); // Current
        }
      });
  
      return { currentNotices, upcomingNotices, expiredNotices };
    };
  
    const { currentNotices, upcomingNotices, expiredNotices } = categorizeNotices();
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text || !postedAt || !expireAt) {
      setError('Please fill in all fields.');
      return;
    }

    const newNotice = {
      text,
      adminId: 'quizopiaAdmin', // Hardcoded admin ID for now
      postedAt,
      expireAt,
    };

    try {
      await axios.post('http://localhost:5000/api/admin/createAdminNotice', newNotice);
      setSuccess('Notice posted successfully.');
      setText('');
      setPostedAt('');
      setExpireAt('');
    } catch (error) {
      setError('Error posting notice.');
      console.error('Error posting notice:', error);
    }
  };



  useEffect(() => {
    // Fetch pending teachers for approval from the backend on port 5000
    fetch('http://localhost:5000/api/admin/pending-teachers')
    .then(response => response.json())
    .then(data => setPendingTeachers(data))
    .catch(error => console.error('Error fetching pending teachers:', error));

    // Fetch approved teachers from the backend on port 5000
    fetch('http://localhost:5000/api/admin/approved-teachers')
      .then(response => response.json())
      .then(data => setApprovedTeachers(data))
      .catch(error => console.error('Error fetching approved teachers:', error));

    // Fetch students from the backend on port 5000
    fetch('http://localhost:5000/api/admin/students')
      .then(response => response.json())
      .then(data => setStudents(data))
      .catch(error => console.error('Error fetching students:', error));
  }, [pendingTeachers]);

  const handleApprove = (id) => {
    fetch(`http://localhost:5000/api/teachers/approve/${id}`, { method: 'PUT' })
      .then(response => response.json())
      .then(() => {
        // Update the state after approval
        const approvedTeacher = pendingTeachers.find(teacher => teacher.id === id);
        setApprovedTeachers([...approvedTeachers, approvedTeacher]);
        setPendingTeachers(pendingTeachers.filter(teacher => teacher.id !== id));
      })
      .catch(error => console.error('Error approving teacher:', error));
  };

  const handleDecline = (id) => {
    fetch(`http://localhost:5000/api/teachers/decline/${id}`, { method: 'DELETE' })
      .then(() => {
        // Update the state after decline
        setPendingTeachers(pendingTeachers.filter(teacher => teacher.id !== id));
      })
      .catch(error => console.error('Error declining teacher:', error));
  };

  return (
    <div className="adminDashboard-container">
      <h1 className="adminDashboard-title">Admin Dashboard</h1>

      <div className="adminDashboard-section teachers-section">
        <h2>Teachers</h2>

        <div className="adminDashboard-subsection pending-teachers">
          <h3>Pending Teachers Approval</h3>
          {pendingTeachers.length > 0 ? (
            <div className="adminDashboard-card-container">
              {pendingTeachers.map((teacher) => (
                <div key={teacher._id} className="adminDashboard-card">
                  <h1>{teacher.firstName} {teacher.lastName}</h1>
                  <p>Qualification: {teacher.qualification}</p>
                  <button className="approve-button" onClick={() => handleApprove(teacher._id)}>Approve</button>
                  <button className="decline-button" onClick={() => handleDecline(teacher._id)}>Decline</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No pending teachers for approval.</p>
          )}
        </div>
        <div>
      <h2>Teacher Notices</h2>

      {/* Present Teacher Notices */}
      <div>
        <h3>Present Teacher Notices</h3>
        {presentTeacherNotices.length > 0 ? (
          presentTeacherNotices.map((notice) => (
            <div key={notice._id} className="notice-card">
              <h4>{notice.text}</h4>
              <p>
                <strong>Teacher:</strong> {notice.teacherName} ({notice.teacherId})
              </p>
              <p>
                <strong>Student:</strong> {notice.studentId}
              </p>
              <p>
                <strong>Posted On:</strong> {new Date(notice.postedAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Expires On:</strong> {new Date(notice.expireAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Visible to Students:</strong> {notice.isVisibleToStudents ? 'Yes' : 'No'}
              </p>
              <button onClick={() => toggleVisibility(notice._id)}>
                {notice.isVisibleToStudents ? 'Hide from Students' : 'Show to Students'}
              </button>
            </div>
          ))
        ) : (
          <p>No present notices</p>
        )}
      </div>

      {/* Upcoming Teacher Notices */}
      <div>
        <h3>Upcoming Teacher Notices</h3>
        {upcomingTeacherNotices.length > 0 ? (
          upcomingTeacherNotices.map((notice) => (
            <div key={notice._id} className="notice-card">
              <h4>{notice.text}</h4>
              <p>
                <strong>Teacher:</strong> {notice.teacherName} ({notice.teacherId})
              </p>
              <p>
                <strong>Student:</strong> {notice.studentId}
              </p>
              <p>
                <strong>Posted On:</strong> {new Date(notice.postedAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Expires On:</strong> {new Date(notice.expireAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Visible to Students:</strong> {notice.isVisibleToStudents ? 'Yes' : 'No'}
              </p>
              <button onClick={() => toggleVisibility(notice._id)}>
                {notice.isVisibleToStudents ? 'Hide from Students' : 'Show to Students'}
              </button>
            </div>
          ))
        ) : (
          <p>No upcoming notices</p>
        )}
      </div>

      {/* Past Teacher Notices */}
      <div>
        <h3>Past Teacher Notices</h3>
        {pastTeacherNotices.length > 0 ? (
          pastTeacherNotices.map((notice) => (
            <div key={notice._id} className="notice-card">
              <h4>{notice.text}</h4>
              <p>
                <strong>Teacher:</strong> {notice.teacherName} ({notice.teacherId})
              </p>
              <p>
                <strong>Student:</strong> {notice.studentId}
              </p>
              <p>
                <strong>Posted On:</strong> {new Date(notice.postedAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Expires On:</strong> {new Date(notice.expireAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Visible to Students:</strong> {notice.isVisibleToStudents ? 'Yes' : 'No'}
              </p>
              <button onClick={() => toggleVisibility(notice._id)}>
                {notice.isVisibleToStudents ? 'Hide from Students' : 'Show to Students'}
              </button>
            </div>
          ))
        ) : (
          <p>No past notices</p>
        )}
      </div>
    </div>

        <div className="adminDashboard-subsection active-teachers">
          <h3>Active Teachers</h3>
          <div className="adminDashboard-card-container">
            {approvedTeachers.map((teacher) => (
              <div key={teacher._id} className="adminDashboard-card">
                <h1>{teacher.firstName} {teacher.lastName}</h1>
                <p>Qualification: {teacher.qualification}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="adminDashboard-section students-section">
        <h2>Students</h2>
        <div className="adminDashboard-card-container">
          {students.map((student) => (
            <div key={student.id} className="adminDashboard-card student-card">
              <h4>{student.name}</h4>
              <p>Class: {student.classStudying}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
      <h2>Admin Notices</h2>

      

      {/* Current Notices */}
      <div>
        <h3>Current Notices</h3>
        <div className="notices-list">
          {currentNotices.length > 0 ? (
            currentNotices.map((notice) => (
              <div key={notice._id} className="notice-card">
                <h4>{notice.text}</h4>
                <p>
                  <strong>Posted On:</strong> {new Date(notice.postedAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Expires On:</strong> {new Date(notice.expireAt).toLocaleDateString()}
                </p>
                <button onClick={() => deleteNotice(notice._id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No current notices</p>
          )}
        </div>
      </div>

      {/* Upcoming Notices */}
      <div>
        <h3>Upcoming Notices</h3>
        <div className="notices-list">
          {upcomingNotices.length > 0 ? (
            upcomingNotices.map((notice) => (
              <div key={notice._id} className="notice-card">
                <h4>{notice.text}</h4>
                <p>
                  <strong>Posted On:</strong> {new Date(notice.postedAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Expires On:</strong> {new Date(notice.expireAt).toLocaleDateString()}
                </p>
                <button onClick={() => deleteNotice(notice._id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No upcoming notices</p>
          )}
        </div>
      </div>

      {/* Expired Notices */}
      <div>
        <h3>Expired Notices</h3>
        <div className="notices-list">
          {expiredNotices.length > 0 ? (
            expiredNotices.map((notice) => (
              <div key={notice._id} className="notice-card">
                <h4>{notice.text}</h4>
                <p>
                  <strong>Posted On:</strong> {new Date(notice.postedAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Expired On:</strong> {new Date(notice.expireAt).toLocaleDateString()}
                </p>
                <button onClick={() => deleteNotice(notice._id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No expired notices</p>
          )}
        </div>
      </div>
    </div>
      <div>
      <h2>Create Admin Notice</h2>
      <div className="notice-form">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Notice Text:</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="3"
            />
          </div>
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
          <button type="submit">Post Notice</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
