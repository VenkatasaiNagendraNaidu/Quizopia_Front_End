import React, { useState } from 'react';
import './Admin.css';

const AdminDashboard = () => {
  const [pendingTeachers, setPendingTeachers] = useState([
    { id: 1, name: 'John Doe', subject: 'Mathematics' },
    { id: 2, name: 'Jane Smith', subject: 'Science' }
  ]);

  const [activeTeachers, setActiveTeachers] = useState([
    { id: 3, name: 'Mark Brown', subject: 'English' },
    { id: 4, name: 'Emily Davis', subject: 'History' }
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Johnson', class: '10th Grade' },
    { id: 2, name: 'Michael Roberts', class: '12th Grade' }
  ]);

  const handleApprove = (id) => {
    const approvedTeacher = pendingTeachers.find(teacher => teacher.id === id);
    setActiveTeachers([...activeTeachers, approvedTeacher]);
    setPendingTeachers(pendingTeachers.filter(teacher => teacher.id !== id));
  };

  const handleDecline = (id) => {
    setPendingTeachers(pendingTeachers.filter(teacher => teacher.id !== id));
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
                <div key={teacher.id} className="adminDashboard-card">
                  <h4>{teacher.name}</h4>
                  <p>Subject: {teacher.subject}</p>
                  <button className="approve-button" onClick={() => handleApprove(teacher.id)}>Approve</button>
                  <button className="decline-button" onClick={() => handleDecline(teacher.id)}>Decline</button>
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
            {activeTeachers.map((teacher) => (
              <div key={teacher.id} className="adminDashboard-card">
                <h4>{teacher.name}</h4>
                <p>Subject: {teacher.subject}</p>
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
              <p>Class: {student.class}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
