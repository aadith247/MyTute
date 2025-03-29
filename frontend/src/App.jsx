import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/", "/signup", "/verify-otp","/profile"];
  const teacherRoutes = ["/create-course", "/teacher-dashboard", "/create-form","/create-first"];

  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);
  const isTeacherPage = teacherRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && (isTeacherPage ? <TeacherHeader /> : <Header />)}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/join-course" element={<JoinCourse />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/join-first" element={<JoinFirst />} />
        <Route path="/create-first" element={<CreateFirst />} />
        <Route path="/course-card" element={<CourseCard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/create-form" element={<CreateForm />} />
        <Route path="/student-test" element={<StudentTest />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
};

export default App;