import React from "react";
import thebook from "../assets/thebook.jpeg";
import { useNavigate } from "react-router-dom";

const CreateFirst = () => {
  const navigate=useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 px-4">
      <img
        src={thebook}
        alt="No Courses"
        className="w-60 md:w-72 mb-4"
      />
      <p className="text-black font-medium">No courses are created yet</p>
      <button onClick={()=>navigate("/create-course")} className="mt-4 bg-purple-700 text-white px-6 py-2 rounded-md shadow-md hover:bg-purple-800 transition">
        Create a New Course
      </button>
    </div>
  );
};

export default CreateFirst;
