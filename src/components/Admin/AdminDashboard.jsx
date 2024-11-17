import React, { useState, useEffect } from 'react';
import './Admin.css';

const AdminDashboard = () => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [students, setStudents] = useState([]);

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
  }, []);

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
    </div>
  );
};

export default AdminDashboard;
