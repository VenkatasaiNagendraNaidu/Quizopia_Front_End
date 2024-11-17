import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './components/LandingPage';
import TeacherLogin from './components/Teacher/TeacherLogin';
import TeacherSignUp from './components/Teacher/TeacherSignUp';
import TeacherHomePage from './components/Teacher/TeacherHomePage';
import StudentSignUp from './components/Student/StudentSignUp';
import StudentHomapage from './components/Student/StudentHomapage';
import StudentLogin from './components/Student/StudentLogin';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path='/teacher-login' element={<TeacherLogin/>}/>
        <Route path='/teacher-signup' element={<TeacherSignUp/>}/>
        <Route path='/TeacherHomePage' element={<TeacherHomePage/>}/>
        <Route path='/student-login' element={<StudentLogin/>}/>
        <Route path='/student-signup' element={<StudentSignUp/>}/>
        <Route path='/studentHomePage' element={<StudentHomapage/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
