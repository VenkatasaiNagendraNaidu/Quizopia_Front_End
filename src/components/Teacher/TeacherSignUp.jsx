import React, { useState } from 'react'
import './Teacher.css'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd';


const TeacherSignup = () => {
  const navigate = useNavigate()
  const [dob, setDob] = useState('')
  const [age, setAge] = useState('')

  const handleSignUp=()=>{
    message.success("Kindly Check your Email for Login Credentials")
  }
  const handleDobChange = (e) => {
    const selectedDob = e.target.value
    setDob(selectedDob)

    const birthDate = new Date(selectedDob)
    const today = new Date()
    let calculatedAge = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--
    }
    setAge(calculatedAge)
  }

  return (
    <div className='teacher-signup-container'>
      <div className='teacher-signup-card'>
        <h2 className='teacher-signup-title'>Teacher Signup</h2>
        <form className='teacher-signup-form'>
          <div className='teacher-signup-grid'>
            <div className='teacher-signup-form-group'>
              <label htmlFor="suffix" className='teacher-signup-form-label'>Suffix</label>
              <select id="suffix" name="suffix" className='teacher-signup-form-input'>
                <option value="Dr.">Dr.</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Miss">Miss</option>
                <option value="Ms.">Ms.</option>
              </select>
            </div>

            <div className='teacher-signup-form-group'>
              <label htmlFor="firstName" className='teacher-signup-form-label'>First Name</label>
              <input type="text" id="firstName" name="firstName" className='teacher-signup-form-input' required />
            </div>

            <div className='teacher-signup-form-group'>
              <label htmlFor="lastName" className='teacher-signup-form-label'>Last Name</label>
              <input type="text" id="lastName" name="lastName" className='teacher-signup-form-input' required />
            </div>

            <div className='teacher-signup-form-group'>
              <label htmlFor="dob" className='teacher-signup-form-label'>Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                className='teacher-signup-form-input'
                value={dob}
                onChange={handleDobChange}
                required
              />
            </div>

            <div className='teacher-signup-form-group'>
              <label htmlFor="age" className='teacher-signup-form-label'>Age</label>
              <input type="text" id="age" name="age" className='teacher-signup-form-input' value={age} readOnly />
            </div>

            <div className='teacher-signup-form-group'>
              <label htmlFor="qualification" className='teacher-signup-form-label'>Qualification</label>
              <input type="text" id="qualification" name="qualification" className='teacher-signup-form-input' required />
            </div>

            <div className='teacher-signup-form-group'>
              <label htmlFor="classesTaught" className='teacher-signup-form-label'>Classes Taught</label>
              <select id="classesTaught" name="classesTaught" className='teacher-signup-form-input'>
                <option value="Grade 1-3">Grade 1-3</option>
                <option value="Grade 4-6">Grade 4-6</option>
                <option value="Grade 7-9">Grade 7-9</option>
                <option value="Grade 10-12">Grade 10-12</option>
                <option value="University">University</option>
              </select>
            </div>

            <div className='teacher-signup-form-group'>
              <label htmlFor="phone" className='teacher-signup-form-label'>Phone Number</label>
              <input type="text" id="phone" name="phone" className='teacher-signup-form-input' required />
            </div>

            <div className='teacher-signup-form-group'>
              <label htmlFor="email" className='teacher-signup-form-label'>Email</label>
              <input type="email" id="email" name="email" className='teacher-signup-form-input' required />
            </div>
          </div>

          <button type="submit" className='teacher-signup-btn' onClick={handleSignUp} >Sign Up</button>
        </form>
        <p className='teacher-login-signup-text'>
          If you already have an account,{' '}
          <span 
            className='teacher-login-signup-link' 
            onClick={()=>{navigate('/teacher-login')}}
          >
            login here
          </span>.
        </p>
      </div>
    </div>
  )
}

export default TeacherSignup
