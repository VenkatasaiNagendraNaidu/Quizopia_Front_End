import React, { useState } from 'react';
import './Student.css';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook


const StudentSignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [classStudying, setClassStudying] = useState('');
  const [dob, setDob] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [isParentEmail, setIsParentEmail] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isParentPhone, setIsParentPhone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the signup logic (API calls, form validation, etc.)
    console.log({
      name,
      classStudying,
      dob,
      schoolName,
      email,
      isParentEmail,
      phoneNumber,
      isParentPhone
    });
  };

  return (
    <div className="student-signup-container">
      <h2 className="student-signup-heading">Student Signup</h2>
      <form onSubmit={handleSubmit} className="student-signup-form">
        <div className="student-signup-input-group">
          <label htmlFor="name" className="student-signup-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="student-signup-input"
          />
        </div>
        <div className="student-signup-input-group">
          <label htmlFor="classStudying" className="student-signup-label">Class Studying</label>
          <input
            type="text"
            id="classStudying"
            name="classStudying"
            value={classStudying}
            onChange={(e) => setClassStudying(e.target.value)}
            placeholder="Enter class you're studying in"
            required
            className="student-signup-input"
          />
        </div>
        <div className="student-signup-input-group">
          <label htmlFor="dob" className="student-signup-label">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            className="student-signup-input"
          />
        </div>
        <div className="student-signup-input-group">
          <label htmlFor="schoolName" className="student-signup-label">School Name</label>
          <input
            type="text"
            id="schoolName"
            name="schoolName"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="Enter your school name"
            required
            className="student-signup-input"
          />
        </div>
        <div className="student-signup-input-group">
          <label htmlFor="email" className="student-signup-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="student-signup-input"
          />
          <div className="student-signup-checkbox-group">
            <input
              type="checkbox"
              id="parentEmail"
              name="parentEmail"
              checked={isParentEmail}
              onChange={() => setIsParentEmail(!isParentEmail)}
              className="student-signup-checkbox"
            />
            <label htmlFor="parentEmail" className="student-signup-checkbox-label">Parent's Email</label>
          </div>
        </div>
        <div className="student-signup-input-group">
          <label htmlFor="phoneNumber" className="student-signup-label">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            required
            className="student-signup-input"
          />
          <div className="student-signup-checkbox-group">
            <input
              type="checkbox"
              id="parentPhone"
              name="parentPhone"
              checked={isParentPhone}
              onChange={() => setIsParentPhone(!isParentPhone)}
              className="student-signup-checkbox"
            />
            <label htmlFor="parentPhone" className="student-signup-checkbox-label">Parent's Phone</label>
          </div>
        </div>

        <button type="submit" className="student-signup-button">Sign Up</button>
      </form>
      <p className="student-login-signup-text">
        Already have an account?{' '}
        <span
          className="student-login-signup-link"
          onClick={()=>{navigate('/student-login')}}
        >
          Login here
        </span>
        .
      </p>
    </div>
  );
};

export default StudentSignUp;
