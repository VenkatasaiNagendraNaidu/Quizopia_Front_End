import React from 'react'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react';
import animationData  from '../Animations/teacher.json'
import Student from '../Animations/Student.json'

const LandingPage = () => {
    const navigate = useNavigate()
  return (
    <>
    <div className='LandingPageHeading'>
        <h1>Quizopia</h1>
    </div>
    <hr />
    <div className='LandingPageContent'>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <Lottie animationData={animationData } loop={true} style={{ height: '250px', width: '250px' }} />
        <button onClick={()=>{navigate('/teacher-login')}}>
            Teacher Login
        </button>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <Lottie animationData={Student } loop={true} style={{ height: '250px', width: '250px' }} />
        <button onClick={()=>{navigate('/student-login')}}>
            Student Login
        </button>
        </div>
    </div>
    </>
  )
}

export default LandingPage