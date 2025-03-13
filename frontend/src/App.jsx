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
import { Card } from "./components/courseCard";
const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/", "/signup"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/join-course" element={<JoinCourse />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/join-first" element={<JoinFirst />} />
        <Route path="/create-first" element={<CreateFirst />} />
        <Route path="/course-card" element={<Card/>} />
      </Routes>
    </>
  );
};

export default App;
