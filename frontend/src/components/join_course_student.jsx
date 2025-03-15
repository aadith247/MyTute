import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../api/config";

const JoinCourse = () => {
  const navigate = useNavigate();
  const [courseCode, setCourseCode] = useState("");

  const handleJoinCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(api.enrollCourse, 
        { courseCode },
        {
          headers: {
            Authorization: token
          }
        }
      );

      toast.success("Successfully joined the course!");
      navigate("/join-first");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to join course");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-50">
      <div className="bg-purple-100 p-8 rounded-2xl shadow-md w-96 text-center">
        <h2 className="text-purple-700 text-2xl font-bold">Join Course</h2>
        <hr className="border-purple-500 my-2" />

        <p className="text-black font-medium">
          Enter your Course Code here :
          <br />
          <span className="text-gray-600 text-sm">(Ask your teacher for the course code)</span>
        </p>

        <input
          type="text"
          placeholder="Course Code"
          className="w-full p-2 mt-4 border border-gray-300 rounded bg-white text-gray-500 text-center"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />

        <button
          className="w-full mt-4 bg-purple-700 text-white p-2 rounded-md shadow-md hover:bg-purple-800 transition"
          onClick={handleJoinCourse}
        >
          Join Course
        </button>
      </div>
    </div>
  );
};

export default JoinCourse;