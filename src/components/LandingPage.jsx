import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate()
  return (
    <>
    <div className='LandingPageHeading'>
        <h1>Quizopia</h1>
    </div>
    <hr />
    <div className='LandingPageContent'>
        <button onClick={()=>{navigate('/teacher-login')}}>
            Teacher Login
        </button>
        <button onClick={()=>{navigate('/student-login')}}>
            Student Login
        </button>
    </div>
    </>
  )
}

export default LandingPage