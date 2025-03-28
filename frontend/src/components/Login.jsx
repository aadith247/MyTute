import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import fevicon from "../assets/fevicon.jpg";
import GoogleSvg from "../assets/icons8-google.svg";
import { api } from "../api/config";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = formData.role.toLowerCase() === "teacher" 
        ? api.teacherSignin 
        : api.studentSignin;

      console.log(endpoint);
      
      const response = await axios.post(endpoint, {
        emailId: formData.email,
        password: formData.password
      });
      console.log(response.data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", formData.role.toLowerCase());
        toast.success("Login successful!");
        navigate(formData.role.toLowerCase() === "teacher" ? "/create-first" : "/join-first");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    }
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
              />
              <select
                name="role"
                className="w-full p-2 mb-3 border border-gray-300 rounded"
                value={formData.role}
                onChange={handleChange}
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
              />
              <button 
                type="submit"
                className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800"
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
