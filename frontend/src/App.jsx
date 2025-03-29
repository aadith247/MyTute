import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation,matchPath } from "react-router-dom";
import "./App.css";
import OtpVerification from "./components/OtpVerification";
import Signup from "./components/signup";
import Login from "./components/Login";
import Header from "./components/studentHeader";
import TeacherHeader from "./components/teacherHeader";
import JoinCourse from "./components/join_course_student";
import CreateCourse from "./components/create_course_teacher";
import JoinFirst from "./components/joinfirst_student";
import CreateFirst from "./components/createfirstcourse_teacher";
import { CourseCard } from "./components/courseCard";
import TeacherDashboard from "./components/teacherDashboard";
import StudentDashboard from "./components/studentDashboard";
import CreateForm from "./components/teacherTest";
import StudentTest from "./components/studentTest";
import Sidebar from "./components/sideBar";
import ProfilePage from "./components/profile";
import {Toaster} from 'react-hot-toast'

const App = () => {
  return (
    <Router>
      <MainLayout />
      <Toaster position="top-center" reverseOrder={false} />
    </Router>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/", "/signup", "/verify-otp","/profile"];



  // const teacherRoutes = ["/create-course", "/teacher-dashboard/:courseId", "/course/:courseId/create-form","/create-first"];



  const isTeacherPage = matchPath("/teacher-dashboard/:courseId", location.pathname) ||
  matchPath("/course/:courseId/create-form/:courseTitle", location.pathname) ||
  matchPath("/create-first", location.pathname) || matchPath("/create-course",location.pathname) || matchPath("/course-card",location.pathname);

  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);


  return (
    <>
      {shouldShowHeader && (isTeacherPage ? <TeacherHeader /> : <Header/>)}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/join-course" element={<JoinCourse />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/join-first" element={<JoinFirst />} />
        <Route path="/create-first" element={<CreateFirst />} />
        <Route path="/course-card" element={<CourseCard />} />
        <Route path="/teacher-dashboard/:courseId" element={<TeacherDashboard />} />
        <Route path="/student-dashboard/:courseId" element={<StudentDashboard />} />
        <Route path="/course/:courseId/create-form/:testTitle" element={<CreateForm />} />
        <Route path="/student-test/:courseId/:testId" element={<StudentTest />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/sidebar" element={<Sidebar />} />
      </Routes>
    </>
  );
};

export default App;