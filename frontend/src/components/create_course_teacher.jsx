import React, { useState } from "react";
import axios from "axios";
import { Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../api/config";
import {useNavigate} from 'react-router-dom';
const CreateCourse = () => {
  const Navigate=useNavigate();
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [visible,setVisible]=useState(false);

  const handleCreateCourse = async () => {
    try {
      setVisible(c=>!c);
      
      const token = localStorage.getItem("token");
      console.log(token);

      
      const response = await axios.post(api.createCourse, 
        {
          courseName,
          courseDescription
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      if (response.data.courseCode) {
        setCourseCode(response.data.courseCode);
        toast.success("Course created successfully!");
      }
     
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create course");
    }

  };

  const handleCopy = () => {
    if (courseCode) {
      navigator.clipboard.writeText(courseCode);
      toast.success("Course code copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-50 px-4">
      <div className="bg-purple-100 p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-purple-700 text-2xl font-bold">Create Course</h2>
        <hr className="border-purple-500 my-2" />

        <p className="text-black font-medium">
          Enter your Course Details here :
          <br />
          <span className="text-gray-600 text-sm">
            (Copy the UNIQUE course code generated and share it with students to enroll)
          </span>
        </p>
        <input
          type="text"
          placeholder="Course Name"
          className="w-full p-2 mt-4 border border-gray-300 rounded bg-white text-gray-500 text-center"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Course description"
          className="w-full p-2 mt-4 border border-gray-300 rounded bg-white text-gray-500 text-center"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
        />
        <div className={`flex ${visible==false ? `hidden` : `block`} items-center justify-between bg-white border border-purple-500 rounded p-2 mt-4`}>
          <span className={`font-semibold ${courseCode ? "text-purple-700" : "text-gray-400"}`}>
            {courseCode || "Course Code"}
          </span>
          <button 
            onClick={handleCopy} 
            className={`hover:text-purple-900 cursor-pointer  ${courseCode ? "text-purple-700" : "text-gray-400 "}`} 
            disabled={!courseCode}
          >
            <Copy size={20} />
          </button>
        </div>
        <button
          className="w-full mt-4 bg-purple-700 text-white p-2 rounded-md shadow-md hover:bg-purple-800 transition"
          onClick={handleCreateCourse}>
          Create Course
        </button>
      </div>
    </div>
  );
};

export default CreateCourse;