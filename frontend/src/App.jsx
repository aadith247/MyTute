import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Signup from "./components/signup";
import Login from "./components/Login";
import Header from "./components/header";
import JoinCourse from "./components/join_course_student";
import CreateCourse from "./components/create_course_teacher";
import JoinFirst from "./components/joinfirst_student";
import CreateFirst from "./components/createfirstcourse_teacher";
import OtpVerification from "./components/OtpVerification";

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/", "/signup", "/verify-otp"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/join-course" element={<JoinCourse />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/join-first" element={<JoinFirst />} />
        <Route path="/teacher/dashboard" element={<CreateFirst />} />
      </Routes>
    </>
  );
};

export default App;