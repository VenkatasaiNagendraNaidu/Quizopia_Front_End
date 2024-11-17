import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Teacher.css'

const TeacherLogin = () => {
  const navigate = useNavigate()

  const handleSignupRedirect = () => {
    navigate('/teacher-signup')
  }

  return (
    <div className='teacher-login-container'>
      <div className='teacher-login-card'>
        <h2 className='teacher-login-title'>Teacher Login</h2>
        <form className='teacher-login-form'>
          <div className='teacher-login-form-group'>
            <label htmlFor="teacherID" className='teacher-login-form-label'>Teacher ID</label>
            <input type="text" id="teacherID" name="teacherID" className='teacher-login-form-input' required />
          </div>
          <div className='teacher-login-form-group'>
            <label htmlFor="password" className='teacher-login-form-label'>Password</label>
            <input type="password" id="password" name="password" className='teacher-login-form-input' required />
          </div>
          <button type="submit" className='teacher-login-btn' onClick={()=>{navigate('/TeacherHomePage')}}>Login</button>
        </form>
        <p className='teacher-login-signup-text'>
          If you don't have an account,{' '}
          <span 
            className='teacher-login-signup-link' 
            onClick={handleSignupRedirect}
          >
            create one here
          </span>.
        </p>
      </div>
    </div>
  )
}

export default TeacherLogin
