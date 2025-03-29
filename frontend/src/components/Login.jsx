


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import fevicon from "../assets/fevicon.jpg";
import GoogleSvg from "../assets/icons8-google.svg";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { api, API_BASE_URL } from "../api/config";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post(api.googleSignin, { token: response.credential });
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        toast.success("Google Login successful!");
  
        // Redirect to respective dashboard
        navigate(res.data.role === "teacher" ? "/create-first" : "/join-first");
      }
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      toast.error("Please select a role.");
      return;
    }
    try {
      const endpoint = formData.role.toLowerCase() === "teacher" 
        ? api.teacherSignin 
        : api.studentSignin;

      const response = await axios.post(endpoint, {
        emailId: formData.email,
        password: formData.password
      });

      if (response.data.token) {
        toast.success("Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", formData.role.toLowerCase());

        if (formData.role.toLowerCase() === "teacher") {
          try {
            const res = await axios.get(`${API_BASE_URL}/teacher/courses`, {
              headers: {
                Authorization: `${response.data.token}`
              }
            });
            navigate(res.data.length > 0 ? "/course-card" : "/create-first");

          } catch (error)
          {
            console.error("Error fetching teacher courses:", error);

            navigate("/create-first");
          }
        } else {
          try {
            const res = await axios.get(`${API_BASE_URL}/student/courses`, {
              headers: {
                Authorization: `${response.data.token}`
              }
            });
            navigate(res.data.length > 0 ? "/course-card" : "/join-first");
          } catch (error) {
            console.error("Error fetching student courses:", error);
            navigate("/join-first");
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-[900px]">
        {/* Left Section */}
        <div className="w-1/2 p-8 bg-purple-100 border border-purple-400">
          <h2 className="text-purple-700 text-3xl font-bold mb-4 text-center">
            Welcome to <span className="text-purple-900">MyTute !</span>
          </h2>
          <hr className="border-purple-500 mb-4" />
          <h3 className="text-black text-lg font-semibold text-center mb-4">Login to Your Account</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button 
              type="submit"
              className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800 cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
            <img
              src={fevicon}
              alt="Educational Bird"
              className="w-48 h-48 mb-4"
            />
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={() => toast.error("Google login failed")} 
            />
            <button 
              onClick={() => navigate("/signup")}
              className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800 mt-4"
            >
              Create a New Account
            </button>
          </div>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
